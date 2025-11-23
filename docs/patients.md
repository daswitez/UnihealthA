## Patients – Pacientes y perfiles

- **Base path**: `/patients`
- **Auth**: requiere `Bearer <token>`

Un paciente se modela como:
- Un `User` con rol `'user'`.
- Un `PatientProfile` asociado (`perfiles_paciente`).

### 1. Crear paciente

- **POST** `/patients`
- Body (`CreatePatientDto` simplificado):

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dob": "1980-01-01",
  "gender": "F",
  "email": "jane.doe@example.com"
}
```

El backend:
- Crea un `User` con:
  - `email` (o uno generado si falta).
  - `passwordHash` con un password temporal.
  - `roleId` para rol `'user'`.
- Crea un `PatientProfile` con los datos básicos.

Frontend:

```ts
export const createPatient = (token: string, payload: {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email?: string;
}) =>
  apiFetch('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
```

### 2. Listar pacientes

- **GET** `/patients`

Devuelve usuarios que tienen perfil de paciente:

```json
[
  {
    "id": 1,
    "email": "jane.doe@example.com",
    "patientProfile": {
      "userId": 1,
      "firstName": "Jane",
      "lastName": "Doe",
      "dob": "1980-01-01T00:00:00.000Z",
      "gender": "F"
    }
  }
]
```

### 3. Obtener paciente por id

- **GET** `/patients/:id`

### 4. Actualizar datos básicos del perfil

- **PATCH** `/patients/:id`
- Body (`UpdatePatientDto`):

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dob": "1981-02-02",
  "gender": "F"
}
```

Esto actualiza la fila en `perfiles_paciente` ligada al usuario con ese `id`.

### 5. Eliminar paciente

- **DELETE** `/patients/:id`

Elimina el `User` asociado; por diseño, puede tener implicaciones en relaciones (usar con cuidado en producción).


