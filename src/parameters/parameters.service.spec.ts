import { Test, TestingModule } from '@nestjs/testing';
import { ParametersService } from './parameters.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ParametersService', () => {
  let parametersService: ParametersService;

  const prismaMock: Partial<PrismaService> = {
    systemParameter: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParametersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    parametersService = module.get<ParametersService>(ParametersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(parametersService).toBeDefined();
  });

  it('findAll should delegate to prisma.systemParameter.findMany', async () => {
    (prismaMock.systemParameter!.findMany as jest.Mock).mockResolvedValueOnce([]);
    const result = await parametersService.findAll();
    expect(prismaMock.systemParameter!.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('findOne should delegate to prisma.systemParameter.findUnique', async () => {
    await parametersService.findOne('SOME_KEY');
    expect(prismaMock.systemParameter!.findUnique).toHaveBeenCalledWith({
      where: { key: 'SOME_KEY' },
    });
  });

  it('update should upsert the parameter with key and value', async () => {
    await parametersService.update('SOME_KEY', 'SOME_VALUE');
    expect(prismaMock.systemParameter!.upsert).toHaveBeenCalledWith({
      where: { key: 'SOME_KEY' },
      update: { value: 'SOME_VALUE' },
      create: { key: 'SOME_KEY', value: 'SOME_VALUE', description: 'Auto-created' },
    });
  });
});


