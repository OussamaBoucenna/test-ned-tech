import { API_ROUTES } from '../constants';
import type { Employee, EmployeeInput, EmployeeQuery, Paginated } from '../types';
import { httpClient } from './httpClient';

export const employeeService = {
  list(query: EmployeeQuery): Promise<Paginated<Employee>> {
    return httpClient.get<Paginated<Employee>>(API_ROUTES.EMPLOYEES, query);
  },

  create(input: EmployeeInput): Promise<Employee> {
    return httpClient.post<Employee>(API_ROUTES.EMPLOYEES, input);
  },

  update(id: string, input: Partial<EmployeeInput>): Promise<Employee> {
    return httpClient.patch<Employee>(`${API_ROUTES.EMPLOYEES}/${id}`, input);
  },

  remove(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ROUTES.EMPLOYEES}/${id}`);
  },
};
