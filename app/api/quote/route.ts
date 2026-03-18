import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import nodemailer from "nodemailer"
import { quoteEmailHtml, quoteEmailText } from "@/lib/emails/quote-template"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      nombre, empresa, email, telefono,
      superficie_m2, notas,
      producto_nombre, producto_codigo, producto_precio_m2,
    } = body

    // ── Validación ────────────────────────────────────────────────────
    const required = { nombre, email, superficie_m2, producto_nombre, producto_codigo, producto_precio_m2 }
    for (const [field, value] of Object.entries(required)) {
      if (!value && value !== 0) {
        return NextResponse.json({ error: `El campo '${field}' es obligatorio.` }, { status: 422 })
      }
    }

    const superficie = parseFloat(superficie_m2)
    if (isNaN(superficie) || superficie <= 0) {
      return NextResponse.json({ error: "Superficie inválida." }, { status: 422 })
    }

    const precio_m2 = parseFloat(producto_precio_m2)
    const presupuesto_estimado = Math.round(superficie * precio_m2 * 100) / 100

    const ip_origen =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      null

    // ── Guardar en base de datos ──────────────────────────────────────
    const [result] = await pool.query(
      `INSERT INTO quote_requests
        (nombre, empresa, email, telefono, superficie_m2, notas,
         producto_nombre, producto_codigo, producto_precio_m2, ip_origen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        empresa || null,
        email,
        telefono || null,
        superficie,
        notas || null,
        producto_nombre,
        producto_codigo,
        precio_m2,
        ip_origen,
      ]
    ) as any

    const quote_id = result.insertId

    // ── Enviar email ──────────────────────────────────────────────────
    const fecha = new Date().toLocaleString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

    const mailTo   = process.env.MAIL_TO_ADDRESS
    const mailFrom = process.env.MAIL_FROM_ADDRESS
    let mail_ok    = true

    if (mailTo && mailFrom) {
      try {
        const transporter = nodemailer.createTransport({
          host:   process.env.SMTP_HOST,
          port:   Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_ENCRYPTION === "ssl",
          auth:   process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        })

        const templateData = {
          quote_id, fecha, nombre, empresa, email, telefono,
          superficie, notas, producto_nombre, producto_codigo,
          precio_m2, presupuesto_estimado, ip_origen,
        }

        await transporter.sendMail({
          from:    `"${process.env.MAIL_FROM_NAME}" <${mailFrom}>`,
          to:      mailTo,
          replyTo: `"${nombre}" <${email}>`,
          subject: `Nueva consulta #${quote_id} – ${producto_nombre} · ${nombre}`,
          html:    quoteEmailHtml(templateData),
          text:    quoteEmailText(templateData),
        })
      } catch (mailErr) {
        console.error("[/api/quote] nodemailer error:", mailErr)
        mail_ok = false
      }
    }

    return NextResponse.json({ success: true, quote_id, mail_ok }, { status: 201 })

  } catch (error) {
    console.error("[/api/quote] error:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
