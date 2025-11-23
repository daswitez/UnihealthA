import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';

describe('AlertsService', () => {
  let alertsService: AlertsService;

  const prismaMock: Partial<PrismaService> = {
    alert: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    } as any,
  };

  const queueMock: Partial<Queue> = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: 'BullQueue_alerts', useValue: queueMock },
      ],
    }).compile();

    alertsService = module.get<AlertsService>(AlertsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(alertsService).toBeDefined();
  });

  it('create should persist alert and enqueue notification job', async () => {
    const dto = {
      patientId: 1,
      typeId: 2,
      latitude: 1.23,
      longitude: 4.56,
      description: 'Test alert',
    } as any;

    const createdAlert = {
      id: BigInt(10),
      patient: {
        patientProfile: { firstName: 'John', lastName: 'Doe' },
      },
      type: { name: 'FALL' },
      latitude: dto.latitude,
      longitude: dto.longitude,
    };

    (prismaMock.alert!.create as jest.Mock).mockResolvedValueOnce(createdAlert);

    const result = await alertsService.create(dto);

    expect(prismaMock.alert!.create).toHaveBeenCalledTimes(1);
    expect(queueMock.add).toHaveBeenCalledTimes(1);
    expect(queueMock.add).toHaveBeenCalledWith('new-alert', {
      alertId: Number(createdAlert.id),
      patientName: 'John Doe',
      type: createdAlert.type?.name,
      location: { lat: createdAlert.latitude, lng: createdAlert.longitude },
    });
    expect(result).toBe(createdAlert);
  });

  it('findAll should delegate to prisma.alert.findMany', async () => {
    (prismaMock.alert!.findMany as jest.Mock).mockResolvedValueOnce([]);
    const result = await alertsService.findAll();
    expect(prismaMock.alert!.findMany).toHaveBeenCalledWith({
      include: { patient: true, type: true, assignedTo: true },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([]);
  });

  it('findOne should delegate to prisma.alert.findUnique', async () => {
    await alertsService.findOne(1);
    expect(prismaMock.alert!.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { patient: true, type: true, assignedTo: true, events: true },
    });
  });

  it('update should delegate to prisma.alert.update', async () => {
    const dto = { status: 'resuelta', assignedToId: 2 } as any;
    await alertsService.update(1, dto);
    expect(prismaMock.alert!.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        status: dto.status,
        assignedToId: dto.assignedToId,
        resolvedAt: expect.any(Date),
      },
    });
  });

  it('assign should delegate to prisma.alert.update with nurse id and status en curso', async () => {
    await alertsService.assign(1, 3);
    expect(prismaMock.alert!.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        assignedToId: 3,
        status: 'en curso',
      },
    });
  });
});


