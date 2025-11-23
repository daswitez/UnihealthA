import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from './attachments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AttachmentsService', () => {
  let service: AttachmentsService;

  const prismaMock: Partial<PrismaService> = {
    attachment: {
      create: jest.fn(),
      findUnique: jest.fn(),
    } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AttachmentsService>(AttachmentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should delegate to prisma.attachment.create using file metadata', async () => {
    const fakeFile: any = {
      originalname: 'test.txt',
      mimetype: 'text/plain',
      path: '/uploads/test.txt',
      size: 1234,
    };

    await service.create(fakeFile, 'clinical_record', 1, 2);

    expect(prismaMock.attachment!.create).toHaveBeenCalledWith({
      data: {
        ownerTable: 'clinical_record',
        ownerId: 1,
        fileName: fakeFile.originalname,
        mimeType: fakeFile.mimetype,
        storagePath: fakeFile.path,
        sizeBytes: fakeFile.size,
        createdById: 2,
      },
    });
  });

  it('findOne should delegate to prisma.attachment.findUnique', async () => {
    await service.findOne(1);
    expect(prismaMock.attachment!.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});


