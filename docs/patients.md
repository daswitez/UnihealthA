# Patients API - Perfiles de Pacientes

**Base URL**: `http://54.166.181.144:3000/patients`  
**Auth**: Requiere `Bearer <token>`

Un paciente se modela como:
- Un `User` con rol `'user'`
- Un `PatientProfile` asociado con información demográfica y médica

---

## 📋 Endpoints

### 1. Crear paciente

```http
POST http://54.166.181.144:3000/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "dob": "1980-01-01",
  "gender": "F",
  "email": "jane.doe@example.com",
  "phone": "+1234567890",
  "bloodGroup": "O+",
  "heightCm": 165,
  "weightKg": 65.5,
  "insurance": {
    "provider": "BlueCross",
    "policyNumber": "BC123456",
    "validUntil": "2025-12-31"
  },
  "emergencyContact": "John Doe +1234567891",
  "isSmoker": false,
  "alcohol": "nunca",
  "activity": "moderado",
  "allergies": "Ninguna conocida",
  "history": "Sin antecedentes relevantes"
}
```

**Campos obligatorios:**
- `firstName` (string)
- `lastName` (string)
- `dob` (string ISO date)
- `gender` (string, 1 carácter: M/F/O)

**Campos opcionales:**
- `email` (string) - Si no se provee, se genera uno automático
- `phone` (string)
- `bloodGroup` (string) - Ej: "A+", "O-", "AB+", etc
- `heightCm` (number, 0-300)
- `weightKg` (number, 0-500)
- `insurance` (object) - Información del seguro médico
- `emergencyContact` (string)
- `isSmoker` (boolean)
- `alcohol` (string) - Ej: "nunca", "ocasional", "frecuente"
- `activity` (string) - Nivel de actividad física
- `allergies` (string)
- `history` (string) - Antecedentes médicos

**El backend crea:**
1. Un `User` con email y password temporal
2. Un `PatientProfile` con todos los datos proporcionados

**Ejemplo con JavaScript:**

```javascript
const createPatient = async (token, patientData) => {
  const response = await fetch('http://54.166.181.144:3000/patients', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });
  return response.json();
};

// Uso
const newPatient = await createPatient(token, {
  firstName: 'Jane',
  lastName: 'Doe',
  dob: '1980-01-01',
  gender: 'F',
  email: 'jane@example.com',
  bloodGroup: 'O+',
  heightCm: 165,
  weightKg: 65.5,
});
```

---

### 2. Listar todos los pacientes

```http
GET http://54.166.181.144:3000/patients
Authorization: Bearer <token>
```

**Respuesta:**

```json
[
  {
    "id": "1",
    "email": "jane.doe@example.com",
    "role": {
      "id": "1",
      "name": "user"
    },
    "patientProfile": {
      "userId": "1",
      "firstName": "Jane",
      "lastName": "Doe",
      "dob": "1980-01-01T00:00:00.000Z",
      "gender": "F",
      "bloodGroup": "O+",
      "heightCm": 165,
      "weightKg": "65.50",
      "insurance": {
        "provider": "BlueCross",
        "policyNumber": "BC123456"
      },
      "emergencyContact": "John Doe +1234567891",
      "isSmoker": false,
      "alcohol": "nunca",
      "activity": "moderado",
      "allergies": "Ninguna conocida",
      "history": "Sin antecedentes relevantes"
    }
  }
]
```

---

### 3. Obtener paciente por ID

```http
GET http://54.166.181.144:3000/patients/:id
Authorization: Bearer <token>
```

**Ejemplo:**

```javascript
const getPatient = async (token, patientId) => {
  const response = await fetch(`http://54.166.181.144:3000/patients/${patientId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

---

### 4. Actualizar perfil de paciente

```http
PATCH http://54.166.181.144:3000/patients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "bloodGroup": "O+",
  "heightCm": 166,
  "weightKg": 64.0,
  "insurance": {
    "provider": "NewInsurance",
    "policyNumber": "NI999999"
  },
  "emergencyContact": "Updated Contact",
  "isSmoker": false,
  "alcohol": "ocasional",
  "activity": "activo",
  "allergies": "Polen",
  "history": "Actualizado"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizan los campos enviados.

**Ejemplo:**

```javascript
const updatePatient = async (token, patientId, updates) => {
  const response = await fetch(`http://54.166.181.144:3000/patients/${patientId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return response.json();
};

// Actualizar solo peso y altura
await updatePatient(token, 1, {
  heightCm: 167,
  weightKg: 65.0,
});
```

---

### 5. Actualizar estilo de vida (legacy endpoint)

```http
PATCH http://54.166.181.144:3000/patients/:id/lifestyle
Authorization: Bearer <token>
Content-Type: application/json

{
  "isSmoker": false,
  "alcohol": "occasional",
  "activity": "moderate"
}
```

**Nota:** Este endpoint es legacy. Se recomienda usar el PATCH principal que soporta todos los campos.

---

### 6. Eliminar paciente

```http
DELETE http://54.166.181.144:3000/patients/:id
Authorization: Bearer <token>
```

**⚠️ Advertencia:** Esto elimina el `User` completo y todas sus relaciones en cascada.

**Ejemplo:**

```javascript
const deletePatient = async (token, patientId) => {
  const response = await fetch(`http://54.166.181.144:3000/patients/${patientId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

---

## 📊 Modelo de datos

### PatientProfile

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `userId` | BigInt | ID del usuario (PK) |
| `firstName` | string | Nombres |
| `lastName` | string | Apellidos |
| `dob` | Date | Fecha de nacimiento |
| `gender` | string | Sexo (M/F/O) |
| `bloodGroup` | string? | Grupo sanguíneo |
| `heightCm` | number? | Altura en cm |
| `weightKg` | decimal? | Peso en kg |
| `insurance` | JSON? | Información del seguro |
| `emergencyContact` | string? | Contacto de emergencia |
| `isSmoker` | boolean? | ¿Es fumador? |
| `alcohol` | string? | Consumo de alcohol |
| `activity` | string? | Actividad física |
| `allergies` | string? | Alergias (texto libre) |
| `history` | string? | Antecedentes (texto libre) |

---

## 💡 Ejemplos completos

### Crear paciente completo

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const newPatient = await fetch('http://54.166.181.144:3000/patients', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'María',
    lastName: 'González',
    dob: '1985-03-15',
    gender: 'F',
    email: 'maria.gonzalez@email.com',
    bloodGroup: 'A+',
    heightCm: 160,
    weightKg: 58.5,
    insurance: {
      provider: 'Seguro Nacional',
      policyNumber: 'SN-2024-789',
      validUntil: '2025-12-31'
    },
    emergencyContact: 'Pedro González: +1234567890',
    isSmoker: false,
    alcohol: 'ocasional',
    activity: 'moderado',
    allergies: 'Penicilina',
    history: 'Hipertensión controlada'
  }),
});

const patient = await newPatient.json();
console.log('Paciente creado:', patient);
```

