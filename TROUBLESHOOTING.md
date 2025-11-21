# Solución de Problemas - Setup NestJS

## ✅ Problema Prisma Client Solucionado

### Error encontrado:
```
TypeError: Cannot read properties of undefined (reading '__internal')
```

### Causa:
Prisma había generado un archivo `prisma.config.ts` que causaba conflictos con el cliente.

### Solución aplicada:
1. ✅ Eliminado `prisma.config.ts`
2. ✅ Regenerado cliente de Prisma con `npx prisma generate`

## ⚠️ Problema Docker

### Error:
```
time="2025-11-21T16:51:57-04:00" level=warning msg="...": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified
```

### Causa:
Docker Desktop no está ejecutándose o no está instalado.

### Soluciones:

#### Opción 1: Instalar/Iniciar Docker Desktop (Recomendado)
1. Si no tienes Docker Desktop instalado, descárgalo de https://www.docker.com/products/docker-desktop
2. Si ya lo tienes, inícialo desde el menú de Windows
3. Espera a que Docker Desktop esté completamente iniciado (ícono de ballena en la bandeja del sistema)
4. Ejecuta: `npm run docker:up`

#### Opción 2: Usar PostgreSQL y Redis instalados localmente
Si prefieres no usar Docker, puedes instalar PostgreSQL y Redis directamente en Windows:

**PostgreSQL:**
1. Descarga desde https://www.postgresql.org/download/windows/
2. Instala y configura con:
   - Usuario: `admin`
   - Contraseña: `admin123`
   - Puerto: `5432`
   - Base de datos: `nestjs_db`

**Redis:**
1. Descarga desde https://github.com/microsoftarchive/redis/releases
2. O usa WSL para ejecutar Redis

**Actualiza .env si usas instalaciones locales:**
```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/nestjs_db?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Opción 3: Usar servicios remotos temporalmente
Puedes usar servicios en la nube gratuitos para desarrollo:
- **PostgreSQL**: Supabase, ElephantSQL, Neon
- **Redis**: Redis Cloud, Upstash

## 🚀 Verificar que la aplicación funcione

La aplicación puede iniciar sin Docker si:
1. **Solo quieres verificar que compile**: Ya está funcionando ✅
2. **Quieres usar la base de datos**: Necesitas PostgreSQL (Docker o local)
3. **Quieres usar colas**: Necesitas Redis (Docker o local)

### Estado actual:
- ✅ NestJS compila correctamente
- ✅ Cliente de Prisma generado
- ⏳ Esperando PostgreSQL y Redis para funcionalidad completa

## 📝 Siguiente paso recomendado:

**Iniciar Docker Desktop** y luego ejecutar:
```bash
npm run docker:up
npm run prisma:migrate
# El servidor ya está en modo watch, debería funcionar automáticamente
```
