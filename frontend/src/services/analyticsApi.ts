// Advanced Analytics Service
export interface AnalyticsData {
  profileViews: number;
  jobApplications: number;
  jobMatches: number;
  skillsGaps: string[];
  topSkills: { skill: string; count: number }[];
  industryTrends: { industry: string; growth: number }[];
  salaryInsights: {
    current: number;
    average: number;
    percentile: number;
  };
  applicationSuccessRate: number;
  responseTime: {
    average: number;
    median: number;
  };
  topCompanies: { company: string; applications: number }[];
  monthlyActivity: { month: string; applications: number; interviews: number }[];
}

export interface SkillAnalysis {
  skill: string;
  currentLevel: number;
  marketDemand: number;
  salaryImpact: number;
  recommendations: string[];
  learningResources: {
    title: string;
    type: 'course' | 'article' | 'video' | 'certification';
    url: string;
    duration: string;
  }[];
}

export interface CareerInsights {
  nextRole: {
    title: string;
    probability: number;
    skillsNeeded: string[];
    salaryRange: { min: number; max: number };
  };
  marketPosition: {
    percentile: number;
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: {
    type: 'skill' | 'experience' | 'network' | 'certification';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actionItems: string[];
  }[];
}

class AnalyticsAPI {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Get comprehensive analytics data
  async getAnalytics(userId: string): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return mock data for development
      return this.getMockAnalytics();
    }
  }

  // Get skill analysis
  async getSkillAnalysis(userId: string, skills: string[]): Promise<SkillAnalysis[]> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, skills })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch skill analysis');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching skill analysis:', error);
      return this.getMockSkillAnalysis(skills);
    }
  }

  // Get career insights
  async getCareerInsights(userId: string): Promise<CareerInsights> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/career-insights/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch career insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching career insights:', error);
      return this.getMockCareerInsights();
    }
  }

  // Track user activity
  async trackActivity(activity: {
    type: 'profile_view' | 'job_application' | 'job_save' | 'skill_add' | 'resume_upload';
    data: any;
  }): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/analytics/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: localStorage.getItem('user_id'),
          activity,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  // Get job market trends
  async getMarketTrends(location?: string, industry?: string): Promise<{
    trendingSkills: { skill: string; growth: number }[];
    salaryTrends: { year: number; average: number }[];
    jobOpenings: { month: string; count: number }[];
    topCompanies: { company: string; openings: number }[];
  }> {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (industry) params.append('industry', industry);

      const response = await fetch(`${this.baseUrl}/analytics/market-trends?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market trends');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return this.getMockMarketTrends();
    }
  }

  // Mock data for development
  private getMockAnalytics(): AnalyticsData {
    return {
      profileViews: 1247,
      jobApplications: 23,
      jobMatches: 156,
      skillsGaps: ['Machine Learning', 'Cloud Architecture', 'DevOps'],
      topSkills: [
        { skill: 'JavaScript', count: 45 },
        { skill: 'React', count: 38 },
        { skill: 'Node.js', count: 32 },
        { skill: 'Python', count: 28 },
        { skill: 'TypeScript', count: 25 }
      ],
      industryTrends: [
        { industry: 'Technology', growth: 15.2 },
        { industry: 'Finance', growth: 8.7 },
        { industry: 'Healthcare', growth: 12.1 },
        { industry: 'E-commerce', growth: 18.5 }
      ],
      salaryInsights: {
        current: 85000,
        average: 92000,
        percentile: 75
      },
      applicationSuccessRate: 68.5,
      responseTime: {
        average: 3.2,
        median: 2.1
      },
      topCompanies: [
        { company: 'Google', applications: 5 },
        { company: 'Microsoft', applications: 4 },
        { company: 'Amazon', applications: 3 },
        { company: 'Meta', applications: 2 }
      ],
      monthlyActivity: [
        { month: 'Jan', applications: 8, interviews: 3 },
        { month: 'Feb', applications: 12, interviews: 5 },
        { month: 'Mar', applications: 15, interviews: 7 },
        { month: 'Apr', applications: 18, interviews: 9 },
        { month: 'May', applications: 22, interviews: 11 },
        { month: 'Jun', applications: 25, interviews: 13 }
      ]
    };
  }

  private getMockSkillAnalysis(skills: string[]): SkillAnalysis[] {
    return skills.map(skill => ({
      skill,
      currentLevel: Math.floor(Math.random() * 5) + 1,
      marketDemand: Math.floor(Math.random() * 100),
      salaryImpact: Math.floor(Math.random() * 50) + 10,
      recommendations: [
        'Take advanced courses in this skill',
        'Build projects to demonstrate expertise',
        'Get certified in this technology'
      ],
      learningResources: [
        {
          title: `Advanced ${skill} Course`,
          type: 'course' as const,
          url: '#',
          duration: '8 weeks'
        },
        {
          title: `${skill} Best Practices`,
          type: 'article' as const,
          url: '#',
          duration: '15 min'
        }
      ]
    }));
  }

  private getMockCareerInsights(): CareerInsights {
    return {
      nextRole: {
        title: 'Senior Software Engineer',
        probability: 78,
        skillsNeeded: ['System Design', 'Leadership', 'Mentoring'],
        salaryRange: { min: 120000, max: 160000 }
      },
      marketPosition: {
        percentile: 75,
        strengths: ['Technical Skills', 'Problem Solving', 'Communication'],
        weaknesses: ['Leadership Experience', 'System Design', 'Team Management']
      },
      recommendations: [
        {
          type: 'skill',
          priority: 'high',
          title: 'Learn System Design',
          description: 'Master system design principles to advance to senior roles',
          actionItems: [
            'Take a system design course',
            'Practice designing scalable systems',
            'Study real-world architectures'
          ]
        },
        {
          type: 'experience',
          priority: 'medium',
          title: 'Lead a Project',
          description: 'Gain leadership experience by leading a team project',
          actionItems: [
            'Volunteer to lead a project at work',
            'Mentor junior developers',
            'Take on more responsibility'
          ]
        }
      ]
    };
  }

  private getMockMarketTrends() {
    return {
      trendingSkills: [
        { skill: 'AI/ML', growth: 45.2 },
        { skill: 'Cloud Computing', growth: 32.1 },
        { skill: 'DevOps', growth: 28.7 },
        { skill: 'Cybersecurity', growth: 25.3 },
        { skill: 'Data Science', growth: 22.8 }
      ],
      salaryTrends: [
        { year: 2020, average: 75000 },
        { year: 2021, average: 82000 },
        { year: 2022, average: 88000 },
        { year: 2023, average: 92000 },
        { year: 2024, average: 98000 }
      ],
      jobOpenings: [
        { month: 'Jan', count: 1250 },
        { month: 'Feb', count: 1380 },
        { month: 'Mar', count: 1520 },
        { month: 'Apr', count: 1680 },
        { month: 'May', count: 1750 },
        { month: 'Jun', count: 1820 }
      ],
      topCompanies: [
        { company: 'Google', openings: 450 },
        { company: 'Microsoft', openings: 380 },
        { company: 'Amazon', openings: 320 },
        { company: 'Meta', openings: 280 },
        { company: 'Apple', openings: 250 }
      ]
    };
  }
}

export const analyticsApi = new AnalyticsAPI();
export default analyticsApi;
