/** Shared constants — defined once and reused across the app. */

export const ROUTES = {
  LOGIN: '/login',
  // Protected app pages (rendered inside the AppLayout shell).
  EMPLOYEES: '/employees',
  LOGS: '/logs',
} as const;

export const API_ROUTES = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  EMPLOYEES: '/employees',
  AUDIT_LOGS: '/activity',
  DEPARTMENTS: '/departments',
  ROLES: '/roles',
} as const;

export const EMPLOYEE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
