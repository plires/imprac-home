interface ContactEmailData {
  nombre:      string
  email:       string
  telefono?:   string | null
  comentarios?: string | null
  fecha:       string
}

export function contactEmailHtml({ nombre, email, telefono, comentarios, fecha }: ContactEmailData): string {
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
        <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Nueva Consulta de Contacto</h1>
      </td></tr>

      <!-- Badge -->
      <tr><td style="padding:20px 32px 0;">
        <span style="display:inline-block;background-color:#fef9c3;color:#854d0e;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;text-transform:uppercase;">PENDIENTE DE RESPUESTA</span>
        <p style="margin:8px 0 0;font-size:13px;color:#71717a;">Recibida el ${fecha}</p>
      </td></tr>

      <tr><td style="padding:16px 32px 0;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td></tr>

      <!-- Datos del contacto -->
      <tr><td style="padding:24px 32px 0;">
        <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">Datos del Contacto</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:50%;padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Nombre</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${nombre}</p>
            </td>
            <td style="width:50%;padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Teléfono</p>
              <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">${telefono || "—"}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-bottom:12px;vertical-align:top;">
              <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
              <p style="margin:4px 0 0;font-size:15px;">
                <a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:600;">${email}</a>
              </p>
            </td>
          </tr>
        </table>
      </td></tr>

      <tr><td style="padding:8px 32px 0;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td></tr>

      <!-- Comentarios -->
      <tr><td style="padding:24px 32px 0;">
        <h2 style="margin:0 0 10px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">Comentarios</h2>
        <p style="margin:0;font-size:14px;color:#3f3f46;line-height:1.6;white-space:pre-wrap;background-color:#fafafa;border-left:3px solid #d4d4d8;padding:12px 16px;border-radius:0 4px 4px 0;">
          ${comentarios || "—"}
        </p>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:24px 32px 0;">
        <a href="mailto:${email}"
           style="display:inline-block;background-color:#18181b;color:#ffffff;font-size:13px;font-weight:700;padding:10px 20px;border-radius:6px;text-decoration:none;">
          Responder a ${nombre}
        </a>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:32px 32px 28px;">
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 20px;" />
        <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6;">
          Este correo fue generado automáticamente por el formulario de contacto de <strong>Imprac Pisos</strong>.
          No respondas a este mensaje directamente.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

export function contactEmailText({ nombre, email, telefono, comentarios }: Omit<ContactEmailData, "fecha">): string {
  return `Nueva consulta de contacto de ${nombre} (${email}).${telefono ? ` Teléfono: ${telefono}.` : ""}\n\nComentarios:\n${comentarios || "—"}`
}
