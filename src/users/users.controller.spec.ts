import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to UsersService.create', async () => {
    const dto: any = { email: 'user@example.com', password: 'Password123!' };
    await controller.create(dto);
    expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('findAll should delegate to UsersService.findAll', async () => {
    await controller.findAll();
    expect(usersServiceMock.findAll).toHaveBeenCalled();
  });

  it('findOne should delegate to UsersService.findOne', async () => {
    await controller.findOne('1');
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('update should delegate to UsersService.update', async () => {
    const dto: any = { isActive: false };
    await controller.update('1', dto);
    expect(usersServiceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove should delegate to UsersService.remove', async () => {
    await controller.remove('1');
    expect(usersServiceMock.remove).toHaveBeenCalledWith(1);
  });
});


