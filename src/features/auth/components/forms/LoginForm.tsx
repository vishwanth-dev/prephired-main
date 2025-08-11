'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { PasswordInput } from '@/features/auth/components/inputs/PasswordInput';
import { AuthForm } from '@/features/auth/components/layout/AuthForm';
import { loginFormSchema, type LoginFormInput } from '@/features/auth/schema';
import { useAuthStore } from '@/features/auth/store/authStore';

export const LoginForm: React.FC = () => {
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
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthForm
      type='login'
      title='Welcome back'
      subtitle="Don't have an account,"
      linkText='Create new account'
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <Label htmlFor='emailOrPhone'>Email or Phone</Label>
          <Input
            id='emailOrPhone'
            type='text'
            placeholder='Enter your email or phone number'
            {...form.register('emailOrPhone')}
            error={form.formState.errors.emailOrPhone?.message}
          />
        </div>

        <div>
          <Label htmlFor='password'>Password</Label>
          <PasswordInput
            label='Password'
            placeholder='Enter your password'
            {...form.register('password')}
            error={form.formState.errors.password?.message}
            required
          />
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='rememberMe'
              {...form.register('rememberMe')}
              className='rounded border-gray-300'
            />
            <Label htmlFor='rememberMe' className='text-sm'>
              Remember me
            </Label>
          </div>
        </div>

        {error && <div className='text-red-600 text-sm'>{error}</div>}

        <Button type='submit' className='w-full' disabled={loading === 'loading'}>
          {loading === 'loading' ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthForm>
  );
};
