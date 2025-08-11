'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Tenant, TenantId } from '@/features/auth/domain/entities';

interface TenantState {
  // Tenant data
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  tenantSettings: Record<string, any>;

  // UI state
  isTenantSwitcherOpen: boolean;
  isTenantSettingsOpen: boolean;
  isTenantInviteOpen: boolean;

  // Loading states
  isSwitchingTenant: boolean;
  isLoadingTenants: boolean;
  isUpdatingSettings: boolean;

  // Error states
  tenantError: string | null;
  settingsError: string | null;
}

interface TenantActions {
  // Tenant actions
  setCurrentTenant: (tenant: Tenant | null) => void;
  setAvailableTenants: (tenants: Tenant[]) => void;
  switchTenant: (tenantId: TenantId) => void;

  // Settings actions
  updateTenantSettings: (settings: Record<string, any>) => void;
  setTenantSetting: (key: string, value: any) => void;

  // UI actions
  openTenantSwitcher: () => void;
  closeTenantSwitcher: () => void;
  openTenantSettings: () => void;
  closeTenantSettings: () => void;
  openTenantInvite: () => void;
  closeTenantInvite: () => void;

  // Loading actions
  setTenantSwitching: (loading: boolean) => void;
  setTenantsLoading: (loading: boolean) => void;
  setSettingsUpdating: (loading: boolean) => void;

  // Error actions
  setTenantError: (error: string | null) => void;
  setSettingsError: (error: string | null) => void;
  clearErrors: () => void;
}

type TenantStore = TenantState & TenantActions;

export const useTenantStore = create<TenantStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentTenant: null,
        availableTenants: [],
        tenantSettings: {},

        // UI state
        isTenantSwitcherOpen: false,
        isTenantSettingsOpen: false,
        isTenantInviteOpen: false,

        // Loading states
        isSwitchingTenant: false,
        isLoadingTenants: false,
        isUpdatingSettings: false,

        // Error states
        tenantError: null,
        settingsError: null,

        // Actions
        setCurrentTenant: tenant => set({ currentTenant: tenant }),
        setAvailableTenants: tenants => set({ availableTenants: tenants }),
        switchTenant: tenantId => {
          const tenant = get().availableTenants.find(t => t.id === tenantId);
          if (tenant) {
            set({ currentTenant: tenant });
          }
        },

        updateTenantSettings: settings => set({ tenantSettings: settings }),
        setTenantSetting: (key, value) =>
          set(state => ({
            tenantSettings: { ...state.tenantSettings, [key]: value },
          })),

        openTenantSwitcher: () => set({ isTenantSwitcherOpen: true }),
        closeTenantSwitcher: () => set({ isTenantSwitcherOpen: false }),
        openTenantSettings: () => set({ isTenantSettingsOpen: true }),
        closeTenantSettings: () => set({ isTenantSettingsOpen: false }),
        openTenantInvite: () => set({ isTenantInviteOpen: true }),
        closeTenantInvite: () => set({ isTenantInviteOpen: false }),

        setTenantSwitching: loading => set({ isSwitchingTenant: loading }),
        setTenantsLoading: loading => set({ isLoadingTenants: loading }),
        setSettingsUpdating: loading => set({ isUpdatingSettings: loading }),

        setTenantError: error => set({ tenantError: error }),
        setSettingsError: error => set({ settingsError: error }),
        clearErrors: () => set({ tenantError: null, settingsError: null }),
      }),
      {
        name: 'tenant-store',
        partialize: state => ({
          currentTenant: state.currentTenant,
          tenantSettings: state.tenantSettings,
        }),
      }
    )
  )
);
