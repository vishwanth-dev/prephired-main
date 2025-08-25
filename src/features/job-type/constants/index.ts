import { InterviewType, TimeOption } from '../types';

export const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: 'hr-behavioral',
    name: 'HR & Behavioral Fit',
    description: 'Cultural alignment, learning mindset, ethics',
    selected: false,
  },
  {
    id: 'soft-skills',
    name: 'Soft Skills',
    description: 'Focus on technical skills and problem-solving abilities',
    selected: false,
  },
  {
    id: 'technical-skills',
    name: 'Technical Skills',
    description: 'Coding Proficiency, Domain Expertise, Real World Use case',
    selected: false,
  },
  {
    id: 'cognitive-abilities',
    name: 'Cognitive Abilities',
    description:
      'Logical reasoning, problem-solving decision-making, Quantitative Aptitude, Verbal English Written Communication Test',
    selected: false,
  },
  {
    id: 'psychometric-personality',
    name: 'Psychometric & Personality',
    description: 'Resilience, work ethic, emotional intelligence',
    selected: false,
  },
  {
    id: 'business-domain-acumen',
    name: 'Business/Domain Acumen',
    description: 'Industry trends, customer centric thinking',
    selected: false,
  },
];

export const TIME_OPTIONS: TimeOption[] = [
  { id: '20', value: 20, label: '20 Minutes', selected: false },
  { id: '30', value: 30, label: '30 Minutes', selected: false },
  { id: '45', value: 45, label: '45 Minutes', selected: false },
  { id: '60', value: 60, label: '60 Minutes', selected: false },
  { id: '120', value: 120, label: '120 Minutes', selected: false },
];

export const CODING_PROFICIENCY_OPTIONS = [
  'Coding Proficiency',
  'System Design',
  'Debugging Round',
  'Coding Optimization Round',
  'Live Coding Simulation',
  'Ai Pair Programming',
  'SQL / Data Handling Round',
  'Domain Specific Round',
];

export const EXPERIENCE_LEVELS = ['0-3 Years', '3-5 Years', '5-8 Years', '8+ Years'];

export const QUESTION_TYPES = ['Beginner', 'Mid', 'Advanced', 'Expert'];
