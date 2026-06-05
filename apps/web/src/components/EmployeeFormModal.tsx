import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EMPLOYEE_STATUS } from '../constants';
import { useDepartments, useRoles } from '../hooks/useCatalogue';
import { employeeSchema } from '../schemas/employeeSchema';
import type { EmployeeFormValues } from '../schemas/employeeSchema';
import type { Employee } from '../types';
import { Modal } from './Modal';

interface EmployeeFormModalProps {
  isOpen: boolean;
  employee: Employee | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
}

const EMPTY_VALUES: EmployeeFormValues = {
  fullName: '',
  email: '',
  departmentId: '',
  roleId: '',
  status: EMPLOYEE_STATUS.ACTIVE,
};

export function EmployeeFormModal({
  isOpen,
  employee,
  isSubmitting,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const { data: departments = [] } = useDepartments();
  const { data: roles = [] } = useRoles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!isOpen) return;

    reset(
      employee
        ? {
            fullName: employee.fullName,
            email: employee.email,
            departmentId: employee.departmentId,
            roleId: employee.roleId,
            status: employee.status,
          }
        : EMPTY_VALUES,
    );
  }, [isOpen, employee, reset]);

  return (
    <Modal
      isOpen={isOpen}
      title={employee ? 'Edit Employee' : 'Add Employee'}
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-300">
            Full Name
          </label>
          <input
            id="fullName"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-sm text-rose-300">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-rose-300">{errors.email.message}</p>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="departmentId" className="text-sm font-medium text-slate-300">
              Department
            </label>
            <select
              id="departmentId"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
              {...register('departmentId')}
            >
              <option value="">Select...</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="text-sm text-rose-300">{errors.departmentId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="roleId" className="text-sm font-medium text-slate-300">
              Role
            </label>
            <select
              id="roleId"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
              {...register('roleId')}
            >
              <option value="">Select...</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && <p className="text-sm text-rose-300">{errors.roleId.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-slate-300">
            Status
          </label>
          <select
            id="status"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
            {...register('status')}
          >
            <option value={EMPLOYEE_STATUS.ACTIVE}>Active</option>
            <option value={EMPLOYEE_STATUS.INACTIVE}>Inactive</option>
          </select>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/8"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_30px_rgba(252,211,77,0.22)] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : employee ? 'Save changes' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
