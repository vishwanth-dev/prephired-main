/**
 * 🎯 Hooks Index
 *
 * Centralized exports for all custom hooks following SOLID principles:
 * - Single Responsibility: Each hook has a focused purpose
 * - Open/Closed: Extensible through options and parameters
 * - Liskov Substitution: Consistent interfaces across hooks
 * - Interface Segregation: Clean, focused interfaces
 * - Dependency Inversion: Works with abstractions
 */

// ============================================
// 🔐 AUTHENTICATION HOOKS
// ============================================

export { default as useAuth } from './use-auth';
export * from './auth';

// ============================================
// 📝 FORM HOOKS
// ============================================

export { default as useFormValidation } from './form/use-form-validation';

// ============================================
// 🍞 UI HOOKS
// ============================================

export { default as useToast } from './ui/use-toast';

// ============================================
// 🛠️ UTILITY HOOKS
// ============================================

export { default as useAsync } from './utils/use-async';
export { default as useClickOutside } from './utils/use-click-outside';
export { default as useClipboard } from './utils/use-clipboard';
export { default as useCountdown } from './utils/use-countdown';
export { default as useDebounce } from './utils/use-debounce';
export { default as useEventListener } from './utils/use-event-listener';
export { default as useHover } from './utils/use-hover';
export { default as useIntersection } from './utils/use-intersection';
export { default as useLocalStorage } from './utils/use-local-storage';
export { default as useLockBodyScroll } from './utils/use-lock-body-scroll';
export { useModal } from './utils/use-modal';
export { default as useOnlineStatus } from './utils/use-online-status';
export { default as usePrevious } from './utils/use-previous';
export { default as useWindowSize } from './utils/use-window-size';

// ============================================
// 📊 SPECIALIZED HOOKS
// ============================================

// Note: Specialized hooks will be added as modules are created
// Dashboard hooks - export * from './dashboard';
// Job type hooks - export * from './job-type';
// Resume analysis hooks - export * from './resume-analysis';
// My interviews hooks - export * from './my-interviews';
// Common hooks - export * from './common';
