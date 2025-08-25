# My Interviews Feature

This feature provides a comprehensive view of user interview history and
performance tracking.

## 🏗️ Architecture

Following the established dashboard folder structure:

```
src/features/my-interviews/
├── components/           # UI components
│   ├── MyInterviewsCard.tsx    # Individual interview card
│   └── index.ts                # Component exports
├── container/           # Business logic containers
│   └── MyInterviewsContainer.tsx    # Main container with data handling
├── pages/              # Page components
│   └── MyInterviewsPage.tsx         # Main page component
├── types/              # TypeScript interfaces
│   └── index.ts                # Type definitions
├── constants/          # Static data and configuration
│   └── index.ts                # Mock data and constants
├── index.ts            # Feature exports
└── README.md           # This file
```

## 🎯 Components

### MyInterviewsCard

- **Purpose**: Displays individual interview information
- **Features**:
  - Interview details (date, duration, scores)
  - Skill level indicators (Low/Medium/High)
  - Category icons with color coding
  - Action buttons (View Report, Retake)
- **Props**: `InterviewData`, callback functions for actions

### MyInterviewsContainer

- **Purpose**: Manages interview data and business logic
- **Features**:
  - Renders list of interview cards
  - Handles action callbacks
  - Empty state management
  - Responsive layout

## 📊 Data Structure

### InterviewData Interface

```typescript
interface InterviewData {
  id: string;
  title: string;
  date: string;
  duration: string;
  overallScore: number;
  resumeScore: number;
  skillLevel: 'Low' | 'Medium' | 'High';
  skillCategory: string;
  focusAreas: string[];
  emotion: string;
  categories: Array<{
    name: string;
    color: string;
    icon: string;
  }>;
}
```

### Skill Level Colors

- **Low**: `#FFEED2` (bg), `#D78400` (text)
- **Medium**: `#DCFFD5` (bg), `#26A60D` (text)
- **High**: `#FFD5D4` (bg), `#BF2E2A` (text)

## 🎨 Design Features

- **Gradient Backgrounds**: Subtle gradients for visual depth
- **Color-Coded Categories**: Different colors for skill categories
- **Responsive Layout**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects and transitions
- **Consistent Typography**: Uses Poppins and Inter fonts

## 🚀 Usage

```typescript
import { MyInterviewsPage } from '@/features/my-interviews';

// In your page component
const MyInterviewsRoute = () => {
  return <MyInterviewsPage />;
};
```

## 🔧 Customization

- **Mock Data**: Update `constants/index.ts` for different interview data
- **Styling**: Modify Tailwind classes in components
- **Actions**: Implement actual functionality in container callbacks
- **Layout**: Adjust spacing and dimensions in container

## 📱 Responsive Design

- **Desktop**: Full-width layout with optimal spacing
- **Tablet**: Maintains readability with adjusted spacing
- **Mobile**: Stacked layout for better mobile experience

## 🎯 Future Enhancements

- [ ] Filtering by skill category
- [ ] Sorting by date, score, or skill level
- [ ] Search functionality
- [ ] Pagination for large interview lists
- [ ] Export functionality
- [ ] Performance analytics
