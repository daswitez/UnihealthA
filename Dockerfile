FROM node:20 AS builder

WORKDIR /usr/src/app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia esquema de Prisma y genera el cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copia el resto del código fuente y compila NestJS
COPY . .
RUN npm run build

FROM node:20 AS production

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copia sólo lo necesario para ejecutar la app
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Variables de entorno por defecto (pueden sobreescribirse desde docker-compose)
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/src/main.js"]


