'use client';

import { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import {
  DashboardData,
  DashboardStats,
  SkillCategory,
  SentimentData,
  InterviewType,
} from '../types';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await DashboardService.getDashboardData();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await DashboardService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

export const useSkillProgress = () => {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await DashboardService.getSkillProgress();
        setSkills(data);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading };
};

export const useSentimentAnalysis = () => {
  const [sentiment, setSentiment] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const data = await DashboardService.getSentimentAnalysis();
        setSentiment(data);
      } catch (err) {
        console.error('Failed to fetch sentiment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, []);

  return { sentiment, loading };
};

export const useInterviewHistory = () => {
  const [interviews, setInterviews] = useState<InterviewType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const result = await DashboardService.getInterviewHistory();
        setInterviews(result.interviews);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return { interviews, loading };
};
