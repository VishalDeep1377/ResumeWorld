import { useMemo } from 'react';

interface SkillAnalysisItem {
	skill: string;
	currentLevel: number;
	marketDemand: number;
	salaryImpact: number;
	recommendations: string[];
	learningResources: { title: string; type: string; url: string; duration: string }[];
}

interface ResumeAnalysisProps {
	skills?: string[];
	analysis?: SkillAnalysisItem[];
}

const ProgressBar = ({ pct }: { pct: number; color: string }) => {
	const clamped = Math.min(100, Math.max(0, pct));
	return (
		<progress value={clamped} max={100} className="w-full h-2 align-middle"></progress>
	);
};

const ResumeAnalysis = ({ skills = [], analysis = [] }: ResumeAnalysisProps) => {
	const top = useMemo(() => analysis.slice(0, 6), [analysis]);
	return (
		<div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 md:p-6">
			<h3 className="text-lg font-semibold mb-3">Resume Insights</h3>
			{skills.length > 0 && (
				<>
					<p className="text-sm text-gray-400 mb-2">Detected skills</p>
					<div className="flex flex-wrap gap-2 mb-4">
						{skills.map((s, i) => (
							<span key={i} className="px-3 py-1 rounded-full text-xs bg-white/10 text-gray-100 border border-white/10">
								{s}
							</span>
						))}
					</div>
				</>
			)}

			{top.length > 0 ? (
				<div className="space-y-4">
					{top.map((item, idx) => (
						<div key={idx} className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
							<div className="flex items-center justify-between mb-2">
								<div className="font-medium">{item.skill}</div>
								<div className="text-xs text-gray-400">Level {item.currentLevel}/5</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
								<div>
									<div className="text-xs text-gray-400 mb-1">Market demand</div>
									<ProgressBar pct={item.marketDemand} color="bg-emerald-500" />
								</div>
								<div>
									<div className="text-xs text-gray-400 mb-1">Salary impact</div>
									<ProgressBar pct={item.salaryImpact} color="bg-blue-500" />
								</div>
								<div>
									<div className="text-xs text-gray-400 mb-1">Priority</div>
									<ProgressBar pct={Math.min(100, (item.marketDemand + item.salaryImpact) / 2)} color="bg-purple-500" />
								</div>
							</div>
							<div className="text-xs text-gray-300">
								<span className="text-gray-400">Next steps:</span> {item.recommendations.slice(0, 2).join(' • ')}
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-400 text-sm">Upload a resume to see insights and recommendations.</p>
			)}
		</div>
	);
};

export default ResumeAnalysis;


