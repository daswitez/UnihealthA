## Alerts – Alertas y atención

- **Base path**: `/alerts`
- **Auth**: requiere `Bearer <token>`

Las alertas representan eventos críticos (caídas, SOS, etc.) que pueden estar asociados a un paciente y ser asignadas a un enfermero.

### 1. Crear alerta

- **POST** `/alerts`
- Body (`CreateAlertDto`):

```json
{
  "patientId": 1,
  "typeId": 1,
  "latitude": 40.4168,
  "longitude": -3.7038,
  "description": "Caída detectada por el wearable"
}
```

Comportamiento:
- Crea una fila en `alertas` con estado inicial `pendiente`.
- Encola un job en la cola `alerts` (BullMQ) para notificar a workers externos.

### 2. Listar alertas

- **GET** `/alerts`

Incluye paciente, tipo y asignado:

```json
[
  {
    "id": 1,
    "status": "pendiente",
    "patient": { "id": 1, "email": "patient@example.com" },
    "type": { "id": 1, "name": "FALL" },
    "assignedTo": null
  }
]
```

### 3. Obtener una alerta

- **GET** `/alerts/:id`

Incluye también eventos asociados.

### 4. Actualizar estado / asignación

- **PATCH** `/alerts/:id`
- Body (`UpdateAlertDto` típico):

```json
{
  "status": "resuelta",
  "assignedToId": 5
}
```

Si el estado es `"resuelta"`, se rellena `resolvedAt` automáticamente.

### 5. Asignar alerta al usuario autenticado

- **PATCH** `/alerts/:id/assign`

No requiere body; usa `req.user.userId` como `assignedToId` y pone el estado en `en curso`:

```http
PATCH /alerts/1/assign
Authorization: Bearer <token>
```

---

### Consumo desde frontend

```ts
export const fetchAlerts = (token: string) =>
  apiFetch('/alerts', {}, token);

export const createAlert = (
  token: string,
  payload: {
    patientId: number;
    typeId: number;
    latitude?: number;
    longitude?: number;
    description?: string;
  },
) =>
  apiFetch('/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);

export const assignAlertToMe = (token: string, alertId: number) =>
  apiFetch(`/alerts/${alertId}/assign`, {
    method: 'PATCH',
  }, token);
```


