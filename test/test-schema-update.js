const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting schema verification...');

  try {
    // 1. Verify User PIN
    console.log('Verifying User PIN...');
    // Find a user or create a dummy one if needed
    let user = await prisma.user.findFirst();
    if (!user) {
        console.log('Creating dummy user for testing...');
        // Create a role first if needed
        let role = await prisma.role.findFirst({ where: { name: 'user' } });
        if (!role) {
            role = await prisma.role.create({
                data: { name: 'user', description: 'Standard user' }
            });
        }
        
        user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                passwordHash: 'hashed_pass',
                roleId: role.id,
                isActive: true
            }
        });
    }

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { pinHash: 'hashed_1234' },
      });
      console.log('✅ User PIN update successful');
    } else {
      console.log('⚠️ No user found to test PIN update');
    }

    // 2. Verify Medical History
    console.log('Verifying Medical History...');
    if (user) {
      const history = await prisma.medicalHistory.create({
        data: {
          patientId: user.id,
          condition: 'Hypertension',
          diagnosis: 'High Blood Pressure',
          type: 'fisico',
          isActive: true,
          notes: 'Initial diagnosis',
        },
      });
      console.log('✅ Medical History creation successful:', history.id);
    }

    // 3. Verify Patient Profile Details
    console.log('Verifying Patient Profile Details...');
    if (user) {
        // Check if profile exists, if not create, if yes update
        let profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
        if (!profile) {
             console.log('Creating patient profile...');
             profile = await prisma.patientProfile.create({
                 data: {
                     userId: user.id,
                     firstName: 'Test',
                     lastName: 'User',
                     bloodGroup: 'O+',
                     heightCm: 175,
                     weightKg: 70.5,
                     insurance: { provider: 'HealthCorp', policy: '12345' }
                 }
             });
             console.log('✅ Patient Profile creation successful');
        } else {
             await prisma.patientProfile.update({
                where: { userId: user.id },
                data: {
                    bloodGroup: 'O+',
                    heightCm: 175,
                    weightKg: 70.5,
                    insurance: { provider: 'HealthCorp', policy: '12345' }
                }
            });
            console.log('✅ Patient Profile update successful');
        }
    }

    // 4. Verify Attachment Category
    console.log('Verifying Attachment Category...');
    // Need a dummy attachment or create one
    if (user) {
        const attachment = await prisma.attachment.create({
            data: {
                ownerTable: 'registros_clinicos',
                ownerId: 1n, // Dummy ID
                fileName: 'test_report.pdf',
                mimeType: 'application/pdf',
                category: 'reporte_medico',
                storagePath: '/tmp/test_report_' + Date.now() + '.pdf',
                createdById: user.id
            }
        });
        console.log('✅ Attachment creation with category successful:', attachment.id);
    }

  } catch (e) {
    console.error('❌ Verification failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
