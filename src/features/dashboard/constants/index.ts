export interface SideBarItem {
  id: string;
  activeIcon: string;
  inactiveIcon: string;
  label: string;
  isActive: boolean;
  path: string;
  type?: 'link' | 'button';
}

export const SIDEBAR_NAVIGATION_ITEMS: SideBarItem[] = [
  {
    id: 'dashboard',
    activeIcon: 'LayoutPrimary',
    inactiveIcon: 'Layout',
    label: 'Dashboard',
    path: '/dashboard',
    type: 'link',
    isActive: true,
  },
  {
    id: 'interviews',
    activeIcon: 'NotepadPrimary',
    inactiveIcon: 'Notepad',
    label: 'My Interviews',
    path: '/dashboard/my-interviews',
    type: 'link',
    isActive: false,
  },
  {
    id: 'streaks',
    activeIcon: 'ShareRoundedPrimary',
    inactiveIcon: 'ShareRounded',
    label: 'Streaks',
    path: '/dashboard/streaks',
    type: 'link',
    isActive: false,
  },
];

export const SIDEBAR_BOTTOM_ITEMS: SideBarItem[] = [
  {
    id: 'settings',
    activeIcon: 'SettingsPrimary',
    inactiveIcon: 'Settings',
    label: 'Settings',
    path: '/dashboard/settings',
    type: 'link',
    isActive: false,
  },
  {
    id: 'subscription',
    activeIcon: 'RefreshPrimary',
    inactiveIcon: 'Refresh',
    label: 'Subscription',
    path: '/dashboard/subscription',
    type: 'link',
    isActive: false,
  },
];

export const SKILL_CATEGORIES = [
  {
    id: 'technical',
    label: 'Technical Knowledge',
    percentage: 78,
    color: '#F0806C',
  },
  {
    id: 'cognitive',
    label: 'Cognitive',
    percentage: 92,
    color: '#6783FF',
  },
  {
    id: 'soft',
    label: 'Soft',
    percentage: 65,
    color: '#F0806C',
  },
  {
    id: 'behavioral',
    label: 'Behavioral Fit',
    percentage: 85,
    color: '#E360FA',
  },
  {
    id: 'growth',
    label: 'Growth Index',
    percentage: 62,
    color: '#FADB60',
  },
  {
    id: 'comprehensive',
    label: 'Comprehensive Skills',
    percentage: 68,
    color: '#60FAA8',
  },
];

export const SENTIMENT_DATA = [
  {
    label: 'Positive',
    percentage: 70,
    color: '#19B278',
  },
  {
    label: 'Neutral',
    percentage: 20,
    color: '#FF8E07',
  },
  {
    label: 'Negative',
    percentage: 10,
    color: '#E54846',
  },
];

export const INTERVIEW_TYPES = [
  {
    id: 'ui-ux',
    label: 'UI/UX Designer',
    date: 'May 20, 2025',
    duration: '32 min',
    overallScore: 83,
    resumeScore: 94,
    categories: [
      { name: 'HR', color: '#F0806C', icon: 'HR' },
      { name: 'SoftSkill', color: '#6783FF', icon: 'SoftSkill' },
      { name: 'Psychometric & Personality', color: '#E360FA', icon: 'Psychometric' },
    ],
  },
  {
    id: 'hr-behavioral',
    label: 'HR & Behavioral Fit',
    date: 'May 20, 2025',
    duration: '32 min',
    overallScore: 83,
    resumeScore: 94,
    categories: [
      { name: 'HR', color: '#F0806C', icon: 'HR' },
      { name: 'SoftSkill', color: '#6783FF', icon: 'SoftSkill' },
      { name: 'Psychometric & Personality', color: '#E360FA', icon: 'Psychometric' },
    ],
  },
  {
    id: 'soft-skills',
    label: 'Soft Skills',
    date: 'May 20, 2025',
    duration: '32 min',
    overallScore: 83,
    resumeScore: 94,
    categories: [
      { name: 'HR', color: '#F0806C', icon: 'HR' },
      { name: 'SoftSkill', color: '#6783FF', icon: 'SoftSkill' },
      { name: 'Psychometric & Personality', color: '#E360FA', icon: 'Psychometric' },
    ],
  },
  {
    id: 'psychometric',
    label: 'Psychometric & Perso..',
    date: 'May 20, 2025',
    duration: '32 min',
    overallScore: 83,
    resumeScore: 94,
    categories: [
      { name: 'HR', color: '#F0806C', icon: 'HR' },
      { name: 'SoftSkill', color: '#6783FF', icon: 'SoftSkill' },
      { name: 'Psychometric & Personality', color: '#E360FA', icon: 'Psychometric' },
    ],
  },
  {
    id: 'technical-skills',
    label: 'Technical Skills',
    date: 'May 20, 2025',
    duration: '32 min',
    overallScore: 83,
    resumeScore: 94,
    categories: [
      { name: 'HR', color: '#F0806C', icon: 'HR' },
      { name: 'SoftSkill', color: '#6783FF', icon: 'SoftSkill' },
      { name: 'Psychometric & Personality', color: '#E360FA', icon: 'Psychometric' },
    ],
  },
];

export const SUGGESTED_FOCUS_AREAS = [
  {
    id: 'communication',
    title: 'Communication Skills',
    description: 'Improve your verbal and non-verbal communication during interviews',
    icon: 'communication',
    color: '#F0806C',
  },
  {
    id: 'technical',
    title: 'Technical Knowledge',
    description: 'Enhance your technical expertise and problem-solving abilities',
    icon: 'technical',
    color: '#4CAF50',
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    description: 'Develop better analytical and critical thinking skills',
    icon: 'problem-solving',
    color: '#2196F3',
  },
  {
    id: 'behavioral',
    title: 'Behavioral Questions',
    description: 'Master STAR method for behavioral interview questions',
    icon: 'communication',
    color: '#FF9800',
  },
];
