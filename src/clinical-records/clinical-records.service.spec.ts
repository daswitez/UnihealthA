import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalRecordsService } from './clinical-records.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClinicalRecordsService', () => {
  let service: ClinicalRecordsService;

  const prismaMock: Partial<PrismaService> = {
    clinicalRecord: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalRecordsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ClinicalRecordsService>(ClinicalRecordsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should delegate to prisma.clinicalRecord.create', async () => {
    const dto = { patientId: 1, noteTypeId: 2, note: 'test' } as any;
    await service.create(dto, 3);
    expect(prismaMock.clinicalRecord!.create).toHaveBeenCalledWith({
      data: {
        patientId: dto.patientId,
        noteTypeId: dto.noteTypeId,
        note: dto.note,
        createdById: 3,
      },
    });
  });

  it('findAllByPatient should delegate to prisma.clinicalRecord.findMany', async () => {
    await service.findAllByPatient(1);
    expect(prismaMock.clinicalRecord!.findMany).toHaveBeenCalledWith({
      where: { patientId: 1 },
      include: {
        createdBy: { select: { email: true, role: true } },
        noteType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('findOne should delegate to prisma.clinicalRecord.findUnique', async () => {
    await service.findOne(1);
    expect(prismaMock.clinicalRecord!.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        createdBy: { select: { email: true } },
        noteType: true,
      },
    });
  });
});


