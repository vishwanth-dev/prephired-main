# Dashboard API Documentation

## Overview

This document provides comprehensive API documentation for the PrepHired
dashboard page, based on the `src/app/(protected)/dashboard/page.tsx`
implementation and the
[Figma design specifications](https://www.figma.com/design/edywbR1ZktVzA2eVzpF0Ob/---PrepaiHaired---?node-id=1302-44811&m=dev).

## Base URL

```
https://api.prephired.com/api/dashboard
```

## Dashboard Components & Data Requirements

Based on the dashboard implementation, the following components require data:

- **Welcome Section** - User profile information
- **Statistics Cards** - Interview metrics and performance data
- **Skill Progress Cards** - User skill assessments
- **Sentiment Analysis** - Interview sentiment data
- **Interview History** - Recent interview records
- **Mood Score Cards** - Emotional assessment data

---

## 🔐 **API Endpoints Required**

### **1. Main Dashboard Overview (Aggregated Data)**

**Endpoint:** `GET /api/dashboard/overview`

**Description:** Fetch all dashboard data in a single optimized request for
initial page load

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Query Parameters:**

```
?timeframe=weekly&includeDetails=true
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Vamshi Krishna",
      "role": "UI/UX Designer",
      "avatar": "/images/avatars/user-avatar.jpg",
      "email": "vamshi@example.com",
      "lastActive": "2025-01-01T10:30:00.000Z"
    },
    "stats": {
      "totalInterviews": 12,
      "averageInterviewDuration": "01:15:20",
      "aiInterviewScore": 78,
      "resumeScore": 85,
      "moodScore": 44,
      "weekChange": {
        "totalInterviews": 2,
        "aiInterviewScore": -2,
        "resumeScore": 0,
        "moodScore": 5
      },
      "trends": {
        "totalInterviews": "increasing",
        "aiInterviewScore": "decreasing",
        "resumeScore": "stable",
        "moodScore": "increasing"
      }
    },
    "skills": [
      {
        "id": "technical",
        "label": "Technical Knowledge",
        "percentage": 78,
        "color": "#F0806C",
        "trend": "increasing",
        "change": 5,
        "level": "Intermediate"
      },
      {
        "id": "cognitive",
        "label": "Cognitive",
        "percentage": 92,
        "color": "#6783FF",
        "trend": "stable",
        "change": 0,
        "level": "Advanced"
      },
      {
        "id": "soft",
        "label": "Soft Skills",
        "percentage": 65,
        "color": "#F0806C",
        "trend": "decreasing",
        "change": -3,
        "level": "Intermediate"
      },
      {
        "id": "behavioral",
        "label": "Behavioral Fit",
        "percentage": 85,
        "color": "#E360FA",
        "trend": "increasing",
        "change": 2,
        "level": "Advanced"
      },
      {
        "id": "growth",
        "label": "Growth Index",
        "percentage": 62,
        "color": "#FADB60",
        "trend": "increasing",
        "change": 8,
        "level": "Intermediate"
      },
      {
        "id": "comprehensive",
        "label": "Comprehensive Skills",
        "percentage": 68,
        "color": "#60FAA8",
        "trend": "stable",
        "change": 0,
        "level": "Intermediate"
      }
    ],
    "sentiment": [
      {
        "label": "Positive",
        "percentage": 70,
        "color": "#19B278",
        "count": 7,
        "trend": "increasing"
      },
      {
        "label": "Neutral",
        "percentage": 20,
        "color": "#FF8E07",
        "count": 2,
        "trend": "stable"
      },
      {
        "label": "Negative",
        "percentage": 10,
        "color": "#E54846",
        "count": 1,
        "trend": "decreasing"
      }
    ],
    "interviews": [
      {
        "id": "ui-ux-001",
        "label": "UI/UX Designer",
        "date": "2025-05-20T00:00:00.000Z",
        "duration": "32 min",
        "overallScore": 83,
        "resumeScore": 94,
        "status": "completed",
        "categories": [
          {
            "name": "HR",
            "color": "#F0806C",
            "icon": "HR",
            "score": 85
          },
          {
            "name": "SoftSkill",
            "color": "#6783FF",
            "icon": "SoftSkill",
            "score": 78
          },
          {
            "name": "Psychometric & Personality",
            "color": "#E360FA",
            "icon": "Psychometric",
            "score": 82
          }
        ],
        "feedback": {
          "strengths": ["Good communication", "Technical knowledge"],
          "improvements": ["Time management", "Problem solving approach"]
        }
      },
      {
        "id": "hr-behavioral-001",
        "label": "HR & Behavioral Fit",
        "date": "2025-05-18T00:00:00.000Z",
        "duration": "28 min",
        "overallScore": 79,
        "resumeScore": 88,
        "status": "completed",
        "categories": [
          {
            "name": "HR",
            "color": "#F0806C",
            "icon": "HR",
            "score": 82
          },
          {
            "name": "Behavioral",
            "color": "#E360FA",
            "icon": "Behavioral",
            "score": 76
          }
        ]
      }
    ],
    "focusAreas": [
      {
        "id": "communication",
        "title": "Communication Skills",
        "description": "Improve your verbal and non-verbal communication during interviews",
        "icon": "communication",
        "color": "#F0806C",
        "priority": "high",
        "difficulty": "medium",
        "estimatedTime": "2-3 weeks"
      },
      {
        "id": "technical",
        "title": "Technical Knowledge",
        "description": "Enhance your technical expertise and problem-solving abilities",
        "icon": "technical",
        "color": "#4CAF50",
        "priority": "medium",
        "difficulty": "high",
        "estimatedTime": "4-6 weeks"
      }
    ],
    "summary": {
      "overallPerformance": "good",
      "confidence": 0.78,
      "nextInterview": "2025-01-15T14:00:00.000Z",
      "recommendations": 3
    }
  },
  "error": null,
  "meta": {
    "generatedAt": "2025-01-01T10:30:00.000Z",
    "cacheExpiry": "2025-01-01T10:35:00.000Z"
  }
}
```

**Response (Error - 401/500):**

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": null
  }
}
```

---

### **2. Dashboard Statistics (Real-time Metrics)**

**Endpoint:** `GET /api/dashboard/stats`

**Description:** Fetch real-time dashboard statistics and performance metrics

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Query Parameters:**

```
?timeframe=weekly&includeTrends=true&includeComparisons=true
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "currentStats": {
      "totalInterviews": 12,
      "averageInterviewDuration": "01:15:20",
      "aiInterviewScore": 78,
      "resumeScore": 85,
      "moodScore": 44,
      "completionRate": 92,
      "averagePreparationTime": "00:45:00"
    },
    "weekChange": {
      "totalInterviews": 2,
      "aiInterviewScore": -2,
      "resumeScore": 0,
      "moodScore": 5,
      "averageDuration": "00:05:30"
    },
    "trends": {
      "totalInterviews": "increasing",
      "aiInterviewScore": "decreasing",
      "resumeScore": "stable",
      "moodScore": "increasing",
      "duration": "decreasing"
    },
    "comparisons": {
      "peerAverage": {
        "aiInterviewScore": 75,
        "resumeScore": 82,
        "moodScore": 41
      },
      "industryAverage": {
        "aiInterviewScore": 72,
        "resumeScore": 79,
        "moodScore": 38
      }
    },
    "goals": {
      "targetScore": 85,
      "currentProgress": 78,
      "remainingInterviews": 8
    }
  },
  "error": null
}
```

---

### **3. Skill Progress & Assessment**

**Endpoint:** `GET /api/dashboard/skills`

**Description:** Fetch detailed skill progress and assessment data

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Query Parameters:**

```
?category=all&timeframe=monthly&includeDetails=true
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "overview": {
      "overallSkillScore": 75,
      "totalSkills": 6,
      "improvingSkills": 3,
      "decliningSkills": 1,
      "stableSkills": 2
    },
    "skills": [
      {
        "id": "technical",
        "label": "Technical Knowledge",
        "percentage": 78,
        "color": "#F0806C",
        "trend": "increasing",
        "change": 5,
        "level": "Intermediate",
        "subSkills": [
          {
            "name": "JavaScript",
            "percentage": 85,
            "level": "Advanced",
            "trend": "increasing"
          },
          {
            "name": "React",
            "percentage": 72,
            "level": "Intermediate",
            "trend": "stable"
          },
          {
            "name": "UI/UX Design",
            "percentage": 78,
            "level": "Intermediate",
            "trend": "increasing"
          }
        ],
        "assessments": [
          {
            "date": "2025-01-01T00:00:00.000Z",
            "score": 78,
            "type": "interview"
          }
        ]
      },
      {
        "id": "cognitive",
        "label": "Cognitive",
        "percentage": 92,
        "color": "#6783FF",
        "trend": "stable",
        "change": 0,
        "level": "Advanced",
        "subSkills": [
          {
            "name": "Problem Solving",
            "percentage": 88,
            "level": "Advanced",
            "trend": "stable"
          },
          {
            "name": "Critical Thinking",
            "percentage": 95,
            "level": "Expert",
            "trend": "increasing"
          }
        ]
      }
    ],
    "recommendations": [
      {
        "skillId": "soft",
        "priority": "high",
        "reason": "Below peer average",
        "suggestedActions": [
          "Practice communication exercises",
          "Join public speaking groups"
        ]
      }
    ]
  },
  "error": null
}
```

---

### **4. Sentiment Analysis & Emotional Assessment**

**Endpoint:** `GET /api/dashboard/sentiment`

**Description:** Fetch interview sentiment analysis and emotional assessment
data

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Query Parameters:**

```
?timeframe=weekly&interviewType=all&includeBreakdown=true
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "overview": {
      "overallSentiment": "positive",
      "confidence": 0.85,
      "totalInterviews": 10,
      "averageMoodScore": 7.2
    },
    "sentimentBreakdown": [
      {
        "label": "Positive",
        "percentage": 70,
        "color": "#19B278",
        "count": 7,
        "trend": "increasing",
        "change": 10,
        "interviews": [
          {
            "id": "ui-ux-001",
            "date": "2025-01-01T00:00:00.000Z",
            "moodScore": 8.5
          }
        ]
      },
      {
        "label": "Neutral",
        "percentage": 20,
        "color": "#FF8E07",
        "count": 2,
        "trend": "stable",
        "change": 0
      },
      {
        "label": "Negative",
        "percentage": 10,
        "color": "#E54846",
        "count": 1,
        "trend": "decreasing",
        "change": -5
      }
    ],
    "moodTrends": {
      "daily": [
        {
          "date": "2025-01-01",
          "score": 7.5,
          "interviews": 2
        }
      ],
      "weekly": [
        {
          "week": "2024-W52",
          "averageScore": 7.2,
          "totalInterviews": 10
        }
      ]
    },
    "emotionalFactors": [
      {
        "factor": "Confidence",
        "impact": "positive",
        "score": 8.0
      },
      {
        "factor": "Stress Level",
        "impact": "negative",
        "score": 6.5
      },
      {
        "factor": "Preparation",
        "impact": "positive",
        "score": 7.8
      }
    ],
    "insights": [
      "Mood score improved by 15% this week",
      "Confidence levels are consistently high",
      "Stress management needs attention"
    ]
  },
  "error": null
}
```

---

### **5. Interview History & Performance**

**Endpoint:** `GET /api/dashboard/interviews`

**Description:** Fetch interview history with detailed performance metrics

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Query Parameters:**

```
?limit=10&offset=0&sortBy=date&order=desc&type=all&includeFeedback=true
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "interviews": [
      {
        "id": "ui-ux-001",
        "label": "UI/UX Designer",
        "date": "2025-05-20T00:00:00.000Z",
        "duration": "32 min",
        "overallScore": 83,
        "resumeScore": 94,
        "status": "completed",
        "type": "technical",
        "difficulty": "medium",
        "categories": [
          {
            "name": "HR",
            "color": "#F0806C",
            "icon": "HR",
            "score": 85,
            "weight": 0.3
          },
          {
            "name": "SoftSkill",
            "color": "#6783FF",
            "icon": "SoftSkill",
            "score": 78,
            "weight": 0.4
          },
          {
            "name": "Psychometric & Personality",
            "color": "#E360FA",
            "icon": "Psychometric",
            "score": 82,
            "weight": 0.3
          }
        ],
        "feedback": {
          "strengths": [
            "Good communication skills",
            "Strong technical knowledge",
            "Professional demeanor"
          ],
          "improvements": [
            "Time management during problem solving",
            "More detailed explanations needed"
          ],
          "overall": "Good performance with room for improvement in time management"
        },
        "metrics": {
          "responseTime": "00:02:30",
          "accuracy": 0.78,
          "confidence": 0.82
        }
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "hasMore": true,
      "totalPages": 3
    },
    "summary": {
      "totalInterviews": 25,
      "averageScore": 78.5,
      "completionRate": 92,
      "averageDuration": "01:15:20",
      "topPerformingCategory": "Technical Skills",
      "improvementAreas": ["Time Management", "Communication"]
    },
    "performanceTrends": {
      "scoreTrend": "increasing",
      "durationTrend": "decreasing",
      "confidenceTrend": "stable"
    }
  },
  "error": null
}
```

---

### **6. Focus Areas & Improvement Recommendations**

**Endpoint:** `GET /api/dashboard/focus-areas`

**Description:** Fetch personalized improvement recommendations and focus areas

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRecommendations": 5,
      "highPriority": 2,
      "mediumPriority": 2,
      "lowPriority": 1
    },
    "focusAreas": [
      {
        "id": "communication",
        "title": "Communication Skills",
        "description": "Improve your verbal and non-verbal communication during interviews",
        "icon": "communication",
        "color": "#F0806C",
        "priority": "high",
        "difficulty": "medium",
        "estimatedTime": "2-3 weeks",
        "currentProgress": 65,
        "targetProgress": 80,
        "impact": "high",
        "resources": [
          {
            "type": "video",
            "title": "Interview Communication Tips",
            "url": "/resources/communication-tips",
            "duration": "15 min"
          },
          {
            "type": "practice",
            "title": "Communication Exercises",
            "url": "/practice/communication",
            "estimatedTime": "30 min"
          }
        ],
        "milestones": [
          {
            "title": "Practice Active Listening",
            "completed": true,
            "dueDate": "2025-01-05"
          },
          {
            "title": "Improve Body Language",
            "completed": false,
            "dueDate": "2025-01-12"
          }
        ]
      },
      {
        "id": "technical",
        "title": "Technical Knowledge",
        "description": "Enhance your technical expertise and problem-solving abilities",
        "icon": "technical",
        "color": "#4CAF50",
        "priority": "medium",
        "difficulty": "high",
        "estimatedTime": "4-6 weeks",
        "currentProgress": 78,
        "targetProgress": 85,
        "impact": "medium"
      }
    ],
    "insights": [
      "Focus on communication skills for immediate improvement",
      "Technical skills are above average but can be enhanced",
      "Consider time management training"
    ]
  },
  "error": null
}
```

---

### **7. User Profile & Dashboard Preferences**

**Endpoint:** `GET /api/dashboard/profile`

**Description:** Fetch user profile information and dashboard customization
preferences

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user-123",
      "name": "Vamshi Krishna",
      "role": "UI/UX Designer",
      "avatar": "/images/avatars/user-avatar.jpg",
      "email": "vamshi@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "experience": "3-5 years",
      "lastActive": "2025-01-01T10:30:00.000Z"
    },
    "preferences": {
      "dashboardLayout": "grid",
      "defaultTimeframe": "weekly",
      "theme": "light",
      "notifications": {
        "email": true,
        "push": false,
        "weeklyReport": true,
        "interviewReminders": true,
        "skillUpdates": false
      },
      "widgets": {
        "stats": true,
        "skills": true,
        "sentiment": true,
        "interviews": true,
        "focusAreas": true
      }
    },
    "subscription": {
      "plan": "premium",
      "status": "active",
      "expiresAt": "2025-12-31T00:00:00.000Z",
      "features": [
        "Advanced Analytics",
        "Personalized Recommendations",
        "Priority Support"
      ]
    },
    "goals": {
      "targetScore": 85,
      "targetInterviews": 20,
      "targetSkills": ["communication", "technical"],
      "deadline": "2025-06-30T00:00:00.000Z"
    }
  },
  "error": null
}
```

---

## 🎯 **API Strategy & Implementation**

### **Data Fetching Strategy**

#### **1. Initial Load (Optimized)**

```typescript
// Fetch critical data in parallel for faster initial render
const [overview, profile] = await Promise.all([
  fetch('/api/dashboard/overview'),
  fetch('/api/dashboard/profile'),
]);
```

#### **2. Lazy Loading (Non-critical)**

```typescript
// Load detailed data on demand
const detailedStats = await fetch('/api/dashboard/stats?includeTrends=true');
const skillDetails = await fetch('/api/dashboard/skills?includeDetails=true');
```

#### **3. Real-time Updates**

```typescript
// WebSocket or polling for live data updates
const liveStats = await fetch('/api/dashboard/stats/live');
```

### **Caching Strategy**

| Data Type       | Cache Duration | Reason                 |
| --------------- | -------------- | ---------------------- |
| **Profile**     | 1 day          | Rarely changes         |
| **Skills**      | 1 hour         | Changes slowly         |
| **Stats**       | 5 minutes      | Real-time data         |
| **Interviews**  | 15 minutes     | Frequently updated     |
| **Sentiment**   | 30 minutes     | Moderate updates       |
| **Focus Areas** | 2 hours        | Recommendations update |

---

## 📊 **Data Models & Interfaces**

### **DashboardData (Main Interface)**

```typescript
interface DashboardData {
  user: UserProfile;
  stats: DashboardStats;
  skills: SkillCategory[];
  sentiment: SentimentData[];
  interviews: InterviewType[];
  focusAreas: FocusArea[];
  summary: DashboardSummary;
}
```

### **DashboardStats**

```typescript
interface DashboardStats {
  totalInterviews: number;
  averageInterviewDuration: string;
  aiInterviewScore: number;
  resumeScore: number;
  moodScore: number;
  completionRate: number;
  weekChange: WeekChangeData;
  trends: TrendData;
  comparisons: ComparisonData;
  goals: GoalData;
}
```

### **SkillCategory**

```typescript
interface SkillCategory {
  id: string;
  label: string;
  percentage: number;
  color: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  subSkills?: SkillSubCategory[];
  assessments?: AssessmentData[];
}
```

### **InterviewType**

```typescript
interface InterviewType {
  id: string;
  label: string;
  date: string;
  duration: string;
  overallScore: number;
  resumeScore: number;
  status: 'completed' | 'in-progress' | 'scheduled';
  type: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  categories: Category[];
  feedback?: InterviewFeedback;
  metrics?: InterviewMetrics;
}
```

---

## 🚨 **Error Handling**

### **Standard Error Response Format**

```typescript
interface ErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  };
}
```

### **Common Error Codes**

| Code                  | Message                  | Description             |
| --------------------- | ------------------------ | ----------------------- |
| `UNAUTHORIZED`        | Authentication required  | User not logged in      |
| `FORBIDDEN`           | Access denied            | User lacks permissions  |
| `NOT_FOUND`           | Dashboard data not found | User has no data        |
| `RATE_LIMIT_EXCEEDED` | Too many requests        | API rate limit exceeded |
| `INTERNAL_ERROR`      | Server error             | Unexpected server error |

### **HTTP Status Codes**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🔒 **Security & Authentication**

### **Required Headers**

```
Authorization: Bearer <access_token>
Content-Type: application/json
X-Request-ID: <unique-request-id>
```

### **Access Control**

- **User Authentication Required** for all endpoints
- **User Isolation** - Users can only access their own data
- **Rate Limiting** - 100 requests per minute per user
- **Data Encryption** - All sensitive data encrypted in transit

---

## 🧪 **Testing & Examples**

### **Test Endpoints**

- **Development:** `http://localhost:3000/api/dashboard/*`
- **Staging:** `https://staging-api.prephired.com/api/dashboard/*`
- **Production:** `https://api.prephired.com/api/dashboard/*`

### **cURL Examples**

#### **Get Dashboard Overview**

```bash
curl -X GET "https://api.prephired.com/api/dashboard/overview?timeframe=weekly" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

#### **Get Skill Progress**

```bash
curl -X GET "https://api.prephired.com/api/dashboard/skills?category=all&timeframe=monthly" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

#### **Get Interview History**

```bash
curl -X GET "https://api.prephired.com/api/dashboard/interviews?limit=5&sortBy=date&order=desc" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📚 **Client Integration Examples**

### **React Hook Example**

```typescript
import { useState, useEffect } from 'react';

const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/overview', {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.error.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      );
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

  return { data, loading, error, refreshData };
};
```

### **Dashboard Service Class**

```typescript
class DashboardService {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async getOverview(timeframe: string = 'weekly') {
    const response = await fetch(
      `${this.baseUrl}/api/dashboard/overview?timeframe=${timeframe}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error.message);
    }
  }

  async getSkills(category: string = 'all', timeframe: string = 'monthly') {
    const response = await fetch(
      `${this.baseUrl}/api/dashboard/skills?category=${category}&timeframe=${timeframe}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error.message);
    }
  }
}
```

---

## 🚀 **Performance Optimization**

### **1. Data Aggregation**

- **Overview endpoint** provides aggregated data for initial load
- **Individual endpoints** for detailed data on demand
- **Parallel requests** for independent data types

### **2. Caching Strategy**

- **Browser caching** for static data
- **API response caching** for frequently accessed data
- **Local storage** for user preferences

### **3. Pagination & Lazy Loading**

- **Interview history** with pagination
- **Skill details** loaded on demand
- **Focus areas** with progressive disclosure

---

## 📝 **Summary**

The dashboard requires **7 comprehensive API endpoints** to provide a rich,
interactive user experience:

1. **`/overview`** - Aggregated data for initial page load
2. **`/stats`** - Real-time statistics and metrics
3. **`/skills`** - Detailed skill progress and assessments
4. **`/sentiment`** - Emotional analysis and mood tracking
5. **`/interviews`** - Interview history with performance data
6. **`/focus-areas`** - Personalized improvement recommendations
7. **`/profile`** - User profile and dashboard preferences

This multi-endpoint approach provides:

- **Better performance** through parallel data fetching
- **Flexible caching** strategies for different data types
- **Real-time updates** for critical metrics
- **Scalable architecture** for future enhancements
- **Rich user experience** with comprehensive data insights

The APIs are designed to work together seamlessly while maintaining independence
for optimal performance and user experience.
