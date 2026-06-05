import { useEffect, useMemo, useState } from 'react';
import type { AuditLogAction, AuditLogQuery, AuditLogStatus } from '../types';
import { useDebounce } from './useDebounce';

const DEFAULT_LIMIT = 10;

export function useAuditLogFilters() {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState<AuditLogAction | ''>('');
  const [status, setStatus] = useState<AuditLogStatus | ''>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const debouncedSearch = useDebounce(search, 700);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, action, status]);

  function changeLimit(nextLimit: number) {
    setLimit(nextLimit);
    setPage(1);
  }

  function reset() {
    setSearch('');
    setAction('');
    setStatus('');
    setPage(1);
  }

  const hasActiveFilters = search !== '' || action !== '' || status !== '';

  const query = useMemo<AuditLogQuery>(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      action: action || undefined,
      status: status || undefined,
    }),
    [page, limit, debouncedSearch, action, status],
  );

  return {
    search,
    setSearch,
    action,
    setAction,
    status,
    setStatus,
    limit,
    setLimit: changeLimit,
    setPage,
    reset,
    hasActiveFilters,
    query,
  };
}
