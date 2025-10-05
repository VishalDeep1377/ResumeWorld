import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { linkedinApi } from '../services/linkedinApi';
import type { LinkedInProfile, LinkedInJob } from '../services/linkedinApi';
import { analyticsApi, type SkillAnalysis } from '../services/analyticsApi';
import { jobApi } from '../services/api';
import ResumeUpload from './ResumeUpload';
import ResumeAnalysis from './ResumeAnalysis';
import JobList from './JobList';
import ResumeInsights from './ResumeInsights';
import type { AnalyticsData } from '../services/analyticsApi';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Removed unused User interface

const AdvancedDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [linkedinProfile, setLinkedinProfile] = useState<LinkedInProfile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  // Removed careerInsights in favor of resume-derived insights
  const [jobs, setJobs] = useState<LinkedInJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<any | null>(null);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis[] | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<any[] | null>(null);
  const [resumeInsights, setResumeInsights] = useState<any | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      loadDashboardData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load analytics data
      const analyticsData = await analyticsApi.getAnalytics('1');
      setAnalytics(analyticsData);

      // Load jobs from our API
      const jobsData = await jobApi.getAllJobs();
      setJobs(jobsData);

      // Removed generic career insights; insights now tied to uploaded resume

      // Load LinkedIn profile if authenticated
      if (linkedinApi.isAuthenticated()) {
        try {
          const profile = await linkedinApi.getProfile();
          setLinkedinProfile(profile);
        } catch (error) {
          console.error('Error loading LinkedIn profile:', error);
        }
      }

      // If resume already uploaded in session, skip
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedinAuth = () => {
    const authUrl = linkedinApi.initializeAuth();
    window.location.href = authUrl;
  };

  const handleUploadSuccess = (data: any) => {
    setUploadedResume(data);
    // When upload is successful, we get skills. Let's trigger analysis.
    if (data.skills) {
      analyticsApi.getSkillAnalysis("1", data.skills).then(handleAnalysis);
    }
    // Set the new insights and cover letter data
    if (data.analysis) {
      setResumeInsights(data.analysis);
    }
    if (data.cover_letter_text) {
      setCoverLetter(data.cover_letter_text);
    }
  };

  const handleAnalysis = (analysis: SkillAnalysis[]) => {
    setSkillAnalysis(analysis);
  };
  
  const handleMatches = (matches: any[]) => {
    setMatchedJobs(matches);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    linkedinApi.logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'auto', label: 'Auto Match', icon: '🤖' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const chartData = {
    monthlyActivity: {
      labels: analytics?.monthlyActivity.map(item => item.month) || [],
      datasets: [
        {
          label: 'Applications',
          data: analytics?.monthlyActivity.map(item => item.applications) || [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Interviews',
          data: analytics?.monthlyActivity.map(item => item.interviews) || [],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    },
    skillsData: {
      labels: analytics?.topSkills.map(skill => skill.skill) || [],
      datasets: [
        {
          data: analytics?.topSkills.map(skill => skill.count) || [],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderWidth: 0
        }
      ]
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Resume World
              </h1>
              <div className="hidden md:flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {linkedinProfile ? (
                <div className="flex items-center space-x-2">
                  <img 
                    src={linkedinProfile.profilePicture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white text-sm">{linkedinProfile.firstName}</span>
                </div>
              ) : (
                <button
                  onClick={handleLinkedinAuth}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Connect LinkedIn
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glassmorphism-dark p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Job Applications</p>
                      <p className="text-3xl font-bold text-white">{analytics?.jobApplications || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                </div>

                <div className="glassmorphism-dark p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Job Matches</p>
                      <p className="text-3xl font-bold text-white">{analytics?.jobMatches || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                </div>

                <div className="glassmorphism-dark p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-white">{analytics?.applicationSuccessRate || 0}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                </div>

                <div className="glassmorphism-dark p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Profile Views</p>
                      <p className="text-3xl font-bold text-white">{analytics?.profileViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👁️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glassmorphism-dark p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">Monthly Activity</h3>
                  <Line data={chartData.monthlyActivity} options={{
                    responsive: true,
                    plugins: {
                      legend: { labels: { color: 'white' } }
                    },
                    scales: {
                      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                    }
                  }} />
                </div>

                <div className="glassmorphism-dark p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">Top Skills</h3>
                  <Doughnut data={chartData.skillsData} options={{
                    responsive: true,
                    plugins: {
                      legend: { labels: { color: 'white' } }
                    }
                  }} />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glassmorphism-dark p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Applied to Software Engineer at Google', time: '2 hours ago', type: 'application' },
                    { action: 'Profile viewed by Microsoft recruiter', time: '4 hours ago', type: 'view' },
                    { action: 'New job match: Senior Developer at Amazon', time: '1 day ago', type: 'match' },
                    { action: 'Updated skills: Added React Native', time: '2 days ago', type: 'update' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'application' ? 'bg-blue-500' :
                        activity.type === 'view' ? 'bg-green-500' :
                        activity.type === 'match' ? 'bg-purple-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'auto' && (
            <motion.div
              key="auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Auto Flow: Upload → Analysis → Matched Jobs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 glassmorphism-dark p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">Upload Resume</h3>
                  <ResumeUpload onUploadSuccess={handleUploadSuccess} onAnalysis={handleAnalysis} onMatches={handleMatches} />
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="glassmorphism-dark p-6 rounded-xl">
                    <ResumeAnalysis skills={uploadedResume?.skills} analysis={skillAnalysis || []} />
                  </div>
                  <div className="glassmorphism-dark p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">Matched Jobs</h3>
                    <JobList userSkills={uploadedResume?.skills || []} matchedJobs={matchedJobs || []} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glassmorphism-dark p-6 rounded-xl text-gray-300">
                Connect LinkedIn to see personalized job recommendations.
              </div>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="glassmorphism-dark p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                    <p className="text-blue-400 font-medium">{job.company}</p>
                    <p className="text-gray-400">{job.location}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Removed analytics tab per request */}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* New Resume Insights Section */}
              <div className="glassmorphism-dark p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Upload Resume for Analysis</h3>
                <p className="text-gray-400 mb-6">Upload your resume to get detailed feedback, suggestions, and a generated cover letter.</p>
                <ResumeUpload onUploadSuccess={handleUploadSuccess} onAnalysis={handleAnalysis} onMatches={handleMatches} />
              </div>
              {resumeInsights && <ResumeInsights analysis={resumeInsights} coverLetter={coverLetter} />}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {linkedinProfile ? (
                <div className="glassmorphism-dark p-6 rounded-xl">
                  <div className="flex items-center space-x-6 mb-6">
                    <img 
                      src={linkedinProfile.profilePicture} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {linkedinProfile.firstName} {linkedinProfile.lastName}
                      </h2>
                      <p className="text-blue-400">{linkedinProfile.headline}</p>
                      <p className="text-gray-400">{linkedinProfile.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
                      <p className="text-gray-300">{linkedinProfile.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Experience</h3>
                      <div className="space-y-4">
                        {linkedinProfile.positions.map((position, index) => (
                          <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                            <h4 className="text-white font-semibold">{position.title}</h4>
                            <p className="text-blue-400">{position.company}</p>
                            <p className="text-gray-400 text-sm">
                              {position.startDate} - {position.isCurrent ? 'Present' : position.endDate}
                            </p>
                            <p className="text-gray-300 text-sm mt-2">{position.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {linkedinProfile.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glassmorphism-dark p-12 rounded-xl text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Connect Your LinkedIn Profile</h2>
                  <p className="text-gray-400 mb-6">
                    Connect your LinkedIn account to unlock advanced features and personalized insights.
                  </p>
                  <button
                    onClick={handleLinkedinAuth}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Connect LinkedIn
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdvancedDashboard;
