import React from 'react';
import { AudienceInsight } from '../types';

interface AudienceInsightsListProps {
  insights: AudienceInsight[];
  onSelectInsight: (insight: AudienceInsight) => void;
}

export const AudienceInsightsList: React.FC<AudienceInsightsListProps> = ({
  insights,
  onSelectInsight
}) => {
  const getBorderColor = (conf: AudienceInsight['confidence']) => {
    switch (conf) {
      case 'high':
        return 'border-l-[#2563eb]';
      case 'medium':
        return 'border-l-[#0d9488]';
      default:
        return 'border-l-[#94a3b8]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          What I've learned about your audience
        </h2>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span>high</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0d9488]" />
            <span>medium</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
            <span>hypothesis</span>
          </span>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-2.5">
        {insights.map((ins) => {
          const borderColor = getBorderColor(ins.confidence);
          const hasMultiplier = ins.multiplier !== undefined;
          const isHigher = hasMultiplier && ins.multiplier! >= 1.0;

          return (
            <div
              key={ins.id}
              onClick={() => onSelectInsight(ins)}
              className={`bg-white border-l-4 ${borderColor} border-y border-r border-slate-200/90 rounded-lg p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              <div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {ins.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {ins.detail}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {ins.isNew && (
                  <span className="text-[11px] font-medium text-slate-400">
                    new
                  </span>
                )}

                {hasMultiplier && (
                  <span
                    className={`text-xs font-semibold flex items-center gap-0.5 ${
                      isHigher ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    <span>{isHigher ? '▲' : '▼'}</span>
                    <span>{ins.multiplier!.toFixed(2)}×</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
