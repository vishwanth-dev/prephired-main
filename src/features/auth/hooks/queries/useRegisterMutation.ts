'use client';

import { useMutation } from '@tanstack/react-query';
import { RegisterForm } from '@/features/auth/domain/entities';
import { useAuthStore } from '@/features/auth/store/authStore';

export const useRegisterMutation = () => {
  const register = useAuthStore(state => state.register);

  return useMutation({
    mutationFn: (form: RegisterForm) => register(form),
    onError: error => {
      console.error('Registration failed:', error);
    },
  });
};
