import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { NotFoundException, StreamableFile } from '@nestjs/common';

describe('AttachmentsController', () => {
  let controller: AttachmentsController;

  const attachmentsServiceMock = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentsController],
      providers: [
        { provide: AttachmentsService, useValue: attachmentsServiceMock },
      ],
    }).compile();

    controller = module.get<AttachmentsController>(AttachmentsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('uploadFile should delegate to AttachmentsService.create', async () => {
    const file: any = { originalname: 'file.txt' };
    const body: any = { ownerTable: 'clinical_record', ownerId: '1' };
    const req: any = { user: { userId: 3 } };

    await controller.uploadFile(file, body, req);

    expect(attachmentsServiceMock.create).toHaveBeenCalledWith(
      file,
      'clinical_record',
      1,
      3,
    );
  });

  it('findOne should throw NotFoundException when attachment does not exist', async () => {
    (attachmentsServiceMock.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      controller.findOne('1', { set: jest.fn() } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findOne should return StreamableFile when attachment exists', async () => {
    (attachmentsServiceMock.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      storagePath: 'dummy',
      mimeType: 'text/plain',
      fileName: 'file.txt',
    });

    const res: any = { set: jest.fn() };
    const result = await controller.findOne('1', res);

    expect(res.set).toHaveBeenCalled();
    expect(result).toBeInstanceOf(StreamableFile);
  });
});


