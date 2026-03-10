-- ============================================================
-- Tabla: quote_requests
-- Descripción: Almacena las solicitudes de presupuesto
--              enviadas desde el formulario del catálogo.
-- ============================================================

CREATE TABLE IF NOT EXISTS `quote_requests` (
  `id`                    INT UNSIGNED        NOT NULL AUTO_INCREMENT,

  -- Datos del solicitante
  `nombre`                VARCHAR(255)        NOT NULL,
  `empresa`               VARCHAR(255)        DEFAULT NULL,
  `email`                 VARCHAR(255)        NOT NULL,
  `telefono`              VARCHAR(50)         DEFAULT NULL,

  -- Datos del requerimiento
  `superficie_m2`         DECIMAL(10, 2)      NOT NULL,
  `notas`                 TEXT                DEFAULT NULL,

  -- Datos del producto seleccionado (snapshot al momento de la consulta)
  `producto_nombre`       VARCHAR(255)        NOT NULL,
  `producto_codigo`       VARCHAR(100)        NOT NULL,
  `producto_precio_m2`    DECIMAL(10, 2)      NOT NULL,

  -- Presupuesto estimado calculado (m² × precio/m²)
  `presupuesto_estimado`  DECIMAL(12, 2)      GENERATED ALWAYS AS
                            (`superficie_m2` * `producto_precio_m2`) STORED,

  -- Metadatos
  `ip_origen`             VARCHAR(45)         DEFAULT NULL,
  `estado`                ENUM(
                            'pendiente',
                            'en_proceso',
                            'respondida',
                            'cerrada'
                          )                   NOT NULL DEFAULT 'pendiente',
  `created_at`            TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_email`      (`email`),
  INDEX `idx_estado`     (`estado`),
  INDEX `idx_created_at` (`created_at`)

) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
