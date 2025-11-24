import { AuditInterceptor } from './audit.interceptor';
import { AuditService } from './audit.service';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('AuditInterceptor', () => {
  const auditServiceMock = {
    log: jest.fn(),
  } as unknown as AuditService;

  const interceptor = new AuditInterceptor(auditServiceMock);

  const createExecutionContext = (method: string, user: any = null, routePath = '/patients/:id', params: any = {}, body: any = {}, ip = '127.0.0.1'): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () =>
          ({
            method,
            user,
            route: { path: routePath },
            params,
            body,
            ip,
          } as any),
      }),
    } as any);

  const createCallHandler = (response: any): CallHandler => ({
    handle: () => of(response),
  });

  beforeEach(() => {
    (auditServiceMock.log as jest.Mock).mockReset();
  });

  it('should bypass non mutating methods (GET)', (done) => {
    const ctx = createExecutionContext('GET');
    const next = createCallHandler({ ok: true });

    interceptor.intercept(ctx, next).subscribe({
      next: () => {
        expect(auditServiceMock.log).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should call auditService.log for mutating methods (POST)', (done) => {
    const user = { userId: 10 };
    const body = { foo: 'bar' };
    const response = { id: 5 };
    const ctx = createExecutionContext('POST', user, '/patients/:id', { id: '5' }, body);
    const next = createCallHandler(response);

    interceptor.intercept(ctx, next).subscribe({
      next: () => {
        expect(auditServiceMock.log).toHaveBeenCalledTimes(1);
        expect(auditServiceMock.log).toHaveBeenCalledWith(
          user.userId,
          'POST',
          'patients',
          '5',
          body,
          '127.0.0.1',
        );
        done();
      },
    });
  });
});


