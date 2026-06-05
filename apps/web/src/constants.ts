/** Shared constants — defined once and reused across the app. */

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
} as const;

export const API_ROUTES = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  EMPLOYEES: '/employees',
} as const;

export const EMPLOYEE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
