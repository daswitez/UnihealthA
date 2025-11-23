import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    // Only log state-changing methods
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        const user = req.user;
        const resource = req.route.path.split('/')[1]; // Simple heuristic
        const action = method;
        const ip = req.ip;
        
        // Try to extract resource ID from response or params
        let resourceId = req.params.id || (data && data.id ? String(data.id) : null);

        this.auditService.log(
          user ? user.userId : null,
          action,
          resource,
          resourceId,
          req.body, // Log request body as details (be careful with passwords!)
          ip
        );
      }),
    );
  }
}
