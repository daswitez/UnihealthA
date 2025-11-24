import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalRecordsController } from './clinical-records.controller';
import { ClinicalRecordsService } from './clinical-records.service';

describe('ClinicalRecordsController', () => {
  let controller: ClinicalRecordsController;

  const serviceMock = {
    create: jest.fn(),
    findAllByPatient: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalRecordsController],
      providers: [
        { provide: ClinicalRecordsService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<ClinicalRecordsController>(ClinicalRecordsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to ClinicalRecordsService.create', async () => {
    const dto: any = { patientId: 1, noteTypeId: 1, note: 'test' };
    const req: any = { user: { userId: 2 } };

    await controller.create(dto, req);

    expect(serviceMock.create).toHaveBeenCalledWith(dto, 2);
  });

  it('findAllByPatient should delegate to ClinicalRecordsService.findAllByPatient', async () => {
    await controller.findAllByPatient('1');
    expect(serviceMock.findAllByPatient).toHaveBeenCalledWith(1);
  });

  it('findMyHistory should call findAllByPatient with req.user.userId', async () => {
    const req: any = { user: { userId: 3 } };
    await controller.findMyHistory(req);
    expect(serviceMock.findAllByPatient).toHaveBeenCalledWith(3);
  });

  it('findOne should delegate to ClinicalRecordsService.findOne', async () => {
    await controller.findOne('10');
    expect(serviceMock.findOne).toHaveBeenCalledWith(10);
  });
});


