import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a message indicating notification was added', () => {
      const dto: any = { title: 'Test', message: 'Test message' };
      const result = service.create(dto);
      expect(result).toBe('This action adds a new notification');
    });
  });

  describe('findAll', () => {
    it('should return a message indicating all notifications', () => {
      const result = service.findAll();
      expect(result).toBe('This action returns all notifications');
    });
  });

  describe('findOne', () => {
    it('should return a message with the notification id', () => {
      const result = service.findOne(1);
      expect(result).toBe('This action returns a #1 notification');
    });

    it('should include the correct id in the message', () => {
      const result = service.findOne(42);
      expect(result).toBe('This action returns a #42 notification');
    });
  });

  describe('update', () => {
    it('should return a message indicating update with id', () => {
      const dto: any = { message: 'Updated' };
      const result = service.update(1, dto);
      expect(result).toBe('This action updates a #1 notification');
    });
  });

  describe('remove', () => {
    it('should return a message indicating removal with id', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 notification');
    });
  });
});
