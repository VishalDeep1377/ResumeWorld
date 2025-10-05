// LinkedIn API Integration Service
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  headline: string;
  summary: string;
  location: string;
  industry: string;
  positions: LinkedInPosition[];
  skills: string[];
  education: LinkedInEducation[];
}

export interface LinkedInPosition {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface LinkedInEducation {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
  activities?: string;
  description?: string;
}

export interface LinkedInJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  datePosted: string;
  jobUrl: string;
}

export interface JobSearchFilters {
  keywords?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
}

class LinkedInAPI {
  private accessToken: string | null = null;

  // Initialize LinkedIn OAuth
  initializeAuth(): string {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('linkedin_state', state);

    if (!LINKEDIN_CLIENT_ID) {
      console.error('LinkedIn Client ID is not configured. Please set VITE_LINKEDIN_CLIENT_ID in your .env file.');
      return '#linkedin-client-id-not-set';
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINKEDIN_CLIENT_ID,
      redirect_uri: `${window.location.origin}/linkedin/callback`,
      state: state,
      scope: 'r_liteprofile r_emailaddress r_basicprofile w_member_social'
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  // Handle OAuth callback
  async handleCallback(code: string, state: string): Promise<boolean> {
    const storedState = localStorage.getItem('linkedin_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    try {
      const response = await fetch(`${API_URL}/linkedin/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: `${window.location.origin}/linkedin/callback`,
        })
      });

      const tokenData = await response.json();

      if (typeof tokenData.access_token === 'string') {
        this.accessToken = tokenData.access_token;
        localStorage.setItem('linkedin_access_token', this.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      return false;
    } finally {
      localStorage.removeItem('linkedin_state');
    }
  }

  // Get user profile
  async getProfile(): Promise<LinkedInProfile | null> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token');
    }

    if (!this.accessToken) {
      throw new Error('No LinkedIn access token found');
    }

    try {
      const response = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline,summary,location,industry,positions,skills,educations)', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn profile');
      }

      const data = await response.json();

      return {
        id: data.id,
        firstName: data.firstName.localized.en_US,
        lastName: data.lastName.localized.en_US,
        profilePicture: data.profilePicture?.['displayImage~'].elements[0].identifiers[0].identifier,
        headline: data.headline,
        summary: data.summary,
        location: data.location,
        industry: data.industry,
        positions: this.parsePositions(data.positions),
        skills: data.skills,
        education: this.parseEducation(data.educations)
      };
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      throw error;
    }
  }

  // Search for jobs
  async searchJobs(filters: JobSearchFilters = {}): Promise<LinkedInJob[]> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token');
    }

    if (!this.accessToken) {
      throw new Error('No LinkedIn access token found');
    }

    try {
      const params = new URLSearchParams();
      params.append('keywords', filters.keywords || '');
      params.append('location', filters.location || '');
      params.append('jobType', filters.jobType || '');
      params.append('experienceLevel', filters.experienceLevel || '');
      params.append('count', '25');
      params.append('start', '0');

      const response = await fetch(`https://api.linkedin.com/v2/jobSearch?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search LinkedIn jobs');
      }

      const data = await response.json();
      return this.parseJobs(data.elements || []);
    } catch (error) {
      console.error('Error searching LinkedIn jobs:', error);
      throw error;
    }
  }

  // Get job recommendations based on profile
  async getJobRecommendations(): Promise<LinkedInJob[]> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token');
    }

    if (!this.accessToken) {
      throw new Error('No LinkedIn access token found');
    }

    try {
      const response = await fetch('https://api.linkedin.com/v2/jobSearch?count=25&start=0', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();
      return this.parseJobs(data.elements || []);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      throw error;
    }
  }

  async applyToJob(jobId: string, coverLetter?: string): Promise<boolean> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token');
    }

    if (!this.accessToken) {
      throw new Error('No LinkedIn access token found');
    }

    try {
      const response = await fetch(`https://api.linkedin.com/v2/jobApplications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job: `/jobs/${jobId}`,
          coverLetter: coverLetter
        })
      });

      if (response.status === 201) {
        return true;
      } else {
        throw new Error(`Failed to apply to job. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      return false;
    }
  }

  async saveJob(jobId: string): Promise<boolean> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token');
    }

    if (!this.accessToken) {
      throw new Error('No LinkedIn access token found');
    }

    try {
      const response = await fetch('https://api.linkedin.com/v2/jobSaves', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job: `/jobs/${jobId}`
        })
      });

      if (response.status === 201) {
        return true;
      } else {
        throw new Error(`Failed to save job. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      return false;
    }
  }

  // Get saved jobs
  async getSavedJobs(): Promise<LinkedInJob[]> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token');
    }

    if (!this.accessToken) {
      throw new Error('No LinkedIn access token found');
    }

    try {
      const response = await fetch('https://api.linkedin.com/v2/jobSaves?count=25&start=0', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();
      return this.parseJobs(data.elements || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  }

  // Parse positions data
  private parsePositions(positions: any[]): LinkedInPosition[] {
    if (!positions || !Array.isArray(positions)) return [];

    return positions.map((pos: any) => ({
      id: pos.id,
      title: pos.title,
      company: pos.company?.name,
      startDate: pos.startDate ? `${pos.startDate.year}-${pos.startDate.month || 1}` : '',
      endDate: pos.endDate ? `${pos.endDate.year}-${pos.endDate.month || 1}` : undefined,
      description: pos.description
    }));
  }

  // Parse education data
  private parseEducation(educations: any): LinkedInEducation[] {
    if (!educations || !Array.isArray(educations)) return [];

    return educations.map((edu: any) => ({
      id: edu.id,
      school: edu.schoolName,
      degree: edu.degreeName,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: `${edu.startDate.year}-${edu.startDate.month || 1}`,
      endDate: `${edu.endDate.year}-${edu.endDate.month || 1}`,
      grade: edu.grade,
      activities: edu.activities,
      description: edu.notes
    }));
  }

  // Parse jobs data
  private parseJobs(jobs: any[]): LinkedInJob[] {
    if (!jobs) {
      return [];
    }
    return jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salary,
      datePosted: job.datePosted,
      jobUrl: job.jobUrl
    }));
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('linkedin_access_token');
    localStorage.removeItem('linkedin_state');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('linkedin_access_token');
  }
}

export const linkedinApi = new LinkedInAPI();
export default linkedinApi;
