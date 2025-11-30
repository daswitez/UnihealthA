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
  // Medical History Tests
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

    it('should create medical history when patient creates own record', async () => {
      const mockResult = { id: BigInt(1), ...dto };
      (prismaMock.medicalHistory!.create as jest.Mock).mockResolvedValue(mockResult);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.create(dto, 1);

      expect(accessServiceMock.checkAccess).not.toHaveBeenCalled();
      expect(prismaMock.medicalHistory!.create).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should create medical history when staff has access', async () => {
      const mockResult = { id: BigInt(1), ...dto };
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: true, mental: false },
      });
      (prismaMock.medicalHistory!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.create(dto, 2);

      expect(accessServiceMock.checkAccess).toHaveBeenCalledWith(1, 2);
      expect(prismaMock.medicalHistory!.create).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should throw ForbiddenException when staff lacks permission for type', async () => {
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue({
        permissions: { fisico: false, mental: true },
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

    it('should return paginated results for patient accessing own records', async () => {
      const mockItems = [{ id: BigInt(1), condition: 'Test' }];
      (prismaMock.medicalHistory!.findMany as jest.Mock).mockResolvedValue(mockItems);
      (prismaMock.medicalHistory!.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAllForPatient(1, 1, query);

      expect(result.items).toEqual(mockItems);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
    });

    it('should filter by type when staff has partial permissions', async () => {
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
  });

  describe('findOne', () => {
    it('should return medical history record', async () => {
      const mockRecord = { id: BigInt(1), patientId: BigInt(1), type: 'fisico' };
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(mockRecord);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockRecord);
    });

    it('should throw NotFoundException when record does not exist', async () => {
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update medical history record', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), type: 'fisico' };
      const updateDto = { condition: 'Updated condition' };
      const updated = { ...existing, ...updateDto };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.update as jest.Mock).mockResolvedValue(updated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.update(1, updateDto as any, 1);

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when record does not exist', async () => {
      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, {} as any, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate medical history record', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), type: 'fisico', isActive: true };
      const deactivated = { ...existing, isActive: false };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.update as jest.Mock).mockResolvedValue(deactivated);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      const result = await service.deactivate(1, 1);

      expect(result.isActive).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete medical history record', async () => {
      const existing = { id: BigInt(1), patientId: BigInt(1), type: 'fisico' };

      (prismaMock.medicalHistory!.findUnique as jest.Mock).mockResolvedValue(existing);
      (prismaMock.medicalHistory!.delete as jest.Mock).mockResolvedValue(existing);
      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);

      await service.remove(1, 1);

      expect(prismaMock.medicalHistory!.delete).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
      });
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
    it('should return all allergies for patient', async () => {
      const mockAllergies = [{ id: BigInt(1), allergen: 'Peanuts' }];

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.allergy!.findMany as jest.Mock).mockResolvedValue(mockAllergies);

      const result = await service.findAllergies(1, 1);

      expect(result).toEqual(mockAllergies);
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
  });

  // ===========================
  // Medications Tests
  // ===========================

  describe('addMedication', () => {
    it('should create medication', async () => {
      const dto = {
        patientId: 1,
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Daily',
        isActive: true,
      };
      const mockResult = { id: BigInt(1), ...dto };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medication!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.addMedication(dto, 1);

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
    it('should return all medications', async () => {
      const mockMeds = [{ id: BigInt(1), name: 'Lisinopril', isActive: true }];

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.medication!.findMany as jest.Mock).mockResolvedValue(mockMeds);

      const result = await service.findMedications(1, 1, false);

      expect(result).toEqual(mockMeds);
    });

    it('should filter active medications only', async () => {
      const mockMeds = [{ id: BigInt(1), name: 'Lisinopril', isActive: true }];

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

  // ===========================
  // Lifestyle Tests
  // ===========================

  describe('addLifestyle', () => {
    it('should create lifestyle detail', async () => {
      const dto = { patientId: 1, diet: 'Mediterranean', sleepHours: 7.5 };
      const mockResult = { id: BigInt(1), ...dto };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.lifestyleDetail!.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.addLifestyle(dto, 1);

      expect(result).toEqual(mockResult);
    });
  });

  describe('findLifestyle', () => {
    it('should return lifestyle detail', async () => {
      const mockLifestyle = { id: BigInt(1), patientId: BigInt(1), diet: 'Mediterranean' };

      (accessServiceMock.checkAccess as jest.Mock).mockResolvedValue(null);
      (prismaMock.lifestyleDetail!.findFirst as jest.Mock).mockResolvedValue(mockLifestyle);

      const result = await service.findLifestyle(1, 1);

      expect(result).toEqual(mockLifestyle);
    });
  });

  // ===========================
  // Full History Tests
  // ===========================

  describe('getFullHistory', () => {
    it('should return complete medical history', async () => {
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

    it('should filter history by permissions', async () => {
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
  });
});
