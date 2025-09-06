'use client';

import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const variants = {
  primary: {
    startColor: '#8B5CF6', // purple-500
    endColor: '#F97316', // orange-500
    textColor: '#F97316',
  },
  success: {
    startColor: '#10B981', // emerald-500
    endColor: '#34D399', // emerald-400
    textColor: '#059669', // emerald-600
  },
  warning: {
    startColor: '#F59E0B', // amber-500
    endColor: '#FCD34D', // amber-300
    textColor: '#D97706', // amber-600
  },
  danger: {
    startColor: '#EF4444', // red-500
    endColor: '#F87171', // red-400
    textColor: '#DC2626', // red-600
  },
  info: {
    startColor: '#3B82F6', // blue-500
    endColor: '#60A5FA', // blue-400
    textColor: '#2563EB', // blue-600
  },
};

const sizes = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-80 h-80',
};

export interface CircularProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Size of the circle in pixels */
  size?: number;
  /** Stroke width of the progress ring */
  strokeWidth?: number;
  /** Custom className for styling */
  className?: string;
  /** Show percentage text in center */
  showPercentage?: boolean;
  /** Custom text to display instead of percentage */
  customText?: string;
  /** Color variant for different use cases */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Custom gradient colors [start, end] */
  customGradient?: [string, string];
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Whether to animate on mount */
  animate?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 200,
  strokeWidth = 20,
  className = '',
  showPercentage = true,
  customText,
  variant = 'default',
  customGradient,
  animationDuration = 1000,
  animate = true,
}) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  // Gradient color variants
  const gradientVariants = {
    default: ['#8B5CF6', '#F97316'], // Purple to Orange (like the image)
    success: ['#10B981', '#34D399'], // Green gradient
    warning: ['#F59E0B', '#FCD34D'], // Yellow/Orange gradient
    danger: ['#EF4444', '#F87171'], // Red gradient
    info: ['#3B82F6', '#60A5FA'], // Blue gradient
  };

  const [startColor, endColor] = customGradient || gradientVariants[variant];
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  // Text content
  const displayText = customText || (showPercentage ? `${Math.round(clampedValue)}%` : '');

  // Font size based on circle size
  const fontSize = size * 0.2; // 20% of circle size
  const fontWeight = 600;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className='relative'>
        <svg width={size} height={size} className='transform rotate-[124deg]'>
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor={startColor} />
              <stop offset='100%' stopColor={endColor} />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='transparent'
            stroke='#E5E7EB'
            strokeWidth={strokeWidth}
            className='opacity-20'
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='transparent'
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animate ? strokeDasharray : strokeDashoffset}
            strokeLinecap='round'
            className='transition-all duration-1000 ease-out'
            style={{
              strokeDashoffset: animate ? strokeDashoffset : undefined,
              transitionDuration: animate ? `${animationDuration}ms` : '0ms',
            }}
          />
        </svg>

        {/* Center text */}
        {displayText && (
          <div
            className='absolute inset-0 flex items-center justify-center'
            style={{
              fontSize: `${fontSize}px`,
              fontWeight,
              color: endColor, // Use end color for text
            }}
          >
            <span className='font-poppins leading-none'>{displayText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const GradientCircularProgress = ({ value = 68 }) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className='w-40 h-40 relative'>
      {/* Hidden SVG for gradient definition */}
      <svg className='absolute w-0 h-0'>
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='16%' stopColor='#3C30C4' className='' />
            <stop offset='68%' stopColor='#F0806C' className='' />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          rotation: 0.67, // Match the 124deg rotation
          pathColor: `url(#${gradientId})`,
          textColor: '#F0806C', // text-orange-500
          trailColor: '#E5E7EB', // bg-gray-200
          strokeLinecap: 'round',
          pathTransitionDuration: 1,
          textSize: '28px',
        })}
        strokeWidth={10}
        className='font-semibold'
        circleRatio={0.65}
      />
    </div>
  );
};

export const ResponsiveGradientProgress = ({ value = 68, className = '', showText = true }) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`
      w-48 h-48 
      sm:w-56 sm:h-56 
      md:w-64 md:h-64 
      lg:w-72 lg:h-72
      relative
      ${className}
    `}
    >
      <svg className='absolute w-0 h-0'>
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#8B5CF6' />
            <stop offset='100%' stopColor='#F97316' />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgressbar
        value={value}
        text={showText ? `${value}%` : ''}
        styles={buildStyles({
          rotation: 0.62,
          pathColor: `url(#${gradientId})`,
          textColor: '#F97316',
          trailColor: 'rgba(229, 231, 235, 0.2)',
          strokeLinecap: 'round',
          pathTransitionDuration: 1.2,
          textSize: '24px',
        })}
        strokeWidth={6}
        className='font-poppins font-semibold'
      />
    </div>
  );
};

interface CustomCircularProgressProps {
  value: number;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  strokeWidth?: number;
  showPercentage?: boolean;
  customText?: string;
  animated?: boolean;
  className?: string;
}

export const CustomCircularProgress = ({
  value = 68,
  variant = 'primary',
  size = 'lg',
  strokeWidth = 6,
  showPercentage = true,
  customText = '',
  animated = true,
  className = '',
}: CustomCircularProgressProps) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const colors = variants[variant];
  const sizeClass = sizes[size];

  const displayText = customText || (showPercentage ? `${Math.round(value)}%` : '');

  return (
    <div
      className={`
      ${sizeClass}
      relative 
      inline-flex 
      items-center 
      justify-center
      ${className}
    `}
    >
      <svg className='absolute w-0 h-0'>
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor={colors.startColor} />
            <stop offset='100%' stopColor={colors.endColor} />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgressbar
        value={Math.max(0, Math.min(100, value))}
        text={displayText}
        styles={buildStyles({
          rotation: 0.62,
          pathColor: `url(#${gradientId})`,
          textColor: colors.textColor,
          trailColor: 'rgba(229, 231, 235, 0.15)',
          strokeLinecap: 'round',
          pathTransitionDuration: animated ? 1.5 : 0,
          textSize:
            size === 'sm' ? '20px' : size === 'md' ? '24px' : size === 'lg' ? '28px' : '32px',
        })}
        strokeWidth={strokeWidth}
        className='font-poppins font-semibold antialiased'
      />
    </div>
  );
};
