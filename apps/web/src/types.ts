import { EMPLOYEE_STATUS } from './constants';

export type EmployeeStatus = (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS];

/** A named lookup item (department or role) — powers the front-end selects. */
export interface CatalogueItem {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  departmentId: string;
  roleId: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
  // Names included by the API for display (see employees.repository INCLUDE).
  department: CatalogueItem;
  role: CatalogueItem;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export type AuditLogAction = 'POST' | 'PATCH' | 'PUT' | 'DELETE';
export type AuditLogStatus = 'SUCCESS' | 'FAILURE';

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: AuditLogAction;
  resource: string;
  payload: unknown;
  status: AuditLogStatus;
  errorMsg: string | null;
  duration: number | null;
  createdAt: string;
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  userId?: string;
  action?: AuditLogAction;
  status?: AuditLogStatus;
  search?: string;
  from?: string;
  to?: string;
}

export interface EmployeeQuery {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  roleId?: string;
}

/** Body sent when creating/updating an employee (FK ids, not nested objects). */
export interface EmployeeInput {
  fullName: string;
  email: string;
  departmentId: string;
  roleId: string;
  status: EmployeeStatus;
}
