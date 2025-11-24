import { Test, TestingModule } from '@nestjs/testing';
import { ParametersController } from './parameters.controller';
import { ParametersService } from './parameters.service';

describe('ParametersController', () => {
  let controller: ParametersController;

  const serviceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParametersController],
      providers: [{ provide: ParametersService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ParametersController>(ParametersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should delegate to ParametersService.findAll', async () => {
    await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('findOne should delegate to ParametersService.findOne', async () => {
    await controller.findOne('KEY');
    expect(serviceMock.findOne).toHaveBeenCalledWith('KEY');
  });

  it('update should delegate to ParametersService.update', async () => {
    await controller.update('KEY', 'VALUE');
    expect(serviceMock.update).toHaveBeenCalledWith('KEY', 'VALUE');
  });
});


