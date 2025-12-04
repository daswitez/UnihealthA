# UniHealth API Documentation

## 🌐 Base URL

**Production**: `http://54.166.181.144:3000`

Esta es la URL base para todas las peticiones API en producción. Todos los endpoints documentados deben usar esta URL.

---

## 🔐 Autenticación

La mayoría de los endpoints están protegidos por **JWT Bearer** usando la estrategia `jwt` de NestJS.

### 1. Registro de usuario

```http
POST http://54.166.181.144:3000/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

### 2. Login

```http
POST http://54.166.181.144:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Respuesta exitosa**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "email": "user@example.com",
  "role": "user"
}
```

### 3. Usar el token en peticiones protegidas

```http
GET http://54.166.181.144:3000/patients
Authorization: Bearer <access_token>
```

**Ejemplo con JavaScript (fetch)**:

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const response = await fetch('http://54.166.181.144:3000/patients', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
const data = await response.json();
```

**Ejemplo con Axios**:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://54.166.181.144:3000',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const patients = await api.get('/patients');
```

---

## 📋 Convenciones generales

- **Formato**: Todas las peticiones y respuestas usan JSON
- **Fechas**: Formato ISO 8601 (`2024-12-04T15:30:00Z`)
- **IDs**: Números enteros (BigInt convertido a número en JSON)
- **Validación**: Todos los DTOs usan `class-validator`

### Códigos de estado HTTP

| Código | Significado |
|--------|-------------|
| `200` | OK - Operación exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Error de validación |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - Sin permisos |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

### Ejemplo de error

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 📚 Módulos de la API

Cada módulo tiene su propia documentación detallada:

### Seguridad y Usuarios
- [**Auth**](./auth.md) - Autenticación y registro (`/auth`)
- [**Users**](./users.md) - Gestión de usuarios (`/users`)

### Pacientes y Perfiles
- [**Patients**](./patients.md) - Perfiles de pacientes (`/patients`)
- [**Medical History**](./medical-history.md) - Historial médico completo (`/medical-history`)

### Clínica y Atención
- [**Clinical Records**](./clinical-records.md) - Registros clínicos (`/clinical-records`)
- [**Vitals**](./vitals.md) - Signos vitales (`/vitals`)
- [**Appointments**](./appointments.md) - Citas médicas (`/appointments`)

### Alertas y Notificaciones
- [**Alerts**](./alerts.md) - Sistema de alertas (`/alerts`)
- [**Notifications**](./notifications.md) - Notificaciones (`/notifications`)

### Archivos y Configuración
- [**Attachments**](./attachments.md) - Gestión de archivos (`/attachments`)
- [**Parameters**](./parameters.md) - Parámetros del sistema (`/parameters`)
- [**Catalogs**](./catalogs.md) - Catálogos y tipos (`/catalogs`)

---

## 🚀 Inicio rápido

### 1. Registrar un usuario

```bash
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

### 2. Obtener token

```bash
curl -X POST http://54.166.181.144:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 3. Usar el API

```bash
TOKEN="<tu_access_token>"

curl -X GET http://54.166.181.144:3000/patients \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🛠️ Desarrollo local

Si estás desarrollando localmente con Docker:

```bash
# 1. Levantar infraestructura
npm run docker:up

# 2. Aplicar schema (solo primera vez)
docker exec -i postgres_db psql -U admin -d nestjs_db < full-schema.sql
docker exec -i postgres_db psql -U admin -d nestjs_db < manual-seed.sql

# 3. API disponible en
# http://localhost:3000
```

**Panel de colas**: `http://localhost:3000/admin/queues`

---

## 📌 Notas importantes

- ⚠️ **CORS**: La API acepta peticiones desde cualquier origen en desarrollo
- 🔒 **JWT**: Los tokens expiran después de 24 horas
- 📦 **BigInt**: Los IDs se devuelven como números en JSON
- 🗄️ **PostgreSQL**: Base de datos con schema `app`
- 🔴 **Redis**: Cache y colas de mensajes

