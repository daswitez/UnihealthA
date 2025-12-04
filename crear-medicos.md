# Crear 10 médicos usando la API

## Opción 1: Con curl (ejecutar en AWS)

```bash
# 1. Dr. Martinez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.martinez@unihealth.com", "password": "Doctor123!", "name": "Dr. Carlos Martinez"}'

# 2. Dr. Rodriguez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.rodriguez@unihealth.com", "password": "Doctor123!", "name": "Dr. Ana Rodriguez"}'

# 3. Dr. Garcia
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.garcia@unihealth.com", "password": "Doctor123!", "name": "Dr. Juan Garcia"}'

# 4. Dr. Lopez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.lopez@unihealth.com", "password": "Doctor123!", "name": "Dr. Maria Lopez"}'

# 5. Dr. Hernandez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.hernandez@unihealth.com", "password": "Doctor123!", "name": "Dr. Pedro Hernandez"}'

# 6. Dr. Gonzalez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.gonzalez@unihealth.com", "password": "Doctor123!", "name": "Dr. Sofia Gonzalez"}'

# 7. Dr. Perez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.perez@unihealth.com", "password": "Doctor123!", "name": "Dr. Luis Perez"}'

# 8. Dr. Sanchez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.sanchez@unihealth.com", "password": "Doctor123!", "name": "Dr. Carmen Sanchez"}'

# 9. Dr. Ramirez
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.ramirez@unihealth.com", "password": "Doctor123!", "name": "Dr. Jorge Ramirez"}'

# 10. Dr. Torres
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.torres@unihealth.com", "password": "Doctor123!", "name": "Dr. Laura Torres"}'
```

## Opción 2: Script bash automático

```bash
#!/bin/bash
# crear-medicos.sh

doctors=(
  "dr.martinez@unihealth.com:Dr. Carlos Martinez"
  "dr.rodriguez@unihealth.com:Dr. Ana Rodriguez"
  "dr.garcia@unihealth.com:Dr. Juan Garcia"
  "dr.lopez@unihealth.com:Dr. Maria Lopez"
  "dr.hernandez@unihealth.com:Dr. Pedro Hernandez"
  "dr.gonzalez@unihealth.com:Dr. Sofia Gonzalez"
  "dr.perez@unihealth.com:Dr. Luis Perez"
  "dr.sanchez@unihealth.com:Dr. Carmen Sanchez"
  "dr.ramirez@unihealth.com:Dr. Jorge Ramirez"
  "dr.torres@unihealth.com:Dr. Laura Torres"
)

for doctor in "${doctors[@]}"; do
  email="${doctor%%:*}"
  name="${doctor##*:}"
  
  echo "Creando: $name ($email)"
  curl -X POST http://54.166.181.144:3000/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$email\", \"password\": \"Doctor123!\", \"name\": \"$name\"}" \
    -w "\n"
  echo ""
done

echo "✅ Médicos creados!"
```

## Opción 3: Colección Postman (JSON)

```json
{
  "info": {
    "name": "Crear 10 Médicos",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Dr. Martinez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.martinez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Carlos Martinez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "2. Dr. Rodriguez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.rodriguez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Ana Rodriguez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "3. Dr. Garcia",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.garcia@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Juan Garcia\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "4. Dr. Lopez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.lopez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Maria Lopez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "5. Dr. Hernandez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.hernandez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Pedro Hernandez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "6. Dr. Gonzalez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.gonzalez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Sofia Gonzalez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "7. Dr. Perez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.perez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Luis Perez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "8. Dr. Sanchez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.sanchez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Carmen Sanchez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "9. Dr. Ramirez",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.ramirez@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Jorge Ramirez\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "10. Dr. Torres",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"dr.torres@unihealth.com\", \"password\": \"Doctor123!\", \"name\": \"Dr. Laura Torres\"}"
        },
        "url": {
          "raw": "http://54.166.181.144:3000/auth/register",
          "protocol": "http",
          "host": ["54", "166", "181", "144"],
          "port": "3000",
          "path": ["auth", "register"]
        }
      }
    }
  ]
}
```

## Verificar que se crearon

```bash
# Listar todos los usuarios
curl -X POST http://54.166.181.144:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.martinez@unihealth.com", "password": "Doctor123!"}'
```
