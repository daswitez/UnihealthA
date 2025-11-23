import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  // Servicio bajo prueba
  let authService: AuthService;

  // Mocks de dependencias
  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('signed-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    usersServiceMock.findByEmail.mockReset();
    usersServiceMock.create.mockReset();
    jwtServiceMock.sign.mockClear();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('validateUser should return user without passwordHash when credentials are valid', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@example.com',
      passwordHash: bcrypt.hashSync('Password123!', 10),
      role: { name: 'user' },
    };

    usersServiceMock.findByEmail.mockResolvedValueOnce(fakeUser);

    const result = await authService.validateUser(fakeUser.email, 'Password123!');

    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(fakeUser.email);
    expect(result).toBeDefined();
    expect(result.passwordHash).toBeUndefined();
    expect(result.email).toBe(fakeUser.email);
  });

  it('validateUser should return null when credentials are invalid', async () => {
    usersServiceMock.findByEmail.mockResolvedValueOnce(null);

    const result = await authService.validateUser('nonexistent@example.com', 'bad-password');

    expect(result).toBeNull();
  });

  it('login should return an access_token and basic user info', async () => {
    const user = { id: 1, email: 'test@example.com', role: { name: 'user' } };

    const result = await authService.login(user);

    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: Number(user.id),
      role: user.role?.name,
    });
    expect(result).toEqual({
      access_token: 'signed-jwt-token',
      id: Number(user.id),
      email: user.email,
      role: user.role?.name,
    });
  });

  it('register should delegate user creation to UsersService and then log in', async () => {
    const dto = { email: 'new@example.com', password: 'Password123!' };
    const createdUser = { id: 2, email: dto.email, role: { name: 'user' } };

    usersServiceMock.create.mockResolvedValueOnce(createdUser);

    const result = await authService.register(dto);

    expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
    expect(jwtServiceMock.sign).toHaveBeenCalled();
    expect(result.access_token).toBe('signed-jwt-token');
  });
});
