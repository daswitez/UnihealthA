-- ==============================================
-- SCRIPT: Crear tablas para módulo de Kioscos
-- Ejecutar en AWS con:
-- docker exec -i postgres_db psql -U admin -d nestjs_db < create-kiosks-tables.sql
-- ==============================================

-- 1. Crear tabla de kioscos
CREATE TABLE IF NOT EXISTS app.kioscos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    latitud DECIMAL(9,6),
    longitud DECIMAL(9,6),
    telefono VARCHAR(20),
    hora_apertura VARCHAR(5),
    hora_cierre VARCHAR(5),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla de personal asignado a kioscos
CREATE TABLE IF NOT EXISTS app.kiosco_personal (
    id BIGSERIAL PRIMARY KEY,
    kiosco_id BIGINT NOT NULL REFERENCES app.kioscos(id) ON DELETE CASCADE,
    usuario_id BIGINT NOT NULL,
    asignado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(kiosco_id, usuario_id)
);

-- 3. Agregar columna kiosco_id a tabla citas (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'app' 
        AND table_name = 'citas' 
        AND column_name = 'kiosco_id'
    ) THEN
        ALTER TABLE app.citas ADD COLUMN kiosco_id BIGINT REFERENCES app.kioscos(id);
        CREATE INDEX idx_citas_kiosco ON app.citas(kiosco_id);
    END IF;
END $$;

-- 4. Crear índices
CREATE INDEX IF NOT EXISTS idx_kiosco_personal_usuario ON app.kiosco_personal(usuario_id);

-- 5. Insertar algunos kioscos de ejemplo
INSERT INTO app.kioscos (nombre, direccion, ciudad, latitud, longitud, telefono, hora_apertura, hora_cierre, activo) VALUES
    ('Kiosco Central', 'Av. 16 de Julio 1234', 'La Paz', -16.500000, -68.150000, '+59112345678', '08:00', '18:00', true),
    ('Kiosco Zona Sur', 'Calle 21 de Calacoto 456', 'La Paz', -16.523000, -68.067000, '+59187654321', '09:00', '19:00', true),
    ('Kiosco El Alto', 'Av. Bolivia 789', 'El Alto', -16.509000, -68.196000, '+59176543210', '07:00', '17:00', true),
    ('Kiosco Cochabamba', 'Av. Ballivián 321', 'Cochabamba', -17.393000, -66.157000, '+59144445555', '08:00', '20:00', true),
    ('Kiosco Santa Cruz', 'Av. Monseñor Rivero 555', 'Santa Cruz', -17.783000, -63.182000, '+59133334444', '07:30', '21:00', true)
ON CONFLICT DO NOTHING;

-- Verificar
SELECT 'Tabla kioscos creada con ' || COUNT(*) || ' registros' AS status FROM app.kioscos;
SELECT 'Tabla kiosco_personal creada' AS status;
SELECT 'Columna kiosco_id agregada a citas' AS status;
