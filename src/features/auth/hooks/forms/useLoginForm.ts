'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormInput } from '../../schema';
import { useAuthStore } from '@/features/auth/store/authStore';

export const useLoginForm = () => {
  const { login, loading, error } = useAuthStore();

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await login({
        email: data.emailOrPhone,
        password: data.password,
      });
      // Redirect logic handled by auth store or router
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      } else {
        console.error('Login failed:', error);
      }
      console.error('Login failed:', error);
      // Handle error state
    }
  };

  return { form, onSubmit, loading, error };
};
