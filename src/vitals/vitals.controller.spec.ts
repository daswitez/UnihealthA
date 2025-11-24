import { Test, TestingModule } from '@nestjs/testing';
import { VitalsController } from './vitals.controller';
import { VitalsService } from './vitals.service';

describe('VitalsController', () => {
  let controller: VitalsController;

  const serviceMock = {
    create: jest.fn(),
    findAllByPatient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VitalsController],
      providers: [{ provide: VitalsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<VitalsController>(VitalsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to VitalsService.create using userId from request', async () => {
    const dto: any = { patientId: 1 };
    const req: any = { user: { userId: 4 } };

    await controller.create(dto, req);

    expect(serviceMock.create).toHaveBeenCalledWith(dto, 4);
  });

  it('findAllByPatient should delegate to VitalsService.findAllByPatient', async () => {
    await controller.findAllByPatient('1');
    expect(serviceMock.findAllByPatient).toHaveBeenCalledWith(1);
  });

  it('findMyHistory should call findAllByPatient with req.user.userId', async () => {
    const req: any = { user: { userId: 7 } };
    await controller.findMyHistory(req);
    expect(serviceMock.findAllByPatient).toHaveBeenCalledWith(7);
  });
});


