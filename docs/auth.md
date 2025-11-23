## Auth – Registro y Login

### Rutas base

- Base URL módulo: `/auth`

### 1. Registro de usuario

- **POST** `/auth/register`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Respuesta:

```json
{
  "access_token": "JWT_TOKEN",
  "id": 1,
  "email": "user@example.com",
  "role": "user"
}
```

Uso desde frontend (TypeScript, `fetch`):

```ts
const register = async (email: string, password: string) => {
  const res = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Registro fallido');
  }

  return res.json() as Promise<{
    access_token: string;
    id: number;
    email: string;
    role: string;
  }>;
};
```

### 2. Login

- **POST** `/auth/login`
- Usa la estrategia `local` (email + password).

Body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Respuesta: mismo formato que registro (`access_token`, `id`, `email`, `role`).

Frontend:

```ts
const login = async (email: string, password: string) => {
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Login inválido');
  }

  return res.json();
};
```

### 3. Uso del JWT en otros módulos

Todos los módulos protegidos usan `@UseGuards(AuthGuard('jwt'))`.  
Debes enviar el token en la cabecera:

```http
Authorization: Bearer JWT_TOKEN
```

Ejemplo genérico de cliente HTTP reutilizable:

```ts
const apiFetch = async <T>(path: string, options: RequestInit = {}, token?: string): Promise<T> => {
  const res = await fetch(`http://localhost:3000${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message ?? `Error HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
};
```


