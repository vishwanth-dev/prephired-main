# 🛠️ PrepAI Development Guide

> **Last Updated**: 2025-09-08  
> **Auto-Generated**: This document is automatically updated when files are added/modified

## 📋 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MongoDB 6+
- Git
- VS Code (recommended)

### **Setup Commands**
```bash
# Clone and install
git clone <repository-url>
cd prephired-main
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your values

# Start development
npm run dev
```

---

## 🏗️ **Architecture Patterns**

### **1. Feature-Based Organization**
```
src/
├── components/
│   ├── ui/                    # ShadCN UI components (32+ components)
│   ├── features/              # Feature-specific components
│   │   ├── auth/              # Authentication components (5 components)
│   │   ├── dashboard/         # Dashboard components
│   │   └── resume-analysis/   # Resume analysis components
│   ├── common/                # Shared components
│   │   └── guards/            # Authentication & permission guards (3 guards)
│   ├── forms/                 # Form components
│   ├── layout/                # Layout components
│   ├── organisms/             # Complex UI organisms
│   ├── providers/             # Context providers
│   └── templates/              # Page templates
├── services/
│   ├── api/                   # API service classes (8 services)
│   ├── auth/                  # Authentication services
│   └── [feature]/             # Feature-specific services
├── hooks/
│   ├── auth/                  # Authentication hooks (3 hooks)
│   ├── common/                # Common utility hooks (6 hooks)
│   ├── form/                  # Form-related hooks
│   ├── ui/                    # UI-specific hooks
│   └── utils/                  # Utility hooks (14 hooks)
└── types/
    ├── auth/                  # Authentication types
    ├── dashboard/             # Dashboard types
    └── [feature]/            # Feature-specific types
```

### **2. Atomic Design System**
```
components/
├── ui/                        # Atoms (Button, Input, etc.)
├── molecules/                  # Molecules (InputGroup, etc.)
├── organisms/                 # Organisms (Forms, Tables, etc.)
├── templates/                 # Templates (Page layouts)
└── pages/                     # Pages (Route components)
```

---

## 🔧 **Development Standards**

### **File Naming Conventions**
- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-auth-guard.ts`)
- **Services**: `kebab-case.service.ts` (e.g., `auth.service.ts`)
- **Types**: `kebab-case.ts` (e.g., `user-types.ts`)
- **Utils**: `kebab-case.ts` (e.g., `format-date.ts`)

### **Import Organization**
```typescript
// 1. React imports
import React from 'react';
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { z } from 'zod';
import axios from 'axios';

// 3. Internal imports (absolute paths)
import { Button } from '@/design-system';
import { useAuth } from '@/hooks/use-auth';
import { authService } from '@/services/auth';

// 4. Relative imports
import './component.css';
```

---

## 🎯 **Key Development Areas**

### **1. Authentication System**

#### **Files to Know**
- `src/store/auth-store.ts` - Authentication state management
- `src/hooks/use-auth.ts` - Main authentication hook
- `src/hooks/auth/use-auth-guard.ts` - Authentication guard hook
- `src/hooks/auth/use-session.ts` - Session management hook
- `src/services/api/auth.service.ts` - Authentication API service
- `src/components/common/guards/auth.guard.tsx` - Authentication guard component
- `src/components/common/guards/permission.guard.tsx` - Permission guard component
- `src/components/features/auth/auth-guard.tsx` - Feature-specific auth guard
- `src/middleware/middleware.ts` - Route protection middleware
- `src/lib/validations/auth.ts` - Authentication form validation

#### **Usage Examples**
```typescript
// Using auth hook
const { user, isAuthenticated, login, logout } = useAuth();

// Using auth store directly
const { user, token } = useAuthStore();

// Authentication guard component
import { AuthGuard } from '@/components/common/guards';

const ProtectedPage = () => (
  <AuthGuard fallback={<LoginForm />}>
    <Dashboard />
  </AuthGuard>
);

// Permission guard component
import { PermissionGuard } from '@/components/common/guards';

const AdminPage = () => (
  <PermissionGuard permissions={['admin']} fallback={<AccessDenied />}>
    <AdminDashboard />
  </PermissionGuard>
);

// Using auth guard hook
import { useAuthGuard } from '@/hooks/auth/use-auth-guard';

const MyComponent = () => {
  const { isAuthenticated, isLoading, user } = useAuthGuard();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginForm />;
  
  return <Dashboard user={user} />;
};
```

---

## 🔄 **Auto-Update Information**

This document is automatically updated when:
- New development patterns are added
- Dependencies are updated
- Configuration changes are made
- New development tools are integrated

**Last Auto-Update**: 2025-09-08T15:56:47.596Z  
**Update Trigger**: Development file changes  
**Next Update**: On next development modification

---

*This guide is automatically maintained. For manual updates, edit the source files and run the update script.*