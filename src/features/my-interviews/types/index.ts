export interface InterviewData {
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
  interviewSynopsis: InterviewSynopsis[];
}

export interface InterviewSynopsis {
  id: string;
  label: string;
  value: string;
}

export interface MyInterviewsPageProps {
  className?: string;
}

export interface MyInterviewsContainerProps {
  className?: string;
}
