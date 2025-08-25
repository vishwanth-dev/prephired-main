# 🎯 Job Type Feature

## Overview

The Job Type feature provides a comprehensive interface for users to explore and
select different career paths and job types. It includes job categories,
detailed job type information, search functionality, and filtering capabilities.

## Features

- **Job Type Selection**: Browse through different job types with detailed
  information
- **Category Browsing**: Explore jobs by category (Technology, Design,
  Marketing, etc.)
- **Search & Filtering**: Find specific job types by skills, experience level,
  or demand
- **Popular Jobs**: Highlight trending and in-demand job types
- **Detailed Information**: Salary ranges, required skills, experience levels,
  and market demand

## Architecture

### Folder Structure

```
src/features/job-type/
├── components/           # React components
│   ├── JobTypePage.tsx  # Main page component
│   ├── JobTypeHeader.tsx # Header with search and stats
│   ├── JobTypeGrid.tsx  # Grid layout for job types
│   └── JobTypeCard.tsx  # Individual job type card
├── container/            # Container components
│   └── JobTypeContainer.tsx # Main container logic
├── hooks/               # Custom React hooks
│   └── useJobTypeSelection.ts # Job type selection logic
├── services/            # Business logic services
│   └── jobTypeService.ts # Job type data operations
├── types/               # TypeScript type definitions
│   └── index.ts        # Job type interfaces
├── constants/           # Static data and constants
│   └── index.ts        # Job types and categories data
├── index.ts            # Public API exports
└── README.md           # This file
```

### Components

#### JobTypePage

Main page component that renders the entire job type selection interface.

#### JobTypeHeader

- Search functionality for job types and skills
- Selected category display
- Quick statistics overview
- Clear selection functionality

#### JobTypeGrid

- Displays job types in a responsive grid layout
- Shows popular job types section
- Category browsing interface
- All job types listing with search results

#### JobTypeCard

Individual job type card displaying:

- Job title and description
- Required skills
- Market demand indicator
- Experience level
- Salary range
- Category information

### Hooks

#### useJobTypeSelection

Custom hook providing:

- Job type and category selection state
- Search and filtering functionality
- Filter management (experience level, demand, salary range)
- Computed values for filtered results

### Services

#### jobTypeService

Service layer providing:

- Job type data retrieval
- Search and filtering operations
- Category-based queries
- Market insights and trending skills

### Types

#### JobType

```typescript
interface JobType {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  category: JobCategory;
  skills: string[];
  demand: 'high' | 'medium' | 'low';
  averageSalary: { min: number; max: number; currency: string };
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### JobCategory

```typescript
interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  jobTypes: JobType[];
  totalJobs: number;
  growthRate: number;
}
```

## Usage

### Basic Implementation

```tsx
import { JobTypePage } from '@/features/job-type';

export default function JobTypeRoute() {
  return <JobTypePage />;
}
```

### Custom Hook Usage

```tsx
import { useJobTypeSelection } from '@/features/job-type';

function MyComponent() {
  const {
    selectedJobType,
    filteredJobTypes,
    selectJobType,
    searchQuery,
    setSearchQuery,
  } = useJobTypeSelection();

  // Use the hook functionality
}
```

### Service Usage

```tsx
import { jobTypeService } from '@/features/job-type';

// Get all job types
const jobTypes = await jobTypeService.getAllJobTypes();

// Search with filters
const results = await jobTypeService.searchJobTypes({
  query: 'developer',
  category: 'technology',
  experienceLevel: 'mid',
});
```

## Data

### Job Categories

- **Technology**: Software development, IT, technical roles
- **Design & Creative**: UI/UX, graphic design, creative roles
- **Marketing & Sales**: Digital marketing, sales, growth roles
- **Business & Operations**: Management, operations, business roles
- **Finance & Accounting**: Financial analysis, accounting, banking roles

### Job Types

Each category contains multiple job types with detailed information including:

- Required skills
- Market demand indicators
- Experience level requirements
- Salary ranges
- Growth potential

## Styling

The feature uses TailwindCSS for styling with:

- Responsive grid layouts
- Hover effects and transitions
- Color-coded indicators for demand and experience levels
- Card-based design for easy scanning
- Consistent spacing and typography

## Future Enhancements

- Advanced filtering options
- Job type comparison
- Personalized recommendations
- Integration with job boards
- Skill gap analysis
- Career path mapping
- Salary negotiation tips
- Interview preparation resources

## Dependencies

- React 18+
- TypeScript
- TailwindCSS
- Lucide React (for icons)
- Zustand (for state management if needed)

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes
- Responsive design for all devices
