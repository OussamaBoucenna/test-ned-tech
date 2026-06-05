import { useQuery } from '@tanstack/react-query';
import { catalogueService } from '../services/catalogueService';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => catalogueService.listDepartments(),
    // Catalogues rarely change — cache them for the session.
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => catalogueService.listRoles(),
    staleTime: 5 * 60 * 1000,
  });
}
