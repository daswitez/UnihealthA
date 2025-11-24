import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

describe('PatientsController', () => {
  let controller: PatientsController;

  const patientsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: patientsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to PatientsService.create with userId from request', async () => {
    const dto: any = { firstName: 'Jane' };
    const req: any = { user: { userId: 5 } };

    await controller.create(dto, req);

    expect(patientsServiceMock.create).toHaveBeenCalledWith(dto, 5);
  });

  it('findAll should delegate to PatientsService.findAll', async () => {
    await controller.findAll();
    expect(patientsServiceMock.findAll).toHaveBeenCalled();
  });

  it('findOne should delegate to PatientsService.findOne', async () => {
    await controller.findOne('1');
    expect(patientsServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('update should delegate to PatientsService.update', async () => {
    const dto: any = { firstName: 'Jane' };
    await controller.update('1', dto);
    expect(patientsServiceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove should delegate to PatientsService.remove', async () => {
    await controller.remove('1');
    expect(patientsServiceMock.remove).toHaveBeenCalledWith(1);
  });
});


