import type { AuditLog } from '../types';

interface AuditLogTableProps {
  logs: AuditLog[];
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse">
        <thead className="bg-white/5">
          <tr>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Timestamp
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              User
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Action
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Resource
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Status
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Duration
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-white/8 transition hover:bg-white/[0.03]">
              <td className="px-5 py-4 text-sm text-slate-200">
                {DATE_TIME_FORMATTER.format(new Date(log.createdAt))}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-col gap-1">
                  <strong className="text-sm text-white">{log.userEmail ?? 'Anonymous'}</strong>
                  <span className="font-mono text-xs text-slate-500">
                    {shortId(log.userId ?? log.id)}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-cyan-100">
                  {log.action}
                </span>
              </td>
              <td className="max-w-[260px] px-5 py-4 font-mono text-xs text-slate-400">
                {log.resource}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    log.status === 'SUCCESS'
                      ? 'bg-emerald-500/15 text-emerald-200'
                      : 'bg-rose-500/15 text-rose-200'
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-slate-300">
                {log.duration !== null ? `${log.duration} ms` : '-'}
              </td>
              <td className="max-w-[320px] px-5 py-4 font-mono text-xs leading-5 text-slate-400">
                {toDetailsPreview(log)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function shortId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

function toDetailsPreview(log: AuditLog): string {
  if (log.errorMsg) {
    return log.errorMsg;
  }

  if (!log.payload) {
    return 'No payload';
  }

  const serializedPayload = JSON.stringify(log.payload);
  if (!serializedPayload) {
    return 'No payload';
  }

  return serializedPayload.length > 96
    ? `${serializedPayload.slice(0, 93)}...`
    : serializedPayload;
}
