import React from 'react';
import { InterviewType } from '../../types';
import InterviewHistoryCard from './InterviewHistoryCard';

interface InterviewHistoryProps {
  interviews: InterviewType[];
  className?: string;
}

const InterviewHistory: React.FC<InterviewHistoryProps> = ({ interviews, className = '' }) => {
  return (
    <div
      className={`bg-white border border-[#ECECEC] rounded-4xl flex flex-col gap-8 w-full p-6 ${className}`}
    >
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-medium text-side-heading-color mb-2'>Interview History</h2>
        <p className='text-base text-support-text-color'>Your recent interview sessions</p>
      </div>

      <div className='flex flex-col gap-6 w-full'>
        {interviews.map(interview => (
          <InterviewHistoryCard
            categories={interview.categories}
            resumeScore={interview.resumeScore}
            onViewReport={() => {}}
            key={interview.id}
            title={interview.label}
            date={interview.date}
            duration={interview.duration}
            overallScore={interview.overallScore}
          />
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;
