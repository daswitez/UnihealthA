import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, Body, UseGuards, Request, Res, StreamableFile, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createReadStream } from 'fs';
import { join } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: { ownerTable: string; ownerId: string }, @Request() req) {
    return this.attachmentsService.create(file, body.ownerTable, +body.ownerId, req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res({ passthrough: true }) res) {
    const attachment = await this.attachmentsService.findOne(+id);
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }
    const file = createReadStream(join(process.cwd(), attachment.storagePath));
    res.set({
      'Content-Type': attachment.mimeType,
      'Content-Disposition': `attachment; filename="${attachment.fileName}"`,
    });
    return new StreamableFile(file);
  }
}
