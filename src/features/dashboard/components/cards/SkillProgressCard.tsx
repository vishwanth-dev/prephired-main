import React from 'react';
import { SkillCategory } from '../../types';

interface SkillProgressCardProps {
  skills: SkillCategory[];
  focusAreas?: string[];
  className?: string;
}

const SkillProgressCard: React.FC<SkillProgressCardProps> = ({
  skills,
  focusAreas = ['System Design', 'Data Structures', 'Conflict Resolution'],
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#ECECEC] rounded-[40px] p-6 ${className}`}>
      <div className='mb-8'>
        <h2 className='text-2xl font-medium text-[#363848] mb-2'>Skill Progress</h2>
        <p className='text-lg text-[#989898]'>Your interview skill development</p>
      </div>

      <div className='space-y-10'>
        {skills.map(skill => (
          <div key={skill.id} className='flex items-center justify-between'>
            <div className='flex-1'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-lg font-medium text-[#363848]'>{skill.label}</span>
                <span className='text-xl font-normal text-[#989898]'>{skill.percentage}%</span>
              </div>
              <div className='w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full transition-all duration-500'
                  style={{
                    width: `${skill.percentage}%`,
                    background: `linear-gradient(90deg, ${skill.color} 0%, ${skill.color} 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Focus Areas Section */}
      <div className='mt-12'>
        <h3 className='text-2xl font-medium text-[#363848] mb-6'>Suggested Focus Areas</h3>
        <div className='flex flex-wrap gap-3'>
          {focusAreas.map((area, index) => (
            <div
              key={index}
              className='px-4 py-2 bg-[#FFF5F3] border border-[#EC7E6B] rounded-[42px] text-[#F0806C] font-medium text-sm'
            >
              {area}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillProgressCard;
