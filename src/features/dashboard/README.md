# Dashboard Feature

A comprehensive dashboard system for the PrepaiHaired application with sidebar
navigation and analytics components.

## Structure

```bash
dashboard/
├── components/          # UI components
│   ├── cards/          # Dashboard card components
│   ├── header/         # Dashboard header with logo and user menu
│   ├── sidebar/        # Navigation sidebar
│   └── index.ts        # Component exports
├── constants/           # Constants and configuration
├── container/           # Main container components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and business logic
├── templates/          # Layout templates
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
- **DashboardLayout**: Layout template for dashboard pages

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

// Use in a page
const DashboardPage = () => {
  return <DashboardContainer />;
};

// Or use the layout template
import { DashboardLayout } from '@/features/dashboard';

const CustomDashboardPage = () => {
  return (
    <DashboardLayout>
      <div>Custom dashboard content</div>
    </DashboardLayout>
  );
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
