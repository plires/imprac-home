import { NextResponse } from "next/server"
import pool from "@/lib/db"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, comentarios } = body

    if (!nombre || !email) {
      return NextResponse.json({ error: "Nombre y email son requeridos." }, { status: 400 })
    }

    // ── Guardar en base de datos ──────────────────────────────────────
    await pool.query(
      `INSERT INTO contacts (nombre, email, telefono, comentarios)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, telefono || null, comentarios || null]
    )

    // ── Enviar email al administrador ─────────────────────────────────
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 1025,
      secure: process.env.SMTP_ENCRYPTION === "ssl",
      auth:   process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })

    await transporter.sendMail({
      from:    `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to:      process.env.MAIL_TO_ADDRESS,
      subject: `Nueva consulta de contacto — ${nombre}`,
      html: `
        <h2 style="margin:0 0 16px">Nueva consulta de contacto</h2>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 16px 6px 0;color:#666">Nombre</td>    <td style="padding:6px 0"><strong>${nombre}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Email</td>     <td style="padding:6px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Teléfono</td>  <td style="padding:6px 0">${telefono || "—"}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top">Comentarios</td>
              <td style="padding:6px 0;white-space:pre-wrap">${comentarios || "—"}</td></tr>
        </table>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error en /api/contact:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
