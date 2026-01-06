
import React from 'react';

interface ComparisonSummaryProps {
  summary: string;
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ summary }) => {
  return (
    <div className="p-5 bg-slate-800/70 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-cyan-400 mb-2">AI Summary</h3>
      <p className="text-slate-300 text-lg leading-relaxed">{summary}</p>
    </div>
  );
};
