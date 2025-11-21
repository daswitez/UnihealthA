# NestJS Backend Project

Backend API construido con NestJS, Prisma, BullMQ, PostgreSQL y Redis.

## 🚀 Stack Tecnológico

- **Framework**: NestJS
- **ORM**: Prisma
- **Colas**: BullMQ
- **Base de Datos**: PostgreSQL
- **Cache/Queues**: Redis
- **Lenguaje**: TypeScript

## 📋 Prerequisitos

- Node.js (v18 o superior)
- Docker y Docker Compose
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Levantar servicios de Docker (PostgreSQL y Redis)**
   ```bash
   npm run docker:up
   ```

3. **Generar cliente de Prisma**
   ```bash
   npm run prisma:generate
   ```

4. **Ejecutar migraciones de base de datos**
   ```bash
   npm run prisma:migrate
   ```

## 🏃 Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La aplicación estará disponible en `http://localhost:3000`

## 📝 Scripts Disponibles

### Desarrollo
- `npm run start:dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run start:debug` - Inicia el servidor en modo debug

### Build
- `npm run build` - Compila el proyecto
- `npm run start:prod` - Ejecuta la versión compilada

### Prisma
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:migrate` - Ejecuta las migraciones de base de datos
- `npm run prisma:studio` - Abre Prisma Studio (GUI para la base de datos)

### Docker
- `npm run docker:up` - Levanta los contenedores de PostgreSQL y Redis
- `npm run docker:down` - Detiene los contenedores

### Testing
- `npm run test` - Ejecuta los tests unitarios
- `npm run test:watch` - Ejecuta los tests en modo watch
- `npm run test:cov` - Ejecuta los tests con coverage
- `npm run test:e2e` - Ejecuta los tests end-to-end

### Linting
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea el código con Prettier

## 🗂️ Estructura del Proyecto

```
backend/
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts # Módulo de Prisma
│   │   └── prisma.service.ts # Servicio de Prisma
│   ├── queue/
│   │   └── queue.module.ts   # Módulo de BullMQ
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Punto de entrada
├── .env                      # Variables de entorno
├── docker-compose.yml        # Configuración de Docker
└── package.json
```

## 🔧 Configuración

Las variables de entorno se encuentran en el archivo `.env`:

```env
# Database
DATABASE_URL="postgresql://admin:admin123@localhost:5432/nestjs_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
PORT=3000
NODE_ENV=development
```

## 🗃️ Prisma

### Modelo de ejemplo (User)

El proyecto incluye un modelo de ejemplo `User` en `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Modificar el esquema

1. Edita `prisma/schema.prisma`
2. Ejecuta `npm run prisma:migrate` para crear y aplicar la migración
3. El cliente de Prisma se regenera automáticamente

## 🐳 Docker

Los servicios de PostgreSQL y Redis están configurados en `docker-compose.yml`:

- **PostgreSQL**: Puerto 5432
- **Redis**: Puerto 6379

Ambos servicios tienen volúmenes persistentes para no perder datos.

## 📊 BullMQ

El módulo de colas está configurado para conectarse a Redis. Para crear una nueva cola:

1. Crea un nuevo módulo de queue
2. Usa `@nestjs/bullmq` decoradores para definir procesadores
3. Inyecta `Queue` en tus servicios para agregar jobs

## 🔒 Seguridad

- Cambia las credenciales de PostgreSQL en producción
- Nunca subas el archivo `.env` a control de versiones
- Usa variables de entorno seguras en producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

UNLICENSED - Privado
