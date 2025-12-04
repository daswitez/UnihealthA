import { Test, TestingModule } from '@nestjs/testing';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

describe('AccessController', () => {
  let controller: AccessController;

  const serviceMock = {
    grantAccess: jest.fn(),
    revokeAccess: jest.fn(),
    checkAccess: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessController],
      providers: [
        { provide: AccessService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<AccessController>(AccessController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('grantAccess', () => {
    it('should delegate to AccessService.grantAccess with correct params', async () => {
      const req = { user: { userId: 1 } };
      const body = { doctorId: 2, pin: '1234', permissions: { fisico: true } };
      serviceMock.grantAccess.mockResolvedValueOnce({ id: 1 });

      const result = await controller.grantAccess(req, body);

      expect(serviceMock.grantAccess).toHaveBeenCalledWith(1, 2, '1234', { fisico: true });
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('revokeAccess', () => {
    it('should delegate to AccessService.revokeAccess with correct params', async () => {
      const req = { user: { userId: 1 } };
      const body = { doctorId: 2 };
      serviceMock.revokeAccess.mockResolvedValueOnce({ count: 1 });

      const result = await controller.revokeAccess(req, body);

      expect(serviceMock.revokeAccess).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('checkAccess', () => {
    it('should delegate to AccessService.checkAccess with correct params', async () => {
      const req = { user: { userId: 2 } };
      const grant = { id: 1, permissions: { fisico: true } };
      serviceMock.checkAccess.mockResolvedValueOnce(grant);

      const result = await controller.checkAccess(req, '1');

      expect(serviceMock.checkAccess).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual(grant);
    });
  });
});
