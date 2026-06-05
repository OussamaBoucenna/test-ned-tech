import type { CatalogueItem } from '../types';

interface EmployeeToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  departments: CatalogueItem[];
  onReset: () => void;
  canReset: boolean;
}


export function EmployeeToolbar({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  departments,
  onReset,
  canReset,
}: EmployeeToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar__search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="toolbar__select"
        value={departmentId}
        onChange={(e) => onDepartmentChange(e.target.value)}
      >
        <option value="">All departments</option>
        {departments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>

      <button className="toolbar__reset" onClick={onReset} disabled={!canReset}>
        Reset
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
