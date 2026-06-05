import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

interface LoginVariables {
  email: string;
  password: string;
}


export function useLogin() {
  const { setUser } = useAuth();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ email, password }: LoginVariables) =>
      authService.login(email, password),
    onSuccess: ({ user }) => {
      setUser(user);
      toast.success('Welcome back!');
    },
  });
}

export function useLogout() {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUser(null);
      // Drop cached employee data so the next session starts clean.
      queryClient.clear();
    },
  });
}
