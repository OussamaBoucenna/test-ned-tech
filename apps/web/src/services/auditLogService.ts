import { API_ROUTES } from '../constants';
import type { AuditLog, AuditLogQuery, Paginated } from '../types';
import { httpClient } from './httpClient';

export const auditLogService = {
  list(query: AuditLogQuery): Promise<Paginated<AuditLog>> {
    return httpClient.get<Paginated<AuditLog>>(API_ROUTES.AUDIT_LOGS, query);
  },
};
