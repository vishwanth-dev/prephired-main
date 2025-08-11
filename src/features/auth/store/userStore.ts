'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserProfile } from '@/features/auth/domain/entities';

interface UserState {
  // User data
  profile: UserProfile | null;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  // UI state
  isProfileModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isActivityModalOpen: boolean;

  // Loading states
  isUpdatingProfile: boolean;
  isChangingPassword: boolean;
  isUpdatingPreferences: boolean;

  // Error states
  profileError: string | null;
  preferencesError: string | null;
}

interface UserActions {
  // Profile actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;

  // Preference actions
  updatePreferences: (updates: Partial<UserState['preferences']>) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  toggleNotification: (type: keyof UserState['preferences']['notifications']) => void;

  // UI actions
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  openActivityModal: () => void;
  closeActivityModal: () => void;

  // Loading actions
  setProfileUpdating: (loading: boolean) => void;
  setPasswordChanging: (loading: boolean) => void;
  setPreferencesUpdating: (loading: boolean) => void;

  // Error actions
  setProfileError: (error: string | null) => void;
  setPreferencesError: (error: string | null) => void;
  clearErrors: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        profile: null,
        preferences: {
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },

        // UI state
        isProfileModalOpen: false,
        isSettingsModalOpen: false,
        isActivityModalOpen: false,

        // Loading states
        isUpdatingProfile: false,
        isChangingPassword: false,
        isUpdatingPreferences: false,

        // Error states
        profileError: null,
        preferencesError: null,

        // Actions
        setProfile: profile => set({ profile }),
        updateProfile: updates => {
          const currentProfile = get().profile;
          if (currentProfile) {
            set({ profile: { ...currentProfile, ...updates } });
          }
        },
        clearProfile: () => set({ profile: null }),

        updatePreferences: updates => {
          const currentPreferences = get().preferences;
          set({ preferences: { ...currentPreferences, ...updates } });
        },
        setTheme: theme =>
          set(state => ({
            preferences: { ...state.preferences, theme },
          })),
        setLanguage: language =>
          set(state => ({
            preferences: { ...state.preferences, language },
          })),
        setTimezone: timezone =>
          set(state => ({
            preferences: { ...state.preferences, timezone },
          })),
        toggleNotification: type =>
          set(state => ({
            preferences: {
              ...state.preferences,
              notifications: {
                ...state.preferences.notifications,
                [type]: !state.preferences.notifications[type],
              },
            },
          })),

        openProfileModal: () => set({ isProfileModalOpen: true }),
        closeProfileModal: () => set({ isProfileModalOpen: false }),
        openSettingsModal: () => set({ isSettingsModalOpen: true }),
        closeSettingsModal: () => set({ isSettingsModalOpen: false }),
        openActivityModal: () => set({ isActivityModalOpen: true }),
        closeActivityModal: () => set({ isActivityModalOpen: false }),

        setProfileUpdating: loading => set({ isUpdatingProfile: loading }),
        setPasswordChanging: loading => set({ isChangingPassword: loading }),
        setPreferencesUpdating: loading => set({ isUpdatingPreferences: loading }),

        setProfileError: error => set({ profileError: error }),
        setPreferencesError: error => set({ preferencesError: error }),
        clearErrors: () => set({ profileError: null, preferencesError: null }),
      }),
      {
        name: 'user-store',
        partialize: state => ({
          preferences: state.preferences,
        }),
      }
    )
  )
);
