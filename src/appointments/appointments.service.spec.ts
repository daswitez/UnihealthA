import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('AppointmentsService', () => {
  let appointmentsService: AppointmentsService;

  const prismaMock: Partial<PrismaService> = {
    appointment: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    appointmentsService = module.get<AppointmentsService>(AppointmentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appointmentsService).toBeDefined();
  });

  it('create should throw BadRequestException when there is a schedule conflict', async () => {
    (prismaMock.appointment!.findFirst as jest.Mock).mockResolvedValueOnce({ id: 1 });

    const dto = {
      patientId: 1,
      nurseId: 2,
      serviceTypeId: 3,
      start: new Date().toISOString(),
      end: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      reason: 'conflict',
    } as any;

    await expect(appointmentsService.create(dto)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('create should create appointment when there is no conflict', async () => {
    (prismaMock.appointment!.findFirst as jest.Mock).mockResolvedValueOnce(null);
    (prismaMock.appointment!.create as jest.Mock).mockImplementationOnce(({ data }) => data);

    const dto = {
      patientId: 1,
      nurseId: 2,
      serviceTypeId: 3,
      start: new Date().toISOString(),
      end: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      reason: 'ok',
    } as any;

    const result = await appointmentsService.create(dto);

    expect(prismaMock.appointment!.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.appointment!.create).toHaveBeenCalledTimes(1);
    expect(result.patientId).toBe(dto.patientId);
    expect(result.nurseId).toBe(dto.nurseId);
  });

  it('findAll should delegate to prisma.appointment.findMany', async () => {
    (prismaMock.appointment!.findMany as jest.Mock).mockResolvedValueOnce([]);
    await appointmentsService.findAll();
    expect(prismaMock.appointment!.findMany).toHaveBeenCalledWith({
      include: { patient: true, nurse: true, serviceType: true },
      orderBy: { start: 'asc' },
    });
  });

  it('findOne should delegate to prisma.appointment.findUnique', async () => {
    await appointmentsService.findOne(1);
    expect(prismaMock.appointment!.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { patient: true, nurse: true, serviceType: true },
    });
  });

  it('update should delegate to prisma.appointment.update', async () => {
    const dto = { status: 'confirmada' } as any;
    await appointmentsService.update(1, dto);
    expect(prismaMock.appointment!.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: dto.status },
    });
  });
});


