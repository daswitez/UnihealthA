import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'alerts',
    }),
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
