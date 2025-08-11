'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  UserProfile,
  Tenant,
  Session,
  AuthState,
  LoginForm,
  RegisterForm,
} from '@/features/auth/domain/entities';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  switchTenant: (tenantId: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        session: null,
        currentTenant: null,
        availableTenants: [],
        loading: 'idle',
        error: null,
        isAuthenticated: false,
        emailVerificationRequired: false,
        lastUpdated: new Date().toISOString(),

        // Actions
        login: async (credentials: LoginForm) => {
          set({ loading: 'loading', error: null });

          try {
            // Mock login logic - replace with actual API call
            const mockUser: UserProfile = {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: credentials.email,
              phone: '+1234567890',
              avatarUrl: 'https://via.placeholder.com/150',
              emailVerified: true,
              phoneVerified: false,
              status: 'active',
              roles: ['user'],
              permissions: ['read:own'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              metadata: {},
              displayName: 'John Doe',
              initials: 'JD',
            };

            const mockSession: Session = {
              id: 'session-1',
              userId: '1',
              tenantId: 'tenant-1',
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              ipAddress: '127.0.0.1',
              userAgent: 'Mozilla/5.0',
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString(),
              metadata: {},
            };

            const mockTenant: Tenant = {
              id: 'tenant-1',
              name: 'Default Organization',
              slug: 'default',
              description: 'Default organization',
              website: 'https://example.com',
              logoUrl: 'https://via.placeholder.com/100',
              status: 'active',
              country: 'US',
              timezone: 'America/New_York',
              language: 'en',
              currency: 'USD',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({
              user: mockUser,
              session: mockSession,
              currentTenant: mockTenant,
              availableTenants: [mockTenant],
              loading: 'success',
              error: null,
              isAuthenticated: true,
              emailVerificationRequired: false,
              lastUpdated: new Date().toISOString(),
            });
          } catch (error: any) {
            set({
              loading: 'error',
              error: error.message || 'Login failed',
              lastUpdated: new Date().toISOString(),
            });
          }
        },

        register: async (userData: RegisterForm) => {
          set({ loading: 'loading', error: null });

          try {
            // Mock registration logic - replace with actual API call
            const mockUser: UserProfile = {
              id: '2',
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              ...(userData.phone && { phone: userData.phone }),
              avatarUrl: 'https://via.placeholder.com/150',
              emailVerified: false,
              phoneVerified: false,
              status: 'pending',
              roles: ['user'],
              permissions: ['read:own'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              metadata: {},
              displayName: `${userData.firstName} ${userData.lastName}`,
              initials: `${userData.firstName[0]}${userData.lastName[0]}`,
            };

            set({
              user: mockUser,
              loading: 'success',
              error: null,
              emailVerificationRequired: true,
              lastUpdated: new Date().toISOString(),
            });
          } catch (error: any) {
            set({
              loading: 'error',
              error: error.message || 'Registration failed',
              lastUpdated: new Date().toISOString(),
            });
          }
        },

        logout: () => {
          set({
            user: null,
            session: null,
            currentTenant: null,
            availableTenants: [],
            loading: 'idle',
            error: null,
            isAuthenticated: false,
            emailVerificationRequired: false,
            lastUpdated: new Date().toISOString(),
          });
        },

        clearError: () => {
          set({ error: null });
        },

        setCurrentTenant: (tenant: Tenant | null) => {
          set({ currentTenant: tenant });
        },

        switchTenant: (tenantId: string) => {
          const tenant = get().availableTenants.find(t => t.id === tenantId);
          if (tenant) {
            set({ currentTenant: tenant });
          }
        },
      }),
      { name: 'auth-store' }
    )
  )
);
