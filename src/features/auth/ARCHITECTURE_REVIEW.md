# 🔐 Auth Feature Architecture Review: Entities Consolidation & Deprecation

## **📊 Current Status: Entities Usage Analysis**

### **✅ Successfully Consolidated Entities**

#### 1. **User & UserProfile** - **CONSOLIDATED** ✅

```typescript
// ❌ BEFORE: Local interface in authStore.ts
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

// ✅ AFTER: Using @entities.ts
import { User, UserProfile } from '@/features/auth/domain/entities';
```

#### 2. **Tenant & TenantId** - **CONSOLIDATED** ✅

```typescript
// ❌ BEFORE: Local interface in tenantStore.ts
interface Tenant {
  id: string;
  name: string;
  // ... other properties
}

// ✅ AFTER: Using @entities.ts
import { Tenant, TenantId } from '@/features/auth/domain/entities';
```

#### 3. **Session** - **CONSOLIDATED** ✅

```typescript
// ❌ BEFORE: Local interface in authStore.ts
interface Session {
  id: string;
  userId: string;
  // ... other properties
}

// ✅ AFTER: Using @entities.ts
import { Session } from '@/features/auth/domain/entities';
```

### **⚠️ Entities That Need Consolidation**

#### 4. **AuthState Interface** - **NEEDS CONSOLIDATION** ⚠️

```typescript
// ❌ CURRENT: Duplicate interface in ui.types.ts
export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  // ... similar to domain entities
}

// ✅ SHOULD USE: From @entities.ts
import { AuthState } from '@/features/auth/domain/entities';
```

#### 5. **Form States** - **NEEDS CONSOLIDATION** ⚠️

```typescript
// ❌ CURRENT: Duplicate form interfaces in ui.types.ts
export interface LoginFormState {
  readonly emailOrPhone: string;
  readonly password: string;
  // ... similar to domain entities
}

// ✅ SHOULD USE: From @entities.ts
import { LoginForm, RegisterForm } from '@/features/auth/domain/entities';
```

### **❌ Entities That Should Be Deprecated**

#### 6. **Duplicate AuthState Interfaces** - **DEPRECATE** ❌

- **File**: `src/features/auth/types/ui.types.ts` (lines 25-145)
- **Reason**: Duplicates domain entities, violates DRY principle
- **Action**: Remove and use domain entities instead

#### 7. **Duplicate Form State Interfaces** - **DEPRECATE** ❌

- **File**: `src/features/auth/types/ui.types.ts` (lines 155-288)
- **Reason**: Duplicates domain entities, creates maintenance overhead
- **Action**: Remove and use domain entities instead

#### 8. **Unused UI Type Interfaces** - **DEPRECATE** ❌

- **File**: `src/features/auth/types/ui.types.ts` (lines 329-602)
- **Reason**: Many interfaces are not used anywhere in the codebase
- **Action**: Remove unused interfaces, keep only essential ones

## **🔧 Recommended Actions**

### **Phase 1: Immediate Consolidation**

1. ✅ **COMPLETED**: Replace local interfaces with domain entities in stores
2. ✅ **COMPLETED**: Update imports to use `@/features/auth/domain/entities`
3. ⚠️ **PENDING**: Remove duplicate AuthState interface from ui.types.ts

### **Phase 2: Clean Up Deprecated Types**

1. ❌ **DEPRECATE**: Remove duplicate form state interfaces
2. ❌ **DEPRECATE**: Remove unused UI type interfaces
3. ❌ **DEPRECATE**: Clean up session.types.ts if not needed

### **Phase 3: Final Architecture**

1. ✅ **MAINTAIN**: Single source of truth in domain/entities.ts
2. ✅ **MAINTAIN**: Clean separation between domain and UI types
3. ✅ **MAINTAIN**: Proper SOLID principles implementation

## **📁 Final Folder Structure**

```
src/features/auth/
├── domain/
│   ├── entities.ts          # ✅ SINGLE SOURCE OF TRUTH
│   ├── rules.ts             # ✅ Business logic
│   ├── errors.ts            # ✅ Domain errors
│   └── events.ts            # ✅ Domain events
├── store/
│   ├── authStore.ts         # ✅ Uses domain entities
│   ├── userStore.ts         # ✅ Uses domain entities
│   └── tenantStore.ts       # ✅ Uses domain entities
├── types/
│   ├── index.ts             # ✅ Re-exports domain entities
│   └── ui.types.ts          # ⚠️ Clean up needed
└── components/               # ✅ Uses domain entities via stores
```

## **🎯 Benefits of Consolidation**

1. **✅ Single Source of Truth**: All entities defined in one place
2. **✅ Type Safety**: Consistent types across the entire feature
3. **✅ Maintainability**: Changes in one place propagate everywhere
4. **✅ SOLID Principles**: Proper separation of concerns
5. **✅ DRY Principle**: No duplicate interface definitions
6. **✅ Developer Experience**: Clear imports and better IntelliSense

## **⚠️ Current Issues to Fix**

1. **Type Mismatches**: Some components still use old interfaces
2. **Import Paths**: Need to update all imports to use domain entities
3. **Duplicate Definitions**: Remove redundant interface definitions
4. **Unused Types**: Clean up unused type definitions

## **🚀 Next Steps**

1. **Immediate**: Update remaining components to use domain entities
2. **Short-term**: Remove deprecated duplicate interfaces
3. **Long-term**: Establish linting rules to prevent future duplication
4. **Ongoing**: Maintain single source of truth in domain/entities.ts
