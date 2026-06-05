import type { AuditLogAction, AuditLogStatus } from '../types';
import { AuditLogTable } from '../components/AuditLogTable';
import { TablePagination } from '../components/TablePagination';
import { useAuditLogFilters } from '../hooks/useAuditLogFilters';
import { useAuditLogs } from '../hooks/useAuditLogs';

export function LogsPage() {
  const filters = useAuditLogFilters();
  const { data } = useAuditLogs(filters.query);

  const isEmpty = data && data.items.length === 0;

  return (
    <section className="logs">
      <div className="logs__head">
        <h2 className="logs__title">Activity Logs</h2>
        <p className="logs__subtitle">
          Trace create, update, delete and authentication activity across the API.
        </p>
      </div>

      <div className="toolbar">
        <div className="toolbar__search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by user, route or error"
            value={filters.search}
            onChange={(event) => filters.setSearch(event.target.value)}
          />
        </div>

        <select
          className="toolbar__select"
          value={filters.action}
          onChange={(event) => filters.setAction(toActionFilter(event.target.value))}
        >
          <option value="">All actions</option>
          <option value="POST">POST</option>
          <option value="PATCH">PATCH</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <select
          className="toolbar__select"
          value={filters.status}
          onChange={(event) => filters.setStatus(toStatusFilter(event.target.value))}
        >
          <option value="">All statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
        </select>

        <button className="toolbar__reset" onClick={filters.reset} disabled={!filters.hasActiveFilters}>
          Reset
        </button>
      </div>

      <div className="card">
        {isEmpty ? (
          <p className="empty">
            {filters.hasActiveFilters
              ? 'No audit log matches your filters.'
              : 'No audit log recorded yet.'}
          </p>
        ) : (
          <>
            <AuditLogTable logs={data?.items ?? []} />
            <TablePagination
              page={data?.meta.page ?? filters.query.page ?? 1}
              totalPages={data?.meta.totalPages ?? 1}
              limit={filters.limit}
              onPageChange={filters.setPage}
              onLimitChange={filters.setLimit}
            />
          </>
        )}
      </div>
    </section>
  );
}

function toActionFilter(value: string): AuditLogAction | '' {
  if (value === 'POST' || value === 'PATCH' || value === 'PUT' || value === 'DELETE') {
    return value;
  }
  return '';
}

function toStatusFilter(value: string): AuditLogStatus | '' {
  if (value === 'SUCCESS' || value === 'FAILURE') {
    return value;
  }
  return '';
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
