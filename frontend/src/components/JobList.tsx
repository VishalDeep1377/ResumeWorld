import { useState, useEffect, useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Job {
  id: number;
  title: string;
  description: string;
  skills_required: string[];
  location?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
}

interface JobMatch {
  job: Job;
  match_score: number;
}

interface JobListProps {
  userSkills?: string[];
  matchedJobs?: JobMatch[];
}

const JobList = ({ userSkills = [], matchedJobs = [] }: JobListProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matched' | 'all'>(matchedJobs.length > 0 ? 'matched' : 'all');

  // Filters
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [sort, setSort] = useState<'match' | 'title' | 'company'>('match');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (matchedJobs.length > 0) {
      setActiveTab('matched');
    }
  }, [matchedJobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { jobApi } = await import('../services/api');
      const data = await jobApi.getAllJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasSkill = (skill: string) => userSkills.includes(skill);

  const filteredAll = useMemo(() => {
    const query = q.toLowerCase();
    const skillQ = skillFilter.toLowerCase();
    let arr = jobs.filter(j => 
      (!q || j.title.toLowerCase().includes(query) || j.description.toLowerCase().includes(query)) &&
      (!loc || (j.location || '').toLowerCase().includes(loc.toLowerCase())) &&
      (!skillFilter || j.skills_required.some(s => s.toLowerCase().includes(skillQ)))
    );
    if (sort === 'title') arr = arr.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'company') arr = arr.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
    return arr;
  }, [jobs, q, loc, skillFilter, sort]);

  const filteredMatches = useMemo(() => {
    let arr = [...matchedJobs];
    if (q) arr = arr.filter(m => m.job.title.toLowerCase().includes(q.toLowerCase()) || m.job.description.toLowerCase().includes(q.toLowerCase()));
    if (loc) arr = arr.filter(m => (m.job.location || '').toLowerCase().includes(loc.toLowerCase()));
    if (skillFilter) arr = arr.filter(m => m.job.skills_required.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())));
    if (sort === 'match') arr = arr.sort((a, b) => b.match_score - a.match_score);
    if (sort === 'title') arr = arr.sort((a, b) => a.job.title.localeCompare(b.job.title));
    if (sort === 'company') arr = arr.sort((a, b) => (a.job.company || '').localeCompare(b.job.company || ''));
    return arr;
  }, [matchedJobs, q, loc, skillFilter, sort]);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or description"
          className="input-modern"
        />
        <input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Location"
          className="input-modern"
        />
        <input
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          placeholder="Filter by skill (e.g., React)"
          className="input-modern"
        />
        <select aria-label="Sort jobs" value={sort} onChange={(e) => setSort(e.target.value as any)} className="input-modern">
          <option value="match">Sort: Best match</option>
          <option value="title">Sort: Title</option>
          <option value="company">Sort: Company</option>
        </select>
      </div>

      {/* Tabs */}
      {matchedJobs.length > 0 && (
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'matched' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('matched')}
          >
            Matched Jobs
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'all' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Jobs
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-200 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && activeTab === 'all' && (
        <LoadingSpinner />
      )}

      {/* Matched Jobs */}
      {activeTab === 'matched' && (
        <div>
          {filteredMatches.length > 0 ? (
            <div className="space-y-4">
              {filteredMatches.map(({ job, match_score }) => (
                <div key={job.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{job.title}</h3>
                      {job.company && <p className="text-sm text-gray-400">{job.company}{job.location ? ' • ' + job.location : ''}</p>}
                    </div>
                    <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full text-sm">
                      {Math.round(match_score * 100)}% Match
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mt-2 mb-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills_required.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          hasSkill(skill)
                            ? 'bg-green-900/50 text-green-200'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No matched jobs found. Try updating your resume with more skills.</p>
            </div>
          )}
        </div>
      )}

      {/* All Jobs */}
      {activeTab === 'all' && !loading && (
        <div className="space-y-4">
          {filteredAll.map((job) => (
            <div key={job.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  {job.company && <p className="text-sm text-gray-400">{job.company}{job.location ? ' • ' + job.location : ''}</p>}
                </div>
              </div>
              <p className="text-gray-300 mt-2 mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      hasSkill(skill)
                        ? 'bg-green-900/50 text-green-200'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;