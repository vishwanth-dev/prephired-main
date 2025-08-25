// =============================================================================
// JOB TYPE FEATURE TYPES
// =============================================================================

export interface JobType {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface InterviewType {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

export interface TimeOption {
  id: string;
  value: number;
  label: string;
  selected: boolean;
}

export interface JobTypeFormData {
  jobRole: string;
  questionType: string;
  experienceLevel: string;
  interviewTypes: InterviewType[];
  selectedTime: TimeOption | null;
  codingProficiency: string;
}

export interface JobTypeFormProps {
  onSubmit: (data: JobTypeFormData) => void;
  onCancel: () => void;
  initialData?: Partial<JobTypeFormData>;
}

export interface InterviewTypeSelectorProps {
  interviewTypes: InterviewType[];
  onSelectionChange: (types: InterviewType[]) => void;
}

export interface TimeSelectorProps {
  timeOptions: TimeOption[];
  selectedTime: TimeOption | null;
  onTimeSelect: (time: TimeOption) => void;
}

export interface GuidelinesPanelProps {
  className?: string;
}
