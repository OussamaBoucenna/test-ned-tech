import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';

const LOGGED_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];
const REDACTED_FIELDS = ['password', 'passwordHash', 'token'];

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, user, body } = request;

    if (!LOGGED_METHODS.includes(method)) {
      return next.handle();
    }

    const startTime = Date.now();
    const base = {
      userId: user?.id,
      userEmail: user?.email,
      action: method,
      resource: originalUrl,
      payload: this.redact(body),
    };

    return next.handle().pipe(
      tap({
        next: () =>
          void this.auditLogService.record({
            ...base,
            status: 'SUCCESS',
            duration: Date.now() - startTime,
          }),
        error: (error: Error) =>
          void this.auditLogService.record({
            ...base,
            status: 'FAILURE',
            errorMsg: error.message,
            duration: Date.now() - startTime,
          }),
      }),
    );
  }

  private redact(body: unknown): Record<string, unknown> | undefined {
    if (!body || typeof body !== 'object') {
      return undefined;
    }
    const clone: Record<string, unknown> = { ...(body as Record<string, unknown>) };
    for (const field of REDACTED_FIELDS) {
      if (field in clone) {
        clone[field] = '[REDACTED]';
      }
    }
    return clone;
  }
}
