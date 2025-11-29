# Medical History API

Módulo completo para gestión de historias médicas con control de acceso granular y validación robusta.

## Tabla de Contenidos

- [Autenticación](#autenticación)
- [Control de Acceso](#control-de-acceso)
- [Medical History](#medical-history)
- [Allergies](#allergies)
- [Medications](#medications)
- [Family History](#family-history)
- [Lifestyle](#lifestyle)
- [Full History](#full-history)

---

## Autenticación

Todos los endpoints requieren autenticación JWT:

```http
Authorization: Bearer <access_token>
```

---

## Control de Acceso

### Permisos Granulares

El sistema implementa control de acceso basado en permisos `fisico` y `mental`:

- **Paciente**: Acceso completo a su propio historial
- **Personal médico**: Requiere grant de acceso explícito del paciente
  - Puede tener acceso solo a registros `fisico`
  - Puede tener acceso solo a registros `mental`
  - O acceso completo a ambos

### Flujo de Acceso

```javascript
// 1. Paciente otorga acceso a un doctor
POST /access/grant
{
  "patientId": 123,
  "doctorId": 456,
  "pin": "1234",
  "permissions": {
    "fisico": true,
    "mental": false  // Solo acceso a registros físicos
  }
}

// 2. Doctor ahora puede acceder a historiales físicos
GET /medical-history/patient/123?type=fisico
Authorization: Bearer <doctor_token>
```

---

## Medical History

### Create Medical History

Crear un registro de historial médico.

```http
POST /medical-history
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "patientId": 123,
  "condition": "Diabetes Type 2",
  "diagnosis": "Confirmed via blood test",
  "treatment": "Metformin 500mg twice daily",
  "diagnosedAt": "2023-06-15",
  "type": "fisico",
  "notes": "Monitor blood sugar levels daily"
}
```

**Required Fields:**
- `patientId` (number)
- `condition` (string, 1-255 chars)
- `type` ("fisico" | "mental")

**Optional Fields:**
- `diagnosis` (string)
- `treatment` (string)
- `diagnosedAt` (ISO date string)
- `notes` (string)

**Response (201):**

```json
{
  "id": "42",
  "patientId": "123",
  "condition": "Diabetes Type 2",
  "diagnosis": "Confirmed via blood test",
  "treatment": "Metformin 500mg twice daily",
  "diagnosedAt": "2023-06-15T00:00:00.000Z",
  "type": "fisico",
  "isActive": true,
  "notes": "Monitor blood sugar levels daily",
  "createdAt": "2025-11-29T04:48:19.886Z",
  "updatedAt": "2025-11-29T04:48:19.886Z"
}
```

---

### List Medical History (with Pagination)

Obtener historiales médicos de un paciente con paginación y filtros.

```http
GET /medical-history/patient/:patientId?page=1&limit=20&type=fisico&isActive=true&sortBy=createdAt&sortOrder=DESC
Authorization: Bearer <token>
```

**Query Parameters:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Número de página (min: 1) |
| `limit` | number | 20 | Items por página (min: 1, max: 100) |
| `type` | string | - | Filtrar por tipo: "fisico" o "mental" |
| `isActive` | boolean | - | Filtrar activos/inactivos |
| `sortBy` | string | createdAt | Campo de ordenamiento: "createdAt", "diagnosedAt", "updatedAt" |
| `sortOrder` | string | DESC | Orden: "ASC" o "DESC" |

**Response (200):**

```json
{
  "items": [
    {
      "id": "42",
      "patientId": "123",
      "condition": "Diabetes Type 2",
      "type": "fisico",
      "isActive": true,
      "createdAt": "2025-11-29T04:48:19.886Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Get One Medical History

```http
GET /medical-history/:id
Authorization: Bearer <token>
```

**Response (200):** Registro completo de historial médico

---

### Update Medical History

```http
PUT /medical-history/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (Todos los campos opcionales)

```json
{
  "condition": "Diabetes Type 2 - Well Controlled",
  "treatment": "Metformin 1000mg, diet modifications",
  "isActive": true
}
```

**Response (200):** Registro actualizado

---

### Deactivate Medical History

Marcar un registro como inactivo (soft delete).

```http
PATCH /medical-history/:id/deactivate
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": "42",
  "isActive": false,
  "updatedAt": "2025-11-29T05:00:00.000Z"
}
```

---

### Delete Medical History

Eliminar permanentemente un registro.

```http
DELETE /medical-history/:id
Authorization: Bearer <token>
```

**Response (200):** Registro eliminado

---

## Allergies

### Create Allergy

```http
POST /medical-history/allergies
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "patientId": 123,
  "allergen": "Peanuts",
  "reaction": "Anaphylaxis",
  "severity": "severe",
  "notes": "Carries EpiPen at all times"
}
```

**Required Fields:**
- `patientId` (number)
- `allergen` (string, 1-255 chars)

**Optional Fields:**
- `reaction` (string)
- `severity` ("mild" | "moderate" | "severe")
- `notes` (string)

**Response (201):**

```json
{
  "id": "15",
  "patientId": "123",
  "allergen": "Peanuts",
  "reaction": "Anaphylaxis",
  "severity": "severe",
  "notes": "Carries EpiPen at all times",
  "createdAt": "2025-11-29T05:00:00.000Z"
}
```

---

### List Patient Allergies

```http
GET /medical-history/allergies/patient/:patientId
Authorization: Bearer <token>
```

**Response (200):** Array de alergias ordenadas por fecha de creación

---

### Get One Allergy

```http
GET /medical-history/allergies/:id
Authorization: Bearer <token>
```

---

### Update Allergy

```http
PUT /medical-history/allergies/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "severity": "moderate",
  "notes": "Severity decreased after immunotherapy"
}
```

---

### Delete Allergy

```http
DELETE /medical-history/allergies/:id
Authorization: Bearer <token>
```

---

## Medications

### Create Medication

```http
POST /medical-history/medications
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "patientId": 123,
  "name": "Lisinopril",
  "dosage": "10mg",
  "frequency": "Once daily in the morning",
  "startDate": "2024-01-01",
  "endDate": null,
  "isActive": true
}
```

**Required Fields:**
- `patientId` (number)
- `name` (string, 1-255 chars)

**Optional Fields:**
- `dosage` (string, max 100 chars)
- `frequency` (string, max 100 chars)
- `startDate` (ISO date string)
- `endDate` (ISO date string)
- `isActive` (boolean, default: true)

**Validation:** `startDate` must be before `endDate`

**Response (201):**

```json
{
  "id": "28",
  "patientId": "123",
  "name":" Lisinopril",
  "dosage": "10mg",
  "frequency": "Once daily in the morning",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": null,
  "isActive": true,
  "createdAt": "2025-11-29T05:00:00.000Z"
}
```

---

### List All Medications

```http
GET /medical-history/medications/patient/:patientId
Authorization: Bearer <token>
```

**Response (200):** Array de todos los medicamentos (activos e inactivos)

---

### List Active Medications Only

```http
GET /medical-history/medications/patient/:patientId/active
Authorization: Bearer <token>
```

**Response (200):** Array de solo medicamentos activos

---

### Get One Medication

```http
GET /medical-history/medications/:id
Authorization: Bearer <token>
```

---

### Update Medication

```http
PUT /medical-history/medications/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "dosage": "20mg",
  "notes": "Dosage increased due to blood pressure readings"
}
```

---

### Deactivate Medication

Marcar medicamento como descontinuado.

```http
PATCH /medical-history/medications/:id/deactivate
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": "28",
  "isActive": false,
  "updatedAt": "2025-11-29T06:00:00.000Z"
}
```

---

### Delete Medication

```http
DELETE /medical-history/medications/:id
Authorization: Bearer <token>
```

---

## Family History

### Create Family History

```http
POST /medical-history/family-history
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "patientId": 123,
  "relationship": "Father",
  "condition": "Hypertension",
  "notes": "Diagnosed at age 45"
}
```

**Required Fields:**
- `patientId` (number)
- `relationship` (string, 1-50 chars)
- `condition` (string, 1-255 chars)

**Optional Fields:**
- `notes` (string)

**Response (201):**

```json
{
  "id": "7",
  "patientId": "123",
  "relationship": "Father",
  "condition": "Hypertension",
  "notes": "Diagnosed at age 45",
  "createdAt": "2025-11-29T05:00:00.000Z"
}
```

---

### List Family History

```http
GET /medical-history/family-history/patient/:patientId
Authorization: Bearer <token>
```

---

### Get One Family History

```http
GET /medical-history/family-history/:id
Authorization: Bearer <token>
```

---

### Update Family History

```http
PUT /medical-history/family-history/:id
Authorization: Bearer <token>
Content-Type: application/json
```

---

### Delete Family History

```http
DELETE /medical-history/family-history/:id
Authorization: Bearer <token>
```

---

## Lifestyle

### Create Lifestyle Details

```http
POST /medical-history/lifestyle
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "patientId": 123,
  "diet": "Mediterranean diet",
  "sleepHours": 7.5,
  "stressLevel": 6,
  "activityType": "Running and swimming",
  "activityFreq": "4-5 times per week",
  "tobacco": "Never",
  "alcohol": "Occasionally (1-2 drinks per week)"
}
```

**Required Fields:**
- `patientId` (number)

**Optional Fields:**
- `diet` (string, max 255 chars)
- `sleepHours` (number, 0-24)
- `stressLevel` (number, 1-10)
- `activityType` (string, max 255 chars)
- `activityFreq` (string, max 100 chars)
- `tobacco` (string, max 100 chars)
- `alcohol` (string, max 100 chars)

**Response (201):**

```json
{
  "id": "3",
  "patientId": "123",
  "diet": "Mediterranean diet",
  "sleepHours": 7.5,
  "stressLevel": 6,
  "activityType": "Running and swimming",
  "activityFreq": "4-5 times per week",
  "tobacco": "Never",
  "alcohol": "Occasionally (1-2 drinks per week)",
  "createdAt": "2025-11-29T05:00:00.000Z",
  "updatedAt": "2025-11-29T05:00:00.000Z"
}
```

---

### Get Lifestyle Details

```http
GET /medical-history/lifestyle/patient/:patientId
Authorization: Bearer <token>
```

**Response (200):** Registro más reciente de lifestyle (o null si no existe)

---

### Update Lifestyle

```http
PUT /medical-history/lifestyle/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "sleepHours": 8,
  "stressLevel": 4,
  "notes": "Improved stress management techniques"
}
```

---

### Delete Lifestyle

```http
DELETE /medical-history/lifestyle/:id
Authorization: Bearer <token>
```

---

## Full History

### Get Complete Medical History

Obtener todo el historial médico de un paciente en una sola llamada.

```http
GET /medical-history/full/:patientId
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "history": [
    {
      "id": "42",
      "condition": "Diabetes Type 2",
      "type": "fisico",
      "diagnosedAt": "2023-06-15T00:00:00.000Z",
      "isActive": true
    },
    {
      "id": "43",
      "condition": "Anxiety Disorder",
      "type": "mental",
      "diagnosedAt": "2024-01-10T00:00:00.000Z",
      "isActive": true
    }
  ],
  "allergies": [
    {
      "id": "15",
      "allergen": "Peanuts",
      "severity": "severe"
    }
  ],
  "medications": [
    {
      "id": "28",
      "name": "Lisinopril",
      "dosage": "10mg",
      "isActive": true
    }
  ],
  "familyHistory": [
    {
      "id": "7",
      "relationship": "Father",
      "condition": "Hypertension"
    }
  ],
  "lifestyle": {
    "id": "3",
    "diet": "Mediterranean diet",
    "sleepHours": 7.5,
    "stressLevel": 6
  }
}
```

**Nota:** Este endpoint respeta los permisos granulares. Si el requester solo tiene acceso a registros `fisico`, el array `history` solo contendrá registros de tipo `fisico`.

---

## Error Responses

### 400 Bad Request

Validación de datos falló.

```json
{
  "statusCode": 400,
  "message": [
    "type must be one of the following values: fisico, mental",
    "condition must be longer than or equal to 1 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized

Token JWT faltante o inválido.

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden

Sin permisos de acceso para este paciente.

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access fisico records for this patient",
  "error": "Forbidden"
}
```

### 404 Not Found

Registro no existe.

```json
{
  "statusCode": 404,
  "message": "Medical history record 999 not found",
  "error": "Not Found"
}
```

---

## Ejemplos de Uso

### Crear Historial Completo para un Paciente

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const patientId = 123;

// 1. Crear historial médico
const history = await fetch('http://localhost:3000/medical-history', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    patientId,
    condition: 'Hypertension',
    type: 'fisico',
    treatment: 'Lisinopril 10mg daily'
  })
});

// 2. Agregar alergias
const allergy = await fetch('http://localhost:3000/medical-history/allergies', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    patientId,
    allergen: 'Penicillin',
    severity: 'severe'
  })
});

// 3. Agregar medicamentos
const medication = await fetch('http://localhost:3000/medical-history/medications', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    patientId,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    isActive: true
  })
});

// 4. Obtener historial completo
const fullHistory = await fetch(`http://localhost:3000/medical-history/full/${patientId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});

const data = await fullHistory.json();
console.log('Complete medical history:', data);
```

---

## Notas de Implementación

### Validación Automática

Todos los endpoints utilizan `class-validator` con `ValidationPipe` global:

- ✅ Tipos de datos automáticamente validados
- ✅ Rangos numéricos verificados
- ✅ Longitudes de string verificadas
- ✅ Enums estrictos (tipo, severidad, etc.)
- ✅ Propiedades no permitidas rechazadas

### Performance

- ✅ **Paginación**: Por defecto 20 items, máximo 100
- ✅ **Índices de BD**: Queries optimizadas con índices compuestos en `(patientId, type)`, `(patientId, createdAt)`, etc.
- ✅ **Queries paralelas**: `getFullHistory()` usa `Promise.all()`

### Seguridad

- ✅ **Control de acceso granular**: Permisos físico/mental
- ✅ **Validación de ownership**: Usuarios solo acceden a sus datos o datos con grant
- ✅ **Logging**: Todas las operaciones se registran
- ✅ **Sanitización**: ValidationPipe remueve propiedades no permitidas

---

## Resumen de Endpoints

**Total: 35 endpoints**

| Categoría | Endpoints | CRUD Completo |
|-----------|-----------|---------------|
| Medical History | 7 | ✅ |
| Allergies | 5 | ✅ |
| Medications | 7 | ✅ |
| Family History | 5 | ✅ |
| Lifestyle | 4 | ✅ |
| Full History | 1 | - |
