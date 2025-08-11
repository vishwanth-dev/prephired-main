'use client';

import { useAuthStore } from '@/features/auth/store/authStore';

export const useUserState = () => {
  const { user, currentTenant } = useAuthStore();

  if (!user) {
    return {
      user: null,
      currentTenant: null,
      profile: null,
      permissions: [],
      role: null,
      isProfileComplete: false,
      canEditProfile: false,
    };
  }

  const profile = {
    displayName: `${user.firstName} ${user.lastName}`,
    initials: `${user.firstName[0]}${user.lastName[0]}`,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
  };

  return {
    user,
    currentTenant,
    profile,
    permissions: user.permissions || [],
    role: user.roles?.[0] || null,
    isProfileComplete: !!user.firstName && !!user.lastName && !!user.email,
    canEditProfile: true, // Example logic
  };
};
