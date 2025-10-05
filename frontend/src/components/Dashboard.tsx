import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from './ResumeUpload';
import JobList from './JobList';

interface User {
  id: number;
  email: string;
}

interface Resume {
  id: number;
  skills: string[];
}

interface Job {
  id: number;
  title: string;
  description: string;
  skills_required: string[];
}

interface JobMatch {
  job: Job;
  match_score: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [resume, setResume] = useState<Resume | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }

    // Fetch jobs from API
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const { jobApi } = await import('../services/api');
      await jobApi.getAllJobs();
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Removed unused handleFileUpload function

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black text-white">
      {/* Header */}
      <header className="bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Resume World
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'profile' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'resume' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'jobs' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-gray-300 mb-2">Email:</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <p className="text-gray-400 mt-4">
                Complete your profile to improve job matching and recommendations.
              </p>
            </div>
          )}

          {activeTab === 'resume' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Resume</h2>
              
              {resume ? (
                <div>
                  <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-lg mb-2">Skills Detected:</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {resume.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg mt-6 mb-4">Upload New Resume:</h3>
                  <ResumeUpload onUploadSuccess={(data) => {
                    setResume(data);
                    // Get job matches
                    if (data.id) {
                      fetch(`http://localhost:8000/jobs/match/${data.id}`)
                        .then(res => res.json())
                        .then(matchData => setMatchedJobs(matchData))
                        .catch(err => console.error('Error fetching job matches:', err));
                    }
                  }} />
                </div>
              ) : (
                <div className="py-8">
                  <p className="text-gray-400 mb-6 text-center">Upload your resume to get started</p>
                  <ResumeUpload onUploadSuccess={(data) => {
                    setResume(data);
                    // Get job matches
                    if (data.id) {
                      fetch(`http://localhost:8000/jobs/match/${data.id}`)
                        .then(res => res.json())
                        .then(matchData => setMatchedJobs(matchData))
                        .catch(err => console.error('Error fetching job matches:', err));
                    }
                  }} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Job Opportunities</h2>
              
              {resume ? (
                <JobList 
                  userSkills={resume.skills} 
                  matchedJobs={matchedJobs} 
                />
              ) : (
                <div className="text-center py-8 mb-6">
                  <p className="text-gray-400">Upload your resume to see matched jobs</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;