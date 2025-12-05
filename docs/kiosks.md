# Kiosks API - Kioscos Médicos

**Base URL**: `http://54.166.181.144:3000/kiosks`  
**Auth**: Requiere `Bearer <token>`

Sistema para gestión de kioscos médicos con ubicación geográfica y asignación de personal.

---

## 📋 Endpoints

### 1. Listar todos los kioscos

```http
GET http://54.166.181.144:3000/kiosks
Authorization: Bearer <token>
```

**Respuesta:**
```json
[
  {
    "id": "1",
    "name": "Kiosco Central",
    "address": "Av. Principal 123",
    "city": "La Paz",
    "latitude": "-16.500000",
    "longitude": "-68.150000",
    "phone": "+59112345678",
    "openTime": "08:00",
    "closeTime": "18:00",
    "isActive": true,
    "staff": [
      { "userId": "5", "assignedAt": "2024-12-01T10:00:00Z" }
    ],
    "_count": { "appointments": 15 }
  }
]
```

---

### 2. Obtener kioscos cercanos

```http
GET http://54.166.181.144:3000/kiosks/nearby?lat=-16.5&lng=-68.15&radius=10
Authorization: Bearer <token>
```

**Query params:**
- `lat` (requerido) - Latitud del usuario
- `lng` (requerido) - Longitud del usuario
- `radius` (opcional, default: 10) - Radio en kilómetros

**Respuesta:**
```json
[
  {
    "id": "1",
    "name": "Kiosco Central",
    "address": "Av. Principal 123",
    "distanceKm": 0.5
  }
]
```

---

### 3. Obtener kiosco por ID

```http
GET http://54.166.181.144:3000/kiosks/:id
Authorization: Bearer <token>
```

---

### 4. Crear kiosco (Admin)

```http
POST http://54.166.181.144:3000/kiosks
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Kiosco Norte",
  "address": "Calle 21 de Calacoto",
  "city": "La Paz",
  "latitude": -16.523,
  "longitude": -68.067,
  "phone": "+59112345678",
  "openTime": "08:00",
  "closeTime": "18:00"
}
```

---

### 5. Actualizar kiosco

```http
PATCH http://54.166.181.144:3000/kiosks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Kiosco Norte Actualizado",
  "phone": "+59187654321"
}
```

---

### 6. Obtener personal del kiosco

```http
GET http://54.166.181.144:3000/kiosks/:id/staff
Authorization: Bearer <token>
```

---

### 7. Asignar personal a kiosco

```http
POST http://54.166.181.144:3000/kiosks/:id/staff
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 5
}
```

---

### 8. Remover personal de kiosco

```http
DELETE http://54.166.181.144:3000/kiosks/:id/staff/:userId
Authorization: Bearer <token>
```

---

## 💡 Ejemplo: Agendar cita con kiosco

```javascript
// 1. Obtener kioscos cercanos
const kiosks = await fetch('http://54.166.181.144:3000/kiosks/nearby?lat=-16.5&lng=-68.15', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 2. Crear cita incluyendo el kioskId
const appointment = await fetch('http://54.166.181.144:3000/appointments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    patientId: 2,
    nurseId: 15,
    serviceTypeId: 1,
    kioskId: kiosks[0].id, // <-- El kiosco seleccionado
    start: '2024-12-10T10:00:00Z',
    end: '2024-12-10T11:00:00Z',
    reason: 'Chequeo mensual',
  }),
}).then(r => r.json());

console.log('Cita creada en:', appointment.kiosk.name);
```
