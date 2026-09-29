import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Calendar, 
  Clock, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Share2,
  FileText
} from 'lucide-react';
import { Brand, Format, Platform, DraftGenerationResult } from '../types';

interface DraftStudioTabProps {
  brand: Brand;
  initialTopic?: string;
  initialFormat?: Format;
  onSaveToCalendar: (post: {
    title: string;
    content: string;
    platform: Platform;
    format: Format;
    topic: string;
    scheduledDate: string;
    scheduledTime: string;
    goal: string;
    evidenceRationale: string;
    supportingPostIds: string[];
    estimatedEngagementRate: number;
  }) => Promise<void>;
}

export const DraftStudioTab: React.FC<DraftStudioTabProps> = ({
  brand,
  initialTopic,
  initialFormat,
  onSaveToCalendar
}) => {
  const [goal, setGoal] = useState('Thought Leadership');
  const [topic, setTopic] = useState(initialTopic || (brand.id === 'brand-cloudscale' ? 'Benchmarking' : 'Workout Tips'));
  const [format, setFormat] = useState<Format>(initialFormat || (brand.id === 'brand-cloudscale' ? 'carousel' : 'short_video'));
  const [platform, setPlatform] = useState<Platform>(brand.defaultPlatforms[0] || 'linkedin');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated draft state
  const [draft, setDraft] = useState<DraftGenerationResult | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // Schedule settings
  const [scheduledDate, setScheduledDate] = useState('2026-10-06');
  const [scheduledTime, setScheduledTime] = useState('08:30');
  const [isSaved, setIsSaved] = useState(false);

  const availableGoals = [
    'Thought Leadership',
    'Community Engagement',
    'Educational How-To',
    'Address Community Concerns',
    'Product / Feature Announcement'
  ];

  const availableTopics = brand.id === 'brand-cloudscale'
    ? ['Benchmarking', 'Architecture', 'Release Notes', 'Security', 'Case Study']
    : ['Workout Tips', 'Community Spotlight', 'Product Drop', 'Behind-the-Scenes', 'Recovery & Nutrition'];

  const availableFormats: Format[] = ['carousel', 'infographic', 'short_video', 'text', 'poll'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSaved(false);
    try {
      const res = await fetch(`/api/brands/${brand.id}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          topic,
          format,
          platform,
          customPrompt
        })
      });

      if (!res.ok) throw new Error('Failed to generate draft');
      const data: DraftGenerationResult = await res.json();
      setDraft(data);
      setEditedTitle(data.title);
      setEditedContent(data.content);
    } catch (err) {
      console.error('Draft generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    await onSaveToCalendar({
      title: editedTitle,
      content: editedContent,
      platform,
      format,
      topic,
      scheduledDate,
      scheduledTime,
      goal,
      evidenceRationale: draft.evidenceRationale,
      supportingPostIds: draft.supportingPostIds,
      estimatedEngagementRate: draft.estimatedEngagementRate
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-medium mb-1">
            Grounded Post Draft Studio · {brand.name}
          </div>
          <h1 className="text-lg font-semibold text-slate-100">
            AI Content Generator & Strategy Calibrator
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Generates copy calibrated to {brand.name}'s tone (<span className="text-slate-300 font-medium">{brand.tone}</span>) and calculates expected engagement using stored benchmarks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-cyan-400" />
            <span>Draft Parameters</span>
          </h2>

          {/* Goal Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Strategic Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-600"
            >
              {availableGoals.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Topic Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-600"
            >
              {availableTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Format</label>
            <div className="grid grid-cols-2 gap-1.5">
              {availableFormats.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`text-xs capitalize py-1.5 px-2.5 rounded-lg border text-left transition-colors ${
                    format === f
                      ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Platform</label>
            <div className="flex gap-2">
              {(['linkedin', 'twitter', 'instagram', 'threads'] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`text-xs capitalize flex-1 py-1.5 rounded-lg border transition-colors ${
                    platform === p
                      ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Context/Instructions */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Specific Angle or Community Focus (Optional)
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Address the memory consumption question on 2GB partitions from comment comm-cs-03..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-600 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating Grounded Draft...' : 'Generate Evidence-Grounded Post Draft'}</span>
          </button>
        </div>

        {/* Editor & Evidence Rationale Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {draft ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              {/* Evidence & Forecast Header */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Evidence-Backed Rationale</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estimated Baseline: <strong>{draft.estimatedEngagementRate}%</strong></span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  {draft.evidenceRationale}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Grounded in historical post(s): {draft.supportingPostIds.join(', ')}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Post Concept Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-600 font-medium"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Draft Copy ({platform.toUpperCase()})</span>
                  <span>{editedContent.length} characters</span>
                </div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed rounded-lg p-3 focus:outline-none focus:border-cyan-600 font-sans"
                />
              </div>

              {/* Hashtag suggestions */}
              {draft.recommendedHashtags && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 text-[11px]">Recommended tags:</span>
                  {draft.recommendedHashtags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setEditedContent((prev) => `${prev} ${tag}`)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Content Calendar Scheduling */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Save to Content Calendar</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Scheduled Time (Best Window)</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Saved to Calendar!</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Save as Approved Calendar Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 space-y-3">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400 font-medium">No Draft Active</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Select your strategic goal, topic, and format on the left, then click "Generate Evidence-Grounded Post Draft".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
