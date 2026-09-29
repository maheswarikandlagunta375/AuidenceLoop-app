import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Check, 
  MessageSquare, 
  PenTool, 
  Calendar as CalendarIcon, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { Brand } from '../types';

interface AgentHeaderProps {
  brands: Brand[];
  activeBrand: Brand | null;
  onSelectBrand: (brandId: string) => void;
  onOpenNewBrand: () => void;
  learningWeek: number;
  onAdvanceWeek: (weeks: number) => void;
  onResetDemo: () => void;
  onOpenUploadCsv: () => void;
  onExportCsv: () => void;
  onOpenChat: () => void;
  onOpenDraft: () => void;
  onOpenCalendar: () => void;
  onOpenFeedback: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  brands,
  activeBrand,
  onSelectBrand,
  onOpenNewBrand,
  learningWeek,
  onAdvanceWeek,
  onResetDemo,
  onOpenUploadCsv,
  onExportCsv,
  onOpenChat,
  onOpenDraft,
  onOpenCalendar,
  onOpenFeedback
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-3.5">
            {/* Concentric Circle Target Logo */}
            <div className="w-11 h-11 rounded-full bg-[#1761d8] flex items-center justify-center shadow-sm shrink-0">
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Social Media Engagement Agent</span>
              </h1>

              {/* Subtitle with Brand Selector Dropdown */}
              <div className="relative inline-block mt-0.5">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 group transition-colors"
                >
                  <span className="font-medium text-slate-700">{activeBrand?.name || 'Brew & Bloom Cafe'}</span>
                  <span className="text-slate-400">·</span>
                  <span>{activeBrand?.simulatedDataLabel || 'simulated Instagram data'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 ml-0.5" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Brand Workspace
                    </div>
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => onSelectBrand(b.id)}
                        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{b.name}</div>
                          <div className="text-[11px] text-slate-500">{b.industry}</div>
                        </div>
                        {activeBrand?.id === b.id && (
                          <Check className="w-4 h-4 text-blue-600 mt-0.5" />
                        )}
                      </button>
                    ))}
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={onOpenNewBrand}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium text-blue-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Create Brand Workspace</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Learning Week counter & Tools */}
          <div className="flex items-center gap-6">
            {/* Quick Tool Links */}
            <div className="hidden lg:flex items-center gap-1 text-xs">
              <button
                onClick={onOpenChat}
                className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Agent Chat</span>
              </button>
              <button
                onClick={onOpenDraft}
                className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
              >
                <PenTool className="w-3.5 h-3.5 text-slate-500" />
                <span>Draft Studio</span>
              </button>
              <button
                onClick={onOpenCalendar}
                className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Calendar</span>
              </button>
              <button
                onClick={onOpenFeedback}
                className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
              >
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Strategy Audit</span>
              </button>
            </div>

            {/* LEARNING WEEK Box */}
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                LEARNING WEEK
              </div>
              <div className="text-3xl font-extrabold text-[#1761d8] leading-none mt-0.5">
                {learningWeek}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onAdvanceWeek(1)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1761d8] hover:bg-[#124eb3] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <span>Advance 1 week</span>
            <span>▶</span>
          </button>

          <button
            onClick={() => onAdvanceWeek(4)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            <span>+4 weeks</span>
            <span>⏩</span>
          </button>

          <button
            onClick={onResetDemo}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            Reset demo
          </button>

          <button
            onClick={onOpenUploadCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            Upload CSV
          </button>

          <button
            onClick={onExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* System Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 rounded-md border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Agent: <strong className="font-medium text-slate-700">Offline rules</strong></span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 rounded-md border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Sentiment: <strong className="font-medium text-slate-700">Offline lexicon</strong></span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/90 rounded-md border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Memory: <strong className="font-medium text-slate-700">Local JSON file</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
