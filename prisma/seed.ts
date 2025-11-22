import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Roles
  const roles = [
    { name: 'user', description: 'Usuario estándar' },
    { name: 'nurse', description: 'Enfermero/a' },
    { name: 'admin', description: 'Administrador del sistema' },
    { name: 'auditor', description: 'Auditor de sistema' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log('✅ Roles seeded');

  // 2. Tipos de Alerta
  const alertTypes = [
    { code: 'trauma', name: 'Trauma' },
    { code: 'cardio', name: 'Cardiovascular' },
    { code: 'respi', name: 'Respiratorio' },
  ];

  for (const type of alertTypes) {
    await prisma.alertType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }
  console.log('✅ Alert Types seeded');

  // 3. Tipos de Nota
  const noteTypes = [
    { code: 'triaje', name: 'Nota de triaje' },
    { code: 'evol', name: 'Evolución' },
    { code: 'ingreso', name: 'Nota de ingreso' },
  ];

  for (const type of noteTypes) {
    await prisma.noteType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }
  console.log('✅ Note Types seeded');

  // 4. Tipos de Servicio
  const serviceTypes = [
    { code: 'control', name: 'Control general' },
    { code: 'vacuna', name: 'Vacunación' },
    { code: 'curacion', name: 'Curación' },
  ];

  for (const type of serviceTypes) {
    await prisma.serviceType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }
  console.log('✅ Service Types seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
