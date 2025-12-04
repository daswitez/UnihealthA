# Catálogos del Sistema - UnihealthA

    "codigo": "consulta_general",
    "nombre": "Consulta General",
    "activo": true
  },
  {
    "id": 2,
    "codigo": "urgencias",
    "nombre": "Urgencias",
    "activo": true
  },
  {
    "id": 3,
    "codigo": "especialidad",
    "nombre": "Consulta de Especialidad",
    "activo": true
  },
  {
    "id": 4,
    "codigo": "control",
    "nombre": "Control/Seguimiento",
    "activo": true
  },
  {
    "id": 5,
    "codigo": "vacunacion",
    "nombre": "Vacunación",
    "activo": true
  }
]
```

**Uso en citas:**
```javascript
// POST /appointments
{
  "patientId": 1,
  "nurseId": 2,
  "serviceTypeId": 1,  // ID del tipo de servicio
  "scheduledAt": "2024-12-10T10:00:00Z",
  "notes": "Consulta de rutina"
}
```

---

## Tipos de Alerta

**Tipos de alerta disponibles:**
```json
[
  {
    "id": 1,
    "codigo": "emergencia",
    "nombre": "Emergencia Médica",
    "activo": true
  },
  {
    "id": 2,
    "codigo": "caida",
    "nombre": "Caída Detectada",
    "activo": true
  },
  {
    "id": 3,
    "codigo": "medicacion",
    "nombre": "Recordatorio de Medicación",
    "activo": true
  },
  {
    "id": 4,
    "codigo": "vitales",
    "nombre": "Signos Vitales Anormales",
    "activo": true
  }
]
```

**Uso en alertas:**
```javascript
// POST /alerts
{
  "patientId": 1,
  "alertTypeId": 1,  // ID del tipo de alerta
  "description": "Dolor de pecho severo",
  "latitude": -16.5000,
  "longitude": -68.1500
}
```

---

## Tipos de Nota Clínica

**Tipos de nota clínica disponibles:**
```json
[
  {
    "id": 1,
    "codigo": "consulta",
    "nombre": "Nota de Consulta"
  },
  {
    "id": 2,
    "codigo": "evolucion",
    "nombre": "Nota de Evolución"
  },
  {
    "id": 3,
    "codigo": "ingreso",
    "nombre": "Nota de Ingreso"
  },
  {
    "id": 4,
    "codigo": "egreso",
    "nombre": "Nota de Egreso"
  }
]
```

**Uso en registros clínicos:**
```javascript
// POST /clinical-records
{
  "patientId": 1,
  "noteTypeId": 1,  // ID del tipo de nota
  "note": "Paciente presenta..."
}
```

---

## Tipos de Historial Médico

**Valores permitidos para el campo `type`:**

```typescript
type: "fisico" | "mental"
```

**Uso:**
```javascript
// POST /medical-history
{
  "patientId": 1,
  "type": "fisico",  // o "mental"
  "condition": "Diabetes",
  "diagnosis": "Diabetes tipo 2",
  "treatment": "Metformina 500mg",
  "diagnosedAt": "2023-01-15",
  "notes": "Control cada 3 meses"
}
```

---

## Severidad de Alergias

**Valores permitidos para el campo `severity`:**

```typescript
severity: "mild" | "moderate" | "severe"
```

**Uso:**
```javascript
// POST /medical-history/:patientId/allergies
{
  "patientId": 1,
  "allergen": "Penicilina",
  "reaction": "Erupciones cutáneas",
  "severity": "severe",  // mild, moderate, o severe
  "notes": "Evitar todos los beta-lactámicos"
}
```

---

## Estados de Alerta

**Valores permitidos para el campo `status`:**

```typescript
status: "pendiente" | "en_proceso" | "resuelta" | "cancelada"
```

**Estado por defecto:** `"pendiente"`

**Uso:**
```javascript
// PATCH /alerts/:id
{
  "status": "resuelta",
  "assignedToId": 2
}
```

---

## Fuente de Alerta

**Valores permitidos para el campo `source`:**

```typescript
source: "app" | "dispositivo" | "manual"
```

**Fuente por defecto:** `"app"`

---

## Género de Paciente

**Valores permitidos para el campo `gender`:**

```typescript
gender: "M" | "F" | "O"
```

- **M**: Masculino
- **F**: Femenino  
- **O**: Otro

**Uso:**
```javascript
// Al crear perfil de paciente
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "dateOfBirth": "1990-05-15",
  "gender": "M",  // Un solo carácter
  "email": "juan.perez@example.com"
}
```

---

## Grupo Sanguíneo

**Valores recomendados:**

```typescript
bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
```

**Campo:** Texto libre (VARCHAR 5), pero se recomienda usar los valores estándar.

---

## Resumen de Campos Requeridos por Endpoint

### POST `/auth/register`
```json
{
  "email": "string (requerido, único)",
  "password": "string (requerido, min 6 caracteres)"
}
```

### POST `/patients`
```json
{
  "email": "string (requerido, único)",
  "firstName": "string (requerido)",
  "lastName": "string (requerido)",
  "dateOfBirth": "YYYY-MM-DD (opcional)",
  "gender": "M | F | O (opcional, 1 carácter)"
}
```

### POST `/appointments`
```json
{
  "patientId": "number (requerido)",
  "nurseId": "number (requerido)",
  "serviceTypeId": "number (requerido, 1-5)",
  "scheduledAt": "ISO DateTime (requerido)",
  "notes": "string (opcional)"
}
```

### POST `/alerts`
```json
{
  "patientId": "number (opcional)",
  "alertTypeId": "number (requerido, 1-4)",
  "description": "string (opcional)",
  "latitude": "number (opcional)",
  "longitude": "number (opcional)"
}
```

### POST `/vitals`
```json
{
  "patientId": "number (requerido)",
  "takenById": "number (requerido)",
  "systolic": "number (opcional)",
  "diastolic": "number (opcional)",
  "heartRate": "number (opcional)",
  "temperature": "number (opcional)",
  "spo2": "number (opcional)"
}
```

### POST `/medical-history`
```json
{
  "patientId": "number (requerido)",
  "type": "fisico | mental (requerido)",
  "condition": "string (requerido)",
  "diagnosis": "string (opcional)",
  "treatment": "string (opcional)",
  "diagnosedAt": "YYYY-MM-DD (opcional)",
  "notes": "string (opcional)"
}
```

---

## Notas Importantes

1. **IDs Autoincrementales**: Todos los `id` son generados automáticamente por la base de datos.

2. **Fechas**: Use formato ISO 8601 (`YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ssZ`).

3. **BigInt a Number**: La API convierte automáticamente los BigInt a números en las respuestas JSON.

4. **Validación**: Todos los endpoints usan validación automática. Los errores 400 indican datos inválidos.

5. **Unicidad de Email**: Tanto en `/auth/register` como en `/patients`, el email debe ser único. Error 500 con código `P2002` indica email duplicado.

6. **Catálogos Dinámicos**: Para obtener los IDs actuales de tipos de servicio, alertas o notas, consulte la base de datos o cree endpoints GET específicos.

---

## Consultas SQL Útiles

Para verificar los catálogos en la base de datos:

```sql
-- Ver roles
SELECT * FROM app.roles;

-- Ver tipos de servicio
SELECT * FROM app.tipos_servicio;

-- Ver tipos de alerta
SELECT * FROM app.tipos_alerta;

-- Ver tipos de nota
SELECT * FROM app.tipos_nota;
```
