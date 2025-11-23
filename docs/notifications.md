## Notifications – Notificaciones (estado actual)

- **Base path**: `/notifications`
- **Auth**: actualmente **no** está protegido con JWT (puedes añadir guarda si lo necesitas).

> Importante: a día de hoy, el servicio `NotificationsService` devuelve **strings de ejemplo** y no está conectado a una tabla real.  
> Estos endpoints son un stub para futuras integraciones (por ejemplo, envío de push o emails).

### 1. Crear notificación (stub)

- **POST** `/notifications`
- Body (`CreateNotificationDto` actual):

```json
{
  "title": "string",
  "message": "string"
}
```

Respuesta (string):

```json
"This action adds a new notification"
```

### 2. Listar notificaciones (stub)

- **GET** `/notifications`

Respuesta:

```json
"This action returns all notifications"
```

### 3. Obtener una notificación (stub)

- **GET** `/notifications/:id`

Respuesta:

```json
"This action returns a #1 notification"
```

### 4. Actualizar / Eliminar (stubs)

- **PATCH** `/notifications/:id`
- **DELETE** `/notifications/:id`

Responden con strings dummy tipo:

```json
"This action updates a #1 notification"
```

---

## Cómo usarlas desde el frontend

Dado que son stubs, solo son útiles para probar el wiring de la API. Ejemplo:

```ts
export const createNotificationStub = (payload: { title: string; message: string }) =>
  apiFetch<string>('/notifications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
```

En cuanto se modele una tabla real de notificaciones, podrás reutilizar este path y adaptar el DTO a la estructura final.


