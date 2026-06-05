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
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Resource</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{DATE_TIME_FORMATTER.format(new Date(log.createdAt))}</td>
              <td>
                <div className="log-user">
                  <strong>{log.userEmail ?? 'Anonymous'}</strong>
                  <span className="table__id">{shortId(log.userId ?? log.id)}</span>
                </div>
              </td>
              <td>{log.action}</td>
              <td className="table__resource">{log.resource}</td>
              <td>
                <span
                  className={`badge ${
                    log.status === 'SUCCESS' ? 'badge--success' : 'badge--failure'
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td>{log.duration !== null ? `${log.duration} ms` : '-'}</td>
              <td className="table__details">{toDetailsPreview(log)}</td>
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
