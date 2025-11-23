## Vitals – Signos vitales

- **Base path**: `/vitals`
- **Auth**: requiere `Bearer <token>`

Representa mediciones puntuales de signos vitales (`Vitals`), tomadas por un usuario (`takenById`) sobre un paciente (`patientId`).

### 1. Registrar signos vitales

- **POST** `/vitals`
- Body (`CreateVitalDto` simplificado):

```json
{
  "patientId": 1,
  "systolicBP": 120,
  "diastolicBP": 80,
  "heartRate": 72,
  "tempC": 36.5,
  "spo2": 98
}
```

El backend guarda `takenById` con `req.user.userId`.

Frontend:

```ts
export const createVitals = (
  token: string,
  payload: {
    patientId: number;
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    tempC?: number;
    spo2?: number;
  },
) =>
  apiFetch('/vitals', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
```

### 2. Listar signos vitales de un paciente

- **GET** `/vitals/patient/:patientId`

```http
GET /vitals/patient/1
Authorization: Bearer <token>
```

Ordenados por `takenAt` descendente.

### 3. Ver mi historial de signos vitales

- **GET** `/vitals/my-history`

Usa `req.user.userId` como `patientId`, de forma similar a la historia clínica.


