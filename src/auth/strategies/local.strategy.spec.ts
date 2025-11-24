import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  const authServiceMock = {
    validateUser: jest.fn(),
  } as unknown as AuthService;

  beforeEach(() => {
    (authServiceMock.validateUser as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    const strategy = new LocalStrategy(authServiceMock);
    expect(strategy).toBeDefined();
  });

  it('validate should return user when credentials are valid', async () => {
    const strategy = new LocalStrategy(authServiceMock);
    const user = { id: 1, email: 'user@example.com' };
    (authServiceMock.validateUser as jest.Mock).mockResolvedValueOnce(user);

    const result = await strategy.validate(user.email, 'Password123!');

    expect(authServiceMock.validateUser).toHaveBeenCalledWith(
      user.email,
      'Password123!',
    );
    expect(result).toBe(user);
  });

  it('validate should throw UnauthorizedException when credentials are invalid', async () => {
    const strategy = new LocalStrategy(authServiceMock);
    (authServiceMock.validateUser as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      strategy.validate('user@example.com', 'bad-pass'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});


