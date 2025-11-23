-- Create roles table
CREATE TABLE IF NOT EXISTS app.roles (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(32) UNIQUE NOT NULL,
  descripcion TEXT
);

-- Insert default roles
INSERT INTO app.roles (nombre, descripcion) VALUES
  ('admin', 'Administrator'),
  ('nurse', 'Nurse'),
  ('doctor', 'Doctor'),
  ('patient', 'Patient'),
  ('user', 'User')
ON CONFLICT (nombre) DO NOTHING;

-- Create alert types
CREATE TABLE IF NOT EXISTS app.tipos_alerta (
  id BIGSERIAL PRIMARY KEY,
  codigo VARCHAR(32) UNIQUE NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

INSERT INTO app.tipos_alerta (codigo, nombre) VALUES
  ('FALL', 'Caída'),
  ('HR_HIGH', 'Ritmo Cardíaco Alto'),
  ('SOS', 'Botón de Pánico')
ON CONFLICT (codigo) DO NOTHING;

-- Create service types
CREATE TABLE IF NOT EXISTS app.tipos_servicio (
  id BIGSERIAL PRIMARY KEY,
  codigo VARCHAR(32) UNIQUE NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

INSERT INTO app.tipos_servicio (codigo, nombre) VALUES
  ('CHECKUP', 'Chequeo General'),
  ('EMERGENCY', 'Urgencia')
ON CONFLICT (codigo) DO NOTHING;

-- Create note types
CREATE TABLE IF NOT EXISTS app.tipos_nota (
  id BIGSERIAL PRIMARY KEY,
  codigo VARCHAR(32) UNIQUE NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

INSERT INTO app.tipos_nota (codigo, nombre) VALUES
  ('GENERAL', 'Nota General'),
  ('PRESCRIPTION', 'Receta')
ON CONFLICT (codigo) DO NOTHING;

SELECT 'Seed completed successfully' AS status;
