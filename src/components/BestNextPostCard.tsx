import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { BestNextPostHypothesis } from '../types';

interface BestNextPostCardProps {
  hypothesis: BestNextPostHypothesis;
  onDraftPost: () => void;
  onInspectEvidence: () => void;
}

export const BestNextPostCard: React.FC<BestNextPostCardProps> = ({
  hypothesis,
  onDraftPost,
  onInspectEvidence
}) => {
  const pills = [
    hypothesis.format,
    hypothesis.topic,
    hypothesis.tone,
    hypothesis.day,
    hypothesis.timeWindow
  ];

  return (
    <div className="bg-white border-l-4 border-l-[#1761d8] border border-slate-200/90 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Star Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
        <span className="text-amber-400 text-sm">⭐</span>
        <span>Best next post, based on what I know so far</span>
      </div>

      {/* Pill Tags */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        {pills.map((pill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-[#e0f2fe] text-[#0284c7] font-semibold text-xs rounded-full"
          >
            {pill}
          </span>
        ))}
      </div>

      {/* Big Headline */}
      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {hypothesis.predictedEngagements} predicted engagements
        </span>
        <span className="text-sm font-semibold text-emerald-700">
          {hypothesis.multiplier}× your average
        </span>
      </div>

      {/* Subtitle & Warning */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          {hypothesis.lowConfidenceFactorsCount} of {hypothesis.totalFactorsCount} factors are still low-confidence. Treat this as a hypothesis.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={onInspectEvidence}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Audit factors</span>
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={onDraftPost}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Draft this post</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
