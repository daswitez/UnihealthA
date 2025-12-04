# Crear 10 Médicos y 5 Enfermeras con curl

## 🚀 Comandos curl para crear médicos (rol: doctor)

```bash
# Médico 1
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.martinez@unihealth.com", "password": "Doctor123!", "name": "Dr. Carlos Martinez", "role": "doctor"}'

# Médico 2
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.rodriguez@unihealth.com", "password": "Doctor123!", "name": "Dr. Ana Rodriguez", "role": "doctor"}'

# Médico 3
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.garcia@unihealth.com", "password": "Doctor123!", "name": "Dr. Juan Garcia", "role": "doctor"}'

# Médico 4
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.lopez@unihealth.com", "password": "Doctor123!", "name": "Dr. Maria Lopez", "role": "doctor"}'

# Médico 5
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.hernandez@unihealth.com", "password": "Doctor123!", "name": "Dr. Pedro Hernandez", "role": "doctor"}'

# Médico 6
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.gonzalez@unihealth.com", "password": "Doctor123!", "name": "Dr. Sofia Gonzalez", "role": "doctor"}'

# Médico 7
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.perez@unihealth.com", "password": "Doctor123!", "name": "Dr. Luis Perez", "role": "doctor"}'

# Médico 8
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.sanchez@unihealth.com", "password": "Doctor123!", "name": "Dr. Carmen Sanchez", "role": "doctor"}'

# Médico 9
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.ramirez@unihealth.com", "password": "Doctor123!", "name": "Dr. Jorge Ramirez", "role": "doctor"}'

# Médico 10
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.torres@unihealth.com", "password": "Doctor123!", "name": "Dr. Laura Torres", "role": "doctor"}'
```

## 👩‍⚕️ Comandos curl para crear enfermeras (rol: nurse)

```bash
# Enfermera 1
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse.lopez@unihealth.com", "password": "Nurse123!", "name": "Nurse Maria Lopez", "role": "nurse"}'

# Enfermera 2
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse.garcia@unihealth.com", "password": "Nurse123!", "name": "Nurse Ana Garcia", "role": "nurse"}'

# Enfermera 3
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse.martinez@unihealth.com", "password": "Nurse123!", "name": "Nurse Carmen Martinez", "role": "nurse"}'

# Enfermera 4
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse.rodriguez@unihealth.com", "password": "Nurse123!", "name": "Nurse Sofia Rodriguez", "role": "nurse"}'

# Enfermera 5
curl -X POST http://54.166.181.144:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse.fernandez@unihealth.com", "password": "Nurse123!", "name": "Nurse Laura Fernandez", "role": "nurse"}'
```

## 📋 Listado de credenciales

### Médicos (10)
| Email | Password | Nombre | Rol |
|-------|----------|--------|-----|
| dr.martinez@unihealth.com | Doctor123! | Dr. Carlos Martinez | doctor |
| dr.rodriguez@unihealth.com | Doctor123! | Dr. Ana Rodriguez | doctor |
| dr.garcia@unihealth.com | Doctor123! | Dr. Juan Garcia | doctor |
| dr.lopez@unihealth.com | Doctor123! | Dr. Maria Lopez | doctor |
| dr.hernandez@unihealth.com | Doctor123! | Dr. Pedro Hernandez | doctor |
| dr.gonzalez@unihealth.com | Doctor123! | Dr. Sofia Gonzalez | doctor |
| dr.perez@unihealth.com | Doctor123! | Dr. Luis Perez | doctor |
| dr.sanchez@unihealth.com | Doctor123! | Dr. Carmen Sanchez | doctor |
| dr.ramirez@unihealth.com | Doctor123! | Dr. Jorge Ramirez | doctor |
| dr.torres@unihealth.com | Doctor123! | Dr. Laura Torres | doctor |

### Enfermeras (5)
| Email | Password | Nombre | Rol |
|-------|----------|--------|-----|
| nurse.lopez@unihealth.com | Nurse123! | Nurse Maria Lopez | nurse |
| nurse.garcia@unihealth.com | Nurse123! | Nurse Ana Garcia | nurse |
| nurse.martinez@unihealth.com | Nurse123! | Nurse Carmen Martinez | nurse |
| nurse.rodriguez@unihealth.com | Nurse123! | Nurse Sofia Rodriguez | nurse |
| nurse.fernandez@unihealth.com | Nurse123! | Nurse Laura Fernandez | nurse |

## ✅ Verificar que se crearon

```bash
# Login de un médico
curl -X POST http://54.166.181.144:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "dr.martinez@unihealth.com", "password": "Doctor123!"}'

# Login de una enfermera
curl -X POST http://54.166.181.144:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse.lopez@unihealth.com", "password": "Nurse123!"}'
```

## 🔄 Ejecutar todos de una vez (Bash)

```bash
#!/bin/bash
# Ejecutar este script para crear todos

echo "Creando 10 médicos..."
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.martinez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.rodriguez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.garcia@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.lopez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.hernandez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.gonzalez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.perez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.sanchez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.ramirez@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "dr.torres@unihealth.com", "password": "Doctor123!", "role": "doctor"}' -w "\n"

echo "Creando 5 enfermeras..."
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "nurse.lopez@unihealth.com", "password": "Nurse123!", "role": "nurse"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "nurse.garcia@unihealth.com", "password": "Nurse123!", "role": "nurse"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "nurse.martinez@unihealth.com", "password": "Nurse123!", "role": "nurse"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "nurse.rodriguez@unihealth.com", "password": "Nurse123!", "role": "nurse"}' -w "\n"
curl -X POST http://54.166.181.144:3000/auth/register -H "Content-Type: application/json" -d '{"email": "nurse.fernandez@unihealth.com", "password": "Nurse123!", "role": "nurse"}' -w "\n"

echo "✅ Todos creados!"
```
