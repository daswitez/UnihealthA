## Parameters – Parámetros de sistema

- **Base path**: `/parameters`
- **Auth**: requiere `Bearer <token>`

Permite leer y actualizar pares clave/valor de configuración de la aplicación (`SystemParameter`).

### 1. Listar todos los parámetros

- **GET** `/parameters`

Respuesta:

```json
[
  {
    "id": 1,
    "key": "ALERT_THRESHOLD",
    "value": "5",
    "description": "Threshold de alertas",
    "updatedAt": "2025-11-23T20:00:00.000Z"
  }
]
```

### 2. Obtener un parámetro por clave

- **GET** `/parameters/:key`

```http
GET /parameters/ALERT_THRESHOLD
Authorization: Bearer <token>
```

### 3. Crear/actualizar parámetro

- **PATCH** `/parameters/:key`
- Body:

```json
{
  "value": "10"
}
```

Comportamiento:

- Si la clave existe → actualiza `value`.
- Si no existe → crea registro nuevo con `description: "Auto-created"`.

Frontend:

```ts
export const getParameter = (token: string, key: string) =>
  apiFetch(`/parameters/${key}`, {}, token);

export const setParameter = (token: string, key: string, value: string) =>
  apiFetch(`/parameters/${key}`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  }, token);
```


