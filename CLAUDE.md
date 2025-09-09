# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Context

**PrepAI** is an AI-powered interview platform that conducts real-time voice
interviews with dynamic question generation from candidate resumes. This is a
full-stack SaaS application with multi-tenant support, built using modern web
technologies.

## Tech Stack

### Frontend (Current Directory)

- **Framework**: Next.js 15.4.5 with App Router and Turbopack
- **UI**: React 19.1.0 + TypeScript 5.8.3
- **Styling**: TailwindCSS 4.1.11 + ShadCN UI (Radix)
- **State**: Zustand 5.0.7 + TanStack Query 5.84.1
- **Forms**: React Hook Form 7.62.0 + Zod 4.0.14
- **Auth**: NextAuth 5.0.0-beta.29 + JWT

### Backend (../prepAiBE)

- **Runtime**: Node.js 18+ with Express + TypeScript
- **Database**: MongoDB 6+ with Mongoose 8.17.1
- **AI**: OpenAI API for resume analysis
- **Real-time**: Pusher for live updates
- **Queue**: BullMQ for background jobs

## Essential Commands

### Development

```bash
# Frontend development with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
tsc --noEmit

# Linting
npm run lint

# Update documentation
npm run docs:update
```

### Backend (from ../prepAiBE)

```bash
npm run start:dev    # Development server
npm run start:prod   # Production server
npm run build        # Build TypeScript
npm run compile      # Watch mode
```

## Architecture Overview

### Frontend Structure

```
src/
├── app/              # Next.js App Router pages (route handlers)
├── components/       # UI components (Atomic Design)
│   ├── ui/          # ShadCN/Radix primitives (32+ components)
│   ├── features/    # Feature-specific components
│   ├── common/      # Shared components and guards
│   ├── forms/       # Form components
│   └── organisms/   # Complex UI organisms
├── hooks/           # Custom React hooks (26+ hooks)
│   ├── auth/       # Authentication hooks
│   ├── common/     # Common utility hooks
│   └── utils/      # Utility hooks
├── services/        # API service classes (8+ services)
├── store/          # Zustand state management
├── types/          # TypeScript type definitions
├── lib/            # Utility libraries
│   └── validations/ # Zod schemas
└── middleware/     # Next.js middleware for auth
```

### Key Architectural Patterns

1. **Atomic Design System**: Components follow atoms → molecules → organisms →
   templates hierarchy
2. **Feature-Based Organization**: Features are self-contained with their own
   components, hooks, and services
3. **Service Layer Pattern**: All API calls go through service classes in
   `/services`
4. **Type-Safe Development**: Strict TypeScript with comprehensive type
   definitions
5. **Multi-Tenant Architecture**: Subdomain-based tenant isolation

## Critical Files & Patterns

### Authentication Flow

- **Store**: `src/store/auth-store.ts` - Zustand store for auth state
- **Hook**: `src/hooks/use-auth.ts` - Main authentication hook
- **Guard**: `src/components/common/guards/auth.guard.tsx` - Component
  protection
- **Middleware**: `src/middleware/middleware.ts` - Route protection
- **Service**: `src/services/api/auth.service.ts` - Auth API calls

### Form Handling Pattern

```typescript
// Always use React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  // Define schema with Zod
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    /* ... */
  },
});
```

### API Service Pattern

```typescript
// Services in src/services/api/*.service.ts
export class ServiceName {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  async methodName(data: Type): Promise<ReturnType> {
    const response = await axios.post(`${this.baseURL}/endpoint`, data);
    return response.data;
  }
}
```

### State Management Pattern

```typescript
// Zustand stores with Immer
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useStore = create()(
  immer((set, get) => ({
    // state and actions
  }))
);
```

## Import Path Aliases

The project uses TypeScript path aliases for clean imports:

- `@/` → `./src/`
- `@/components/*` → UI components
- `@/design-system` → ShadCN UI components
- `@/services/*` → API services
- `@/hooks/*` → Custom hooks
- `@/store/*` → Zustand stores
- `@/types/*` → TypeScript types

## Development Guidelines

### Component Creation

1. Use existing ShadCN UI components from `@/components/ui`
2. Follow Atomic Design principles
3. Create feature-specific components in `@/components/features/[feature-name]`
4. Always include TypeScript types
5. Use existing design tokens and Tailwind classes

### State Management

1. Use Zustand for client state
2. Use TanStack Query for server state
3. Keep stores feature-specific when possible
4. Use Immer for immutable updates

### API Integration

1. Create service classes in `@/services/api`
2. Use axios with the configured instance
3. Handle errors consistently
4. Use TanStack Query for data fetching

### Form Development

1. Always use React Hook Form
2. Define Zod schemas for validation
3. Use ShadCN form components
4. Handle loading and error states

### Authentication & Security

1. Use the auth guard components for protected routes
2. Check permissions with `PermissionGuard`
3. Validate all inputs with Zod
4. Use environment variables for sensitive data
5. Never expose API keys in client code

## Common Development Tasks

### Adding a New Feature

1. Create feature folder in `@/components/features/[feature-name]`
2. Add service class in `@/services/api/[feature].service.ts`
3. Create Zustand store if needed in `@/store/[feature]-store.ts`
4. Add types in `@/types/[feature]/`
5. Use existing UI components from `@/components/ui`

### Creating Forms

1. Define Zod schema in `@/lib/validations/[feature].ts`
2. Create form component using React Hook Form
3. Use ShadCN form components for UI
4. Handle submission with try/catch
5. Show loading and error states

### Protected Routes

1. Use `AuthGuard` component for authentication
2. Use `PermissionGuard` for role-based access
3. Configure in `src/middleware/middleware.ts` for route-level protection

## Environment Variables

### Frontend (.env.local)

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: <http://localhost:5000/api>)
- `NEXT_PUBLIC_APP_URL` - Frontend URL (default: <http://localhost:3000>)
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - NextAuth URL

### Backend (.env in ../prepAiBE)

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key

## Design System

### Colors (Primary Brand)

- Primary: `#F0806C`
- Secondary: `#F35427`
- Text: `#363848`
- Muted: `#626262`

### Component Libraries

- ShadCN UI for base components
- Radix UI primitives
- Lucide React for icons
- Framer Motion for animations

## Code Quality Standards

1. **TypeScript**: Strict mode enabled with comprehensive type checking
2. **ESLint**: Configured for Next.js and React best practices
3. **Prettier**: Auto-formatting with consistent style
4. **Imports**: Organized by React → Third-party → Internal → Relative
5. **Naming**: PascalCase for components, kebab-case for files/hooks/services

## Multi-Tenant Considerations

1. Tenant isolation via subdomains
2. Tenant-specific configurations in database
3. Role-based permissions per tenant
4. Separate data storage per tenant
5. Tenant context available throughout app

## Performance Optimizations

1. Turbopack for faster development builds
2. Code splitting with dynamic imports
3. Image optimization with Next.js Image
4. React 19 optimizations (use, Suspense boundaries)
5. TanStack Query for efficient data caching

## Testing Approach

- Component testing with React Testing Library
- API testing with Jest and Supertest
- Form validation testing with Zod schemas
- Auth flow testing with mocked services

## Important Notes

1. **Backend Separation**: The backend is a separate Node.js/Express app, not
   Next.js API routes
2. **Real-time Features**: Pusher integration for live updates
3. **AI Integration**: OpenAI API for resume analysis and question generation
4. **File Uploads**: AWS S3 for document storage
5. **Background Jobs**: BullMQ for async processing

## Project Documentation Conventions (Important)

**Documentation Files:** All new documentation or task files must be saved under
the `docs/` folder in this repository.For example:

- **Tasks & TODOs**: Save in `docs/{YYYY_MM_DD}/tasks/` (e.g.,
  `docs/t2025_08_08/asks/ReleaseTodo.md` for a release checklist).
- **Requirements/Specs**: Save in `docs/{YYYY_MM_DD}/specs/` (e.g.,
  `docs/2025_08_08/specs/AuthModuleRequirements.md`).
- **Design Docs**: Save in `docs/{YYYY_MM_DD}/design/` (e.g.,
  `docs/2025_08_08/design/ArchitectureOverview.md`).
- **Code Files:** Follow the project structure (place new code in the
  appropriate src/module folder as discussed).
- **Tests:** Put new test files under the `tests/` directory, mirroring the code
  structure.

> **Important:** When creating a new file, ensure the directory exists or create
> it. Never default to the root directory for these files.
