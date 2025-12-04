import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from './access.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AccessService', () => {
  let accessService: AccessService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    medicalAccess: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    accessService = module.get<AccessService>(AccessService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(accessService).toBeDefined();
  });

  describe('grantAccess', () => {
    it('should throw BadRequestException when patient has no PIN', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1n, pinHash: null });

      await expect(
        accessService.grantAccess(1, 2, '1234', { fisico: true }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when patient not found', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        accessService.grantAccess(1, 2, '1234', { fisico: true }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException for invalid PIN', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1n, pinHash: 'hashedPin' });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        accessService.grantAccess(1, 2, 'wrongPin', { fisico: true }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create new access grant when valid PIN and no existing grant', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1n, pinHash: 'hashedPin' });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      prismaMock.medicalAccess.findFirst.mockResolvedValueOnce(null);
      prismaMock.medicalAccess.create.mockResolvedValueOnce({ id: 1 });

      const result = await accessService.grantAccess(1, 2, '1234', { fisico: true });

      expect(prismaMock.medicalAccess.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should update existing access grant when valid PIN', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1n, pinHash: 'hashedPin' });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      prismaMock.medicalAccess.findFirst.mockResolvedValueOnce({ id: 5n });
      prismaMock.medicalAccess.update.mockResolvedValueOnce({ id: 5n, permissions: { fisico: true } });

      const result = await accessService.grantAccess(1, 2, '1234', { fisico: true });

      expect(prismaMock.medicalAccess.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 5n, permissions: { fisico: true } });
    });
  });

  describe('revokeAccess', () => {
    it('should deactivate access grants', async () => {
      prismaMock.medicalAccess.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = await accessService.revokeAccess(1, 2);

      expect(prismaMock.medicalAccess.updateMany).toHaveBeenCalledWith({
        where: {
          patientId: 1n,
          staffId: 2n,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('checkAccess', () => {
    it('should return false when no grant exists', async () => {
      prismaMock.medicalAccess.findFirst.mockResolvedValueOnce(null);

      const result = await accessService.checkAccess(1, 2);

      expect(result).toBe(false);
    });

    it('should return grant when valid and not expired', async () => {
      const futureDate = new Date(Date.now() + 3600000);
      const grant = { id: 1, expiresAt: futureDate, permissions: { fisico: true } };
      prismaMock.medicalAccess.findFirst.mockResolvedValueOnce(grant);

      const result = await accessService.checkAccess(1, 2);

      expect(result).toEqual(grant);
    });

    it('should revoke and return false when grant is expired', async () => {
      const pastDate = new Date(Date.now() - 3600000);
      const grant = { id: 1, expiresAt: pastDate, permissions: { fisico: true } };
      prismaMock.medicalAccess.findFirst.mockResolvedValueOnce(grant);
      prismaMock.medicalAccess.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = await accessService.checkAccess(1, 2);

      expect(prismaMock.medicalAccess.updateMany).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return grant when expiresAt is null (no expiration)', async () => {
      const grant = { id: 1, expiresAt: null, permissions: { fisico: true } };
      prismaMock.medicalAccess.findFirst.mockResolvedValueOnce(grant);

      const result = await accessService.checkAccess(1, 2);

      expect(result).toEqual(grant);
    });
  });
});
