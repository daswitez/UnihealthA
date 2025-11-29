
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Comprehensive System Verification...');

    try {
        // 1. Create Patient
        const email = `patient.flow.${Date.now()}@unihealth.com`;
        console.log(`\n1. Creating Patient (${email})...`);
        const patient = await prisma.user.create({
            data: {
                email,
                passwordHash: 'hashed_password',
                role: {
                    connectOrCreate: {
                        where: { name: 'patient' },
                        create: { name: 'patient', description: 'Patient Role' }
                    }
                },
                patientProfile: {
                    create: {
                        firstName: 'Flow',
                        lastName: 'Test',
                        dob: new Date('1990-01-01'),
                        isSmoker: false,
                        alcohol: 'None',
                        activity: 'Moderate'
                    }
                }
            }
        });
        console.log('✅ Patient created with Profile');

        // 2. Add Comprehensive Medical Data
        console.log('\n2. Adding Comprehensive Medical Data...');
        
        // Allergies
        await prisma.allergy.create({
            data: {
                patientId: patient.id,
                allergen: 'Shellfish',
                reaction: 'Swelling',
                severity: 'Severe'
            }
        });
        console.log('✅ Allergy added');

        // Medications
        await prisma.medication.create({
            data: {
                patientId: patient.id,
                name: 'Aspirin',
                dosage: '81mg',
                frequency: 'Daily',
                isActive: true
            }
        });
        console.log('✅ Medication added');

        // Family History
        await prisma.familyHistory.create({
            data: {
                patientId: patient.id,
                relationship: 'Mother',
                condition: 'Diabetes'
            }
        });
        console.log('✅ Family History added');

        // Lifestyle Detail
        await prisma.lifestyleDetail.create({
            data: {
                patientId: patient.id,
                diet: 'Low Carb',
                sleepHours: 8,
                stressLevel: 3,
                activityType: 'Yoga',
                activityFreq: 'Daily'
            }
        });
        console.log('✅ Lifestyle Details added');

        // 3. Simulate Attachment Upload with Category
        console.log('\n3. Simulating Attachment Upload...');
        // We simulate the DB record creation as if the service did it
        await prisma.attachment.create({
            data: {
                ownerTable: 'perfiles_paciente',
                ownerId: patient.id,
                fileName: 'lab_results.pdf',
                mimeType: 'application/pdf',
                category: 'reporte_medico', // Testing the new field
                storagePath: `uploads/lab_results_${Date.now()}.pdf`,
                sizeBytes: 1024,
                createdById: patient.id
            }
        });
        console.log('✅ Attachment record created with category');

        // 4. Verify Retrieval
        console.log('\n4. Verifying Data Retrieval...');
        const fullProfile = await prisma.user.findUnique({
            where: { id: patient.id },
            include: {
                patientProfile: true,
                allergies: true,
                medications: true,
                familyHistory: true,
                lifestyleDetail: true,
                createdAttachments: true
            }
        });

        if (!fullProfile.allergies.length) throw new Error('Missing Allergies');
        if (!fullProfile.medications.length) throw new Error('Missing Medications');
        if (!fullProfile.familyHistory.length) throw new Error('Missing Family History');
        if (!fullProfile.lifestyleDetail.length) throw new Error('Missing Lifestyle Detail');
        if (!fullProfile.createdAttachments.length) throw new Error('Missing Attachments');
        if (fullProfile.createdAttachments[0].category !== 'reporte_medico') throw new Error('Attachment Category Mismatch');

        console.log('✅ All data retrieved and verified successfully!');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
