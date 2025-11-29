## Visión general de la API

Este backend es una API REST construida con NestJS, Prisma, PostgreSQL, Redis y BullMQ.  
Se expone típicamente desde Docker en:

- **Base URL**: `http://localhost:3000`
- **Panel de colas (Bull Board)**: `http://localhost:3000/admin/queues`

Para entorno de desarrollo se recomienda:

```bash
# 1) Levantar toda la infraestructura
npm run docker:up

# 2) (solo primera vez) aplicar schema y datos iniciales
docker exec -i postgres_db psql -U admin -d nestjs_db < full-schema.sql
docker exec -i postgres_db psql -U admin -d nestjs_db < manual-seed.sql
```

La API queda disponible inmediatamente en `http://localhost:3000`.

---

## Autenticación

La mayoría de los endpoints están protegidos por **JWT Bearer** usando la estrategia `jwt` de NestJS.

### Registro y login

1. **Registrar usuario**

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

2. **Login**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Respuesta de login / register**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "email": "user@example.com",
  "role": "user"
}
```

3. **Usar el token en el resto de llamadas**

```http
GET /patients
Authorization: Bearer <access_token>
```

En frontend (fetch):

```ts
const token = '<access_token>';

const response = await fetch('http://localhost:3000/patients', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
const data = await response.json();
```

---

## Convenciones generales

- **Formato JSON** en todas las peticiones/respuestas.
- **Fechas** en formato ISO 8601 (`new Date().toISOString()`).
- **ID numéricos**: internamente pueden ser `BigInt`, pero la API devuelve números normales.
- **Errores**:
  - 400: Validación (`BadRequestException`)
  - 401: Falta de autenticación (`Unauthorized`)
  - 404: Recurso no encontrado

Ejemplo de error:

```json
{
  "statusCode": 400,
  "message": "El enfermero ya tiene una cita en ese horario.",
  "error": "Bad Request"
}
```

---

## Módulos documentados

Cada módulo tiene su propio archivo en `docs/` con detalles de endpoints y ejemplos:

- `docs/auth.md` – Registro y login, uso de JWT.
- `docs/users.md` – Gestión de usuarios.
- `docs/patients.md` – CRUD de pacientes.
- `docs/clinical-records.md` – Historia clínica.
- `docs/vitals.md` – Signos vitales.
- `docs/medical-history.md` – **Historias médicas completas (35+ endpoints)** con control de acceso granular.
- `docs/alerts.md` – Alertas y asignación a enfermeros.
- `docs/appointments.md` – Citas y agenda.
- `docs/attachments.md` – Subida y descarga de adjuntos.
- `docs/parameters.md` – Parámetros de sistema.
- `docs/notifications.md` – Endpoints de notificaciones (stub actual).

Consulta esos archivos para ver el detalle de cada CRUD y ejemplos de consumo desde frontend.


