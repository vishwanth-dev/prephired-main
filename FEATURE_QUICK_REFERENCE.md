# 🚀 Feature Quick Reference Guide

## 📋 One-Command Setup

```bash
# Replace {feature-name} with your actual feature name
mkdir -p src/features/{feature-name}/{components/{forms,ui,inputs,layout,display,cards},containers,hooks/{state,forms,mutations,queries},domain,store,services,types,constants,utils} && \
touch src/features/{feature-name}/{index.ts,README.md} && \
touch src/features/{feature-name}/components/index.ts && \
touch src/features/{feature-name}/hooks/index.ts && \
touch src/features/{feature-name}/domain/{entities,rules,errors,events,selectors}.ts && \
touch src/features/{feature-name}/store/{feature}Store.ts && \
touch src/features/{feature-name}/store/types.ts && \
touch src/features/{feature-name}/services/{feature}Service.ts && \
touch src/features/{feature-name}/services/index.ts && \
touch src/features/{feature-name}/types/index.ts && \
touch src/features/{feature-name}/constants/index.ts
```

## 🔧 Essential File Templates

### 1. `index.ts` - Public API

```typescript
// src/features/{feature-name}/index.ts
export { {Feature}List } from './components/{Feature}List';
export { {Feature}Form } from './components/forms/{Feature}Form';
export { use{Feature} } from './hooks/use{Feature}';
export type { {Feature}Entity, {Feature}Form } from './domain/entities';
```

### 2. `domain/entities.ts` - Core Entities

```typescript
// src/features/{feature-name}/domain/entities.ts
export interface {Feature}Entity {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly status: 'active' | 'inactive';
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface {Feature}Form {
  name: string;
  description?: string;
}
```

### 3. `store/{feature}Store.ts` - State Management

```typescript
// src/features/{feature-name}/store/{feature}Store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { {Feature}Entity } from '../domain/entities';

interface {Feature}Store {
  data: {Feature}Entity[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  create{Feature}: (data: {Feature}Form) => Promise<void>;
}

export const use{Feature}Store = create<{Feature}Store>()(
  devtools(
    (set, get) => ({
      data: [],
      loading: false,
      error: null,

      fetchData: async () => {
        set({ loading: true, error: null });
        try {
          // API call implementation
          set({ loading: false });
        } catch (error) {
          set({ loading: false, error: error.message });
        }
      },

      create{Feature}: async (data) => {
        // Implementation
      },
    })
  )
);
```

### 4. `hooks/use{Feature}.ts` - Custom Hook

```typescript
// src/features/{feature-name}/hooks/use{Feature}.ts
import { useEffect } from 'react';
import { use{Feature}Store } from '../store/{feature}Store';

export const use{Feature} = () => {
  const { data, loading, error, fetchData } = use{Feature}Store();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
```

### 5. `components/{Feature}List.tsx` - Main Component

```typescript
// src/features/{feature-name}/components/{Feature}List.tsx
import React from 'react';
import { {Feature}Entity } from '../domain/entities';

interface {Feature}ListProps {
  data: {Feature}Entity[];
  loading: boolean;
  onRefresh: () => void;
}

export const {Feature}List: React.FC<{Feature}ListProps> = ({
  data,
  loading,
  onRefresh
}) => {
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### 6. `services/{feature}Service.ts` - API Service

```typescript
// src/features/{feature-name}/services/{feature}Service.ts
import { {Feature}Entity, {Feature}Form } from '../domain/entities';

export class {Feature}Service {
  static async getData(): Promise<{Feature}Entity[]> {
    try {
      // API implementation
      return [];
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  }

  static async create(data: {Feature}Form): Promise<{Feature}Entity> {
    // Implementation
  }
}
```

### 7. `types/index.ts` - Type Exports

```typescript
// src/features/{feature-name}/types/index.ts
export type { {Feature}Entity, {Feature}Form } from '../domain/entities';
export type { {Feature}ListProps } from '../components/{Feature}List';
```

### 8. `constants/index.ts` - Configuration

```typescript
// src/features/{feature-name}/constants/index.ts
export const {FEATURE}_CONFIG = {
  API_ENDPOINTS: {
    LIST: '/api/{feature}',
    CREATE: '/api/{feature}',
    UPDATE: '/api/{feature}/:id',
    DELETE: '/api/{feature}/:id',
  },
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
  },
} as const;
```

## 📝 README Template

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

## Components

- **{Feature}List**: Main list component
- **{Feature}Form**: Form for creating/editing
- **{Feature}Card**: Individual item display

## Hooks

- **use{Feature}**: Main data fetching hook
- **use{Feature}Form**: Form management hook

## API Endpoints

- `GET /api/{feature}` - List all items
- `POST /api/{feature}` - Create new item
- `PUT /api/{feature}/:id` - Update item
- `DELETE /api/{feature}/:id` - Delete item

```

```

## 🎯 Naming Conventions

| Item            | Convention       | Example                                      |
| --------------- | ---------------- | -------------------------------------------- |
| Feature Folder  | kebab-case       | `job-type`, `user-profile`                   |
| Component Files | PascalCase       | `JobTypeList.tsx`, `UserProfileCard.tsx`     |
| Hook Files      | camelCase        | `useJobType.ts`, `useUserProfile.ts`         |
| Store Files     | camelCase        | `jobTypeStore.ts`, `userProfileStore.ts`     |
| Service Files   | PascalCase       | `JobTypeService.ts`, `UserProfileService.ts` |
| Type Files      | camelCase        | `entities.ts`, `types.ts`                    |
| Constants       | UPPER_SNAKE_CASE | `JOB_TYPE_CONFIG`, `USER_PROFILE_CONFIG`     |

## 🔄 Implementation Order

1. **Domain Layer** - Define entities and business rules
2. **Store Layer** - Create Zustand store
3. **Service Layer** - Implement API communication
4. **Hooks Layer** - Create custom hooks
5. **Components Layer** - Build UI components
6. **Public API** - Export everything through index.ts
7. **Documentation** - Write README and usage examples

## ✅ Quick Checklist

- [ ] Folder structure created
- [ ] Domain entities defined
- [ ] Store implemented
- [ ] Service layer created
- [ ] Custom hooks written
- [ ] Components built
- [ ] Types exported
- [ ] Constants defined
- [ ] Public API exposed
- [ ] README written
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] TypeScript types complete

## 🚨 Common Mistakes to Avoid

1. **❌ Don't skip the domain layer** - Start with business logic
2. **❌ Don't mix concerns** - Keep components, hooks, and business logic
   separate
3. **❌ Don't forget error handling** - Always handle loading and error states
4. **❌ Don't use `any` types** - Use proper TypeScript interfaces
5. **❌ Don't forget exports** - Export everything through index.ts
6. **❌ Don't skip documentation** - Write clear README files

## 🔗 Related Documentation

- [Full Feature Structure Documentation](./FEATURE_FOLDER_STRUCTURE_DOCUMENTATION.md)
- [Atomic Design Principles](https://bradfrost.com/blog/post/atomic-web-design/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

**Remember**: Follow the established patterns for consistency and
maintainability!
