// Carga explícitamente las variables de entorno desde .env
// para que Prisma use el mismo DATABASE_URL que la app NestJS.
const dotenv = require('dotenv');
dotenv.config();

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Testing Prisma connection...  ');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ SUCCESS:', result);
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED:');
    console.error('Error name:', error.constructor.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\nFull error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
