import { Module } from '@nestjs/common';
import { KiosksService } from './kiosks.service';
import { KiosksController } from './kiosks.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [KiosksController],
  providers: [KiosksService, PrismaService],
  exports: [KiosksService],
})
export class KiosksModule {}
