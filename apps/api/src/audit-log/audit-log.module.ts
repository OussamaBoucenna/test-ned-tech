import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogController } from './audit-log.controller';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { AuditLogService } from './audit-log.service';

@Module({
  controllers: [AuditLogController],
  providers: [
    AuditLogService,
    AuditLogInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
  exports: [AuditLogService],
})
export class AuditLogModule {}
