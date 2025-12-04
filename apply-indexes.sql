-- ========================================
-- Índices de Optimización - UnihealthA
-- ========================================
-- Aplicar ANTES o INMEDIATAMENTE DESPUÉS del deployment en AWS
-- Estos índices optimizan las consultas de paginación, filtrado y ordenamiento

-- ========================================
-- TABLA: historial_medico
-- ========================================

-- Índice 1: Búsqueda por paciente y tipo (fisico/mental)
-- Optimiza: GET /medical-history/:patientId con filtro type
CREATE INDEX IF NOT EXISTS idx_historial_paciente_tipo 
ON app.historial_medico(paciente_id, tipo);

-- Índice 2: Ordenamiento por fecha de creación
-- Optimiza: Paginación con sortBy=createdAt
CREATE INDEX IF NOT EXISTS idx_historial_paciente_fecha
ON app.historial_medico(paciente_id, creado_en);

-- Índice 3: Filtrado de registros activos/inactivos
-- Optimiza: GET /medical-history/:patientId?isActive=true
CREATE INDEX IF NOT EXISTS idx_historial_paciente_activo
ON app.historial_medico(paciente_id, activo);

-- ========================================
-- TABLA: medicamentos
-- ========================================

-- Índice 1: Filtrado de medicamentos activos
-- Optimiza: GET /medical-history/:patientId/medications/active
CREATE INDEX IF NOT EXISTS idx_medicamentos_paciente_activo
ON app.medicamentos(paciente_id, activo);

-- Índice 2: Búsqueda por rango de fechas
-- Optimiza: Consultas con filtros de startDate/endDate
CREATE INDEX IF NOT EXISTS idx_medicamentos_paciente_fechas
ON app.medicamentos(paciente_id, fecha_inicio, fecha_fin);

-- ========================================
-- Verificación de Índices Creados
-- ========================================

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'app' 
AND tablename IN ('historial_medico', 'medicamentos')
ORDER BY tablename, indexname;

-- ========================================
-- Resultado Esperado:
-- ========================================
-- historial_medico | historial_medico_pkey (PRIMARY KEY)
-- historial_medico | idx_historial_paciente_tipo
-- historial_medico | idx_historial_paciente_fecha
-- historial_medico | idx_historial_paciente_activo
-- medicamentos     | medicamentos_pkey (PRIMARY KEY)
-- medicamentos     | idx_medicamentos_paciente_activo
-- medicamentos     | idx_medicamentos_paciente_fechas
