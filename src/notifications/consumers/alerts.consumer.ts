import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('alerts')
export class AlertsConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`[AlertsConsumer] Procesando alerta ${job.id}...`);
    console.log('Datos:', job.data);
    
    // Simular envío de notificación (email/push)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`[AlertsConsumer] Alerta ${job.data.alertId} notificada a personal cercano.`);
    return { sent: true, recipient: 'nurses@unihealth.com' };
  }
}
