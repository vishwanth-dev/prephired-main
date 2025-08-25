# Dashboard Feature

A comprehensive dashboard system for the PrepaiHaired application with sidebar
navigation and analytics components.

## Structure

```bash
dashboard/
├── ARCHITECTURE_REVIEW.md  # Feature architecture notes
├── components/          # UI components
│   ├── cards/          # Dashboard card components
│   ├── header/         # Dashboard header with logo and user menu
│   ├── sidebar/        # Navigation sidebar
│   └── index.ts        # Component exports
├── constants/          # Constants and configuration
├── containers/         # Feature containers
├── hooks/              # Custom React hooks
├── routes/             # Route definitions
├── services/           # API and business logic
├── types/              # TypeScript type definitions
└── index.ts            # Feature exports
```

## Components

### Cards

- **StatsCard**: Displays key metrics with icons and colors
- **WelcomeCard**: Welcome message with user name and illustration
- **SkillProgressCard**: Shows skill categories with progress bars
- **SentimentCard**: Displays sentiment analysis and mood scores
- **InterviewHistoryCard**: Lists recent interviews with scores
- **FocusAreasCard**: Suggested improvement areas with icons
- **ChartCard**: Placeholder for performance charts

### Layout

- **DashboardSidebar**: Navigation sidebar with menu items
- **DashboardHeader**: Top header with logo and user controls

## Features

- **Responsive Design**: Mobile-first responsive layout
- **Sidebar Navigation**: Collapsible navigation with active states
- **Data Visualization**: Progress bars, charts, and metrics
- **Loading States**: Skeleton loaders and error handling
- **Accessibility**: ARIA labels and keyboard navigation
- **Theme Support**: Consistent color scheme and typography

## Usage

```tsx
import { DashboardContainer } from '@/features/dashboard';

const DashboardPage = () => {
  return <DashboardContainer />;
};
```

## Data Structure

The dashboard uses mock data from the `DashboardService` which provides:

- User profile information
- Performance statistics
- Skill progress data
- Interview history
- Sentiment analysis
- Focus area recommendations

## Styling

Uses TailwindCSS with custom color variables:

- Primary: `#F0806C` (Coral)
- Background: `#F6F6F6` (Light Gray)
- Text: `#363848` (Dark Gray)
- Accent: `#ECECEC` (Border Gray)
