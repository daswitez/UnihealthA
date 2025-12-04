# Appointments API - Citas Médicas

**Base URL**: `http://54.166.181.144:3000/appointments`  
**Auth**: Requiere `Bearer <token>`

Sistema completo para gestión de citas médicas entre pacientes y enfermeras/doctores.

---

## 📋 Endpoints de Consulta

### 1. Listar todas las citas

```http
GET http://54.166.181.144:3000/appointments
Authorization: Bearer <token>
```

**Respuesta:**
```json
[
  {
    "id": "1",
    "patientId": "2",
    "nurseId": "5",
    "serviceTypeId": "1",
    "start": "2024-12-10T10:00:00Z",
    "end": "2024-12-10T11:00:00Z",
    "status": "confirmada",
    "reason": "Chequeo mensual",
    "patient": {
      "id": "2",
      "email": "patient@example.com"
    },
    "nurse": {
      "id": "5",
      "email": "nurse.lopez@unihealth.com"
    },
    "serviceType": {
      "id": "1",
      "code": "CHECKUP",
      "name": "Chequeo General"
    }
  }
]
```

---

### 2. Obtener médicos disponibles

```http
GET http://54.166.181.144:3000/appointments/available-doctors
Authorization: Bearer <token>
```

Lista todos los médicos activos que pueden atender citas.

**Respuesta:**
```json
[
  {
    "id": "5",
    "email": "dr.martinez@unihealth.com",
    "role": {
      "name": "doctor"
    }
  },
  {
    "id": "6",
    "email": "dr.rodriguez@unihealth.com",
    "role": {
      "name": "doctor"
    }
  }
]
```

**Ejemplo JavaScript:**
```javascript
const getDoctors = async (token) => {
  const response = await fetch('http://54.166.181.144:3000/appointments/available-doctors', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

---

### 3. Obtener enfermeras disponibles

```http
GET http://54.166.181.144:3000/appointments/available-nurses
Authorization: Bearer <token>
```

Lista todas las enfermeras activas que pueden atender citas.

**Respuesta:**
```json
[
  {
    "id": "15",
    "email": "nurse.lopez@unihealth.com",
    "role": {
      "name": "nurse"
    }
  }
]
```

---

### 4. Obtener tipos de servicio

```http
GET http://54.166.181.144:3000/appointments/service-types
Authorization: Bearer <token>
```

Lista todos los tipos de servicios médicos disponibles.

**Respuesta:**
```json
[
  {
    "id": "1",
    "code": "CHECKUP",
    "name": "Chequeo General"
  },
  {
    "id": "2",
    "code": "EMERGENCY",
    "name": "Urgencia"
  }
]
```

---

### 5. Obtener cita por ID

```http
GET http://54.166.181.144:3000/appointments/:id
Authorization: Bearer <token>
```

---

## 📝 Endpoints de Creación y Modificación

### 6. Crear nueva cita

```http
POST http://54.166.181.144:3000/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 2,
  "nurseId": 15,
  "serviceTypeId": 1,
  "start": "2024-12-10T10:00:00Z",
  "end": "2024-12-10T11:00:00Z",
  "reason": "Chequeo mensual"
}
```

**Campos:**
- `patientId` (number, requerido) - ID del paciente
- `nurseId` (number, requerido) - ID de la enfermera/doctor
- `serviceTypeId` (number, requerido) - ID del tipo de servicio
- `start` (string ISO date, requerido) - Fecha/hora de inicio
- `end` (string ISO date, requerido) - Fecha/hora de fin
- `reason` (string, opcional) - Motivo de la cita

**Validaciones automáticas:**
- ✅ Detecta conflictos de horario
- ✅ No permite citas superpuestas
- ⚠️ Retorna error 400 si hay conflicto

**Ejemplo JavaScript:**
```javascript
const createAppointment = async (token, appointmentData) => {
  const response = await fetch('http://54.166.181.144:3000/appointments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });
  return response.json();
};
```

---

### 7. Actualizar estado de cita

```http
PATCH http://54.166.181.144:3000/appointments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmada"
}
```

**Estados válidos:**
- `solicitada` - Estado inicial
- `confirmada` - Cita confirmada
- `completada` - Cita realizada
- `cancelada` - Cita cancelada

---

## 💡 Flujo completo para agendar una cita

```javascript
const token = localStorage.getItem('token');

// 1. Obtener opciones disponibles
const [nurses, services] = await Promise.all([
  fetch('http://54.166.181.144:3000/appointments/available-nurses', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),
  fetch('http://54.166.181.144:3000/appointments/service-types', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json())
]);

// 2. Crear la cita
const appointmentData = {
  patientId: 2,
  nurseId: nurses[0].id,
  serviceTypeId: services[0].id,
  start: '2024-12-10T10:00:00Z',
  end: '2024-12-10T11:00:00Z',
  reason: 'Chequeo de rutina',
};

const newAppointment = await fetch('http://54.166.181.144:3000/appointments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(appointmentData),
}).then(r => r.json());

console.log('Cita creada:', newAppointment);
```
