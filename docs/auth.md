# Auth API - Autenticación y Registro

**Base URL**: `http://54.166.181.144:3000/auth`  
**Auth**: No requiere autenticación (endpoints públicos)

---

## 📋 Endpoints

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

**Campos:**
- `email` (string, requerido) - Email válido único
- `password` (string, requerido) - Mínimo 6 caracteres
- `name` (string, opcional) - Nombre del usuario

**Respuesta exitosa (201):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "1",
  "email": "user@example.com",
  "role": "user"
}
```

**Ejemplo con JavaScript:**

```javascript
const register = async (email, password, name) => {
  const response = await fetch('http://54.166.181.144:3000/auth/register', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registro fallido');
  }

  return response.json();
};

// Uso
try {
  const result = await register('user@example.com', 'Password123!', 'John Doe');
  console.log('Token:', result.access_token);
  // Guardar token en localStorage o estado
  localStorage.setItem('token', result.access_token);
} catch (error) {
  console.error('Error:', error.message);
}
```

---

### 2. Login

```http
POST http://54.166.181.144:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Campos:**
- `email` (string, requerido)
- `password` (string, requerido)

**Respuesta exitosa (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "1",
  "email": "user@example.com",
  "role": "user"
}
```

**Errores comunes:**

| Código | Mensaje |
|--------|---------|
| `401` | Credenciales inválidas |
| `400` | Email o password faltante |

**Ejemplo con JavaScript:**

```javascript
const login = async (email, password) => {
  const response = await fetch('http://54.166.181.144:3000/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  return response.json();
};

// Uso
try {
  const result = await login('user@example.com', 'Password123!');
  localStorage.setItem('token', result.access_token);
  localStorage.setItem('userId', result.id);
  console.log('Login exitoso');
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## 🔐 Uso del JWT en endpoints protegidos

Después de login o register, usa el `access_token` en la cabecera `Authorization`:

```http
GET http://54.166.181.144:3000/patients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Función reutilizable para API calls

```javascript
// Helper function para hacer peticiones autenticadas
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://54.166.181.144:3000${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error HTTP ${response.status}`);
  }

  return response.json();
};

// Uso
const patients = await apiFetch('/patients');
const newPatient = await apiFetch('/patients', {
  method: 'POST',
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Doe',
    dob: '1990-01-01',
    gender: 'F',
  }),
});
```

---

## 💡 Ejemplo completo de flujo de autenticación

```javascript
// 1. Login
async function loginUser(email, password) {
  try {
    const response = await fetch('http://54.166.181.144:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login fallido');
    }

    const data = await response.json();
    
    // Guardar token y datos del usuario
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRole', data.role);
    
    return data;
  } catch (error) {
    console.error('Error al hacer login:', error);
    throw error;
  }
}

// 2. Hacer peticiones autenticadas
async function getPatients() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://54.166.181.144:3000/patients', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}

// 3. Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
}

// Uso
await loginUser('user@example.com', 'Password123!');
const patients = await getPatients();
logout();
```

---

## 📌 Notas importantes

- 🔒 **Expiración**: Los tokens JWT expiran después de 24 horas
- 🔐 **Password**: Mínimo 6 caracteres requeridos
- ✉️ **Email**: Debe ser único en el sistema
- 🔑 **Token**: Almacenar de forma segura (localStorage/cookies)
- 🚫 **Roles**: Por defecto, los usuarios registrados obtienen rol `'user'`

