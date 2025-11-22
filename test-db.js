const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL!');
    
    // Intentar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Query de prueba exitosa:', result);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
