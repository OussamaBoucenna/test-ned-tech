import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmployeeFormModal } from '../components/EmployeeFormModal';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeToolbar } from '../components/EmployeeToolbar';
import { TablePagination } from '../components/TablePagination';
import { useDepartments } from '../hooks/useCatalogue';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
  useUpdateEmployee,
} from '../hooks/useEmployees';
import type { EmployeeFormValues } from '../schemas/employeeSchema';
import type { Employee } from '../types';

/**
 * The employee directory: table (A), search & filter (B), create/edit modal (C)
 * and delete confirmation (D). Loading is shown globally (GlobalLoadingBar) and
 * API errors surface as toasts, so this page only owns its own UI state.
 */
export function DirectoryPage() {
  const filters = useEmployeeFilters();
  const { data } = useEmployees(filters.query);
  const { data: departments = [] } = useDepartments();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  // null = form closed; { employee: null } = create; { employee } = edit.
  const [formState, setFormState] = useState<{ employee: Employee | null } | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const isEmpty = data && data.items.length === 0;

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
    <section className="directory">
      <div className="directory__head">
        <EmployeeToolbar
          search={filters.search}
          onSearchChange={filters.setSearch}
          departmentId={filters.departmentId}
          onDepartmentChange={filters.setDepartmentId}
          departments={departments}
          onReset={filters.reset}
          canReset={filters.hasActiveFilters}
        />
        <button
          className="btn btn--primary directory__add"
          onClick={() => setFormState({ employee: null })}
        >
          + Add Employee
        </button>
      </div>

      <div className="card">
        {isEmpty ? (
          <p className="empty">
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
