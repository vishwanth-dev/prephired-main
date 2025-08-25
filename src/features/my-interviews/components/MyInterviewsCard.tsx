'use client';

import React from 'react';
import { InterviewData } from '../types';
import GridMyInterviewCard from './GridMyInterviewCard';
import ListMyInterviewCard from './ListMyInterviewCard';

export interface BaseMyInterviewCardProps {
  interview: InterviewData;
  className?: string;
  onViewReport: (id: string) => void;
  onRetake: (id: string) => void;
}

interface MyInterviewsCardProps extends BaseMyInterviewCardProps {
  viewMode: 'grid' | 'list';
}

const MyInterviewsCard: React.FC<MyInterviewsCardProps> = ({
  interview,
  className = '',
  onViewReport,
  onRetake,
  viewMode = 'list',
}) => {
  console.log(viewMode);
  if (viewMode === 'grid') {
    return (
      <GridMyInterviewCard
        interview={interview}
        className={className}
        onViewReport={onViewReport}
        onRetake={onRetake}
      />
    );
  }

  return (
    <ListMyInterviewCard
      interview={interview}
      className={className}
      onViewReport={onViewReport}
      onRetake={onRetake}
    />
  );
};

export default MyInterviewsCard;
