import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Brand, FeedbackLoopRecord } from '../types';

interface FeedbackLoopTabProps {
  brand: Brand;
  records: FeedbackLoopRecord[];
  onDraftStrategyPost: (topic: string, format: any) => void;
}

export const FeedbackLoopTab: React.FC<FeedbackLoopTabProps> = ({
  brand,
  records,
  onDraftStrategyPost
}) => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-medium mb-1">
            Closed-Loop Recommendation Validation · {brand.name}
          </div>
          <h1 className="text-lg font-semibold text-slate-100">
            Strategy vs. Reality Performance Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            AudienceLoop tracks past recommendations against later published post metrics to determine whether the strategic evidence holds up or requires a pivot.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Automated Strategy Auditing Active</span>
        </div>
      </div>

      {/* Records Grid */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
            <TrendingUp className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs">No strategic feedback records found for {brand.name}.</p>
          </div>
        ) : (
          records.map((rec) => {
            const isValidated = rec.status === 'validated';
            const isRefuted = rec.status === 'refuted';
            const isPositiveDelta = rec.evidenceDelta > 0;

            return (
              <div
                key={rec.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-750 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    {isValidated && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle className="w-4 h-4" /> Strategy Validated
                      </span>
                    )}
                    {isRefuted && (
                      <span className="flex items-center gap-1 text-rose-400 font-semibold">
                        <XCircle className="w-4 h-4" /> Strategy Refuted (Pivot Needed)
                      </span>
                    )}
                    {!isValidated && !isRefuted && (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <HelpCircle className="w-4 h-4" /> Inconclusive (Insufficient Data)
                      </span>
                    )}
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">ID: {rec.id}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Recommended on: {rec.recommendationDate}</span>
                  </div>
                </div>

                {/* Recommendation Summary */}
                <div>
                  <div className="text-xs text-slate-400 font-medium mb-1">Recommendation:</div>
                  <div className="text-sm font-semibold text-slate-100 leading-snug">
                    "{rec.recommendationSummary}"
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                    <span className="text-slate-300">Topic: <strong className="text-white">{rec.targetTopic}</strong></span>
                    <span>·</span>
                    <span className="text-slate-300">Format: <strong className="text-white capitalize">{rec.targetFormat}</strong></span>
                    <span>·</span>
                    <span className="text-slate-300">Target Timing: <strong className="text-white">{rec.recommendedDay} {rec.recommendedHour}:00</strong></span>
                  </div>
                </div>

                {/* Metrics Comparison Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                  <div>
                    <div className="text-[11px] text-slate-400">Baseline Engagement</div>
                    <div className="text-sm font-semibold text-slate-300 mt-0.5">
                      {rec.baselineEngagementRate}%
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400">Later Actual Performance</div>
                    <div className="text-sm font-semibold text-slate-100 mt-0.5">
                      {rec.actualEngagementRate}%{' '}
                      <span className="text-xs font-normal text-slate-400">({rec.laterPostsAnalyzed} posts analyzed)</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400">Evidence Delta</div>
                    <div className={`text-sm font-bold mt-0.5 flex items-center gap-1 ${isPositiveDelta ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositiveDelta ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{isPositiveDelta ? '+' : ''}{rec.evidenceDelta}%</span>
                    </div>
                  </div>
                </div>

                {/* Outcome Analysis & Strategic Takeaway */}
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                  <div className="font-semibold text-slate-400 text-[11px] mb-1">OBSERVED EVIDENCE & AUDIT TAKEAWAY:</div>
                  <p>{rec.outcomeSummary}</p>
                </div>

                {/* Footer with Supporting Post IDs & Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-850 text-xs">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Supporting Post Records: {rec.supportingPostIds.join(', ')}
                  </div>

                  {isValidated ? (
                    <button
                      onClick={() => onDraftStrategyPost(rec.targetTopic, rec.targetFormat)}
                      className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 hover:text-emerald-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Double Down: Generate More {rec.targetTopic} Posts</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onDraftStrategyPost(rec.targetTopic, 'carousel')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>Adjust Format & Test Again</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
