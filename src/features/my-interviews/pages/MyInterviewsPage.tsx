import React from 'react';
import MyInterviewsContainer from '../container/MyInterviewsContainer';
import { MyInterviewsPageProps } from '../types';

const MyInterviewsPage: React.FC<MyInterviewsPageProps> = ({ className = '' }) => {
  return <MyInterviewsContainer className={className} />;
};

export default MyInterviewsPage;
