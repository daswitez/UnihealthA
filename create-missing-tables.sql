-- ========================================
-- Creación de Tablas Faltantes - UnihealthA
-- ========================================

-- 1. Tabla Alergias
CREATE TABLE IF NOT EXISTS app.alergias (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    alergeno VARCHAR(255) NOT NULL,
    reaccion VARCHAR(255) NOT NULL,
    severidad VARCHAR(50) NOT NULL,
    notas TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT alergias_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES app.usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_alergias_paciente_id ON app.alergias(paciente_id);

-- 2. Tabla Medicamentos
CREATE TABLE IF NOT EXISTS app.medicamentos (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN NOT NULL DEFAULT true,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT medicamentos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES app.usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_medicamentos_paciente_id ON app.medicamentos(paciente_id);
-- Índices de optimización incluidos
CREATE INDEX IF NOT EXISTS idx_medicamentos_paciente_activo ON app.medicamentos(paciente_id, activo);
CREATE INDEX IF NOT EXISTS idx_medicamentos_paciente_fechas ON app.medicamentos(paciente_id, fecha_inicio, fecha_fin);

-- 3. Tabla Antecedentes Familiares
CREATE TABLE IF NOT EXISTS app.antecedentes_familiares (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    condicion VARCHAR(255) NOT NULL,
    notas TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT antecedentes_familiares_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES app.usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_antecedentes_familiares_paciente_id ON app.antecedentes_familiares(paciente_id);

-- 4. Tabla Detalles Estilo de Vida
CREATE TABLE IF NOT EXISTS app.detalles_estilo_vida (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    dieta VARCHAR(100),
    consumo_alcohol VARCHAR(100),
    consumo_tabaco VARCHAR(100),
    nivel_actividad VARCHAR(100),
    horas_sueno DECIMAL(4,2),
    nivel_estres VARCHAR(50),
    notas TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT detalles_estilo_vida_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES app.usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_detalles_estilo_vida_paciente_id ON app.detalles_estilo_vida(paciente_id);
