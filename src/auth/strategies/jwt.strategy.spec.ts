import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  const configServiceMock = {
    get: jest.fn().mockReturnValue('test-secret'),
  } as unknown as ConfigService;

  it('should be defined', () => {
    const strategy = new JwtStrategy(configServiceMock);
    expect(strategy).toBeDefined();
  });

  it('validate should map payload to user object', async () => {
    const strategy = new JwtStrategy(configServiceMock);

    const payload = { sub: 1, email: 'user@example.com', role: 'user' };
    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  });
});


