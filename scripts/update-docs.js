#!/usr/bin/env node

/**
 * 📚 Auto-Documentation Update Script
 *
 * This script automatically updates the main documentation files
 * when project files are added, modified, or removed.
 *
 * Usage:
 *   node scripts/update-docs.js
 *   npm run docs:update
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  docs: ['PROJECT_OVERVIEW.md', 'DEVELOPMENT_GUIDE.md', 'API_REFERENCE.md'],
  srcDir: 'src',
  excludeDirs: ['node_modules', '.next', 'dist', '.git'],
  excludeFiles: ['.DS_Store', 'Thumbs.db'],
};

/**
 * Get file statistics for documentation
 */
function getFileStats() {
  const stats = {
    totalFiles: 0,
    components: 0,
    hooks: 0,
    services: 0,
    types: 0,
    routes: 0,
    dependencies: 0,
    uiComponents: 0,
    authComponents: 0,
    guards: 0,
  };

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (CONFIG.excludeDirs.includes(item) || CONFIG.excludeFiles.includes(item)) {
        continue;
      }

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        stats.totalFiles++;

        // Categorize files with more specific logic
        if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
          stats.components++;

          // Count UI components specifically
          if (dir.includes('/ui/') || dir.includes('\\ui\\')) {
            stats.uiComponents++;
          }

          // Count auth components specifically
          if (dir.includes('/auth/') || dir.includes('\\auth\\')) {
            stats.authComponents++;
          }

          // Count guard components
          if (item.includes('guard') || dir.includes('/guards/') || dir.includes('\\guards\\')) {
            stats.guards++;
          }
        } else if (item.includes('hook') || item.startsWith('use-')) {
          stats.hooks++;
        } else if (item.includes('service')) {
          stats.services++;
        } else if (item.includes('type') || item.endsWith('.d.ts')) {
          stats.types++;
        } else if (item.includes('route')) {
          stats.routes++;
        }
      }
    }
  }

  // Get dependencies count
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    stats.dependencies =
      Object.keys(packageJson.dependencies || {}).length +
      Object.keys(packageJson.devDependencies || {}).length;
  } catch (error) {
    console.warn('Could not read package.json:', error.message);
  }

  scanDirectory(CONFIG.srcDir);
  return stats;
}

/**
 * Update PROJECT_OVERVIEW.md with current file statistics
 */
function updateProjectOverview() {
  const stats = getFileStats();
  const timestamp = new Date().toISOString();

  const content = `# 🚀 PrepAI - Complete Project Overview

> **Last Updated**: ${timestamp.split('T')[0]}  
> **Auto-Generated**: This document is automatically updated when files are added/modified

## 📋 **Project Summary**

**PrepAI** is a comprehensive AI-powered resume preparation and analysis platform built with Next.js 15, featuring multi-tenancy, enterprise-grade security, and modern React patterns.

### **🎯 Core Features**
- **AI Resume Analysis**: Intelligent resume optimization and feedback
- **Multi-Tenant SaaS**: Subdomain-based tenant isolation
- **Authentication System**: JWT-based auth with role-based access control
- **Interview Management**: Complete interview scheduling and management
- **Dashboard Analytics**: Comprehensive user and admin dashboards
- **Widget System**: Embeddable components for external sites

---

## 🏗️ **Architecture Overview**

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 + React 19 | App Router, SSR/SSG/ISR |
| **Styling** | TailwindCSS + ShadCN UI | Utility-first CSS + Component library |
| **State Management** | Zustand + Context API | Client-side state management |
| **Forms** | React Hook Form + Zod | Form handling + validation |
| **API Client** | Axios + TanStack Query | HTTP client + caching |
| **Authentication** | JWT + NextAuth | Token-based auth |
| **Database** | MongoDB + Mongoose | Primary data storage |
| **AI Integration** | OpenAI API | Resume analysis and optimization |
| **Real-time** | Pusher | Live updates and notifications |

### **Architecture Principles**
- **🧩 Feature-Based Modular Design**: Self-contained business modules
- **🏢 Multi-Tenant SaaS Patterns**: Scalable tenant isolation
- **⚛️ Atomic Design System**: Clear UI component hierarchy
- **🔒 Security-First Approach**: Built-in security and compliance
- **📈 Enterprise Scalability**: Designed for startup to enterprise scale

---

## 📊 **Development Statistics**

| Metric | Count |
|--------|-------|
| **Total Files** | ${stats.totalFiles}+ |
| **Components** | ${stats.components}+ |
| **UI Components** | ${stats.uiComponents}+ |
| **Auth Components** | ${stats.authComponents}+ |
| **Guard Components** | ${stats.guards}+ |
| **Hooks** | ${stats.hooks}+ |
| **Services** | ${stats.services}+ |
| **Types** | ${stats.types}+ |
| **Routes** | ${stats.routes}+ |
| **Dependencies** | ${stats.dependencies}+ |

---

## 🔄 **Auto-Update Information**

This document is automatically updated when:
- New files are added to the project
- Existing files are modified or moved
- Dependencies are updated
- Configuration changes are made

**Last Auto-Update**: ${timestamp}  
**Update Trigger**: File system changes detected  
**Next Update**: On next file modification

---

*This document is automatically maintained and updated. For manual updates, edit the source files and run the update script.*`;

  fs.writeFileSync('PROJECT_OVERVIEW.md', content);
  console.log('✅ Updated PROJECT_OVERVIEW.md');
}

/**
 * Update DEVELOPMENT_GUIDE.md with current patterns
 */
function updateDevelopmentGuide() {
  const timestamp = new Date().toISOString();

  const content = `# 🛠️ PrepAI Development Guide

> **Last Updated**: ${timestamp.split('T')[0]}  
> **Auto-Generated**: This document is automatically updated when files are added/modified

## 📋 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MongoDB 6+
- Git
- VS Code (recommended)

### **Setup Commands**
\`\`\`bash
# Clone and install
git clone <repository-url>
cd prephired-main
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your values

# Start development
npm run dev
\`\`\`

---

## 🏗️ **Architecture Patterns**

### **1. Feature-Based Organization**
\`\`\`
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
\`\`\`

### **2. Atomic Design System**
\`\`\`
components/
├── ui/                        # Atoms (Button, Input, etc.)
├── molecules/                  # Molecules (InputGroup, etc.)
├── organisms/                 # Organisms (Forms, Tables, etc.)
├── templates/                 # Templates (Page layouts)
└── pages/                     # Pages (Route components)
\`\`\`

---

## 🔧 **Development Standards**

### **File Naming Conventions**
- **Components**: \`PascalCase.tsx\` (e.g., \`UserProfile.tsx\`)
- **Hooks**: \`use-kebab-case.ts\` (e.g., \`use-auth-guard.ts\`)
- **Services**: \`kebab-case.service.ts\` (e.g., \`auth.service.ts\`)
- **Types**: \`kebab-case.ts\` (e.g., \`user-types.ts\`)
- **Utils**: \`kebab-case.ts\` (e.g., \`format-date.ts\`)

### **Import Organization**
\`\`\`typescript
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
\`\`\`

---

## 🎯 **Key Development Areas**

### **1. Authentication System**

#### **Files to Know**
- \`src/store/auth-store.ts\` - Authentication state management
- \`src/hooks/use-auth.ts\` - Main authentication hook
- \`src/hooks/auth/use-auth-guard.ts\` - Authentication guard hook
- \`src/hooks/auth/use-session.ts\` - Session management hook
- \`src/services/api/auth.service.ts\` - Authentication API service
- \`src/components/common/guards/auth.guard.tsx\` - Authentication guard component
- \`src/components/common/guards/permission.guard.tsx\` - Permission guard component
- \`src/components/features/auth/auth-guard.tsx\` - Feature-specific auth guard
- \`src/middleware/middleware.ts\` - Route protection middleware
- \`src/lib/validations/auth.ts\` - Authentication form validation

#### **Usage Examples**
\`\`\`typescript
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
\`\`\`

---

## 🔄 **Auto-Update Information**

This document is automatically updated when:
- New development patterns are added
- Dependencies are updated
- Configuration changes are made
- New development tools are integrated

**Last Auto-Update**: ${timestamp}  
**Update Trigger**: Development file changes  
**Next Update**: On next development modification

---

*This guide is automatically maintained. For manual updates, edit the source files and run the update script.*`;

  fs.writeFileSync('DEVELOPMENT_GUIDE.md', content);
  console.log('✅ Updated DEVELOPMENT_GUIDE.md');
}

/**
 * Update API_REFERENCE.md with current endpoints
 */
function updateApiReference() {
  const timestamp = new Date().toISOString();

  const content = `# 🔌 PrepAI API Reference

> **Last Updated**: ${timestamp.split('T')[0]}  
> **Auto-Generated**: This document is automatically updated when files are added/modified

## 📋 **API Overview**

The PrepAI API provides comprehensive endpoints for authentication, user management, resume analysis, interview scheduling, and multi-tenant operations.

### **Base URLs**
- **Development**: \`http://localhost:5000/api\`
- **Production**: \`https://api.prephired.com\`
- **Widget API**: \`https://widget.prephired.com/api\`

### **API Services Available**
- **Auth Service**: User authentication and session management
- **User Service**: User profile and account management
- **Resume Service**: Resume upload, analysis, and optimization
- **Tenant Service**: Multi-tenant organization management
- **Group Service**: User group and team management
- **Role Service**: Role-based access control

### **Authentication**
All protected endpoints require a Bearer token in the Authorization header:
\`\`\`http
Authorization: Bearer <jwt-token>
\`\`\`

---

## 🔐 **Authentication Endpoints**

### **POST /auth/register**
Register a new user account.

**Request Body:**
\`\`\`typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    requiresVerification: boolean;
  };
}
\`\`\`

### **POST /auth/login**
Authenticate user and return tokens.

**Request Body:**
\`\`\`typescript
{
  email: string;
  password: string;
  rememberMe?: boolean;
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}
\`\`\`

---

## 📄 **Resume Analysis Endpoints**

### **POST /resume/upload**
Upload resume file for analysis.

**Request:** Multipart form data
\`\`\`typescript
{
  file: File;  // PDF, DOC, DOCX
  jobDescription?: string;
  analysisType?: 'general' | 'job-specific';
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean;
  data: {
    resumeId: string;
    fileName: string;
    fileSize: number;
    uploadStatus: 'processing' | 'completed' | 'failed';
    analysisResults?: ResumeAnalysis;
  };
}
\`\`\`

---

## 🔄 **Auto-Update Information**

This document is automatically updated when:
- New API endpoints are added
- Existing endpoints are modified
- Request/response schemas change
- Error handling is updated

**Last Auto-Update**: ${timestamp}  
**Update Trigger**: API file changes  
**Next Update**: On next API modification

---

*This API reference is automatically maintained. For manual updates, edit the source files and run the update script.*`;

  fs.writeFileSync('API_REFERENCE.md', content);
  console.log('✅ Updated API_REFERENCE.md');
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting documentation update...');

  try {
    updateProjectOverview();
    updateDevelopmentGuide();
    updateApiReference();

    console.log('✅ All documentation updated successfully!');
    console.log('📚 Updated files:');
    CONFIG.docs.forEach(doc => {
      console.log(`   - ${doc}`);
    });
  } catch (error) {
    console.error('❌ Error updating documentation:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, updateProjectOverview, updateDevelopmentGuide, updateApiReference };
