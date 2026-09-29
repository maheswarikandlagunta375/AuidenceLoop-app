import React from 'react';

interface StatCardsProps {
  postsAnalysed: number;
  avgEngagementPerPost: number;
  highConfidenceInsightsCount: number;
  experimentsRunningCount: number;
}

export const StatCards: React.FC<StatCardsProps> = ({
  postsAnalysed,
  avgEngagementPerPost,
  highConfidenceInsightsCount,
  experimentsRunningCount
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {postsAnalysed}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1.5">
          posts analysed
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {avgEngagementPerPost}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1.5">
          avg engagement / post
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {highConfidenceInsightsCount}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1.5">
          high-confidence insights
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {experimentsRunningCount}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1.5">
          experiments running
        </div>
      </div>
    </div>
  );
};
