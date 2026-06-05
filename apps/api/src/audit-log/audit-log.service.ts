import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

export interface CreateAuditLogInput {
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  payload?: Record<string, unknown>;
  status: 'SUCCESS' | 'FAILURE';
  errorMsg?: string;
  duration?: number;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(input: CreateAuditLogInput): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: input.userId,
          userEmail: input.userEmail,
          action: input.action,
          resource: input.resource,
          payload: (input.payload ?? Prisma.JsonNull) as Prisma.InputJsonValue,
          status: input.status,
          errorMsg: input.errorMsg,
          duration: input.duration,
        },
      });
    } catch (error) {
      this.logger.error('Failed to write audit log', error as Error);
    }
  }

  async findAll(query: QueryAuditLogDto) {
    const { page, limit } = query;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
