import { useQuery } from '@tanstack/react-query';
import type { AuditLogQuery } from '../types';
import { auditLogService } from '../services/auditLogService';

export function useAuditLogs(query: AuditLogQuery) {
  return useQuery({
    queryKey: ['audit-logs', query],
    queryFn: () => auditLogService.list(query),
    placeholderData: (previous) => previous,
  });
}
