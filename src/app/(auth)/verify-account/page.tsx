import { Metadata } from 'next';
import { VerifyAccountContainer } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Verify Account - PrepHired',
  description: 'Verify your account with the OTP sent to your email or phone',
};

export default function VerifyAccountPage() {
  return <VerifyAccountContainer />;
}
