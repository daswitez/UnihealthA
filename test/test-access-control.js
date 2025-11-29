const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  console.log('Starting Access Control Verification...');

  try {
    // 1. Setup Data
    console.log('Setting up test data...');
    // Create Patient
    const patientEmail = `patient.test.${Date.now()}@unihealth.com`;
    const pin = '1234';
    const pinHash = await bcrypt.hash(pin, 10);
    const patient = await prisma.user.create({
        data: {
            email: patientEmail,
            passwordHash: 'pass',
            pinHash: pinHash,
            roleId: 1, // Assuming 1 is user
            patientProfile: {
                create: {
                    firstName: 'John',
                    lastName: 'Doe',
                    isSmoker: true,
                    alcohol: 'social',
                    activity: 'moderate'
                }
            }
        }
    });

    // Create Comprehensive Medical Data
    console.log('Adding comprehensive medical data...');
    await prisma.allergy.create({
        data: {
            patientId: patient.id,
            allergen: 'Peanuts',
            reaction: 'Hives',
            severity: 'moderate'
        }
    });
    await prisma.medication.create({
        data: {
            patientId: patient.id,
            name: 'Ibuprofen',
            dosage: '200mg',
            frequency: 'As needed',
            isActive: true
        }
    });
    await prisma.familyHistory.create({
        data: {
            patientId: patient.id,
            relationship: 'Father',
            condition: 'Hypertension'
        }
    });
    await prisma.lifestyleDetail.create({
        data: {
            patientId: patient.id,
            diet: 'Vegetarian',
            sleepHours: 7.5,
            stressLevel: 5,
            activityType: 'Running',
            activityFreq: '3x/week'
        }
    });

    // Create Doctor
    const doctorEmail = `doctor.test.${Date.now()}@unihealth.com`;
    const doctor = await prisma.user.create({
        data: {
            email: doctorEmail,
            passwordHash: 'pass',
            roleId: 1, // Using 1 for simplicity, should be nurse/doctor role
        }
    });

    // Create Medical History
    await prisma.medicalHistory.create({
        data: {
            patientId: patient.id,
            condition: 'Anxiety',
            type: 'mental',
            isActive: true
        }
    });
    await prisma.medicalHistory.create({
        data: {
            patientId: patient.id,
            condition: 'Broken Leg',
            type: 'fisico',
            isActive: true
        }
    });

    console.log('✅ Test data created');

    // 2. Test Access Grant
    console.log('Testing Access Grant...');
    // Simulate AccessService logic directly or via API call? 
    // Since this is a script, we can use Prisma to simulate the service logic or just call the service if we could import it (hard in JS script).
    // We will simulate the logic:
    
    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, patient.pinHash);
    if (!isPinValid) throw new Error('PIN verification failed');
    console.log('✅ PIN verified');

    // Grant Access (Physical only)
    await prisma.medicalAccess.create({
        data: {
            patientId: patient.id,
            staffId: doctor.id,
            permissions: { fisico: true, mental: false },
            expiresAt: new Date(Date.now() + 3600000)
        }
    });
    console.log('✅ Access granted (Physical only)');

    // 3. Test Access Check
    console.log('Testing Access Check...');
    const grant = await prisma.medicalAccess.findFirst({
        where: {
            patientId: patient.id,
            staffId: doctor.id,
            isActive: true
        }
    });
    
    if (!grant) throw new Error('Grant not found');
    
    // Check permissions
    const permissions = grant.permissions;
    if (!permissions.fisico || permissions.mental) throw new Error('Permissions mismatch');
    console.log('✅ Permissions verified: Physical=True, Mental=False');

    // 3.1 Test Full History Access
    console.log('Testing Full History Access...');
    const [allergies, meds, famHistory, lifestyle] = await Promise.all([
        prisma.allergy.findMany({ where: { patientId: patient.id } }),
        prisma.medication.findMany({ where: { patientId: patient.id } }),
        prisma.familyHistory.findMany({ where: { patientId: patient.id } }),
        prisma.lifestyleDetail.findFirst({ where: { patientId: patient.id } })
    ]);

    if (allergies.length !== 1 || meds.length !== 1 || famHistory.length !== 1 || !lifestyle) {
        throw new Error('Failed to retrieve comprehensive data');
    }
    console.log('✅ Comprehensive data retrieval verified');

    // 4. Test Revoke
    console.log('Testing Revoke...');
    await prisma.medicalAccess.updateMany({
        where: { patientId: patient.id, staffId: doctor.id },
        data: { isActive: false }
    });
    
    const revokedGrant = await prisma.medicalAccess.findFirst({
        where: {
            patientId: patient.id,
            staffId: doctor.id,
            isActive: true
        }
    });
    if (revokedGrant) throw new Error('Access should be revoked');
    console.log('✅ Access revoked successfully');

  } catch (e) {
    console.error('❌ Verification failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
