import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const AUDIT_LOG_ACTIONS = ['POST', 'PATCH', 'PUT', 'DELETE'] as const;
const AUDIT_LOG_STATUSES = ['SUCCESS', 'FAILURE'] as const;

export class QueryAuditLogDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsIn(AUDIT_LOG_ACTIONS)
  action?: (typeof AUDIT_LOG_ACTIONS)[number];

  @IsOptional()
  @IsIn(AUDIT_LOG_STATUSES)
  status?: (typeof AUDIT_LOG_STATUSES)[number];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
