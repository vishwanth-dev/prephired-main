import { useGlobalStore } from '../store/global-store';

/**
 * Hook for managing sidebar collapse state
 * @returns {Object} Sidebar state and actions
 */
export const useSidebar = () => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isApplinkDrawerOpen,
    setIsApplinkDrawerOpen,
  } = useGlobalStore();

  return {
    // Legacy sidebar collapse (for backward compatibility)
    isCollapsed: isSidebarCollapsed,
    toggle: toggleSidebar,
    setCollapsed: setSidebarCollapsed,

    // New dashboard sidebar states
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isApplinkDrawerOpen,
    setIsApplinkDrawerOpen,
  };
};
