import type { AuditLogAction, AuditLogStatus } from '../types';
import { AuditLogTable } from '../components/AuditLogTable';
import { TablePagination } from '../components/TablePagination';
import { useAuditLogFilters } from '../hooks/useAuditLogFilters';
import { useAuditLogs } from '../hooks/useAuditLogs';

export function LogsPage() {
  const filters = useAuditLogFilters();
  const { data } = useAuditLogs(filters.query);

  const isEmpty = data && data.items.length === 0;
  const failures = data?.items.filter((entry) => entry.status === 'FAILURE').length ?? 0;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
          Audit Trail
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white">Activity Logs</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-400">
          Trace create, update, delete and authentication activity across the API.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <LogStatCard label="Visible events" value={String(data?.items.length ?? 0)} accent="cyan" />
        <LogStatCard label="Total events" value={String(data?.meta.total ?? 0)} accent="amber" />
        <LogStatCard label="Failures on page" value={String(failures)} accent="rose" />
      </div>

      <div className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-slate-900/65 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur md:flex-row md:p-5">
        <div className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by user, route or error"
            value={filters.search}
            onChange={(event) => filters.setSearch(event.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <select
          className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/50 md:min-w-40"
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
          className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/50 md:min-w-40"
          value={filters.status}
          onChange={(event) => filters.setStatus(toStatusFilter(event.target.value))}
        >
          <option value="">All statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
        </select>

        <button
          className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={filters.reset}
          disabled={!filters.hasActiveFilters}
        >
          Reset
        </button>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/65 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur">
        {isEmpty ? (
          <p className="px-6 py-16 text-center text-sm text-slate-400">
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

function LogStatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'cyan' | 'amber' | 'rose';
}) {
  const accentClass =
    accent === 'cyan'
      ? 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100'
      : accent === 'amber'
        ? 'border-amber-300/20 bg-amber-300/10 text-amber-100'
        : 'border-rose-300/20 bg-rose-400/10 text-rose-100';

  return (
    <div className={`rounded-[26px] border px-5 py-4 ${accentClass}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">{label}</div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
