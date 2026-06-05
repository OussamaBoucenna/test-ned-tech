import { API_ROUTES } from '../constants';
import { httpClient } from './httpClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export const authService = {
  login(email: string, password: string): Promise<{ user: AuthUser }> {
    return httpClient.post<{ user: AuthUser }>(API_ROUTES.LOGIN, { email, password });
  },

  logout(): Promise<{ success: boolean }> {
    return httpClient.post<{ success: boolean }>(API_ROUTES.LOGOUT);
  },

  getCurrentUser(): Promise<AuthUser> {
    return httpClient.get<AuthUser>(API_ROUTES.ME);
  },
};
