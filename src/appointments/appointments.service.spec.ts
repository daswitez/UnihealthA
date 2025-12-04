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
    role: {
      findUnique: jest.fn(),
    } as any,
    user: {
      findMany: jest.fn(),
    } as any,
    serviceType: {
      findMany: jest.fn(),
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

  describe('getAvailableDoctors', () => {
    it('should return empty array when doctor role does not exist', async () => {
      (prismaMock.role!.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await appointmentsService.getAvailableDoctors();

      expect(result).toEqual([]);
    });

    it('should return active doctors when role exists', async () => {
      const doctorRole = { id: 2, name: 'doctor' };
      const doctors = [{ id: 1n, email: 'doctor@test.com', role: { name: 'doctor' } }];
      (prismaMock.role!.findUnique as jest.Mock).mockResolvedValueOnce(doctorRole);
      (prismaMock.user!.findMany as jest.Mock).mockResolvedValueOnce(doctors);

      const result = await appointmentsService.getAvailableDoctors();

      expect(prismaMock.user!.findMany).toHaveBeenCalledWith({
        where: { roleId: 2, isActive: true },
        select: { id: true, email: true, role: { select: { name: true } } },
      });
      expect(result).toEqual(doctors);
    });
  });

  describe('getAvailableNurses', () => {
    it('should return empty array when nurse role does not exist', async () => {
      (prismaMock.role!.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await appointmentsService.getAvailableNurses();

      expect(result).toEqual([]);
    });

    it('should return active nurses when role exists', async () => {
      const nurseRole = { id: 3, name: 'nurse' };
      const nurses = [{ id: 2n, email: 'nurse@test.com', role: { name: 'nurse' } }];
      (prismaMock.role!.findUnique as jest.Mock).mockResolvedValueOnce(nurseRole);
      (prismaMock.user!.findMany as jest.Mock).mockResolvedValueOnce(nurses);

      const result = await appointmentsService.getAvailableNurses();

      expect(prismaMock.user!.findMany).toHaveBeenCalledWith({
        where: { roleId: 3, isActive: true },
        select: { id: true, email: true, role: { select: { name: true } } },
      });
      expect(result).toEqual(nurses);
    });
  });

  describe('getServiceTypes', () => {
    it('should return active service types', async () => {
      const serviceTypes = [
        { id: 1, code: 'CONS', name: 'Consulta' },
        { id: 2, code: 'VAC', name: 'Vacunación' },
      ];
      (prismaMock.serviceType!.findMany as jest.Mock).mockResolvedValueOnce(serviceTypes);

      const result = await appointmentsService.getServiceTypes();

      expect(prismaMock.serviceType!.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        select: { id: true, code: true, name: true },
      });
      expect(result).toEqual(serviceTypes);
    });
  });
});


