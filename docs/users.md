## Users – Gestión de usuarios

- **Base path**: `/users`
- **Auth**: requiere `Authorization: Bearer <token>` (rol actual simple: cualquier usuario autenticado).

### DTO principal (`CreateUserDto`)

Campos típicos:

- `email: string`
- `password: string`

El servicio:
- Hashea el password (`bcrypt`).
- Asigna automáticamente el rol `'user'` (tomado de la tabla `roles`).

---

### Endpoints

#### 1. Crear usuario

- **POST** `/users`
- Body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Respuesta (resumen):

```json
{
  "id": 1,
  "email": "user@example.com",
  "roleId": 5,
  "passwordHash": "$2b$10$..."
}
```

Frontend:

```ts
import { apiFetch } from './apiClient'; // ver ejemplo en docs/auth.md

export const createUser = (token: string, email: string, password: string) =>
  apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, token);
```

#### 2. Listar usuarios

- **GET** `/users`

Incluye rol y, si existe, perfil de paciente:

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "role": { "id": 5, "name": "user" },
    "patientProfile": null
  }
]
```

#### 3. Obtener usuario por id

- **GET** `/users/:id`

```http
GET /users/1
Authorization: Bearer <token>
```

#### 4. Actualizar usuario (activar / desactivar)

- **PATCH** `/users/:id`
- Body:

```json
{
  "isActive": false
}
```

Esto actualiza el campo `isActive` en `usuarios`.

#### 5. Eliminar usuario

- **DELETE** `/users/:id`

```http
DELETE /users/1
Authorization: Bearer <token>
```

Usar con cuidado: esto borra el registro de usuario en la base de datos.


