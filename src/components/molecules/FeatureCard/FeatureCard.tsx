import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Icon } from '@/components/atoms/icon';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onAction?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color,
  onAction,
}) => {
  return (
    <Card className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
      <CardHeader className='p-0'>
        <div
          className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 text-white text-2xl`}
        >
          <Icon size='xl' color='white'>
            {icon}
          </Icon>
        </div>
        <CardTitle className='text-2xl font-bold text-gray-900 mb-4'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <p className='text-gray-600 mb-6 leading-relaxed'>{description}</p>
        <button
          onClick={onAction}
          className='text-orange-600 hover:text-orange-700 font-semibold group'
        >
          Get Started →
        </button>
      </CardContent>
    </Card>
  );
};
