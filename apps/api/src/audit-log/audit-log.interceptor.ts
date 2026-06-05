import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';

const LOGGED_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
const REDACTED_FIELDS = new Set([
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
]);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, user, body } = request;

    if (!LOGGED_METHODS.has(method)) {
      return next.handle();
    }

    const startTime = Date.now();
    const base = {
      userId: user?.id,
      userEmail: user?.email ?? this.extractUserEmail(body),
      action: method,
      resource: originalUrl,
      payload: this.sanitize(body),
    };

    return next.handle().pipe(
      tap({
        next: () =>
          void this.auditLogService.record({
            ...base,
            status: 'SUCCESS',
            duration: Date.now() - startTime,
          }),
        error: (error: unknown) =>
          void this.auditLogService.record({
            ...base,
            status: 'FAILURE',
            errorMsg: this.extractErrorMessage(error),
            duration: Date.now() - startTime,
          }),
      }),
    );
  }

  private extractUserEmail(body: unknown): string | undefined {
    if (!body || typeof body !== 'object') {
      return undefined;
    }

    const email = (body as Record<string, unknown>).email;
    return typeof email === 'string' ? email : undefined;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error';
  }

  private sanitize(value: unknown): Record<string, unknown> | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return undefined;
    }

    return this.sanitizeObject(value as Record<string, unknown>);
  }

  private sanitizeObject(input: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = REDACTED_FIELDS.has(key) ? '[REDACTED]' : this.sanitizeValue(value);
    }

    return sanitized;
  }

  private sanitizeValue(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeValue(item));
    }

    if (value && typeof value === 'object') {
      return this.sanitizeObject(value as Record<string, unknown>);
    }

    return value;
  }
}
