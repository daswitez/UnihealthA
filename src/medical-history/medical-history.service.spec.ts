import { Test, TestingModule } from '@nestjs/testing';
import { MedicalHistoryService } from './medical-history.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../access/access.service';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('MedicalHistoryService', () => {
  let service: MedicalHistoryService;

  const prismaMock: Partial<PrismaService> = {
    medicalHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any,
    allergy: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any,
    medication: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any,
    familyHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any,
    lifestyleDetail: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any,
  };

  const accessServiceMock = {
    checkAccess: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalHistoryService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: AccessService, useValue: accessServiceMock },
      ],
    }).compile();

    service = module.get<MedicalHistoryService>(MedicalHistoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ===========================
  // Medical History Tests - All Branches
  // ===========================

  describe('create', () => {
    const dto = {
      patientId: 1,
      condition: 'Diabetes',
      diagnosis: 'Type 2',
      treatment: 'Metformin',
      diagnosedAt: '2023-01-01',
      type: 'fisico' as 'fisico',
      notes: 'Test notes',
    };

    it('should create when patient creates own record (patientId === requesterId)', async () => {
      const mockResult = { id: BigInt(1), ...dto };
      (prismaMock.medicalHistory!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.create(dto, 1);

      expect(accessServiceMock.checkAccess).not.toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should create when staff has fisico permission', async () => {
      const mockResult = { id: BigInt(1), ...dto };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });
      (prismaMock.medicalHistory!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.create(dto, 2);

      expect(accessServiceMock.checkAccess).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual(mockResult);
    });

    it('should create mental when staff has mental permission', async () => {
      const mentalDto = { ...dto, type: 'mental' as 'mental' };
      const mockResult = { id: BigInt(1), ...mentalDto };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
      });
      (prismaMock.medicalHistory!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.create(mentalDto, 2);

      expect(result).toEqual(mockResult);
    });

    it('should create when staff has both permissions', async () => {
      const mockResult = { id: BigInt(1), ...dto };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: true },
      });
      (prismaMock.medicalHistory!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.create(dto, 2);

      expect(result).toEqual(mockResult);
    });

    it('should throw ForbiddenException when staff lacks fisico permission', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
      });

      await expect(service.create(dto, 2)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when staff lacks mental permission', async () => {
      const mentalDto = { ...dto, type: 'mental' as 'mental' };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });

      await expect(service.create(mentalDto, 2)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when staff has no permissions', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: false },
      });

      await expect(service.create(dto, 2)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllForPatient', () => {
    const query = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as 'DESC',
    };

    it('should return paginated results for patient (no access check)', async () => {
      const mockItems = [{ id: BigInt(1), condition: 'Test' }];
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAllForPatient(1, 1, query);

      expect(result.meta.totalPages).toBe(1);
      expect(result.items).toEqual(mockItems);
    });

    it('should filter by fisico when staff has only fisico permission', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(0);

      await service.findAllForPatient(1, 2, query);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: { in: ['fisico'] },
          }),
        })
      );
    });

    it('should filter by mental when staff has only mental permission', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
      });
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(0);

      await service.findAllForPatient(1, 2, query);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: { in: ['mental'] },
          }),
        })
      );
    });

    it('should allow both types when staff has both permissions', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: true },
      });
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(0);

      await service.findAllForPatient(1, 2, query);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: { in: ['fisico', 'mental'] },
          }),
        })
      );
    });

    it('should throw ForbiddenException when staff has no permissions', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: false },
      });

      await expect(service.findAllForPatient(1, 2, query)).rejects.toThrow(ForbiddenException);
    });

    it('should apply type filter from query (fisico)', async () => {
      const queryWithType = { ...query, type: 'fisico' as 'fisico' };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(0);

      await service.findAllForPatient(1, 1, queryWithType);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'fisico',
          }),
        })
      );
    });

    it('should apply type filter from query (mental)', async () => {
      const queryWithType = { ...query, type: 'mental' as 'mental' };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(0);

      await service.findAllForPatient(1, 1, queryWithType);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'mental',
          }),
        })
      );
    });

    it('should apply isActive=true filter from query', async () => {
      const queryWithActive = { ...query, isActive: true };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(0);

      await service.findAllForPatient(1, 1, queryWithActive);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        })
      );
    });

    it('should apply isActive=false filter from query', async () => {
      const queryWithActive = { ...query, isActive: false };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(0);

      await service.findAllForPatient(1, 1, queryWithActive);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: false,
          }),
        })
      );
    });

    it('should throw ForbiddenException when requesting fisico without permission', async () => {
      const queryWithType = { ...query, type: 'fisico' as 'fisico' };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
      });

      await expect(service.findAllForPatient(1, 2, queryWithType)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when requesting mental without permission', async () => {
      const queryWithType = { ...query, type: 'mental' as 'mental' };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });

      await expect(service.findAllForPatient(1, 2, queryWithType)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return record when patient accesses own', async () => {
      const mockRecord = { id: BigInt(1), patientId: BigInt(1), type: 'fisico' };
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(mockRecord);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockRecord);
    });

    it('should return fisico record when staff has fisico permission', async () => {
      const mockRecord = { id: BigInt(1), patientId: BigInt(2), type: 'fisico' };
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(mockRecord);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockRecord);
    });

    it('should return mental record when staff has mental permission', async () => {
      const mockRecord = { id: BigInt(1), patientId: BigInt(2), type: 'mental' };
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(mockRecord);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
      });

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockRecord);
    });

    it('should throw ForbiddenException when accessing fisico without permission', async () => {
      const mockRecord = { id: BigInt(1), patientId: BigInt(2), type: 'fisico' };
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(mockRecord);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
      });

      await expect(service.findOne(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when accessing mental without permission', async () => {
      const mockRecord = { id: BigInt(1), patientId: BigInt(2), type: 'mental' };
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(mockRecord);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });

      await expect(service.findOne(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when record not found', async () => {
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update when not changing type', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), type: 'fisico' };
      const updateDto = { condition: 'Updated' };
      const updated = { ...existing, ...updateDto };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.update(1, updateDto as any, 1);

      expect(result).toEqual(updated);
    });

    it('should update when changing from fisico to mental with permission', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(2), type: 'fisico' };
      const updateDto = { type: 'mental' as 'mental' };
      const updated = { ...existing, ...updateDto };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: true },
      });

      const result = await service.update(1, updateDto as any, 1);

      expect(result).toEqual(updated);
    });

    it('should update when changing from mental to fisico with permission', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(2), type: 'mental' };
      const updateDto = { type: 'fisico' as 'fisico' };
      const updated = { ...existing, ...updateDto };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: true },
      });

      const result = await service.update(1, updateDto as any, 1);

      expect(result).toEqual(updated);
    });

    it('should throw ForbiddenException when changing to type without permission', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(2), type: 'fisico' };
      const updateDto = { type: 'mental' as 'mental' };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });

      await expect(service.update(1, updateDto as any, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when record not found', async () => {
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, {} as any, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate record', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), type: 'fisico', isActive: true };
      const deactivated = { ...existing, isActive: false };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.update as jest.Mock).mockResolvedValue(deactivated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.deactivate(1, 1);

      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException when record not found', async () => {
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deactivate(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete record', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), type: 'fisico' };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.delete as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await service.remove(1, 1);

      expect(prismaMock.medicalHistory!.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when record not found', async () => {
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  // ===========================
  // Allergies Tests
  // ===========================

  describe('addAllergy', () => {
    it('should create allergy', async () => {
      const dto = { patientId: 1, allergen: 'Peanuts', severity: 'severe' as 'severe' };
      const mockResult = { id: BigInt(1), ...dto };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.allergy!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.addAllergy(dto, 1);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findAllergies', () => {
    it('should return all allergies', async () => {
      const mockAllergies = [{ id: BigInt(1), allergen: 'Peanuts' }];

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.allergy!.findMany as jest.Mock).mockResolvedValue(mockAllergies);

      const result = await service.findAllergies(1, 1);

      expect(result).toEqual(mockAllergies);
    });
  });

  describe('findOneAllergy', () => {
    it('should return one allergy', async () => {
      const mockAllergy = { id: BigInt(1), patientId: BigInt(1), allergen: 'Peanuts' };

      (prismaMock.allergy!.findUnique as jest.Mock).mockResolvedValue(mockAllergy);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneAllergy(1, 1);

      expect(result).toEqual(mockAllergy);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.allergy!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneAllergy(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAllergy', () => {
    it('should update allergy', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), allergen: 'Peanuts' };
      const updateDto = { severity: 'moderate' as 'moderate' };
      const updated = { ...existing, ...updateDto };

      (prismaMock.allergy!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.allergy!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.updateAllergy(1, updateDto, 1);

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.allergy!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateAllergy(999, {} as any, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeAllergy', () => {
    it('should delete allergy', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1) };

      (prismaMock.allergy!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.allergy!.delete as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await service.removeAllergy(1, 1);

      expect(prismaMock.allergy!.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.allergy!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.removeAllergy(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  // ===========================
  // Medications Tests
  // ===========================

  describe('addMedication', () => {
    it('should create medication when dates are valid', async () => {
      const dto = {
        patientId: 1,
        name: 'Lisinopril',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };
      const mockResult = { id: BigInt(1), ...dto };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medication!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.addMedication(dto as any, 1);

      expect(result).toEqual(mockResult);
    });

    it('should create medication when no dates provided', async () => {
      const dto = {
        patientId: 1,
        name: 'Lisinopril',
      };
      const mockResult = { id: BigInt(1), ...dto };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medication!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.addMedication(dto as any, 1);

      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException when startDate > endDate', async () => {
      const dto = {
        patientId: 1,
        name: 'Test',
        startDate: '2024-12-31',
        endDate: '2024-01-01',
      };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await expect(service.addMedication(dto as any, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findMedications', () => {
    it('should return all medications when activeOnly=false', async () => {
      const mockMeds = [
        { id: BigInt(1), name: 'Active', isActive: true },
        { id: BigInt(2), name: 'Inactive', isActive: false },
      ];

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medication!.findMany as jest.Mock).mockResolvedValue(mockMeds);

      const result = await service.findMedications(1, 1, false);

      expect(result).toEqual(mockMeds);
    });

    it('should filter active medications when activeOnly=true', async () => {
      const mockMeds = [{ id: BigInt(1), name: 'Active', isActive: true }];

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medication!.findMany as jest.Mock).mockResolvedValue(mockMeds);

      await service.findMedications(1, 1, true);

      expect(prismaMock.medication!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        })
      );
    });
  });

  describe('findOneMedication', () => {
    it('should return medication', async () => {
      const mockMed = { id: BigInt(1), patientId: BigInt(1), name: 'Lisinopril' };

      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(mockMed);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneMedication(1, 1);

      expect(result).toEqual(mockMed);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneMedication(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMedication', () => {
    it('should update when dates valid', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1) };
      const updateDto = { startDate: '2024-01-01', endDate: '2024-12-31' };
      const updated = { ...existing, ...updateDto };

      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medication!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.updateMedication(1, updateDto as any, 1);

      expect(result).toEqual(updated);
    });

    it('should throw BadRequestException when update dates invalid', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1) };
      const updateDto = { startDate: '2024-12-31', endDate: '2024-01-01' };

      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await expect(service.updateMedication(1, updateDto as any, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateMedication(999, {} as any, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivateMedication', () => {
    it('should deactivate medication', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), isActive: true };
      const deactivated = { ...existing, isActive: false };

      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medication!.update as jest.Mock).mockResolvedValue(deactivated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.deactivateMedication(1, 1);

      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deactivateMedication(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeMedication', () => {
    it('should delete medication', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1) };

      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medication!.delete as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await service.removeMedication(1, 1);

      expect(prismaMock.medication!.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.medication!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.removeMedication(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  // ===========================
  // Family History Tests
  // ===========================

  describe('addFamilyHistory', () => {
    it('should create family history', async () => {
      const dto = { patientId: 1, relationship: 'Father', condition: 'Hypertension' };
      const mockResult = { id: BigInt(1), ...dto };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.familyHistory!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.addFamilyHistory(dto, 1);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findFamilyHistory', () => {
    it('should return family history', async () => {
      const mockHistory = [{ id: BigInt(1), relationship: 'Father' }];

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.familyHistory!.findMany as jest.Mock).mockResolvedValue(mockHistory);

      const result = await service.findFamilyHistory(1, 1);

      expect(result).toEqual(mockHistory);
    });
  });

  describe('findOneFamilyHistory', () => {
    it('should return one family history', async () => {
      const mockRecord = { id: BigInt(1), patientId: BigInt(1), relationship: 'Father' };

      (prismaMock.familyHistory!.findUnique as jest.Mock).mockResolvedValue(mockRecord);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneFamilyHistory(1, 1);

      expect(result).toEqual(mockRecord);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.familyHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneFamilyHistory(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateFamilyHistory', () => {
    it('should update family history', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), relationship: 'Father' };
      const updateDto = { condition: 'Updated' };
      const updated = { ...existing, ...updateDto };

      (prismaMock.familyHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.familyHistory!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.updateFamilyHistory(1, updateDto as any, 1);

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.familyHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateFamilyHistory(999, {} as any, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFamilyHistory', () => {
    it('should delete family history', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1) };

      (prismaMock.familyHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.familyHistory!.delete as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await service.removeFamilyHistory(1, 1);

      expect(prismaMock.familyHistory!.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.familyHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.removeFamilyHistory(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  // ===========================
  // Lifestyle Tests
  // ===========================

  describe('addLifestyle', () => {
    it('should create lifestyle', async () => {
      const dto = { patientId: 1, diet: 'Mediterranean', sleepHours: 7.5 };
      const mockResult = { id: BigInt(1), ...dto };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.lifestyleDetail!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.addLifestyle(dto, 1);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findLifestyle', () => {
    it('should return lifestyle', async () => {
      const mockLifestyle = { id: BigInt(1), patientId: BigInt(1), diet: 'Mediterranean' };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.lifestyleDetail!.findFirst as jest.Mock).mockResolvedValue(mockLifestyle);

      const result = await service.findLifestyle(1, 1);

      expect(result).toEqual(mockLifestyle);
    });
  });

  describe('updateLifestyle', () => {
    it('should update lifestyle', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), diet: 'Mediterranean' };
      const updateDto = { sleepHours: 8 };
      const updated = { ...existing, ...updateDto };

      (prismaMock.lifestyleDetail!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.lifestyleDetail!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.updateLifestyle(1, updateDto as any, 1);

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.lifestyleDetail!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateLifestyle(999, {} as any, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeLifestyle', () => {
    it('should delete lifestyle', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1) };

      (prismaMock.lifestyleDetail!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.lifestyleDetail!.delete as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await service.removeLifestyle(1, 1);

      expect(prismaMock.lifestyleDetail!.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when not found', async () => {
      (prismaMock.lifestyleDetail!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.removeLifestyle(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  // ===========================
  // Full History Tests
  // ===========================

  describe('getFullHistory', () => {
    it('should return complete history for patient', async () => {
      const mockData = {
        history: [{ id: BigInt(1), condition: 'Diabetes' }],
        allergies: [{ id: BigInt(1), allergen: 'Peanuts' }],
        medications: [{ id: BigInt(1), name: 'Lisinopril' }],
        familyHistory: [{ id: BigInt(1), relationship: 'Father' }],
        lifestyle: { id: BigInt(1), diet: 'Mediterranean' },
      };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue(mockData.history);
      (prismaMock.allergy!.findMany as jest.Mock).mockResolvedValue(mockData.allergies);
      (prismaMock.medication!.findMany as jest.Mock).mockResolvedValue(mockData.medications);
      (prismaMock.familyHistory!.findMany as jest.Mock).mockResolvedValue(mockData.familyHistory);
      (prismaMock.lifestyleDetail!.findFirst as jest.Mock).mockResolvedValue(mockData.lifestyle);

      const result = await service.getFullHistory(1, 1);

      expect(result.history).toEqual(mockData.history);
      expect(result.allergies).toEqual(mockData.allergies);
      expect(result.medications).toEqual(mockData.medications);
      expect(result.familyHistory).toEqual(mockData.familyHistory);
      expect(result.lifestyle).toEqual(mockData.lifestyle);
    });

    it('should filter by fisico when staff has only fisico permission', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.allergy!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medication!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.familyHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.lifestyleDetail!.findFirst as jest.Mock).mockResolvedValue(null);

      await service.getFullHistory(1, 2);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: { in: ['fisico'] },
          }),
        })
      );
    });

    it('should filter by mental when staff has only mental permission', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
      });
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.allergy!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medication!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.familyHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.lifestyleDetail!.findFirst as jest.Mock).mockResolvedValue(null);

      await service.getFullHistory(1, 2);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: { in: ['mental'] },
          }),
        })
      );
    });

    it('should allow both types when staff has both permissions', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: true },
      });
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.allergy!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.medication!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.familyHistory!.findMany as jest.Mock).mockResolvedValue([]);
      (prismaMock.lifestyleDetail!.findFirst as jest.Mock).mockResolvedValue(null);

      await service.getFullHistory(1, 2);

      expect(prismaMock.medicalHistory!.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: { in: ['fisico', 'mental'] },
          }),
        })
      );
    });

    it('should throw ForbiddenException when staff has no permissions', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: false },
      });

      await expect(service.getFullHistory(1, 2)).rejects.toThrow(ForbiddenException);
    });
  });
});
