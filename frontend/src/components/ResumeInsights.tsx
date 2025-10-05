import { useState } from 'react';
import { motion } from 'framer-motion';

interface ResumeInsightsProps {
  analysis: {
    mistakes: string[];
    suggestions: string[];
  };
  coverLetter: string;
}

const ResumeInsights = ({ analysis, coverLetter }: ResumeInsightsProps) => {
  const [editableCoverLetter, setEditableCoverLetter] = useState(coverLetter);

  const handleDownload = () => {
    const blob = new Blob([editableCoverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cover_letter.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Resume Analysis Section */}
      <div className="glassmorphism-dark p-6 rounded-xl">
        <h3 className="text-2xl font-bold text-white mb-4">
          <span className="text-blue-400">Resume</span> Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mistakes */}
          <div>
            <h4 className="text-lg font-semibold text-red-400 mb-3">Common Mistakes</h4>
            <ul className="space-y-3">
              {analysis.mistakes.map((mistake, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">✖</span>
                  <p className="text-gray-300">{mistake}</p>
                </li>
              ))}
            </ul>
          </div>
          {/* Suggestions */}
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-3">Improvement Suggestions</h4>
            <ul className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✔</span>
                  <p className="text-gray-300">{suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Cover Letter Section */}
      <div className="glassmorphism-dark p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">
            <span className="text-purple-400">Generated</span> Cover Letter
          </h3>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <span>📄</span>
            <span>Download as .txt</span>
          </button>
        </div>
        <textarea
          value={editableCoverLetter}
          onChange={(e) => setEditableCoverLetter(e.target.value)}
          className="w-full h-96 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          placeholder="Your cover letter will appear here..."
        />
        <p className="text-sm text-gray-500 mt-2">
          This is an AI-generated draft. Feel free to edit it to better match your voice and the specific job you're applying for.
        </p>
      </div>
    </motion.div>
  );
};

export default ResumeInsights;