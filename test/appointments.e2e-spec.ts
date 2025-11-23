import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Appointments endpoints (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let accessToken: string;
  let patientUserId: bigint;
  let nurseUserId: bigint;
  let serviceTypeId: bigint;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // Usuario paciente
    const patientEmail = `patient+${Date.now()}@example.com`;
    const password = 'Password123!';

    await prisma.user.deleteMany({ where: { email: patientEmail } });

    const patientRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: patientEmail, password });

    patientUserId = BigInt(patientRes.body.id);

    // Usuario enfermero (nurse) - reutilizamos el servicio de usuarios directamente
    const nurseRole = await prisma.role.findFirst({ where: { name: 'nurse' } });
    const nurse = await prisma.user.create({
      data: {
        email: `nurse+${Date.now()}@example.com`,
        passwordHash: patientRes.body.access_token, // El valor real no importa para la prueba
        roleId: nurseRole ? nurseRole.id : 1n,
      },
    });
    nurseUserId = nurse.id;

    // Servicio de tipo de cita
    const serviceType = await prisma.serviceType.findFirst();
    if (!serviceType) {
      throw new Error('No ServiceType found in database. Did you run manual-seed.sql?');
    }
    serviceTypeId = serviceType.id;

    // Usamos el paciente para autenticarnos y obtener un token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: patientEmail, password })
      .expect(201);

    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /appointments should create an appointment when authenticated', async () => {
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const response = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        patientId: Number(patientUserId),
        nurseId: Number(nurseUserId),
        serviceTypeId: Number(serviceTypeId),
        start: start.toISOString(),
        end: end.toISOString(),
        reason: 'Test appointment',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('reason', 'Test appointment');
  });

  it('GET /appointments should return a list of appointments when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/appointments')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});


