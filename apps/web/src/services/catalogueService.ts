import { API_ROUTES } from '../constants';
import type { CatalogueItem } from '../types';
import { httpClient } from './httpClient';

export const catalogueService = {
  listDepartments(): Promise<CatalogueItem[]> {
    return httpClient.get<CatalogueItem[]>(API_ROUTES.DEPARTMENTS);
  },

  listRoles(): Promise<CatalogueItem[]> {
    return httpClient.get<CatalogueItem[]>(API_ROUTES.ROLES);
  },
};
