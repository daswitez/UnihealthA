import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthController', () => {
  // Controlador bajo prueba
  let authController: AuthController;

  // Mock del AuthService con los métodos usados por el controlador
  const authServiceMock = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);

    authServiceMock.login.mockReset();
    authServiceMock.register.mockReset();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('login should delegate to AuthService.login using request.user', async () => {
    const fakeUser = { id: 1, email: 'test@example.com' };
    const fakeReq = { user: fakeUser } as any;
    const expectedResponse = { access_token: 'token' };

    authServiceMock.login.mockResolvedValueOnce(expectedResponse);

    const result = await authController.login(fakeReq);

    expect(authServiceMock.login).toHaveBeenCalledWith(fakeUser);
    expect(result).toBe(expectedResponse);
  });

  it('register should delegate to AuthService.register with DTO', async () => {
    const dto: CreateUserDto = { email: 'new@example.com', password: 'Password123!' };
    const expectedResponse = { access_token: 'token' };

    authServiceMock.register.mockResolvedValueOnce(expectedResponse);

    const result = await authController.register(dto);

    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
    expect(result).toBe(expectedResponse);
  });
});
