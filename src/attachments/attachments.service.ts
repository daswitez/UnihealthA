import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  create(file: Express.Multer.File, ownerTable: string, ownerId: number, createdByUserId: number) {
    return this.prisma.attachment.create({
      data: {
        ownerTable,
        ownerId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        storagePath: file.path,
        sizeBytes: file.size,
        createdById: createdByUserId,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.attachment.findUnique({
      where: { id },
    });
  }
}
