'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth/store/authStore';
import { registerSchema, type RegisterFormData } from '@/features/auth/schema/register.zod';

export const useRegisterForm = () => {
  const { register, loading, error } = useAuthStore();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms,
        acceptPrivacy: data.acceptPrivacy || false,
      });
    } catch (error: unknown) {
      console.error('Registration failed:', error);
    }
  };

  return { form, onSubmit, loading, error };
};
