import {
  DashboardData,
  DashboardStats,
  SkillCategory,
  SentimentData,
  InterviewType,
  UserProfile,
  FocusArea,
} from '../types';

export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      stats: {
        totalInterviews: 12,
        averageDuration: '01:15:20',
        aiInterviewScore: 78,
        resumeScore: 85,
        moodScore: 44,
        completionRate: 92,
        averagePreparationTime: '00:45:00',
        weekChange: {
          totalInterviews: 2,
          aiInterviewScore: -2,
          resumeScore: 0,
          moodScore: 5,
          averageDuration: '00:05:30',
        },
        trends: {
          totalInterviews: 'increasing',
          aiInterviewScore: 'decreasing',
          resumeScore: 'stable',
          moodScore: 'increasing',
          duration: 'decreasing',
        },
      },
      skills: [
        {
          id: 'technical',
          label: 'Technical Knowledge',
          percentage: 78,
          color: '#F0806C',
          trend: 'increasing',
          change: 5,
          level: 'Intermediate',
        },
        {
          id: 'cognitive',
          label: 'Cognitive',
          percentage: 92,
          color: '#6783FF',
          trend: 'stable',
          change: 0,
          level: 'Advanced',
        },
        {
          id: 'soft',
          label: 'Soft Skills',
          percentage: 65,
          color: '#F0806C',
          trend: 'decreasing',
          change: -3,
          level: 'Intermediate',
        },
        {
          id: 'behavioral',
          label: 'Behavioral Fit',
          percentage: 85,
          color: '#E360FA',
          trend: 'increasing',
          change: 2,
          level: 'Advanced',
        },
        {
          id: 'growth',
          label: 'Growth Index',
          percentage: 62,
          color: '#FADB60',
          trend: 'increasing',
          change: 8,
          level: 'Intermediate',
        },
        {
          id: 'comprehensive',
          label: 'Comprehensive Skills',
          percentage: 68,
          color: '#60FAA8',
          trend: 'stable',
          change: 0,
          level: 'Intermediate',
        },
      ],
      sentiment: [
        {
          label: 'Positive',
          percentage: 70,
          color: '#19B278',
          count: 7,
          trend: 'increasing',
          icon: '😊'
        },
        {
          label: 'Neutral',
          percentage: 20,
          color: '#FF8E07',
          count: 2,
          trend: 'stable',
          icon: '😐'
        },
        {
          label: 'Negative',
          percentage: 10,
          color: '#E54846',
          count: 1,
          trend: 'decreasing',
          icon: '😔'
        }
      ],
      interviews: [
        {
          id: 'ui-ux-001',
          label: 'UI/UX Designer',
          date: '2025-05-20T00:00:00.000Z',
          duration: '32 min',
          overallScore: 83,
          resumeScore: 94,
          status: 'completed',
          type: 'technical',
          difficulty: 'medium',
          categories: [
            {
              name: 'HR',
              color: '#F0806C',
              icon: 'HR',
              score: 85,
              weight: 0.3,
            },
            {
              name: 'SoftSkill',
              color: '#6783FF',
              icon: 'SoftSkill',
              score: 78,
              weight: 0.4,
            },
            {
              name: 'Psychometric & Personality',
              color: '#E360FA',
              icon: 'Psychometric',
              score: 82,
              weight: 0.3,
            },
          ],
          feedback: {
            strengths: [
              'Good communication skills',
              'Strong technical knowledge',
              'Professional demeanor',
            ],
            improvements: [
              'Time management during problem solving',
              'More detailed explanations needed',
            ],
            overall: 'Good performance with room for improvement in time management',
          },
          metrics: {
            responseTime: '00:02:30',
            accuracy: 0.78,
            confidence: 0.82,
          },
        },
        {
          id: 'hr-behavioral-001',
          label: 'HR & Behavioral Fit',
          date: '2025-05-18T00:00:00.000Z',
          duration: '28 min',
          overallScore: 79,
          resumeScore: 88,
          status: 'completed',
          type: 'behavioral',
          difficulty: 'medium',
          categories: [
            {
              name: 'HR',
              color: '#F0806C',
              icon: 'HR',
              score: 82,
              weight: 0.5,
            },
            {
              name: 'Behavioral',
              color: '#E360FA',
              icon: 'Behavioral',
              score: 76,
              weight: 0.5,
            },
          ],
          feedback: {
            strengths: ['Good situational awareness', 'Clear communication'],
            improvements: ['More specific examples needed', 'Better STAR method usage'],
            overall: 'Solid behavioral interview performance',
          },
          metrics: {
            responseTime: '00:03:15',
            accuracy: 0.75,
            confidence: 0.78,
          },
        },
        {
          id: 'soft-skills-001',
          label: 'Soft Skills Assessment',
          date: '2025-05-15T00:00:00.000Z',
          duration: '25 min',
          overallScore: 81,
          resumeScore: 90,
          status: 'completed',
          type: 'mixed',
          difficulty: 'easy',
          categories: [
            {
              name: 'Communication',
              color: '#4CAF50',
              icon: 'Communication',
              score: 85,
              weight: 0.4,
            },
            {
              name: 'Leadership',
              color: '#2196F3',
              icon: 'Leadership',
              score: 78,
              weight: 0.3,
            },
            {
              name: 'Teamwork',
              color: '#FF9800',
              icon: 'Teamwork',
              score: 80,
              weight: 0.3,
            },
          ],
          feedback: {
            strengths: ['Excellent communication', 'Good team player'],
            improvements: ['Leadership examples could be stronger'],
            overall: 'Strong soft skills foundation',
          },
          metrics: {
            responseTime: '00:02:45',
            accuracy: 0.82,
            confidence: 0.85,
          },
        },
      ],
      focusAreas: [
        {
          id: 'communication',
          title: 'Communication Skills',
          description: 'Improve your verbal and non-verbal communication during interviews',
          icon: 'communication',
          color: '#F0806C',
          priority: 'high',
          difficulty: 'medium',
          estimatedTime: '2-3 weeks',
          currentProgress: 65,
          targetProgress: 80,
          impact: 'high',
          resources: [
            {
              type: 'video',
              title: 'Interview Communication Tips',
              url: '/resources/communication-tips',
              duration: '15 min',
            },
            {
              type: 'practice',
              title: 'Communication Exercises',
              url: '/practice/communication',
              estimatedTime: '30 min',
            },
          ],
          milestones: [
            {
              title: 'Practice Active Listening',
              completed: true,
              dueDate: '2025-01-05',
            },
            {
              title: 'Improve Body Language',
              completed: false,
              dueDate: '2025-01-12',
            },
          ],
        },
        {
          id: 'technical',
          title: 'Technical Knowledge',
          description: 'Enhance your technical expertise and problem-solving abilities',
          icon: 'technical',
          color: '#4CAF50',
          priority: 'medium',
          difficulty: 'high',
          estimatedTime: '4-6 weeks',
          currentProgress: 78,
          targetProgress: 85,
          impact: 'medium',
          resources: [
            {
              type: 'course',
              title: 'Advanced JavaScript Concepts',
              url: '/courses/javascript-advanced',
              duration: '8 hours',
            },
          ],
        },
        {
          id: 'problem-solving',
          title: 'Problem Solving',
          description: 'Develop better analytical and critical thinking skills',
          icon: 'problem-solving',
          color: '#2196F3',
          priority: 'medium',
          difficulty: 'medium',
          estimatedTime: '3-4 weeks',
          currentProgress: 72,
          targetProgress: 80,
          impact: 'medium',
        },
      ],
      user: {
        name: 'Vamshi Krishna',
        role: 'UI/UX Designer',
        avatar: '/images/avatars/user-avatar.jpg',
        email: 'vamshi@example.com',
        lastActive: '2025-01-01T10:30:00.000Z',
      },
      summary: {
        overallPerformance: 'good',
        confidence: 0.78,
        nextInterview: '2025-01-15T14:00:00.000Z',
        recommendations: 3,
      },
    };
  }

  static async getDashboardStats(_timeframe: string = 'weekly'): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      totalInterviews: 12,
      averageDuration: '01:15:20',
      aiInterviewScore: 78,
      resumeScore: 85,
      moodScore: 44,
      completionRate: 92,
      averagePreparationTime: '00:45:00',
      weekChange: {
        totalInterviews: 2,
        aiInterviewScore: -2,
        resumeScore: 0,
        moodScore: 5,
        averageDuration: '00:05:30',
      },
      trends: {
        totalInterviews: 'increasing',
        aiInterviewScore: 'decreasing',
        resumeScore: 'stable',
        moodScore: 'increasing',
        duration: 'decreasing',
      },
      comparisons: {
        peerAverage: {
          aiInterviewScore: 75,
          resumeScore: 82,
          moodScore: 41,
        },
        industryAverage: {
          aiInterviewScore: 72,
          resumeScore: 79,
          moodScore: 38,
        },
      },
      goals: {
        targetScore: 85,
        currentProgress: 78,
        remainingInterviews: 8,
      },
    };
  }

  static async getSkillProgress(
    _category: string = 'all',
    _timeframe: string = 'monthly'
  ): Promise<SkillCategory[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return [
      {
        id: 'technical',
        label: 'Technical Knowledge',
        percentage: 78,
        color: '#F0806C',
        trend: 'increasing',
        change: 5,
        level: 'Intermediate',
        subSkills: [
          {
            name: 'JavaScript',
            percentage: 85,
            level: 'Advanced',
            trend: 'increasing',
          },
          {
            name: 'React',
            percentage: 72,
            level: 'Intermediate',
            trend: 'stable',
          },
          {
            name: 'UI/UX Design',
            percentage: 78,
            level: 'Intermediate',
            trend: 'increasing',
          },
        ],
        assessments: [
          {
            date: '2025-01-01T00:00:00.000Z',
            score: 78,
            type: 'interview',
          },
        ],
      },
      {
        id: 'cognitive',
        label: 'Cognitive',
        percentage: 92,
        color: '#6783FF',
        trend: 'stable',
        change: 0,
        level: 'Advanced',
        subSkills: [
          {
            name: 'Problem Solving',
            percentage: 88,
            level: 'Advanced',
            trend: 'stable',
          },
          {
            name: 'Critical Thinking',
            percentage: 95,
            level: 'Expert',
            trend: 'increasing',
          },
        ],
      },
      {
        id: 'soft',
        label: 'Soft Skills',
        percentage: 65,
        color: '#F0806C',
        trend: 'decreasing',
        change: -3,
        level: 'Intermediate',
      },
      {
        id: 'behavioral',
        label: 'Behavioral Fit',
        percentage: 85,
        color: '#E360FA',
        trend: 'increasing',
        change: 2,
        level: 'Advanced',
      },
      {
        id: 'growth',
        label: 'Growth Index',
        percentage: 62,
        color: '#FADB60',
        trend: 'increasing',
        change: 8,
        level: 'Intermediate',
      },
      {
        id: 'comprehensive',
        label: 'Comprehensive Skills',
        percentage: 68,
        color: '#60FAA8',
        trend: 'stable',
        change: 0,
        level: 'Intermediate',
      },
    ];
  }

  static async getSentimentAnalysis(_timeframe: string = 'weekly'): Promise<SentimentData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
      {
        label: 'Positive',
        percentage: 70,
        color: '#19B278',
        count: 7,
        trend: 'increasing',
        icon: '😊',
      },
      {
        label: 'Neutral',
        percentage: 20,
        color: '#FF8E07',
        count: 2,
        trend: 'stable',
        icon: '😐',
      },
      {
        label: 'Negative',
        percentage: 10,
        color: '#E54846',
        count: 1,
        trend: 'decreasing',
        icon: '😔',
      },
    ];
  }

  static async getInterviewHistory(
    limit: number = 10,
    offset: number = 0
  ): Promise<{
    interviews: InterviewType[];
    pagination: any;
    summary: any;
    performanceTrends: any;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));

    const allInterviews: InterviewType[] = [
      {
        id: 'ui-ux-001',
        label: 'UI/UX Designer',
        date: '2025-05-20T00:00:00.000Z',
        duration: '32 min',
        overallScore: 83,
        resumeScore: 94,
        status: 'completed',
        type: 'technical',
        difficulty: 'medium',
        categories: [
          {
            name: 'HR',
            color: '#F0806C',
            icon: 'HR',
            score: 85,
            weight: 0.3,
          },
          {
            name: 'SoftSkill',
            color: '#6783FF',
            icon: 'SoftSkill',
            score: 78,
            weight: 0.4,
          },
          {
            name: 'Psychometric & Personality',
            color: '#E360FA',
            icon: 'Psychometric',
            score: 82,
            weight: 0.3,
          },
        ],
        feedback: {
          strengths: [
            'Good communication skills',
            'Strong technical knowledge',
            'Professional demeanor',
          ],
          improvements: [
            'Time management during problem solving',
            'More detailed explanations needed',
          ],
          overall: 'Good performance with room for improvement in time management',
        },
        metrics: {
          responseTime: '00:02:30',
          accuracy: 0.78,
          confidence: 0.82,
        },
      },
      {
        id: 'hr-behavioral-001',
        label: 'HR & Behavioral Fit',
        date: '2025-05-18T00:00:00.000Z',
        duration: '28 min',
        overallScore: 79,
        resumeScore: 88,
        status: 'completed',
        type: 'behavioral',
        difficulty: 'medium',
        categories: [
          {
            name: 'HR',
            color: '#F0806C',
            icon: 'HR',
            score: 82,
            weight: 0.5,
          },
          {
            name: 'Behavioral',
            color: '#E360FA',
            icon: 'Behavioral',
            score: 76,
            weight: 0.5,
          },
        ],
        feedback: {
          strengths: ['Good situational awareness', 'Clear communication'],
          improvements: ['More specific examples needed', 'Better STAR method usage'],
          overall: 'Solid behavioral interview performance',
        },
        metrics: {
          responseTime: '00:03:15',
          accuracy: 0.75,
          confidence: 0.78,
        },
      },
      {
        id: 'soft-skills-001',
        label: 'Soft Skills Assessment',
        date: '2025-05-15T00:00:00.000Z',
        duration: '25 min',
        overallScore: 81,
        resumeScore: 90,
        status: 'completed',
        type: 'mixed',
        difficulty: 'easy',
        categories: [
          {
            name: 'Communication',
            color: '#4CAF50',
            icon: 'Communication',
            score: 85,
            weight: 0.4,
          },
          {
            name: 'Leadership',
            color: '#2196F3',
            icon: 'Leadership',
            score: 78,
            weight: 0.3,
          },
          {
            name: 'Teamwork',
            color: '#FF9800',
            icon: 'Teamwork',
            score: 80,
            weight: 0.3,
          },
        ],
        feedback: {
          strengths: ['Excellent communication', 'Good team player'],
          improvements: ['Leadership examples could be stronger'],
          overall: 'Strong soft skills foundation',
        },
        metrics: {
          responseTime: '00:02:45',
          accuracy: 0.82,
          confidence: 0.85,
        },
      },
      {
        id: 'technical-001',
        label: 'Technical Skills',
        date: '2025-05-12T00:00:00.000Z',
        duration: '45 min',
        overallScore: 76,
        resumeScore: 87,
        status: 'completed',
        type: 'technical',
        difficulty: 'hard',
        categories: [
          {
            name: 'Programming',
            color: '#9C27B0',
            icon: 'Code',
            score: 72,
            weight: 0.5,
          },
          {
            name: 'System Design',
            color: '#607D8B',
            icon: 'Architecture',
            score: 68,
            weight: 0.3,
          },
          {
            name: 'Algorithms',
            color: '#795548',
            icon: 'Algorithm',
            score: 80,
            weight: 0.2,
          },
        ],
        feedback: {
          strengths: ['Good algorithmic thinking', 'Solid programming fundamentals'],
          improvements: ['System design concepts need work', 'More practice with complex problems'],
          overall: 'Good technical foundation with room for growth',
        },
        metrics: {
          responseTime: '00:04:20',
          accuracy: 0.74,
          confidence: 0.7,
        },
      },
    ];

    const paginatedInterviews = allInterviews.slice(offset, offset + limit);

    return {
      interviews: paginatedInterviews,
      pagination: {
        total: allInterviews.length,
        limit,
        offset,
        hasMore: offset + limit < allInterviews.length,
        totalPages: Math.ceil(allInterviews.length / limit),
      },
      summary: {
        totalInterviews: allInterviews.length,
        averageScore: 79.75,
        completionRate: 92,
        averageDuration: '01:15:20',
        topPerformingCategory: 'Technical Skills',
        improvementAreas: ['Time Management', 'Communication'],
      },
      performanceTrends: {
        scoreTrend: 'increasing',
        durationTrend: 'decreasing',
        confidenceTrend: 'stable',
      },
    };
  }

  static async getSuggestedFocusAreas(): Promise<FocusArea[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return [
      {
        id: 'communication',
        title: 'Communication Skills',
        description: 'Improve your verbal and non-verbal communication during interviews',
        icon: 'communication',
        color: '#F0806C',
        priority: 'high',
        difficulty: 'medium',
        estimatedTime: '2-3 weeks',
        currentProgress: 65,
        targetProgress: 80,
        impact: 'high',
        resources: [
          {
            type: 'video',
            title: 'Interview Communication Tips',
            url: '/resources/communication-tips',
            duration: '15 min',
          },
          {
            type: 'practice',
            title: 'Communication Exercises',
            url: '/practice/communication',
            estimatedTime: '30 min',
          },
        ],
        milestones: [
          {
            title: 'Practice Active Listening',
            completed: true,
            dueDate: '2025-01-05',
          },
          {
            title: 'Improve Body Language',
            completed: false,
            dueDate: '2025-01-12',
          },
        ],
      },
      {
        id: 'technical',
        title: 'Technical Knowledge',
        description: 'Enhance your technical expertise and problem-solving abilities',
        icon: 'technical',
        color: '#4CAF50',
        priority: 'medium',
        difficulty: 'high',
        estimatedTime: '4-6 weeks',
        currentProgress: 78,
        targetProgress: 85,
        impact: 'medium',
        resources: [
          {
            type: 'course',
            title: 'Advanced JavaScript Concepts',
            url: '/courses/javascript-advanced',
            duration: '8 hours',
          },
        ],
      },
      {
        id: 'problem-solving',
        title: 'Problem Solving',
        description: 'Develop better analytical and critical thinking skills',
        icon: 'problem-solving',
        color: '#2196F3',
        priority: 'medium',
        difficulty: 'medium',
        estimatedTime: '3-4 weeks',
        currentProgress: 72,
        targetProgress: 80,
        impact: 'medium',
      },
      {
        id: 'behavioral',
        title: 'Behavioral Questions',
        description: 'Master STAR method for behavioral interview questions',
        icon: 'communication',
        color: '#FF9800',
        priority: 'low',
        difficulty: 'medium',
        estimatedTime: '2-3 weeks',
        currentProgress: 85,
        targetProgress: 90,
        impact: 'medium',
      },
    ];
  }

  static async getUserProfile(): Promise<UserProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      name: 'Vamshi Krishna',
      role: 'UI/UX Designer',
      avatar: '/images/avatars/user-avatar.jpg',
      email: 'vamshi@example.com',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      experience: '3-5 years',
      lastActive: '2025-01-01T10:30:00.000Z',
    };
  }

  // New method to get dashboard overview (aggregated data)
  static async getDashboardOverview(_timeframe: string = 'weekly'): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return this.getDashboardData();
  }

  // New method to get detailed sentiment analysis
  static async getDetailedSentimentAnalysis(_timeframe: string = 'weekly'): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      overview: {
        overallSentiment: 'positive',
        confidence: 0.85,
        totalInterviews: 10,
        averageMoodScore: 7.2,
      },
      sentimentBreakdown: [
        {
          label: 'Positive',
          percentage: 70,
          color: '#19B278',
          count: 7,
          trend: 'increasing',
          change: 10,
          interviews: [
            {
              id: 'ui-ux-001',
              date: '2025-01-01T00:00:00.000Z',
              moodScore: 8.5,
            },
          ],
        },
        {
          label: 'Neutral',
          percentage: 20,
          color: '#FF8E07',
          count: 2,
          trend: 'stable',
          change: 0,
        },
        {
          label: 'Negative',
          percentage: 10,
          color: '#E54846',
          count: 1,
          trend: 'decreasing',
          change: -5,
        },
      ],
      moodTrends: {
        daily: [
          {
            date: '2025-01-01',
            score: 7.5,
            interviews: 2,
          },
        ],
        weekly: [
          {
            week: '2024-W52',
            averageScore: 7.2,
            totalInterviews: 10,
          },
        ],
      },
      emotionalFactors: [
        {
          factor: 'Confidence',
          impact: 'positive',
          score: 8.0,
        },
        {
          factor: 'Stress Level',
          impact: 'negative',
          score: 6.5,
        },
        {
          factor: 'Preparation',
          impact: 'positive',
          score: 7.8,
        },
      ],
      insights: [
        'Mood score improved by 15% this week',
        'Confidence levels are consistently high',
        'Stress management needs attention',
      ],
    };
  }
}
