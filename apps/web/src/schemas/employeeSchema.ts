import { z } from 'zod';
import { EMPLOYEE_STATUS } from '../constants';

export const employeeSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  departmentId: z.string().min(1, 'Department is required'),
  roleId: z.string().min(1, 'Role is required'),
  status: z.enum([EMPLOYEE_STATUS.ACTIVE, EMPLOYEE_STATUS.INACTIVE]),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
