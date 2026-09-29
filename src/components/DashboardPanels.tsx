import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  DriveFactor, 
  SentimentTopicSummary, 
  ExperimentRecord, 
  WeeklyLearningPoint 
} from '../types';

interface DashboardPanelsProps {
  driveFactors: Record<'format' | 'topic' | 'tone' | 'time' | 'day', DriveFactor[]>;
  sentimentTopics: SentimentTopicSummary[];
  experiments: ExperimentRecord[];
  learningOverTime: WeeklyLearningPoint[];
  onOpenPlanExperiment: () => void;
}

export const DashboardPanels: React.FC<DashboardPanelsProps> = ({
  driveFactors,
  sentimentTopics,
  experiments,
  learningOverTime,
  onOpenPlanExperiment
}) => {
  const [activeFactorTab, setActiveFactorTab] = useState<'format' | 'topic' | 'tone' | 'time' | 'day'>('format');

  const factorTabs = [
    { key: 'format', label: 'Format' },
    { key: 'topic', label: 'Topic' },
    { key: 'tone', label: 'Tone' },
    { key: 'time', label: 'Time' },
    { key: 'day', label: 'Day' }
  ] as const;

  const currentFactors = driveFactors[activeFactorTab] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. What drives engagement */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
            What drives engagement
          </h3>

          {/* Filter Pill Buttons */}
          <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
            {factorTabs.map((tab) => {
              const isActive = activeFactorTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFactorTab(tab.key)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    isActive
                      ? 'bg-[#1761d8] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Factor Bars */}
          <div className="space-y-4">
            {currentFactors.map((f) => {
              const isOverAvg = f.multiplier >= 1.0;
              // Bar width relative to max 2.5 multiplier
              const barWidthPercent = Math.min(100, Math.max(8, (f.multiplier / 2.2) * 80));

              return (
                <div key={f.name} className="flex items-center gap-3 text-xs">
                  <div className="w-24 font-medium text-slate-700 truncate text-left">
                    {f.name}
                  </div>

                  <div className="flex-1 relative h-5 flex items-center">
                    {/* Baseline indicator line at 1.0x (approx 45%) */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 z-10"
                      style={{ left: '45%' }}
                      title="Average baseline (1.0x)"
                    />

                    {/* Colored bar */}
                    <div
                      className={`h-4 rounded-sm transition-all ${
                        isOverAvg 
                          ? 'bg-[#86efac]' 
                          : 'bg-[#fca5a5]'
                      } ${!f.isTrustworthy ? 'opacity-70' : 'opacity-100'}`}
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>

                  <div className="w-16 text-right font-mono text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{f.multiplier.toFixed(2)}×</span>{' '}
                    <span>n={f.postCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Line = your average. Faded bars = too few posts to trust yet.
        </div>
      </div>

      {/* 2. Community sentiment */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
            Community sentiment
          </h3>

          <div className="space-y-4">
            {sentimentTopics.map((st) => {
              const negPct = st.negativePct;
              const posPct = 100 - negPct;

              return (
                <div key={st.topic} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{st.topic}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {st.negativePct}% negative · {st.commentCount} comments
                    </span>
                  </div>

                  {/* Stacked Bar (Green / Red) */}
                  <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full"
                      style={{ width: `${posPct}%` }}
                    />
                    <div 
                      className="bg-rose-500 h-full"
                      style={{ width: `${negPct}%` }}
                    />
                  </div>

                  {/* Sample Quote if high negative */}
                  {st.sampleQuote && st.negativePct > 0 && (
                    <div className="text-[11px] text-rose-500 italic pt-0.5">
                      "{st.sampleQuote}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Based on comments memory. Green = positive/neutral, Red = critical feedback.
        </div>
      </div>

      {/* 3. Experiments */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Experiments
            </h3>
            <button
              onClick={onOpenPlanExperiment}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Plan experiment</span>
            </button>
          </div>

          <div className="space-y-3">
            {experiments.map((exp) => (
              <div 
                key={exp.id}
                className="bg-slate-50/80 border border-slate-200/80 rounded-lg p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{exp.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200/90 text-slate-700 capitalize">
                    {exp.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  {exp.earlySignal}
                </div>

                <div className="text-slate-700 font-medium">
                  {exp.instruction}
                </div>

                {/* Progress */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{exp.publishedCount}/{exp.targetCount} posts published</span>
                  <div className="w-28 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(exp.publishedCount / exp.targetCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Learning over time */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
            Learning over time
          </h3>

          {/* Stacked Vertical Bar Chart */}
          <div className="h-32 flex items-end gap-5 px-3 pt-4 pb-2 border-b border-slate-100">
            {learningOverTime.map((pt) => {
              const total = pt.high + pt.medium + pt.hypothesis;
              const maxScale = 8;
              const totalHeightPercent = Math.min(100, (total / maxScale) * 100);

              const highPct = total > 0 ? (pt.high / total) * 100 : 0;
              const medPct = total > 0 ? (pt.medium / total) * 100 : 0;
              const hypoPct = total > 0 ? (pt.hypothesis / total) * 100 : 0;

              return (
                <div key={pt.week} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-7 rounded-t-sm flex flex-col-reverse overflow-hidden transition-all shadow-sm"
                    style={{ height: `${totalHeightPercent}%` }}
                  >
                    {/* Bottom: High confidence (solid blue) */}
                    {pt.high > 0 && (
                      <div 
                        className="bg-[#2563eb] w-full"
                        style={{ height: `${highPct}%` }}
                        title={`${pt.high} high-confidence`}
                      />
                    )}
                    {/* Middle: Medium confidence (teal) */}
                    {pt.medium > 0 && (
                      <div 
                        className="bg-[#0d9488] w-full"
                        style={{ height: `${medPct}%` }}
                        title={`${pt.medium} medium-confidence`}
                      />
                    )}
                    {/* Top: Hypothesis (slate-300 / faded) */}
                    {pt.hypothesis > 0 && (
                      <div 
                        className="bg-[#cbd5e1] w-full"
                        style={{ height: `${hypoPct}%` }}
                        title={`${pt.hypothesis} hypothesis`}
                      />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {pt.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-2 text-[11px] text-slate-400">
          Insights per week by confidence. Bars grow and turn solid as the agent gets surer.
        </div>
      </div>
    </div>
  );
};
