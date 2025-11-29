import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  create(file: Express.Multer.File, ownerTable: string, ownerId: number, createdByUserId: number, category?: string) {
    return this.prisma.attachment.create({
      data: {
        ownerTable,
        ownerId: BigInt(ownerId),
        fileName: file.originalname,
        mimeType: file.mimetype,
        category,
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
