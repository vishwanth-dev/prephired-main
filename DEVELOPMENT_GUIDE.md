# 🛠️ PrepAI Development Guide

> **Last Updated**: 2025-09-06  
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
│   ├── ui/                    # ShadCN UI components
│   ├── features/              # Feature-specific components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   └── resume-analysis/   # Resume analysis components
│   └── common/                # Shared components
├── services/
│   ├── api/                   # API service classes
│   ├── auth/                  # Authentication services
│   └── [feature]/             # Feature-specific services
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
import { Button } from '@/components/ui/button';
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
- `src/services/auth/auth.service.ts` - Authentication API service
- `src/middleware/middleware.ts` - Route protection middleware
- `src/lib/validations/auth.ts` - Authentication form validation

#### **Usage Examples**
```typescript
// Using auth hook
const { user, isAuthenticated, login, logout } = useAuth();

// Using auth store directly
const { user, token } = useAuthStore();

// Authentication guard
const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginForm />;
  
  return <>{children}</>;
};
```

---

## 🔄 **Auto-Update Information**

This document is automatically updated when:
- New development patterns are added
- Dependencies are updated
- Configuration changes are made
- New development tools are integrated

**Last Auto-Update**: 2025-09-06T07:31:01.750Z  
**Update Trigger**: Development file changes  
**Next Update**: On next development modification

---

*This guide is automatically maintained. For manual updates, edit the source files and run the update script.*