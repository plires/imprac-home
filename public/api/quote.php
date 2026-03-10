<?php
declare(strict_types=1);

// ─── CORS & Headers ───────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Origen permitido: el mismo dominio en producción.
// Ajustá esto a tu dominio real en producción.
$allowed_origin = $_ENV['APP_URL'] ?? '*';
header("Access-Control-Allow-Origin: {$allowed_origin}");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit;
}

// ─── Dependencias ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as MailException;
use Dotenv\Dotenv;

// Carga el .env.local desde la raíz del proyecto (dos niveles arriba de public/api/)
$dotenv = Dotenv::createImmutable(__DIR__ . '/');
$dotenv->safeLoad();

// ─── Input ────────────────────────────────────────────────────────────────────
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload inválido.']);
    exit;
}

// ─── Validación ───────────────────────────────────────────────────────────────
$required = ['nombre', 'email', 'superficie_m2', 'producto_nombre', 'producto_codigo', 'producto_precio_m2'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(422);
        echo json_encode(['error' => "El campo '{$field}' es obligatorio."]);
        exit;
    }
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Email inválido.']);
    exit;
}

$superficie = filter_var($data['superficie_m2'], FILTER_VALIDATE_FLOAT);
if ($superficie === false || $superficie <= 0) {
    http_response_code(422);
    echo json_encode(['error' => 'Superficie inválida.']);
    exit;
}

// Sanitización
$nombre          = htmlspecialchars(trim($data['nombre']),          ENT_QUOTES, 'UTF-8');
$empresa         = htmlspecialchars(trim($data['empresa'] ?? ''),   ENT_QUOTES, 'UTF-8');
$email           = filter_var(trim($data['email']),                 FILTER_SANITIZE_EMAIL);
$telefono        = htmlspecialchars(trim($data['telefono'] ?? ''),  ENT_QUOTES, 'UTF-8');
$notas           = htmlspecialchars(trim($data['notas'] ?? ''),     ENT_QUOTES, 'UTF-8');
$prod_nombre     = htmlspecialchars(trim($data['producto_nombre']), ENT_QUOTES, 'UTF-8');
$prod_codigo     = htmlspecialchars(trim($data['producto_codigo']), ENT_QUOTES, 'UTF-8');
$prod_precio_m2  = filter_var($data['producto_precio_m2'],          FILTER_VALIDATE_FLOAT);
$ip_origen       = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? null;

$presupuesto_estimado = round($superficie * $prod_precio_m2, 2);

// ─── Base de datos ────────────────────────────────────────────────────────────
$db_host = $_ENV['DB_HOST']     ?? 'localhost';
$db_name = $_ENV['DB_NAME']     ?? '';
$db_user = $_ENV['DB_USER']     ?? '';
$db_pass = $_ENV['DB_PASSWORD'] ?? '';          // coincide con .env.local
$db_port = $_ENV['DB_PORT']     ?? '3306';

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO quote_requests
            (nombre, empresa, email, telefono, superficie_m2, notas,
             producto_nombre, producto_codigo, producto_precio_m2, ip_origen)
        VALUES
            (:nombre, :empresa, :email, :telefono, :superficie_m2, :notas,
             :producto_nombre, :producto_codigo, :producto_precio_m2, :ip_origen)
    ");
    
    $stmt->execute([
        ':nombre'           => $nombre,
        ':empresa'          => $empresa ?: null,
        ':email'            => $email,
        ':telefono'         => $telefono ?: null,
        ':superficie_m2'    => $superficie,
        ':notas'            => $notas ?: null,
        ':producto_nombre'  => $prod_nombre,
        ':producto_codigo'  => $prod_codigo,
        ':producto_precio_m2' => $prod_precio_m2,
        ':ip_origen'        => $ip_origen,
    ]);
    $quote_id = $pdo->lastInsertId();
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar la solicitud.']);
    exit;
}

// ─── Email ────────────────────────────────────────────────────────────────────
$mail_to      = $_ENV['MAIL_TO_ADDRESS']  ?? '';
$mail_from    = $_ENV['MAIL_FROM_ADDRESS'] ?? '';
$mail_name    = $_ENV['MAIL_FROM_NAME']   ?? 'Imprac Home';
$smtp_host    = $_ENV['SMTP_HOST']        ?? 'localhost';
$smtp_user    = $_ENV['SMTP_USER']        ?? '';
$smtp_pass    = $_ENV['SMTP_PASS']        ?? '';
$smtp_port    = (int)($_ENV['SMTP_PORT']  ?? 587);

$fecha        = date('d/m/Y H:i');
$presupuesto_fmt = number_format($presupuesto_estimado, 2, ',', '.');
$precio_m2_fmt   = number_format($prod_precio_m2, 2, ',', '.');

$email_html = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva Solicitud de Presupuesto</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#18181b;padding:28px 32px;">
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a1a1aa;">Imprac Pisos · Administración</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                Nueva Solicitud de Presupuesto
              </h1>
            </td>
          </tr>

          <!-- Badge de estado -->
          <tr>
            <td style="padding:20px 32px 0;">
              <span style="display:inline-block;background-color:#fef9c3;color:#854d0e;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.5px;text-transform:uppercase;">
                PENDIENTE DE RESPUESTA
              </span>
              <p style="margin:8px 0 0;font-size:13px;color:#71717a;">
                Recibida el {$fecha} &nbsp;·&nbsp; ID&nbsp;#<strong>{$quote_id}</strong>
              </p>
            </td>
          </tr>

          <!-- Separador -->
          <tr><td style="padding:16px 32px 0;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td></tr>

          <!-- Datos del contacto -->
          <tr>
            <td style="padding:24px 32px 0;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">
                Datos del Contacto
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;padding-bottom:12px;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Nombre</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">{$nombre}</p>
                  </td>
                  <td style="width:50%;padding-bottom:12px;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Empresa</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">{$empresa}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
                    <p style="margin:4px 0 0;font-size:15px;">
                      <a href="mailto:{$email}" style="color:#2563eb;text-decoration:none;font-weight:600;">{$email}</a>
                    </p>
                  </td>
                  <td style="padding-bottom:12px;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Teléfono</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#18181b;font-weight:600;">{$telefono}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Separador -->
          <tr><td style="padding:8px 32px 0;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td></tr>

          <!-- Producto -->
          <tr>
            <td style="padding:24px 32px 0;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">
                Producto Consultado
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;border-radius:6px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:17px;font-weight:700;color:#18181b;">{$prod_nombre}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#71717a;">Código: <strong style="color:#18181b;">{$prod_codigo}</strong></p>
                  </td>
                  <td style="padding:16px 20px;text-align:right;vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Precio ref.</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#18181b;">\${$precio_m2_fmt}/m²</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Estimación -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;padding-right:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;">
                      <tr>
                        <td style="padding:14px 16px;">
                          <p style="margin:0;font-size:11px;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Superficie</p>
                          <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#15803d;">{$superficie}&nbsp;m²</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:50%;padding-left:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;">
                      <tr>
                        <td style="padding:14px 16px;">
                          <p style="margin:0;font-size:11px;color:#2563eb;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Presupuesto estimado</p>
                          <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#1d4ed8;">\${$presupuesto_fmt}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notas -->
          <tr>
            <td style="padding:24px 32px 0;">
              <h2 style="margin:0 0 10px;font-size:14px;font-weight:700;color:#18181b;text-transform:uppercase;letter-spacing:0.5px;">
                Notas del Cliente
              </h2>
              <p style="margin:0;font-size:14px;color:#3f3f46;line-height:1.6;white-space:pre-wrap;background-color:#fafafa;border-left:3px solid #d4d4d8;padding:12px 16px;border-radius:0 4px 4px 0;">
                {$notas}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 32px 28px;margin-top:24px;">
              <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 20px;" />
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6;">
                Este correo fue generado automáticamente por el sistema de cotizaciones de <strong>Imprac Pisos</strong>.
                No respondas a este mensaje. Para gestionar esta solicitud, ingresá al panel de administración.
              </p>
              <p style="margin:10px 0 0;font-size:12px;color:#d4d4d8;">
                IP de origen: {$ip_origen} &nbsp;·&nbsp; ID de solicitud: #{$quote_id}
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>
HTML;

$mail_error = null;

if ($mail_to && $mail_from) {
    $mail = new PHPMailer(true);

    try {
        if ($_ENV['ENVIRONMENT'] === 'dev') {
          $mail->isSendmail();
        } else {
          $mail->isSMTP();
        }
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_user;
        $mail->Password   = $smtp_pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $smtp_port;
        $mail->CharSet    = PHPMailer::CHARSET_UTF8;

        $mail->setFrom($mail_from, $mail_name);
        $mail->addAddress($mail_to);
        $mail->addReplyTo($email, $nombre);

        $mail->isHTML(true);
        $mail->Subject = "Nueva consulta #{$quote_id} – {$prod_nombre} · {$nombre}";
        $mail->Body    = $email_html;
        $mail->AltBody = "Nueva solicitud de presupuesto de {$nombre} ({$email}) para {$prod_nombre} ({$prod_codigo}). "
                       . "Superficie: {$superficie} m². Presupuesto estimado: \${$presupuesto_estimado}.";

        $mail->send();
    } catch (MailException $e) {
        // El registro en DB ya fue exitoso; solo logueamos el error de mail.
        $mail_error = $mail->ErrorInfo;
        error_log("[quote.php] PHPMailer error: {$mail_error}");
    }
}

// ─── Respuesta ────────────────────────────────────────────────────────────────
http_response_code(201);
echo json_encode([
    'success'  => true,
    'quote_id' => (int) $quote_id,
    'mail_ok'  => $mail_error === null,
]);
