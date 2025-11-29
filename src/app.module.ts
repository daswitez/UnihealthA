import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { ClinicalRecordsModule } from './clinical-records/clinical-records.module';
import { VitalsModule } from './vitals/vitals.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AlertsModule } from './alerts/alerts.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { ParametersModule } from './parameters/parameters.module';
import { AccessModule } from './access/access.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { LoggerModule } from 'nestjs-pino';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './audit/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  singleLine: false,
                },
              }
            : undefined,
        autoLogging: true,
      },
    }),
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    PrismaModule,
    QueueModule,
    UsersModule,
    AuthModule,
    PatientsModule,
    ClinicalRecordsModule,
    VitalsModule,
    AttachmentsModule,
    AlertsModule,
    AppointmentsModule,
    NotificationsModule,
    AuditModule,
    ParametersModule,
    AccessModule,
    MedicalHistoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
