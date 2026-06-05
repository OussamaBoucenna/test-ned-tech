import { useState } from 'react';
import { EMPLOYEE_STATUS } from '../constants';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmployeeFormModal } from '../components/EmployeeFormModal';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeToolbar } from '../components/EmployeeToolbar';
import { TablePagination } from '../components/TablePagination';
import { useDepartments, useRoles } from '../hooks/useCatalogue';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
  useUpdateEmployee,
} from '../hooks/useEmployees';
import type { EmployeeFormValues } from '../schemas/employeeSchema';
import type { Employee } from '../types';

export function DirectoryPage() {
  const filters = useEmployeeFilters();
  const { data } = useEmployees(filters.query);
  const { data: departments = [] } = useDepartments();
  const { data: roles = [] } = useRoles();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [formState, setFormState] = useState<{ employee: Employee | null } | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const isEmpty = data && data.items.length === 0;
  const activeOnPage =
    data?.items.filter((employee) => employee.status === EMPLOYEE_STATUS.ACTIVE).length ?? 0;

  function handleSubmit(values: EmployeeFormValues) {
    const editing = formState?.employee;
    const mutation = editing
      ? updateEmployee.mutateAsync({ id: editing.id, input: values })
      : createEmployee.mutateAsync(values);

    mutation.then(() => setFormState(null));
  }

  function handleConfirmDelete() {
    if (!employeeToDelete) return;
    deleteEmployee.mutateAsync(employeeToDelete.id).then(() => setEmployeeToDelete(null));
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
            Workforce Directory
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Manage employee records
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Search the directory, edit employee profiles and keep departments aligned
            from one responsive workspace.
          </p>
        </div>

        <button
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-amber-300 px-5 text-sm font-bold text-slate-950 shadow-[0_18px_38px_rgba(252,211,77,0.22)] transition hover:bg-amber-200"
          onClick={() => setFormState({ employee: null })}
        >
          + Add Employee
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Visible records" value={String(data?.items.length ?? 0)} accent="cyan" />
        <StatCard label="Total records" value={String(data?.meta.total ?? 0)} accent="amber" />
        <StatCard label="Active on page" value={String(activeOnPage)} accent="emerald" />
      </div>

      <div className="space-y-4 rounded-[28px] border border-white/10 bg-slate-900/65 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur md:p-5">
        <EmployeeToolbar
          search={filters.search}
          onSearchChange={filters.setSearch}
          departmentId={filters.departmentId}
          onDepartmentChange={filters.setDepartmentId}
          roleId={filters.roleId}
          onRoleChange={filters.setRoleId}
          departments={departments}
          roles={roles}
          onReset={filters.reset}
          canReset={filters.hasActiveFilters}
        />
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/65 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur">
        {isEmpty ? (
          <p className="px-6 py-16 text-center text-sm text-slate-400">
            {filters.hasActiveFilters
              ? 'No employees match your filters.'
              : 'No employees found.'}
          </p>
        ) : (
          <>
            <EmployeeTable
              employees={data?.items ?? []}
              onEdit={(employee) => setFormState({ employee })}
              onDelete={(employee) => setEmployeeToDelete(employee)}
            />
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

      <EmployeeFormModal
        isOpen={formState !== null}
        employee={formState?.employee ?? null}
        isSubmitting={createEmployee.isPending || updateEmployee.isPending}
        onClose={() => setFormState(null)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={employeeToDelete !== null}
        title="Delete employee"
        message={`Are you sure you want to delete ${employeeToDelete?.fullName}? This action cannot be undone.`}
        isConfirming={deleteEmployee.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'cyan' | 'amber' | 'emerald';
}) {
  const accentClass =
    accent === 'cyan'
      ? 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100'
      : accent === 'amber'
        ? 'border-amber-300/20 bg-amber-300/10 text-amber-100'
        : 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100';

  return (
    <div className={`rounded-[26px] border px-5 py-4 ${accentClass}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">{label}</div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
