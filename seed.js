const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Roles
  const roles = ['admin', 'nurse', 'doctor', 'patient', 'user'];
  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r, description: `Role ${r}` },
    });
  }
  console.log('Roles seeded.');

  // Alert Types
  const alertTypes = [
    { code: 'FALL', name: 'Caída' },
    { code: 'HR_HIGH', name: 'Ritmo Cardíaco Alto' },
    { code: 'SOS', name: 'Botón de Pánico' },
  ];
  for (const t of alertTypes) {
    await prisma.alertType.upsert({
      where: { code: t.code },
      update: {},
      create: { code: t.code, name: t.name },
    });
  }
  console.log('AlertTypes seeded.');

  // Service Types
  const serviceTypes = [
    { code: 'CHECKUP', name: 'Chequeo General' },
    { code: 'EMERGENCY', name: 'Urgencia' },
  ];
  for (const s of serviceTypes) {
    await prisma.serviceType.upsert({
      where: { code: s.code },
      update: {},
      create: { code: s.code, name: s.name },
    });
  }
  console.log('ServiceTypes seeded.');

  // Note Types
  const noteTypes = [
    { code: 'GENERAL', name: 'Nota General' },
    { code: 'PRESCRIPTION', name: 'Receta' },
  ];
  for (const n of noteTypes) {
    await prisma.noteType.upsert({
      where: { code: n.code },
      update: {},
      create: { code: n.code, name: n.name },
    });
  }
  console.log('NoteTypes seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
