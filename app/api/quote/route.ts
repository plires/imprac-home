import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import nodemailer from "nodemailer"

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

    // ── Email ─────────────────────────────────────────────────────────
    const fecha = new Date().toLocaleString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

    const fmt = (n: number) =>
      n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr><td style="background-color:#18181b;padding:28px 32px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a1a1aa;">Imprac Pisos · Administración</p>
        <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Nueva Solicitud de Presupuesto</h1>
      </td></tr>

      <!-- Badge -->
      <tr><td style="padding:20px 32px 0;">
        <span style="display:inline-block;background-color:#fef9c3;color:#854d0e;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;text-transform:uppercase;">PENDIENTE DE RESPUESTA</span>
        <p style="margin:8px 0 0;font-size:13px;color:#71717a;">Recibida el ${fecha} &nbsp;·&nbsp; ID&nbsp;#<strong>${quote_id}</strong></p>
      </td></tr>

      <tr><td style="padding:16px 32px 0;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td></tr>

      <!-- Contacto -->
      <tr><td style="padding:24px 32px 0;">
        <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">Datos del Contacto</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:50%;padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Nombre</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${nombre}</p>
            </td>
            <td style="width:50%;padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Empresa</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${empresa || "—"}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
              <p style="margin:4px 0 0;font-size:15px;">
                <a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:600;">${email}</a>
              </p>
            </td>
            <td style="padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Teléfono</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${telefono || "—"}</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="padding:8px 32px 0;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td></tr>

      <!-- Producto -->
      <tr><td style="padding:24px 32px 0;">
        <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">Producto Consultado</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;border-radius:6px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0;font-size:17px;font-weight:700;color:#18181b;">${producto_nombre}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#71717a;">Código: <strong style="color:#18181b;">${producto_codigo}</strong></p>
            </td>
            <td style="padding:16px 20px;text-align:right;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Precio ref.</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#18181b;">$${fmt(precio_m2)}/m²</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Estimación -->
      <tr><td style="padding:16px 32px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:50%;padding-right:8px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;">
                <tr><td style="padding:14px 16px;">
                  <p style="margin:0;font-size:11px;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Superficie</p>
                  <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#15803d;">${superficie}&nbsp;m²</p>
                </td></tr>
              </table>
            </td>
            <td style="width:50%;padding-left:8px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;">
                <tr><td style="padding:14px 16px;">
                  <p style="margin:0;font-size:11px;color:#2563eb;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Presupuesto estimado</p>
                  <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#1d4ed8;">$${fmt(presupuesto_estimado)}</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Notas -->
      <tr><td style="padding:24px 32px 0;">
        <h2 style="margin:0 0 10px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">Notas del Cliente</h2>
        <p style="margin:0;font-size:14px;color:#3f3f46;line-height:1.6;white-space:pre-wrap;background-color:#fafafa;border-left:3px solid #d4d4d8;padding:12px 16px;border-radius:0 4px 4px 0;">
          ${notas || "—"}
        </p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:32px 32px 28px;">
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 20px;" />
        <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6;">
          Este correo fue generado automáticamente por el sistema de cotizaciones de <strong>Imprac Pisos</strong>.
          No respondas a este mensaje.
        </p>
        <p style="margin:10px 0 0;font-size:12px;color:#d4d4d8;">
          IP de origen: ${ip_origen ?? "—"} &nbsp;·&nbsp; ID de solicitud: #${quote_id}
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

    let mail_ok = true

    const mailTo   = process.env.MAIL_TO_ADDRESS
    const mailFrom = process.env.MAIL_FROM_ADDRESS

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

        await transporter.sendMail({
          from:     `"${process.env.MAIL_FROM_NAME}" <${mailFrom}>`,
          to:       mailTo,
          replyTo:  `"${nombre}" <${email}>`,
          subject:  `Nueva consulta #${quote_id} – ${producto_nombre} · ${nombre}`,
          html,
          text: `Nueva solicitud de presupuesto de ${nombre} (${email}) para ${producto_nombre} (${producto_codigo}). Superficie: ${superficie} m². Presupuesto estimado: $${fmt(presupuesto_estimado)}.`,
        })
      } catch (mailErr) {
        console.error("[/api/quote] nodemailer error:", mailErr)
        mail_ok = false
        // No cortamos el flujo — el registro en DB ya fue exitoso
      }
    }

    return NextResponse.json({ success: true, quote_id, mail_ok }, { status: 201 })

  } catch (error) {
    console.error("[/api/quote] error:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
