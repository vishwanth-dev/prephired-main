import { LoginFormContainer } from '@/features/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - PrepHired',
  description: 'Login to your PrepHired account',
};

export default function LoginPage() {
  return <LoginFormContainer />;
}
