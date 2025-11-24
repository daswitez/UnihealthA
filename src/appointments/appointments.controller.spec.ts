import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [{ provide: AppointmentsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to AppointmentsService.create', async () => {
    const dto: any = { patientId: 1 };
    await controller.create(dto);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('findAll should delegate to AppointmentsService.findAll', async () => {
    await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('findOne should delegate to AppointmentsService.findOne', async () => {
    await controller.findOne('2');
    expect(serviceMock.findOne).toHaveBeenCalledWith(2);
  });

  it('updateStatus should delegate to AppointmentsService.update', async () => {
    const dto: any = { status: 'confirmada' };
    await controller.updateStatus('2', dto);
    expect(serviceMock.update).toHaveBeenCalledWith(2, dto);
  });
});


