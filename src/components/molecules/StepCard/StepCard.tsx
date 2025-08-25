import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Icon } from '@/components/atoms/icon';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export const StepCard: React.FC<StepCardProps> = ({ number, title, description, icon }) => {
  return (
    <Card className='relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
      <div className='absolute -top-4 -right-4 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg'>
        {number}
      </div>
      <CardHeader className='p-0'>
        <div className='w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl'>
          <Icon size='xl' color='white'>
            {icon}
          </Icon>
        </div>
        <CardTitle className='text-2xl font-bold text-gray-900 mb-4'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <p className='text-gray-600 leading-relaxed'>{description}</p>
      </CardContent>
    </Card>
  );
};
