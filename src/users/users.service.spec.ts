import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;

  const prismaMock: Partial<PrismaService> = {
    role: {
      findUnique: jest.fn(),
    } as any,
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('create should hash password and create user with default role', async () => {
    const dto = { email: 'user@example.com', password: 'Password123!' } as any;
    const fakeRole = { id: BigInt(2) };

    (prismaMock.role!.findUnique as jest.Mock).mockResolvedValueOnce(fakeRole);
    (prismaMock.user!.create as jest.Mock).mockImplementationOnce(async ({ data }) => data);

    const result = await usersService.create(dto);

    expect(prismaMock.role!.findUnique).toHaveBeenCalledWith({ where: { name: 'user' } });
    expect(prismaMock.user!.create).toHaveBeenCalledTimes(1);
    expect(result.email).toBe(dto.email);
    expect(result.roleId).toBe(fakeRole.id);
    expect(await bcrypt.compare(dto.password, result.passwordHash)).toBe(true);
  });

  it('findAll should delegate to prisma.user.findMany', async () => {
    (prismaMock.user!.findMany as jest.Mock).mockResolvedValueOnce([]);
    const result = await usersService.findAll();
    expect(prismaMock.user!.findMany).toHaveBeenCalledWith({
      include: { role: true, patientProfile: true },
    });
    expect(result).toEqual([]);
  });

  it('findOne should delegate to prisma.user.findUnique', async () => {
    (prismaMock.user!.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await usersService.findOne(1);
    expect(prismaMock.user!.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { role: true, patientProfile: true },
    });
  });

  it('findByEmail should delegate to prisma.user.findUnique', async () => {
    const email = 'user@example.com';
    await usersService.findByEmail(email);
    expect(prismaMock.user!.findUnique).toHaveBeenCalledWith({
      where: { email },
      include: { role: true },
    });
  });

  it('update should delegate to prisma.user.update', async () => {
    const dto = { isActive: false } as any;
    await usersService.update(1, dto);
    expect(prismaMock.user!.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: dto.isActive },
    });
  });

  it('remove should delegate to prisma.user.delete', async () => {
    await usersService.remove(1);
    expect(prismaMock.user!.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});


