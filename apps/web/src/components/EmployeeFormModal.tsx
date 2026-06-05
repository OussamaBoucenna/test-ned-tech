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
  /** Present → edit mode (pre-filled); absent → create mode. */
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

  // Re-seed the form whenever the modal opens (pre-fill on edit, clear on create).
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
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form__field">
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" {...register('fullName')} />
          {errors.fullName && <p className="form__error">{errors.fullName.message}</p>}
        </div>

        <div className="form__field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p className="form__error">{errors.email.message}</p>}
        </div>

        <div className="form__row">
          <div className="form__field">
            <label htmlFor="departmentId">Department</label>
            <select id="departmentId" {...register('departmentId')}>
              <option value="">Select…</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="form__error">{errors.departmentId.message}</p>
            )}
          </div>

          <div className="form__field">
            <label htmlFor="roleId">Role</label>
            <select id="roleId" {...register('roleId')}>
              <option value="">Select…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.roleId && <p className="form__error">{errors.roleId.message}</p>}
          </div>
        </div>

        <div className="form__field">
          <label htmlFor="status">Status</label>
          <select id="status" {...register('status')}>
            <option value={EMPLOYEE_STATUS.ACTIVE}>Active</option>
            <option value={EMPLOYEE_STATUS.INACTIVE}>Inactive</option>
          </select>
        </div>

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : employee ? 'Save changes' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
