import { NextResponse } from "next/server"
import pool from "@/lib/db"
import nodemailer from "nodemailer"
import { contactEmailHtml, contactEmailText } from "@/lib/emails/contact-template"

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
    const fecha = new Date().toLocaleString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

    const mailTo   = process.env.MAIL_TO_ADDRESS
    const mailFrom = process.env.MAIL_FROM_ADDRESS

    if (mailTo && mailFrom) {
      const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   Number(process.env.SMTP_PORT) || 1025,
        secure: process.env.SMTP_ENCRYPTION === "ssl",
        auth:   process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      })

      await transporter.sendMail({
        from:    `"${process.env.MAIL_FROM_NAME}" <${mailFrom}>`,
        to:      mailTo,
        replyTo: `"${nombre}" <${email}>`,
        subject: `Nueva consulta de contacto — ${nombre}`,
        html:    contactEmailHtml({ nombre, email, telefono, comentarios, fecha }),
        text:    contactEmailText({ nombre, email, telefono, comentarios }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error en /api/contact:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
