import { useEffect, useMemo, useState } from 'react';
import type { EmployeeQuery } from '../types';
import { useDebounce } from './useDebounce';

const DEFAULT_LIMIT = 10;


export function useEmployeeFilters() {
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const debouncedSearch = useDebounce(search, 700);

  // Any filter change sends the user back to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, departmentId, roleId]);

  function changeLimit(nextLimit: number) {
    setLimit(nextLimit);
    setPage(1);
  }

  function reset() {
    setSearch('');
    setDepartmentId('');
    setRoleId('');
    setPage(1);
  }

  const hasActiveFilters = search !== '' || departmentId !== '' || roleId !== '';

  const query = useMemo<EmployeeQuery>(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      departmentId: departmentId || undefined,
      roleId: roleId || undefined,
    }),
    [page, limit, debouncedSearch, departmentId, roleId],
  );

  return {
    // Raw UI state (bound to the inputs)
    search,
    setSearch,
    departmentId,
    setDepartmentId,
    roleId,
    setRoleId,
    limit,
    setLimit: changeLimit,
    setPage,
    reset,
    hasActiveFilters,
    // Resolved query for useEmployees
    query,
  };
}
