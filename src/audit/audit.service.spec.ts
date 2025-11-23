import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditService', () => {
  // Servicio bajo prueba
  let auditService: AuditService;

  // Mock explícito del PrismaService que usa el servicio de auditoría
  const prismaServiceMock: Partial<PrismaService> = {
    auditLog: {
      // Mock de la operación de escritura de logs de auditoría
      create: jest.fn(),
    } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    auditService = module.get<AuditService>(AuditService);
    (prismaServiceMock.auditLog!.create as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(auditService).toBeDefined();
  });

  it('should call prisma.auditLog.create with the expected payload', async () => {
    const payload = {
      userId: 1,
      action: 'TEST_ACTION',
      resource: 'test-resource',
      resourceId: '123',
      details: { foo: 'bar' },
      ip: '127.0.0.1',
    };

    await auditService.log(
      payload.userId,
      payload.action,
      payload.resource,
      payload.resourceId,
      payload.details,
      payload.ip,
    );

    expect(prismaServiceMock.auditLog!.create).toHaveBeenCalledTimes(1);
    expect(prismaServiceMock.auditLog!.create).toHaveBeenCalledWith({
      data: {
        userId: payload.userId,
        action: payload.action,
        resource: payload.resource,
        resourceId: payload.resourceId,
        details: payload.details,
        ip: payload.ip,
      },
    });
  });

  it('should swallow errors thrown by prisma.auditLog.create', async () => {
    (prismaServiceMock.auditLog!.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    // No debería lanzar, solo loggear internamente
    await expect(
      auditService.log(1, 'TEST', 'resource', 'id', {}, '127.0.0.1'),
    ).resolves.toBeUndefined();
  });
});
