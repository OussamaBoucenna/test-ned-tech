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
    const { page, limit, userId, action, status, search, from, to } = query;
    const where = this.buildWhereClause({
      userId,
      action,
      status,
      search,
      from,
      to,
    });

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private buildWhereClause(filters: {
    userId?: string;
    action?: string;
    status?: 'SUCCESS' | 'FAILURE';
    search?: string;
    from?: string;
    to?: string;
  }): Prisma.AuditLogWhereInput {
    const createdAt = this.buildCreatedAtFilter(filters.from, filters.to);

    return {
      ...(filters.userId ? { userId: filters.userId } : {}),
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(createdAt ? { createdAt } : {}),
      ...(filters.search
        ? {
            OR: [
              { userEmail: { contains: filters.search, mode: 'insensitive' } },
              { resource: { contains: filters.search, mode: 'insensitive' } },
              { errorMsg: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }

  private buildCreatedAtFilter(from?: string, to?: string): Prisma.DateTimeFilter | undefined {
    if (!from && !to) {
      return undefined;
    }

    return {
      ...(from ? { gte: this.toDateBoundary(from, 'start') } : {}),
      ...(to ? { lte: this.toDateBoundary(to, 'end') } : {}),
    };
  }

  private toDateBoundary(value: string, boundary: 'start' | 'end'): Date {
    if (value.length > 10) {
      return new Date(value);
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    if (boundary === 'end') {
      date.setUTCHours(23, 59, 59, 999);
    }
    return date;
  }
}
