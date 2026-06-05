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

/** Section A — the employee table. */
export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Email</th>
            <th>Status</th>
            <th className="table__actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="table__id">{shortId(employee.id)}</td>
              <td>
                <div className="table__name">
                  <span className="avatar" aria-hidden="true">
                    {initials(employee.fullName)}
                  </span>
                  <strong>{employee.fullName}</strong>
                </div>
              </td>
              <td>{employee.department.name}</td>
              <td>{employee.role.name}</td>
              <td className="table__email">{employee.email}</td>
              <td>
                <StatusBadge status={employee.status} />
              </td>
              <td className="table__actions">
                <button
                  className="icon-button"
                  onClick={() => onEdit(employee)}
                  aria-label={`Edit ${employee.fullName}`}
                >
                  <EditIcon />
                </button>
                <button
                  className="icon-button icon-button--danger"
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
