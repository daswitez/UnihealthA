import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('PatientsService', () => {
  let service: PatientsService;

  const prismaMock: Partial<PrismaService> = {
    role: {
      findUnique: jest.fn(),
    } as any,
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    } as any,
    patientProfile: {
      update: jest.fn(),
    } as any,
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create user and profile inside transaction', async () => {
    const dto = {
      firstName: 'Jane',
      lastName: 'Doe',
      dob: new Date().toISOString(),
      gender: 'F',
      email: 'patient@example.com',
    } as any;

    const txMock = {
      user: { create: jest.fn().mockResolvedValue({ id: BigInt(5), email: dto.email }) },
      patientProfile: { create: jest.fn().mockResolvedValue({ userId: BigInt(5) }) },
    };

    (prismaMock.role!.findUnique as jest.Mock).mockResolvedValueOnce({ id: BigInt(2) });
    (prismaMock.$transaction as jest.Mock).mockImplementation(async (fn: any) => fn(txMock));

    const result = await service.create(dto, 1);

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(txMock.user.create).toHaveBeenCalled();
    expect(txMock.patientProfile.create).toHaveBeenCalled();
    expect(result.email).toBe(dto.email);
    expect(result.profile.userId).toBe(BigInt(5));
  });

  it('findAll should query users with patientProfile', async () => {
    (prismaMock.user!.findMany as jest.Mock).mockResolvedValueOnce([]);
    await service.findAll();
    expect(prismaMock.user!.findMany).toHaveBeenCalledWith({
      where: { patientProfile: { isNot: null } },
      include: { patientProfile: true },
    });
  });

  it('findOne should delegate to prisma.user.findUnique', async () => {
    await service.findOne(1);
    expect(prismaMock.user!.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { patientProfile: true },
    });
  });

  it('update should delegate to prisma.patientProfile.update', async () => {
    const dto = {
      firstName: 'Jane',
      lastName: 'Doe',
      dob: new Date().toISOString(),
      gender: 'F',
    } as any;

    await service.update(1, dto);
    expect(prismaMock.patientProfile!.update).toHaveBeenCalledWith({
      where: { userId: BigInt(1) },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        dob: expect.any(Date),
        gender: dto.gender,
      },
    });
  });

  it('remove should delegate to prisma.user.delete', async () => {
    await service.remove(1);
    expect(prismaMock.user!.delete).toHaveBeenCalledWith({ where: { id: BigInt(1) } });
  });
});


