import { Metadata } from 'next';
import React from 'react';
import { SelectRoleForm } from '@/features/auth/components/forms/SelectRoleForm';

export const metadata: Metadata = {
  title: 'Select Role - prepAI',
  description: 'Choose your role to customize your prepAI experience',
};

export default function SelectRolePage() {
  return <SelectRoleForm />;
}
