'use client';

import { useDashboard } from '../hooks/useDashboard';
import WelcomeCard from '../components/cards/WelcomeCard';
import StatsCard from '../components/cards/StatsCard';
import SkillProgressCard from '../components/cards/SkillProgressCard';
import SentimentCard from '../components/cards/SentimentCard';
import InterviewHistoryCard from '../components/cards/InterviewHistory';
import Image from 'next/image';
import MoodScoreCard from '../components/cards/MoodScoreCard';

const DashboardContainer: React.FC = () => {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className='min-h-screen bg-[#F6F6F6] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-[#F0806C] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-lg text-[#626262]'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='min-h-screen bg-[#F6F6F6] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-2xl text-red-500'>⚠️</span>
          </div>
          <p className='text-lg text-[#626262]'>Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  // Extract data from service
  const { stats, skills, sentiment, interviews, focusAreas, user, summary } = data;

  return (
    <div className='flex flex-col gap-8 relative'>
      {/* Welcome Section */}
      <div className='flex items-center gap-1 absolute right-4'>
        <span className='text-base'>July 24, 2025</span>
        <Image
          src='/images/icons/Calendar.svg'
          width={24}
          height={24}
          className='w-6 h-6 object-contain'
          alt='Calendar'
        />
      </div>

      <WelcomeCard userName={user.name} />

      {/* Main Stats Row */}
      <div className='grid grid-cols-1 lg:grid-cols-11 gap-6'>
        <StatsCard
          title='Total Interviews'
          value={stats.totalInterviews.toString()}
          weekChange={stats.weekChange?.totalInterviews?.toString() || '0'}
          hasIncreased={stats.trends?.totalInterviews === 'increasing'}
          icon='Video'
          className='col-span-4'
          styles={{
            backgroundColor: 'bg-total-interview',
            strokeColor: 'border-peach-pink',
            strokeWidth: '2',
            fillColor: '#FFECE7',
            color: 'text-primary',
          }}
        />
        <StatsCard
          title='Average Interview Duration'
          subtitle='hh:mm:ss'
          value={stats.averageDuration}
          icon='Clock'
          className='col-span-4'
          showFormat
          styles={{
            backgroundColor: 'bg-avg-interview-duration',
            strokeColor: 'border-green-light',
            strokeWidth: '2',
            fillColor: '#D9FFD9',
            color: 'text-green-strong',
          }}
        />
        <MoodScoreCard className='col-span-3' moodScore={stats.moodScore} />
      </div>

      {/* Secondary Stats Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <StatsCard
          title='Average AI Interview Score'
          value={`${stats.aiInterviewScore}%`}
          weekChange={Math.abs(stats.weekChange?.aiInterviewScore || 0).toString()}
          hasIncreased={stats.trends?.aiInterviewScore === 'increasing'}
          icon='SpeedoMeter'
          styles={{
            backgroundColor: 'bg-avg-ai-interview-score',
            strokeColor: 'border-mint-light',
            strokeWidth: '2',
            fillColor: '#CDF2E4',
            color: 'text-green-primary',
          }}
        />
        <StatsCard
          title='Average Resume Score'
          value={`${stats.resumeScore}%`}
          weekChange={Math.abs(stats.weekChange?.resumeScore || 0).toString()}
          hasIncreased={stats.trends?.resumeScore === 'increasing'}
          icon='Note'
          styles={{
            backgroundColor: 'bg-avg-resume-score',
            strokeColor: 'border-purple-light',
            strokeWidth: '2',
            fillColor: '#E1D1F9',
            color: 'text-purple-strong',
          }}
        />
        <StatsCard
          title='Completion Rate'
          value={`${stats.completionRate || 0}%`}
          icon='CheckCircle'
          styles={{
            backgroundColor: 'bg-completion-rate',
            strokeColor: 'border-blue-light',
            strokeWidth: '2',
            fillColor: '#E3F2FD',
            color: 'text-blue-strong',
          }}
        />
      </div>

      {/* Skills and Sentiment Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          <SkillProgressCard skills={skills} />
          {/* Performance Summary */}
          {summary && (
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Performance Summary</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-green-600'>{summary.overallPerformance}</p>
                  <p className='text-sm text-gray-600'>Overall Performance</p>
                </div>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-blue-600'>
                    {Math.round(summary.confidence * 100)}%
                  </p>
                  <p className='text-sm text-gray-600'>Confidence Level</p>
                </div>
              </div>
              <div className='mt-4 text-center'>
                <p className='text-sm text-gray-600'>
                  Next Interview: {new Date(summary.nextInterview).toLocaleDateString()}
                </p>
                <p className='text-sm text-gray-600'>
                  {summary.recommendations} improvement recommendations available
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='space-y-8'>
          <SentimentCard sentimentData={sentiment} />

          {/* Focus Areas Summary */}
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Focus Areas</h3>
            <div className='space-y-3'>
              {focusAreas.slice(0, 3).map(area => (
                <div key={area.id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-3 h-3 rounded-full' style={{ backgroundColor: area.color }} />
                    <span className='text-sm font-medium text-gray-700'>{area.title}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      area.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : area.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {area.priority}
                  </span>
                </div>
              ))}
            </div>
            <button className='w-full mt-4 px-4 py-2 bg-[#F0806C] text-white rounded-xl text-sm font-medium hover:bg-[#E06B5A] transition-colors'>
              View All Focus Areas
            </button>
          </div>
        </div>
      </div>

      {/* Interview History */}
      <InterviewHistoryCard interviews={interviews} />

      {/* Additional Stats Row */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <StatsCard
          title='Average Preparation Time'
          value={stats.averagePreparationTime || '00:00:00'}
          icon='Timer'
          styles={{
            backgroundColor: 'bg-prep-time',
            strokeColor: 'border-orange-light',
            strokeWidth: '2',
            fillColor: '#FFF3E0',
            color: 'text-orange-strong',
          }}
        />
        <StatsCard
          title='Peer Average Score'
          value={`${stats.comparisons?.peerAverage.aiInterviewScore || 0}%`}
          icon='Users'
          styles={{
            backgroundColor: 'bg-peer-avg',
            strokeColor: 'border-indigo-light',
            strokeWidth: '2',
            fillColor: '#E8EAF6',
            color: 'text-indigo-strong',
          }}
        />
        <StatsCard
          title='Industry Average'
          value={`${stats.comparisons?.industryAverage.aiInterviewScore || 0}%`}
          icon='TrendingUp'
          styles={{
            backgroundColor: 'bg-industry-avg',
            strokeColor: 'border-teal-light',
            strokeWidth: '2',
            fillColor: '#E0F2F1',
            color: 'text-teal-strong',
          }}
        />
        <StatsCard
          title='Goal Progress'
          value={`${stats.goals?.currentProgress || 0}%`}
          subtitle={`Target: ${stats.goals?.targetScore || 0}%`}
          icon='Target'
          styles={{
            backgroundColor: 'bg-goal-progress',
            strokeColor: 'border-pink-light',
            strokeWidth: '2',
            fillColor: '#FCE4EC',
            color: 'text-pink-strong',
          }}
        />
      </div>
    </div>
  );
};

export default DashboardContainer;
