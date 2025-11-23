import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth endpoints (e2e)', () => {
  // Aplicación Nest completa para pruebas de integración
  let app: INestApplication;

  // Cliente Prisma real contra la base de datos del proyecto
  let prisma: PrismaService;

  // Datos de prueba reutilizables entre casos
  const testEmail = `test+${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /auth/register should create a new user and return a JWT', async () => {
    // Limpiamos cualquier usuario previo con el mismo email (por si el test se re-ejecuta)
    await prisma.user.deleteMany({ where: { email: testEmail } });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('email', testEmail);
    expect(response.body).toHaveProperty('id');
  });

  it('POST /auth/login should authenticate an existing user and return a JWT', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('email', testEmail);
  });
});


