import type { Employee } from '../types';
import { StatusBadge } from './StatusBadge';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

function shortId(id: string): string {
  return `#EMP-${id.slice(0, 4).toUpperCase()}`;
}

function initials(fullName: string): string {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse">
        <thead className="bg-white/5">
          <tr>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              ID
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Full Name
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Department
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Role
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Email
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Status
            </th>
            <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t border-white/8 transition hover:bg-white/[0.03]">
              <td className="px-5 py-4 font-mono text-xs text-slate-500">{shortId(employee.id)}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/10 text-xs font-bold text-amber-200">
                    {initials(employee.fullName)}
                  </span>
                  <div className="space-y-1">
                    <strong className="block text-sm font-semibold text-white">{employee.fullName}</strong>
                    <span className="text-xs text-slate-500">{employee.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-slate-200">{employee.department.name}</td>
              <td className="px-5 py-4 text-sm text-slate-300">{employee.role.name}</td>
              <td className="px-5 py-4 text-sm text-slate-400">{employee.email}</td>
              <td className="px-5 py-4">
                <StatusBadge status={employee.status} />
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
                  onClick={() => onEdit(employee)}
                  aria-label={`Edit ${employee.fullName}`}
                >
                  <EditIcon />
                </button>
                <button
                  className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-rose-300/40 hover:text-rose-200"
                  onClick={() => onDelete(employee)}
                  aria-label={`Delete ${employee.fullName}`}
                >
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20h4L18 10l-4-4L4 16v4ZM14 6l4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 7h14M9 7V5h6v2M6 7l1 13h10l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
