import { Test, TestingModule } from '@nestjs/testing';
import { MedicalHistoryController } from './medical-history.controller';
import { MedicalHistoryService } from './medical-history.service';

describe('MedicalHistoryController', () => {
  let controller: MedicalHistoryController;

  const medicalHistoryServiceMock = {
    create: jest.fn(),
    findAllForPatient: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
    remove: jest.fn(),
    getFullHistory: jest.fn(),
    addAllergy: jest.fn(),
    findAllergies: jest.fn(),
    findOneAllergy: jest.fn(),
    updateAllergy: jest.fn(),
    removeAllergy: jest.fn(),
    addMedication: jest.fn(),
    findMedications: jest.fn(),
    findOneMedication: jest.fn(),
    updateMedication: jest.fn(),
    deactivateMedication: jest.fn(),
    removeMedication: jest.fn(),
    addFamilyHistory: jest.fn(),
    findFamilyHistory: jest.fn(),
    findOneFamilyHistory: jest.fn(),
    updateFamilyHistory: jest.fn(),
    removeFamilyHistory: jest.fn(),
    addLifestyle: jest.fn(),
    findLifestyle: jest.fn(),
    updateLifestyle: jest.fn(),
    removeLifestyle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalHistoryController],
      providers: [
        { provide: MedicalHistoryService, useValue: medicalHistoryServiceMock },
      ],
    }).compile();

    controller = module.get<MedicalHistoryController>(MedicalHistoryController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===========================
  // Medical History Endpoints
  // ===========================

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto: any = { patientId: 1, condition: 'Test', type: 'fisico' };
      const req = { user: { userId: 1 } };

      await controller.create(dto, req as any);

      expect(medicalHistoryServiceMock.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findAll', () => {
    it('should delegate to service.findAllForPatient', async () => {
      const query: any = { page: 1, limit: 20 };
      const req = { user: { userId: 1 } };

      await controller.findAll(1, query, req as any);

      expect(medicalHistoryServiceMock.findAllForPatient).toHaveBeenCalledWith(1, 1, query);
    });
  });

  describe('getFullHistory', () => {
    it('should delegate to service.getFullHistory', async () => {
      const req = { user: { userId: 1 } };

      await controller.getFullHistory(1, req as any);

      expect(medicalHistoryServiceMock.getFullHistory).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      const req = { user: { userId: 1 } };

      await controller.findOne(1, req as any);

      expect(medicalHistoryServiceMock.findOne).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('update', () => {
    it('should delegate to service.update', async () => {
      const dto: any = { condition: 'Updated' };
      const req = { user: { userId: 1 } };

      await controller.update(1, dto, req as any);

      expect(medicalHistoryServiceMock.update).toHaveBeenCalledWith(1, dto, 1);
    });
  });

  describe('deactivate', () => {
    it('should delegate to service.deactivate', async () => {
      const req = { user: { userId: 1 } };

      await controller.deactivate(1, req as any);

      expect(medicalHistoryServiceMock.deactivate).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove', async () => {
      const req = { user: { userId: 1 } };

      await controller.remove(1, req as any);

      expect(medicalHistoryServiceMock.remove).toHaveBeenCalledWith(1, 1);
    });
  });

  // ===========================
  // Allergies Endpoints
  // ===========================

  describe('addAllergy', () => {
    it('should delegate to service.addAllergy', async () => {
      const dto: any = { patientId: 1, allergen: 'Peanuts' };
      const req = { user: { userId: 1 } };

      await controller.addAllergy(dto, req as any);

      expect(medicalHistoryServiceMock.addAllergy).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findAllergies', () => {
    it('should delegate to service.findAllergies', async () => {
      const req = { user: { userId: 1 } };

      await controller.findAllergies(1, req as any);

      expect(medicalHistoryServiceMock.findAllergies).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('updateAllergy', () => {
    it('should delegate to service.updateAllergy', async () => {
      const dto: any = { severity: 'moderate' };
      const req = { user: { userId: 1 } };

      await controller.updateAllergy(1, dto, req as any);

      expect(medicalHistoryServiceMock.updateAllergy).toHaveBeenCalledWith(1, dto, 1);
    });
  });

  describe('removeAllergy', () => {
    it('should delegate to service.removeAllergy', async () => {
      const req = { user: { userId: 1 } };

      await controller.removeAllergy(1, req as any);

      expect(medicalHistoryServiceMock.removeAllergy).toHaveBeenCalledWith(1, 1);
    });
  });

  // ===========================
  // Medications Endpoints
  // ===========================

  describe('addMedication', () => {
    it('should delegate to service.addMedication', async () => {
      const dto: any = { patientId: 1, name: 'Lisinopril' };
      const req = { user: { userId: 1 } };

      await controller.addMedication(dto, req as any);

      expect(medicalHistoryServiceMock.addMedication).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findMedications', () => {
    it('should delegate to service.findMedications with activeOnly=false', async () => {
      const req = { user: { userId: 1 } };

      await controller.findMedications(1, req as any);

      expect(medicalHistoryServiceMock.findMedications).toHaveBeenCalledWith(1, 1, false);
    });
  });

  describe('findActiveMedications', () => {
    it('should delegate to service.findMedications with activeOnly=true', async () => {
      const req = { user: { userId: 1 } };

      await controller.findActiveMedications(1, req as any);

      expect(medicalHistoryServiceMock.findMedications).toHaveBeenCalledWith(1, 1, true);
    });
  });

  describe('deactivateMedication', () => {
    it('should delegate to service.deactivateMedication', async () => {
      const req = { user: { userId: 1 } };

      await controller.deactivateMedication(1, req as any);

      expect(medicalHistoryServiceMock.deactivateMedication).toHaveBeenCalledWith(1, 1);
    });
  });

  // ===========================
  // Family History Endpoints
  // ===========================

  describe('addFamilyHistory', () => {
    it('should delegate to service.addFamilyHistory', async () => {
      const dto: any = { patientId: 1, relationship: 'Father', condition: 'Hypertension' };
      const req = { user: { userId: 1 } };

      await controller.addFamilyHistory(dto, req as any);

      expect(medicalHistoryServiceMock.addFamilyHistory).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findFamilyHistory', () => {
    it('should delegate to service.findFamilyHistory', async () => {
      const req = { user: { userId: 1 } };

      await controller.findFamilyHistory(1, req as any);

      expect(medicalHistoryServiceMock.findFamilyHistory).toHaveBeenCalledWith(1, 1);
    });
  });

  // ===========================
  // Lifestyle Endpoints
  // ===========================

  describe('addLifestyle', () => {
    it('should delegate to service.addLifestyle', async () => {
      const dto: any = { patientId: 1, diet: 'Mediterranean' };
      const req = { user: { userId: 1 } };

      await controller.addLifestyle(dto, req as any);

      expect(medicalHistoryServiceMock.addLifestyle).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('findLifestyle', () => {
    it('should delegate to service.findLifestyle', async () => {
      const req = { user: { userId: 1 } };

      await controller.findLifestyle(1, req as any);

      expect(medicalHistoryServiceMock.findLifestyle).toHaveBeenCalledWith(1, 1);
    });
  });
});
