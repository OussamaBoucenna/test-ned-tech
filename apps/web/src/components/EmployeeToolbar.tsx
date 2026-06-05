import type { CatalogueItem } from '../types';

interface EmployeeToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  roleId: string;
  onRoleChange: (value: string) => void;
  departments: CatalogueItem[];
  roles: CatalogueItem[];
  onReset: () => void;
  canReset: boolean;
}

export function EmployeeToolbar({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  roleId,
  onRoleChange,
  departments,
  roles,
  onReset,
  canReset,
}: EmployeeToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <select
        className="min-h-12 rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/50 md:min-w-52"
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

      <select
        className="min-h-12 rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none transition focus:border-cyan-300/50 md:min-w-52"
        value={roleId}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="">All roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      <button
        className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onReset}
        disabled={!canReset}
      >
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
