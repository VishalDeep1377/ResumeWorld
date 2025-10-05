import { useState, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ResumeUploadProps {
  onUploadSuccess: (resumeData: any) => void;
  onAnalysis?: (analysis: any) => void;
  onMatches?: (matches: any[]) => void;
}

const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ResumeUpload = ({ onUploadSuccess, onAnalysis, onMatches }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validate = (file: File) => {
    if (!VALID_TYPES.includes(file.type)) {
      throw new Error('Please upload a PDF or Word document');
    }
    if (file.size > MAX_SIZE) {
      throw new Error('File too large. Max 5MB');
    }
  };

  const uploadWithProgress = (file: File) =>
    new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8000/resumes/');
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('Invalid server response'));
          }
        } else {
          reject(new Error('Failed to upload resume'));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      validate(file);
    } catch (e: any) {
      setError(e.message);
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const data = await uploadWithProgress(file);
      onUploadSuccess(data);

      // Get job matches
      try {
        const { jobApi } = await import('../services/api');
        const matches = await jobApi.getJobMatches(data.id);
        onMatches?.(matches);
      } catch (e) {
        console.warn('Match fetch failed, continuing.', e);
      }

      // Get skill analysis
      try {
        const { analyticsApi } = await import('../services/analyticsApi');
        const userId = localStorage.getItem('user_id') || '1';
        const analysis = await analyticsApi.getSkillAnalysis(userId, data.skills || []);
        onAnalysis?.(analysis);
      } catch (e) {
        console.warn('Analysis fetch failed, continuing.', e);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to upload resume. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600 hover:border-gray-400'
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg 
            className="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <div className="text-lg font-medium">
            {isUploading ? 'Uploading...' : 'Drag & drop your resume here'}
          </div>
          
          <p className="text-sm text-gray-400">
            Supports PDF, DOC, DOCX (Max 5MB)
          </p>
          
          {isUploading && (
            <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <span className="text-sm text-gray-400">- or -</span>
          
          <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white cursor-pointer transition-colors">
            Browse Files
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              onChange={handleChange}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
      
      {isUploading && <LoadingSpinner />}
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;