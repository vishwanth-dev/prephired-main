// ============================================
// 📋 PROVIDER INFO
// ============================================

export const PROVIDERS_INFO = {
  providers: ['AuthProvider', 'ToastProvider', 'QueryProvider'],
  hooks: ['useAuth', 'useToast', 'useToastNotifications'],
  features: [
    'Authentication state management',
    'Toast notification system',
    'React Query integration',
    'SOLID principles compliance',
    'TypeScript type safety',
    'Error handling',
    'Loading states',
  ],
} as const;

// Default export for convenience
export default PROVIDERS_INFO;
