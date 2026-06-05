import { EMPLOYEE_STATUS } from '../constants';
import type { EmployeeStatus } from '../types';

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  const isActive = status === EMPLOYEE_STATUS.ACTIVE;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
