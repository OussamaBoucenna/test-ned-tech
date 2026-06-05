import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';
import type { EmployeeQuery } from '../types';

/**
 * Fetches the paginated employee list for the given query.
 * `keepPreviousData` keeps the table populated while the next page loads.
 */
export function useEmployees(query: EmployeeQuery) {
  return useQuery({
    queryKey: ['employees', query],
    queryFn: () => employeeService.list(query),
    placeholderData: (previous) => previous,
  });
}
