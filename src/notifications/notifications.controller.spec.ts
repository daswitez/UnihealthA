import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to NotificationsService.create', async () => {
    const dto: any = { title: 't', message: 'm' };
    await controller.create(dto);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('findAll should delegate to NotificationsService.findAll', async () => {
    await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('findOne should delegate to NotificationsService.findOne', async () => {
    await controller.findOne('1');
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('update should delegate to NotificationsService.update', async () => {
    const dto: any = { message: 'updated' };
    await controller.update('1', dto);
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove should delegate to NotificationsService.remove', async () => {
    await controller.remove('1');
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});


