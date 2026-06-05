import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { employeeService } from '../services/employeeService';
import type { EmployeeInput, EmployeeQuery } from '../types';

const EMPLOYEES_KEY = ['employees'] as const;

export function useEmployees(query: EmployeeQuery) {
  return useQuery({
    queryKey: ['employees', query],
    queryFn: () => employeeService.list(query),
    placeholderData: (previous) => previous,
  });
}


function useInvalidateEmployees() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
}

export function useCreateEmployee() {
  const invalidate = useInvalidateEmployees();
  const toast = useToast();
  return useMutation({
    mutationFn: (input: EmployeeInput) => employeeService.create(input),
    onSuccess: () => {
      invalidate();
      toast.success('Employee created');
    },
  });
}

export function useUpdateEmployee() {
  const invalidate = useInvalidateEmployees();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EmployeeInput> }) =>
      employeeService.update(id, input),
    onSuccess: () => {
      invalidate();
      toast.success('Employee updated');
    },
  });
}

export function useDeleteEmployee() {
  const invalidate = useInvalidateEmployees();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => employeeService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success('Employee deleted');
    },
  });
}
