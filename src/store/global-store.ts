import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalUIState {
  // Sidebar state
  isSidebarCollapsed: boolean;

  // Dashboard specific states
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  isApplinkDrawerOpen: boolean;

  // Theme and appearance
  isDarkMode: boolean;

  // Global loading states
  isGlobalLoading: boolean;

  // Global notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;

  // Modal states
  activeModals: string[];

  // Toast states
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }>;
}

interface GlobalUIActions {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Dashboard specific actions
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  setIsApplinkDrawerOpen: (isOpen: boolean) => void;

  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  // Loading actions
  setGlobalLoading: (loading: boolean) => void;

  // Notification actions
  addNotification: (notification: Omit<GlobalUIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Modal actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;

  // Toast actions
  showToast: (toast: Omit<GlobalUIState['toasts'][0], 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;

  // Reset all state
  resetGlobalState: () => void;
}

interface GlobalUIStore extends GlobalUIState, GlobalUIActions {}

const initialState: GlobalUIState = {
  isSidebarCollapsed: false,
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  isApplinkDrawerOpen: false,
  isDarkMode: false,
  isGlobalLoading: false,
  notifications: [],
  activeModals: [],
  toasts: [],
};

export const useGlobalStore = create<GlobalUIStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Sidebar actions
      toggleSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),

      // Dashboard specific actions
      setIsSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),

      setIsMobileSidebarOpen: (isOpen: boolean) => set({ isMobileSidebarOpen: isOpen }),

      setIsApplinkDrawerOpen: (isOpen: boolean) => set({ isApplinkDrawerOpen: isOpen }),

      // Theme actions
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),

      setDarkMode: (enabled: boolean) => set({ isDarkMode: enabled }),

      // Loading actions
      setGlobalLoading: (loading: boolean) => set({ isGlobalLoading: loading }),

      // Notification actions
      addNotification: notification => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const newNotification = { ...notification, id };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration (default: 5000ms)
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },

      removeNotification: (id: string) =>
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // Modal actions
      openModal: (modalId: string) =>
        set(state => ({
          activeModals: [...state.activeModals, modalId],
        })),

      closeModal: (modalId: string) =>
        set(state => ({
          activeModals: state.activeModals.filter(id => id !== modalId),
        })),

      closeAllModals: () => set({ activeModals: [] }),

      // Toast actions
      showToast: toast => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast = { ...toast, id };

        set(state => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto-hide toast after duration (default: 4000ms)
        const duration = toast.duration || 4000;
        setTimeout(() => {
          get().hideToast(id);
        }, duration);
      },

      hideToast: (id: string) =>
        set(state => ({
          toasts: state.toasts.filter(t => t.id !== id),
        })),

      clearToasts: () => set({ toasts: [] }),

      // Reset all state
      resetGlobalState: () => set(initialState),
    }),
    {
      name: 'global-ui-store',
      partialize: state => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
        isSidebarOpen: state.isSidebarOpen,
        isMobileSidebarOpen: state.isMobileSidebarOpen,
        isApplinkDrawerOpen: state.isApplinkDrawerOpen,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// Selector hooks for better performance
export const useSidebarState = () =>
  useGlobalStore(state => ({
    isSidebarCollapsed: state.isSidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
    setSidebarCollapsed: state.setSidebarCollapsed,
  }));

export const useDashboardState = () =>
  useGlobalStore(state => ({
    isSidebarOpen: state.isSidebarOpen,
    setIsSidebarOpen: state.setIsSidebarOpen,
    isMobileSidebarOpen: state.isMobileSidebarOpen,
    setIsMobileSidebarOpen: state.setIsMobileSidebarOpen,
    isApplinkDrawerOpen: state.isApplinkDrawerOpen,
    setIsApplinkDrawerOpen: state.setIsApplinkDrawerOpen,
  }));

export const useThemeState = () =>
  useGlobalStore(state => ({
    isDarkMode: state.isDarkMode,
    toggleDarkMode: state.toggleDarkMode,
    setDarkMode: state.setDarkMode,
  }));

export const useGlobalLoading = () =>
  useGlobalStore(state => ({
    isGlobalLoading: state.isGlobalLoading,
    setGlobalLoading: state.setGlobalLoading,
  }));

export const useNotifications = () =>
  useGlobalStore(state => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
  }));

export const useModals = () =>
  useGlobalStore(state => ({
    activeModals: state.activeModals,
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
  }));

export const useToasts = () =>
  useGlobalStore(state => ({
    toasts: state.toasts,
    showToast: state.showToast,
    hideToast: state.hideToast,
    clearToasts: state.clearToasts,
  }));
