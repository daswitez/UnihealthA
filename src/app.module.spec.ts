import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

// Test ligero para asegurar que AppModule se puede compilar
// sin levantar toda la aplicación ni conectar a la base de datos.
describe('AppModule', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
    const appModule = moduleRef.get(AppModule);
    expect(appModule).toBeInstanceOf(AppModule);
  });
});


