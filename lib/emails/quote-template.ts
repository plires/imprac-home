interface QuoteEmailData {
  quote_id:            number
  fecha:               string
  nombre:              string
  empresa?:            string | null
  email:               string
  telefono?:           string | null
  superficie:          number
  notas?:              string | null
  producto_nombre:     string
  producto_codigo:     string
  precio_m2:           number
  presupuesto_estimado: number
  ip_origen?:          string | null
}

function fmt(n: number): string {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function quoteEmailHtml(d: QuoteEmailData): string {
  return `
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
        <p style="margin:8px 0 0;font-size:13px;color:#71717a;">Recibida el ${d.fecha} &nbsp;·&nbsp; ID&nbsp;#<strong>${d.quote_id}</strong></p>
      </td></tr>

      <tr><td style="padding:16px 32px 0;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td></tr>

      <!-- Contacto -->
      <tr><td style="padding:24px 32px 0;">
        <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">Datos del Contacto</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:50%;padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Nombre</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${d.nombre}</p>
            </td>
            <td style="width:50%;padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Empresa</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${d.empresa || "—"}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
              <p style="margin:4px 0 0;font-size:15px;">
                <a href="mailto:${d.email}" style="color:#2563eb;text-decoration:none;font-weight:600;">${d.email}</a>
              </p>
            </td>
            <td style="padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Teléfono</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${d.telefono || "—"}</p>
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
              <p style="margin:0;font-size:17px;font-weight:700;color:#18181b;">${d.producto_nombre}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#71717a;">Código: <strong style="color:#18181b;">${d.producto_codigo}</strong></p>
            </td>
            <td style="padding:16px 20px;text-align:right;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Precio ref.</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#18181b;">$${fmt(d.precio_m2)}/m²</p>
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
                  <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#15803d;">${d.superficie}&nbsp;m²</p>
                </td></tr>
              </table>
            </td>
            <td style="width:50%;padding-left:8px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;">
                <tr><td style="padding:14px 16px;">
                  <p style="margin:0;font-size:11px;color:#2563eb;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Presupuesto estimado</p>
                  <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#1d4ed8;">$${fmt(d.presupuesto_estimado)}</p>
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
          ${d.notas || "—"}
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
          IP de origen: ${d.ip_origen ?? "—"} &nbsp;·&nbsp; ID de solicitud: #${d.quote_id}
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

export function quoteEmailText(d: QuoteEmailData): string {
  return `Nueva solicitud de presupuesto de ${d.nombre} (${d.email}) para ${d.producto_nombre} (${d.producto_codigo}). Superficie: ${d.superficie} m². Presupuesto estimado: $${fmt(d.presupuesto_estimado)}.`
}
