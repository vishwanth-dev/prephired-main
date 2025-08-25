export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

export interface SkillCategory {
  id: string;
  label: string;
  percentage: number;
  color: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
  change?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  subSkills?: SkillSubCategory[];
  assessments?: AssessmentData[];
}

export interface SkillSubCategory {
  name: string;
  percentage: number;
  level: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface AssessmentData {
  date: string;
  score: number;
  type: string;
}

export interface SentimentData {
  label: string;
  percentage: number;
  color: string;
  count?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  icon: string;
}

export interface Category {
  name: string;
  color: string;
  icon: string;
  score?: number;
  weight?: number;
}

export interface InterviewType {
  id: string;
  label: string;
  date: string;
  duration: string;
  overallScore: number;
  resumeScore: number;
  status?: 'completed' | 'in-progress' | 'scheduled';
  type?: 'technical' | 'behavioral' | 'mixed';
  difficulty?: 'easy' | 'medium' | 'hard';
  categories: Category[];
  feedback?: InterviewFeedback;
  metrics?: InterviewMetrics;
}

export interface InterviewFeedback {
  strengths: string[];
  improvements: string[];
  overall: string;
}

export interface InterviewMetrics {
  responseTime: string;
  accuracy: number;
  confidence: number;
}

export interface DashboardStats {
  aiInterviewScore: number;
  resumeScore: number;
  totalInterviews: number;
  averageDuration: string;
  moodScore: number;
  averageInterviewDuration?: string;
  completionRate?: number;
  averagePreparationTime?: string;
  weekChange?: WeekChangeData;
  trends?: TrendData;
  comparisons?: ComparisonData;
  goals?: GoalData;
}

export interface WeekChangeData {
  totalInterviews: number;
  aiInterviewScore: number;
  resumeScore: number;
  moodScore: number;
  averageDuration: string;
}

export interface TrendData {
  totalInterviews: 'increasing' | 'decreasing' | 'stable';
  aiInterviewScore: 'increasing' | 'decreasing' | 'stable';
  resumeScore: 'increasing' | 'decreasing' | 'stable';
  moodScore: 'increasing' | 'decreasing' | 'stable';
  duration?: 'increasing' | 'decreasing' | 'stable';
}

export interface ComparisonData {
  peerAverage: {
    aiInterviewScore: number;
    resumeScore: number;
    moodScore: number;
  };
  industryAverage: {
    aiInterviewScore: number;
    resumeScore: number;
    moodScore: number;
  };
}

export interface GoalData {
  targetScore: number;
  currentProgress: number;
  remainingInterviews: number;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  lastActive?: string;
}

export interface FocusArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  priority?: 'high' | 'medium' | 'low';
  difficulty?: 'easy' | 'medium' | 'hard' | 'high';
  estimatedTime?: string;
  currentProgress?: number;
  targetProgress?: number;
  impact?: 'high' | 'medium' | 'low';
  resources?: Resource[];
  milestones?: Milestone[];
}

export interface Resource {
  type: 'video' | 'course' | 'practice' | 'article';
  title: string;
  url: string;
  duration?: string;
  estimatedTime?: string;
}

export interface Milestone {
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface DashboardData {
  stats: DashboardStats;
  skills: SkillCategory[];
  sentiment: SentimentData[];
  interviews: InterviewType[];
  focusAreas: FocusArea[];
  user: UserProfile;
  summary?: DashboardSummary;
}

export interface DashboardSummary {
  overallPerformance: string;
  confidence: number;
  nextInterview: string;
  recommendations: number;
}
