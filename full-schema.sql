-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateTable
CREATE TABLE "app"."roles" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(32) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."usuarios" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "pass_hash" TEXT NOT NULL,
    "pin_hash" VARCHAR(60), -- PIN de 4 digitos hasheado
    "rol_id" BIGINT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_login" TIMESTAMPTZ,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."consentimientos" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "aceptado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" INET,

    CONSTRAINT "consentimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."perfiles_paciente" (
    "usuario_id" BIGINT NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "fecha_nacimiento" DATE,
    "sexo" CHAR(1),
    "grupo_sanguineo" VARCHAR(5),
    "altura_cm" SMALLINT,
    "peso_kg" DECIMAL(5,2),
    "seguro_medico" JSONB DEFAULT '{}',
    "contacto_emergencia" VARCHAR(100),
    "es_fumador" BOOLEAN DEFAULT false,
    "consumo_alcohol" VARCHAR(50),
    "actividad_fisica" VARCHAR(50),
    "alergias" TEXT,
    "antecedentes" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfiles_paciente_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "app"."accesos_medicos" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "personal_id" BIGINT NOT NULL,
    "permisos" JSONB NOT NULL DEFAULT '{}', -- {'fisico': true, 'mental': false}
    "otorgado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_en" TIMESTAMPTZ,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "accesos_medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."historial_medico" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "condicion" VARCHAR(255) NOT NULL,
    "diagnostico" TEXT,
    "tratamiento" TEXT,
    "fecha_diagnostico" DATE,
    "tipo" VARCHAR(20) NOT NULL CHECK (tipo IN ('fisico', 'mental')),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."registros_clinicos" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "creado_por_id" BIGINT NOT NULL,
    "tipo_nota_id" BIGINT NOT NULL,
    "nota" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_clinicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."signos_vitales" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "tomado_por_id" BIGINT NOT NULL,
    "pas_sistolica" SMALLINT,
    "pas_diastolica" SMALLINT,
    "fcritmo" SMALLINT,
    "temp_c" DECIMAL(4,1),
    "spo2" SMALLINT,
    "tomado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signos_vitales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."adjuntos" (
    "id" BIGSERIAL NOT NULL,
    "propietario_tabla" VARCHAR(32) NOT NULL,
    "propietario_id" BIGINT NOT NULL,
    "nombre_archivo" TEXT NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "categoria" VARCHAR(50), -- 'reporte_medico', 'lab', 'imagen', etc.
    "ruta_storage" TEXT NOT NULL,
    "tamano_bytes" INTEGER,
    "creado_por_id" BIGINT NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adjuntos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."tipos_alerta" (
    "id" BIGSERIAL NOT NULL,
    "codigo" VARCHAR(32) NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_alerta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."alertas" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT,
    "tipo_alerta_id" BIGINT,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "descripcion" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asignado_a_id" BIGINT,
    "resuelto_en" TIMESTAMPTZ,
    "fuente" VARCHAR(16) NOT NULL DEFAULT 'app',

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."alergias" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "alergeno" VARCHAR(255) NOT NULL,
    "reaccion" VARCHAR(255) NOT NULL,
    "severidad" VARCHAR(50) NOT NULL,
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alergias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."medicamentos" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "dosis" VARCHAR(100),
    "frecuencia" VARCHAR(100),
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."antecedentes_familiares" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "parentesco" VARCHAR(50) NOT NULL,
    "condicion" VARCHAR(255) NOT NULL,
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "antecedentes_familiares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."estilo_vida_detalle" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "dieta" VARCHAR(100),
    "consumo_alcohol" VARCHAR(100),
    "consumo_tabaco" VARCHAR(100),
    "nivel_actividad" VARCHAR(100),
    "horas_sueno" DECIMAL(4,2),
    "estres_nivel" SMALLINT,
    "actividad_fisica_tipo" VARCHAR(255),
    "actividad_fisica_frecuencia" VARCHAR(100),
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estilo_vida_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."eventos_alerta" (
    "id" BIGSERIAL NOT NULL,
    "alerta_id" BIGINT NOT NULL,
    "por_usuario_id" BIGINT,
    "tipo" VARCHAR(32) NOT NULL,
    "detalle_json" JSONB NOT NULL DEFAULT '{}',
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_alerta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."tipos_servicio" (
    "id" BIGSERIAL NOT NULL,
    "codigo" VARCHAR(32) NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."agendas" (
    "id" BIGSERIAL NOT NULL,
    "enfermero_id" BIGINT NOT NULL,
    "dia_semana" SMALLINT NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,

    CONSTRAINT "agendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."citas" (
    "id" BIGSERIAL NOT NULL,
    "paciente_id" BIGINT NOT NULL,
    "enfermero_id" BIGINT NOT NULL,
    "tipo_servicio_id" BIGINT NOT NULL,
    "inicio" TIMESTAMPTZ NOT NULL,
    "fin" TIMESTAMPTZ NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'solicitada',
    "motivo" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "citas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT,
    "accion" VARCHAR(32) NOT NULL,
    "recurso" VARCHAR(64) NOT NULL,
    "recurso_id" TEXT,
    "detalles" JSONB,
    "ip" INET,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."system_parameters" (
    "id" SERIAL NOT NULL,
    "clave" VARCHAR(64) NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "actualizado_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "system_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "app"."roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "app"."usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_id_idx" ON "app"."usuarios"("rol_id");

-- CreateIndex
CREATE INDEX "consentimientos_usuario_id_idx" ON "app"."consentimientos"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_nota_codigo_key" ON "app"."tipos_nota"("codigo");

-- CreateIndex
CREATE INDEX "registros_clinicos_paciente_id_idx" ON "app"."registros_clinicos"("paciente_id");

-- CreateIndex
CREATE INDEX "registros_clinicos_tipo_nota_id_idx" ON "app"."registros_clinicos"("tipo_nota_id");

-- CreateIndex
CREATE INDEX "signos_vitales_paciente_id_tomado_en_idx" ON "app"."signos_vitales"("paciente_id", "tomado_en" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "adjuntos_ruta_storage_key" ON "app"."adjuntos"("ruta_storage");

-- CreateIndex
CREATE INDEX "adjuntos_propietario_tabla_propietario_id_idx" ON "app"."adjuntos"("propietario_tabla", "propietario_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_alerta_codigo_key" ON "app"."tipos_alerta"("codigo");

-- CreateIndex
CREATE INDEX "alertas_estado_idx" ON "app"."alertas"("estado");

-- CreateIndex
CREATE INDEX "alertas_latitud_longitud_idx" ON "app"."alertas"("latitud", "longitud");

-- CreateIndex
CREATE INDEX "alertas_asignado_a_id_idx" ON "app"."alertas"("asignado_a_id");

-- CreateIndex
CREATE INDEX "eventos_alerta_alerta_id_idx" ON "app"."eventos_alerta"("alerta_id");

-- CreateIndex
CREATE INDEX "eventos_alerta_tipo_idx" ON "app"."eventos_alerta"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_servicio_codigo_key" ON "app"."tipos_servicio"("codigo");

-- CreateIndex
CREATE INDEX "agendas_enfermero_id_dia_semana_idx" ON "app"."agendas"("enfermero_id", "dia_semana");

-- CreateIndex
CREATE INDEX "citas_enfermero_id_inicio_fin_idx" ON "app"."citas"("enfermero_id", "inicio", "fin");

-- CreateIndex
CREATE INDEX "citas_paciente_id_inicio_idx" ON "app"."citas"("paciente_id", "inicio");

-- CreateIndex
CREATE INDEX "audit_logs_usuario_id_idx" ON "app"."audit_logs"("usuario_id");

-- CreateIndex
CREATE INDEX "audit_logs_recurso_idx" ON "app"."audit_logs"("recurso");

-- CreateIndex
CREATE UNIQUE INDEX "system_parameters_clave_key" ON "app"."system_parameters"("clave");

-- AddForeignKey
ALTER TABLE "app"."usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "app"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."consentimientos" ADD CONSTRAINT "consentimientos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."perfiles_paciente" ADD CONSTRAINT "perfiles_paciente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."accesos_medicos" ADD CONSTRAINT "accesos_medicos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."accesos_medicos" ADD CONSTRAINT "accesos_medicos_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."historial_medico" ADD CONSTRAINT "historial_medico_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."alergias" ADD CONSTRAINT "alergias_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."medicamentos" ADD CONSTRAINT "medicamentos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."antecedentes_familiares" ADD CONSTRAINT "antecedentes_familiares_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."estilo_vida_detalle" ADD CONSTRAINT "estilo_vida_detalle_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."registros_clinicos" ADD CONSTRAINT "registros_clinicos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."registros_clinicos" ADD CONSTRAINT "registros_clinicos_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "app"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."registros_clinicos" ADD CONSTRAINT "registros_clinicos_tipo_nota_id_fkey" FOREIGN KEY ("tipo_nota_id") REFERENCES "app"."tipos_nota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."signos_vitales" ADD CONSTRAINT "signos_vitales_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."signos_vitales" ADD CONSTRAINT "signos_vitales_tomado_por_id_fkey" FOREIGN KEY ("tomado_por_id") REFERENCES "app"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."adjuntos" ADD CONSTRAINT "adjuntos_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "app"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."alertas" ADD CONSTRAINT "alertas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."alertas" ADD CONSTRAINT "alertas_tipo_alerta_id_fkey" FOREIGN KEY ("tipo_alerta_id") REFERENCES "app"."tipos_alerta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."alertas" ADD CONSTRAINT "alertas_asignado_a_id_fkey" FOREIGN KEY ("asignado_a_id") REFERENCES "app"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."eventos_alerta" ADD CONSTRAINT "eventos_alerta_alerta_id_fkey" FOREIGN KEY ("alerta_id") REFERENCES "app"."alertas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."eventos_alerta" ADD CONSTRAINT "eventos_alerta_por_usuario_id_fkey" FOREIGN KEY ("por_usuario_id") REFERENCES "app"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."agendas" ADD CONSTRAINT "agendas_enfermero_id_fkey" FOREIGN KEY ("enfermero_id") REFERENCES "app"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."citas" ADD CONSTRAINT "citas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "app"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."citas" ADD CONSTRAINT "citas_enfermero_id_fkey" FOREIGN KEY ("enfermero_id") REFERENCES "app"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."citas" ADD CONSTRAINT "citas_tipo_servicio_id_fkey" FOREIGN KEY ("tipo_servicio_id") REFERENCES "app"."tipos_servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."audit_logs" ADD CONSTRAINT "audit_logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "app"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

