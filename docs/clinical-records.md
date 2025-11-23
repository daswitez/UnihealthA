## Clinical Records – Historia clínica

- **Base path**: `/records`
- **Auth**: requiere `Bearer <token>`

Un registro clínico (`ClinicalRecord`) vincula:
- Paciente (`patientId`)
- Profesional que lo crea (`createdById`)
- Tipo de nota (`noteTypeId`)
- Texto de la nota.

### 1. Crear registro clínico

- **POST** `/records`
- Body (`CreateClinicalRecordDto`):

```json
{
  "patientId": 1,
  "noteTypeId": 1,
  "note": "Texto libre de la nota clínica"
}
```

`createdById` se rellena automáticamente con `req.user.userId` (usuario autenticado).

### 2. Listar historia clínica de un paciente

- **GET** `/records/patient/:patientId`

```http
GET /records/patient/1
Authorization: Bearer <token>
```

Respuesta típica:

```json
[
  {
    "id": 10,
    "patientId": 1,
    "noteTypeId": 1,
    "note": "....",
    "createdAt": "2025-11-23T20:00:00.000Z",
    "createdBy": { "email": "nurse@example.com", "role": { "name": "nurse" } },
    "noteType": { "id": 1, "name": "GENERAL" }
  }
]
```

### 3. Obtener mi propia historia

- **GET** `/records/my-history`

Usa `req.user.userId` como `patientId`, útil para que el paciente vea sus propias notas.

### 4. Obtener registro concreto

- **GET** `/records/:id`

```http
GET /records/10
Authorization: Bearer <token>
```

---

### Consumo desde frontend

```ts
export const fetchPatientRecords = (token: string, patientId: number) =>
  apiFetch(`/records/patient/${patientId}`, {}, token);

export const createRecord = (
  token: string,
  payload: { patientId: number; noteTypeId: number; note: string },
) =>
  apiFetch('/records', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
```


