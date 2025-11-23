import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Alerts endpoints (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Token JWT que reutilizaremos entre pruebas
  let accessToken: string;

  // Entidades relacionadas necesarias para poder crear una alerta
  let patientUserId: bigint;
  let alertTypeId: bigint;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // Creamos o reutilizamos un usuario para autenticación
    const email = `alerts+${Date.now()}@example.com`;
    const password = 'Password123!';

    await prisma.user.deleteMany({ where: { email } });

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password });

    accessToken = registerRes.body.access_token;

    // Para patientId podemos reutilizar el mismo usuario
    patientUserId = BigInt(registerRes.body.id);

    // Tomamos cualquier tipo de alerta existente (seed de manual-seed.sql)
    const alertType = await prisma.alertType.findFirst();
    if (!alertType) {
      throw new Error('No AlertType found in database. Did you run manual-seed.sql?');
    }
    alertTypeId = alertType.id;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /alerts should create a new alert when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/alerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        patientId: Number(patientUserId),
        typeId: Number(alertTypeId),
        description: 'Test alert from e2e',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('description', 'Test alert from e2e');
  });

  it('GET /alerts should return a list of alerts when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/alerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});


