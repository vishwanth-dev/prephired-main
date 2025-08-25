'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SideBarItem, SIDEBAR_NAVIGATION_ITEMS, SIDEBAR_BOTTOM_ITEMS } from '../constants';

export const useSidebar = () => {
  const pathname = usePathname();
  const [navigationItems, setNavigationItems] = useState<SideBarItem[]>(SIDEBAR_NAVIGATION_ITEMS);
  const [bottomItems, setBottomItems] = useState<SideBarItem[]>(SIDEBAR_BOTTOM_ITEMS);

  // Automatically detect and set active item based on current route
  useEffect(() => {
    const updateActiveItem = () => {
      // Find the item that matches the current pathname
      const allItems = [...SIDEBAR_NAVIGATION_ITEMS, ...SIDEBAR_BOTTOM_ITEMS];
      const activeItem = allItems.find(item => pathname === item.path);

      if (activeItem) {
        setActiveItem(activeItem.id);
      }
    };

    updateActiveItem();
  }, [pathname]);

  const setActiveItem = useCallback((itemId: string) => {
    // Update main navigation items
    setNavigationItems(prev =>
      prev.map(item => ({
        ...item,
        isActive: item.id === itemId,
      }))
    );

    // Update bottom items
    setBottomItems(prev =>
      prev.map(item => ({
        ...item,
        isActive: item.id === itemId,
      }))
    );
  }, []);

  const getActiveItem = useCallback(() => {
    const activeMain = navigationItems.find(item => item.isActive);
    const activeBottom = bottomItems.find(item => item.isActive);
    return activeMain || activeBottom;
  }, [navigationItems, bottomItems]);

  const handleItemClick = useCallback(
    (item: SideBarItem) => {
      if (item.type === 'link') {
        setActiveItem(item.id);
      }
    },
    [setActiveItem]
  );

  return {
    navigationItems,
    bottomItems,
    setActiveItem,
    getActiveItem,
    handleItemClick,
  };
};
