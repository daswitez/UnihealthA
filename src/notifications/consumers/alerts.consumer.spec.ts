import { Test, TestingModule } from '@nestjs/testing';
import { AlertsConsumer } from './alerts.consumer';
import { Job } from 'bullmq';

describe('AlertsConsumer', () => {
  let consumer: AlertsConsumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertsConsumer],
    }).compile();

    consumer = module.get<AlertsConsumer>(AlertsConsumer);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  describe('process', () => {
    it('should process job and return sent status', async () => {
      const mockJob = {
        id: '123',
        data: { alertId: 1, message: 'Test alert' },
      } as unknown as Job<any, any, string>;

      // Mock console.log to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await consumer.process(mockJob);

      expect(result).toEqual({ sent: true, recipient: 'nurses@unihealth.com' });
      expect(consoleSpy).toHaveBeenCalledWith('[AlertsConsumer] Procesando alerta 123...');
      expect(consoleSpy).toHaveBeenCalledWith('Datos:', { alertId: 1, message: 'Test alert' });
      
      consoleSpy.mockRestore();
    }, 10000); // Timeout for the 1s delay in consumer
  });
});
