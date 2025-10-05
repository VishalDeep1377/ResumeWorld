// API service for Resume World

const API_URL = 'http://localhost:8000';

// User related API calls
export const userApi = {
  // Create a new user
  createUser: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Login user (simulated as backend doesn't have auth)
  loginUser: async (email: string, _password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an actual API call
      // For now, we'll just return a mock user
      return {
        id: 1,
        email,
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};

// Resume related API calls
export const resumeApi = {
  // Upload a resume
  uploadResume: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/resumes/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }
};

// Job related API calls
export const jobApi = {
  // Get all jobs
  getAllJobs: async () => {
    try {
      const response = await fetch(`${API_URL}/jobs/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },
  
  // Get job matches for a resume
  getJobMatches: async (resumeId: number) => {
    try {
      const response = await fetch(`${API_URL}/jobs/match/${resumeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job matches');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching job matches:', error);
      throw error;
    }
  }
};
 
export default {
  user: userApi,
  resume: resumeApi,
  job: jobApi
};