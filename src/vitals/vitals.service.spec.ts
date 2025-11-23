import { Test, TestingModule } from '@nestjs/testing';
import { VitalsService } from './vitals.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VitalsService', () => {
  let service: VitalsService;

  const prismaMock: Partial<PrismaService> = {
    vitals: {
      create: jest.fn(),
      findMany: jest.fn(),
    } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VitalsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<VitalsService>(VitalsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should delegate to prisma.vitals.create', async () => {
    const dto = {
      patientId: 1,
      systolicBP: 120,
      diastolicBP: 80,
      heartRate: 70,
      tempC: 36.5,
      spo2: 98,
    } as any;

    await service.create(dto, 2);

    expect(prismaMock.vitals!.create).toHaveBeenCalledWith({
      data: {
        patientId: dto.patientId,
        takenById: 2,
        systolicBP: dto.systolicBP,
        diastolicBP: dto.diastolicBP,
        heartRate: dto.heartRate,
        tempC: dto.tempC,
        spo2: dto.spo2,
      },
    });
  });

  it('findAllByPatient should delegate to prisma.vitals.findMany', async () => {
    await service.findAllByPatient(1);
    expect(prismaMock.vitals!.findMany).toHaveBeenCalledWith({
      where: { patientId: 1 },
      include: {
        takenBy: { select: { email: true } },
      },
      orderBy: { takenAt: 'desc' },
    });
  });
});


