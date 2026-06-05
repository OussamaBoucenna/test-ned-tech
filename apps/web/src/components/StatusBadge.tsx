import { EMPLOYEE_STATUS } from '../constants';
import type { EmployeeStatus } from '../types';

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  const isActive = status === EMPLOYEE_STATUS.ACTIVE;
  return (
    <span className={`badge badge--${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
