# 🏗️ Feature Folder Structure Documentation

## 📋 Overview

This document outlines the standardized feature folder structure used in the
PrepHired application. Each feature follows a consistent architecture pattern
that promotes maintainability, scalability, and separation of concerns.

## 🎯 Architecture Principles

- **Feature-First Organization**: Each feature is self-contained with its own
  folder
- **Domain-Driven Design**: Clear separation between domain logic and UI
  concerns
- **Single Responsibility**: Each folder has a specific purpose and
  responsibility
- **Clean Exports**: Public API exposed through index.ts files
- **Type Safety**: Comprehensive TypeScript definitions
- **SOLID Principles**: Proper separation of concerns and dependency management

## 📁 Standard Feature Structure

```
src/features/{feature-name}/
├── 📄 index.ts                    # Public API exports
├── 📄 README.md                   # Feature documentation
├── 📁 components/                 # UI components
│   ├── 📁 forms/                 # Form components
│   ├── 📁 ui/                    # Reusable UI elements
│   ├── 📁 inputs/                # Input components
│   ├── 📁 layout/                # Layout components
│   ├── 📁 display/               # Display components
│   ├── 📁 cards/                 # Card components
│   └── 📄 index.ts               # Component exports
├── 📁 containers/                 # Container components (business logic)
├── 📁 hooks/                      # Custom React hooks
│   ├── 📁 state/                 # State management hooks
│   ├── 📁 forms/                 # Form-related hooks
│   ├── 📁 mutations/             # Data mutation hooks
│   ├── 📁 queries/               # Data fetching hooks
│   └── 📄 index.ts               # Hook exports
├── 📁 domain/                     # Domain layer (business logic)
│   ├── 📄 entities.ts            # Core domain entities
│   ├── 📄 rules.ts               # Business rules and validation
│   ├── 📄 errors.ts              # Domain-specific errors
│   ├── 📄 events.ts              # Domain events
│   └── 📄 selectors.ts           # Data selectors
├── 📁 store/                      # State management (Zustand)
│   ├── 📄 {feature}Store.ts      # Main feature store
│   ├── 📄 types.ts               # Store-specific types
│   └── 📄 session.types.ts       # Session-related types (if needed)
├── 📁 services/                   # API and business logic services
│   └── 📄 index.ts               # Service exports
├── 📁 types/                      # TypeScript type definitions
│   └── 📄 index.ts               # Type exports
├── 📁 constants/                  # Feature constants and configuration
├── 📁 utils/                      # Utility functions
├── 📁 routes/                     # Route definitions (if needed)
├── 📁 schema/                     # Validation schemas
└── 📁 pages/                      # Page components (if feature has pages)
```

## 🔍 Detailed Folder Explanations

### 📄 `index.ts` - Public API

- **Purpose**: Main entry point for the feature
- **Responsibility**: Export all public APIs, components, hooks, and types
- **Pattern**: Clean, organized exports with proper TypeScript support

```typescript
// Example: src/features/auth/index.ts
export { LoginForm } from './components/forms/LoginForm';
export { useLogin } from './hooks/useLogin';
export type { User, AuthState } from './domain/entities';
```

### 📁 `components/` - UI Components

- **Purpose**: Reusable UI components specific to the feature
- **Organization**: Grouped by functionality (forms, inputs, layout, etc.)
- **Pattern**: Atomic design principles with proper prop interfaces

```typescript
// Example: src/features/auth/components/forms/LoginForm.tsx
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  loading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  // Component implementation
};
```

### 📁 `containers/` - Business Logic Containers

- **Purpose**: Connect UI components with business logic and state
- **Responsibility**: Handle data fetching, state management, and side effects
- **Pattern**: Container component pattern for separation of concerns

```typescript
// Example: src/features/auth/containers/LoginFormContainer.tsx
export const LoginFormContainer: React.FC = () => {
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (credentials: LoginForm) => {
    await login(credentials);
  };

  return <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />;
};
```

### 📁 `hooks/` - Custom React Hooks

- **Purpose**: Encapsulate feature-specific logic and state
- **Organization**: Grouped by functionality (state, forms, mutations, queries)
- **Pattern**: Custom hooks for reusable logic

```typescript
// Example: src/features/auth/hooks/useLogin.ts
export const useLogin = () => {
  const { login, loading, error } = useAuthStore();

  const handleLogin = async (credentials: LoginForm) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { handleLogin, loading, error };
};
```

### 📁 `domain/` - Business Logic Layer

- **Purpose**: Core business logic, entities, and rules
- **Responsibility**: Define domain models, business rules, and validation
- **Pattern**: Domain-Driven Design principles

```typescript
// Example: src/features/auth/domain/entities.ts
export interface User {
  readonly id: UserId;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: Email;
  readonly status: UserStatus;
  readonly roles: readonly UserRole[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

// Example: src/features/auth/domain/rules.ts
export const validateUserRegistration = (
  userData: RegisterForm
): ValidationResult => {
  // Business rule validation logic
};
```

### 📁 `store/` - State Management

- **Purpose**: Feature-specific state management using Zustand
- **Responsibility**: Manage feature state, actions, and side effects
- **Pattern**: Zustand stores with proper TypeScript support

```typescript
// Example: src/features/auth/store/authStore.ts
interface AuthStore extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist((set, get) => ({
      // State and actions implementation
    }))
  )
);
```

### 📁 `services/` - API and Business Logic

- **Purpose**: Handle external API calls and business logic
- **Responsibility**: Data fetching, API communication, business operations
- **Pattern**: Service classes with proper error handling

```typescript
// Example: src/features/dashboard/services/dashboardService.ts
export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    try {
      // API call implementation
      return dashboardData;
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  }
}
```

### 📁 `types/` - TypeScript Definitions

- **Purpose**: Feature-specific TypeScript interfaces and types
- **Responsibility**: Define data structures and component props
- **Pattern**: Comprehensive type definitions with proper exports

```typescript
// Example: src/features/auth/types/index.ts
export type { User, AuthState, LoginForm } from '../domain/entities';
export type { LoginFormProps } from '../components/forms/LoginForm';
```

### 📁 `constants/` - Configuration

- **Purpose**: Feature-specific constants and configuration
- **Responsibility**: Define feature settings, API endpoints, validation rules
- **Pattern**: Centralized configuration management

```typescript
// Example: src/features/auth/constants/index.ts
export const AUTH_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  PASSWORD_MIN_LENGTH: 8,
} as const;
```

## 🚀 Creating New Features

### Step 1: Create Feature Folder Structure

```bash
mkdir -p src/features/{feature-name}/{components,containers,hooks,domain,store,services,types,constants,utils}
```

### Step 2: Create Essential Files

```bash
# Create main files
touch src/features/{feature-name}/index.ts
touch src/features/{feature-name}/README.md

# Create component structure
touch src/features/{feature-name}/components/index.ts
mkdir -p src/features/{feature-name}/components/{forms,ui,inputs,layout,display,cards}

# Create hook structure
touch src/features/{feature-name}/hooks/index.ts
mkdir -p src/features/{feature-name}/hooks/{state,forms,mutations,queries}

# Create domain structure
touch src/features/{feature-name}/domain/{entities,rules,errors,events,selectors}.ts

# Create store structure
touch src/features/{feature-name}/store/{feature}Store.ts
touch src/features/{feature-name}/store/types.ts

# Create service structure
touch src/features/{feature-name}/services/index.ts
touch src/features/{feature-name}/services/{feature}Service.ts

# Create type structure
touch src/features/{feature-name}/types/index.ts

# Create constants
touch src/features/{feature-name}/constants/index.ts
```

### Step 3: Implement Core Structure

#### Domain Layer (Start Here)

```typescript
// src/features/{feature-name}/domain/entities.ts
export interface {Feature}Entity {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// src/features/{feature-name}/domain/rules.ts
export const validate{Feature} = (data: any): ValidationResult => {
  // Business validation logic
};
```

#### Store Layer

```typescript
// src/features/{feature-name}/store/{feature}Store.ts
interface {Feature}Store {
  data: {Feature}Entity[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const use{Feature}Store = create<{Feature}Store>()(
  devtools(
    (set, get) => ({
      // Implementation
    })
  )
);
```

#### Service Layer

```typescript
// src/features/{feature-name}/services/{feature}Service.ts
export class {Feature}Service {
  static async getData(): Promise<{Feature}Entity[]> {
    // API implementation
  }
}
```

#### Hooks Layer

```typescript
// src/features/{feature-name}/hooks/use{Feature}.ts
export const use{Feature} = () => {
  const { data, loading, error, fetchData } = use{Feature}Store();

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refresh: fetchData };
};
```

#### Components Layer

```typescript
// src/features/{feature-name}/components/{Feature}List.tsx
interface {Feature}ListProps {
  data: {Feature}Entity[];
  loading: boolean;
  onRefresh: () => void;
}

export const {Feature}List: React.FC<{Feature}ListProps> = ({ data, loading, onRefresh }) => {
  // Component implementation
};
```

#### Public API

```typescript
// src/features/{feature-name}/index.ts
export { {Feature}List } from './components/{Feature}List';
export { use{Feature} } from './hooks/use{Feature}';
export type { {Feature}Entity } from './domain/entities';
```

### Step 4: Documentation

````markdown
# {Feature Name} Feature

Brief description of the feature and its purpose.

## Structure

```bash
{feature-name}/
├── components/          # UI components
├── containers/          # Business logic containers
├── hooks/              # Custom React hooks
├── domain/             # Business logic and entities
├── store/              # State management
├── services/           # API and business logic
├── types/              # TypeScript definitions
├── constants/          # Configuration constants
└── utils/              # Utility functions
```
````

## Usage

```tsx
import { {Feature}List, use{Feature} } from '@/features/{feature-name}';

const {Feature}Page = () => {
  const { data, loading, error } = use{Feature}();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <{Feature}List data={data} />;
};
```

````

## 📋 Feature Creation Checklist

- [ ] Create folder structure following the standard pattern
- [ ] Implement domain entities and business rules
- [ ] Create Zustand store for state management
- [ ] Implement service layer for API communication
- [ ] Create custom hooks for business logic
- [ ] Build UI components with proper TypeScript interfaces
- [ ] Create container components for business logic
- [ ] Define comprehensive type definitions
- [ ] Set up constants and configuration
- [ ] Create public API exports in index.ts
- [ ] Write comprehensive README documentation
- [ ] Ensure proper error handling and loading states
- [ ] Implement accessibility features
- [ ] Add proper TypeScript types throughout
- [ ] Test component integration and state management

## 🔧 Best Practices

### 1. **Start with Domain Layer**
- Define entities and business rules first
- Ensure proper validation and error handling
- Follow domain-driven design principles

### 2. **State Management**
- Use Zustand for feature-specific state
- Keep stores focused and single-purpose
- Implement proper loading and error states

### 3. **Component Design**
- Follow atomic design principles
- Use proper TypeScript interfaces
- Implement accessibility features
- Handle loading, error, and empty states

### 4. **Hook Organization**
- Group hooks by functionality
- Keep hooks focused and single-purpose
- Implement proper error handling
- Use early return patterns for clarity

### 5. **Service Layer**
- Handle API communication
- Implement proper error handling
- Use consistent error messages
- Cache data when appropriate

### 6. **Type Safety**
- Define comprehensive interfaces
- Use proper TypeScript features
- Avoid `any` types
- Export types through index files

### 7. **Documentation**
- Write clear README files
- Document component props and usage
- Provide usage examples
- Keep documentation up-to-date

## 🎯 Example: Job Type Feature

Here's how the job-type feature follows this pattern:

```bash
src/features/job-type/
├── index.ts                    # Exports JobTypeList, useJobType, etc.
├── README.md                   # Feature documentation
├── components/                 # UI components
│   ├── JobTypeCard.tsx        # Individual job type display
│   ├── JobTypeList.tsx        # List of job types
│   └── index.ts               # Component exports
├── hooks/                      # Custom hooks
│   ├── useJobType.ts          # Main job type hook
│   └── index.ts               # Hook exports
├── domain/                     # Business logic
│   ├── entities.ts            # JobType entity definition
│   └── rules.ts               # Validation rules
├── store/                      # State management
│   └── jobTypeStore.ts        # Zustand store
├── services/                   # API communication
│   └── jobTypeService.ts      # Job type API service
├── types/                      # TypeScript definitions
│   └── index.ts               # Type exports
└── constants/                  # Configuration
    └── index.ts               # Constants exports
````

## 🚀 Benefits of This Structure

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Easy to add new features and functionality
3. **Testability**: Isolated components and logic
4. **Reusability**: Components and hooks can be easily reused
5. **Type Safety**: Comprehensive TypeScript support
6. **Developer Experience**: Clear file organization and imports
7. **Code Quality**: Consistent patterns across features
8. **Performance**: Optimized state management and data flow

## 📚 Additional Resources

- [Atomic Design Principles](https://bradfrost.com/blog/post/atomic-web-design/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)

---

**Note**: This structure should be followed for all new features to maintain
consistency and quality across the application. Each feature should be
self-contained while following the established patterns and principles.
