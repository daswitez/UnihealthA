import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

describe('AlertsController', () => {
  let controller: AlertsController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    assign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [{ provide: AlertsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to AlertsService.create', async () => {
    const dto: any = { patientId: 1, typeId: 1 };
    await controller.create(dto);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('findAll should delegate to AlertsService.findAll', async () => {
    await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('findOne should delegate to AlertsService.findOne', async () => {
    await controller.findOne('5');
    expect(serviceMock.findOne).toHaveBeenCalledWith(5);
  });

  it('update should delegate to AlertsService.update', async () => {
    const dto: any = { status: 'resuelta' };
    await controller.update('5', dto);
    expect(serviceMock.update).toHaveBeenCalledWith(5, dto);
  });

  it('assign should use req.user.userId and delegate to AlertsService.assign', async () => {
    const req: any = { user: { userId: 9 } };
    await controller.assign('3', req);
    expect(serviceMock.assign).toHaveBeenCalledWith(3, 9);
  });
});


