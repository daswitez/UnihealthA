## Appointments – Citas y agenda

- **Base path**: `/appointments`
- **Auth**: requiere `Bearer <token>`

Gestiona citas entre pacientes y enfermeros, con control de solapamientos.

### 1. Crear cita

- **POST** `/appointments`
- Body (`CreateAppointmentDto`):

```json
{
  "patientId": 1,
  "nurseId": 2,
  "serviceTypeId": 1,
  "start": "2025-11-24T09:00:00.000Z",
  "end": "2025-11-24T09:30:00.000Z",
  "reason": "Chequeo general"
}
```

Reglas:
- Si el enfermero ya tiene una cita que se solapa en ese intervalo (excepto canceladas), devuelve `400` con mensaje:
  - `"El enfermero ya tiene una cita en ese horario."`

### 2. Listar citas

- **GET** `/appointments`

Incluye paciente, enfermero y tipo de servicio:

```json
[
  {
    "id": 1,
    "patientId": 1,
    "nurseId": 2,
    "serviceTypeId": 1,
    "start": "2025-11-24T09:00:00.000Z",
    "end": "2025-11-24T09:30:00.000Z",
    "status": "solicitada",
    "reason": "Chequeo general"
  }
]
```

### 3. Obtener cita concreta

- **GET** `/appointments/:id`

### 4. Actualizar estado de una cita

- **PATCH** `/appointments/:id/status`
- Body (`UpdateAppointmentDto` típico):

```json
{
  "status": "confirmada"
}
```

Valores de estado habituales: `"solicitada"`, `"confirmada"`, `"cancelada"`, etc.

---

### Consumo desde frontend

```ts
export const createAppointment = (
  token: string,
  payload: {
    patientId: number;
    nurseId: number;
    serviceTypeId: number;
    start: string;
    end: string;
    reason?: string;
  },
) =>
  apiFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);

export const updateAppointmentStatus = (
  token: string,
  appointmentId: number,
  status: string,
) =>
  apiFetch(`/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token);
```


