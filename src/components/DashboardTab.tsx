import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MessageCircle, 
  ArrowUpRight,
  Info,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { AnalyticsSummary, Brand, PostRecord } from '../types';

interface DashboardTabProps {
  brand: Brand;
  analytics: AnalyticsSummary | null;
  posts: PostRecord[];
  onAskAgent: (prompt: string) => void;
  onDraftForTopic: (topic: string, format: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  brand,
  analytics,
  posts,
  onAskAgent,
  onDraftForTopic
}) => {
  if (!analytics) {
    return (
      <div className="py-16 text-center text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs">Computing brand engagement patterns and sentiment metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-medium mb-1">
            Grounded Performance Intelligence · {brand.name}
          </div>
          <h1 className="text-lg font-semibold text-slate-100">
            Social Media Engagement Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Derived from <span className="text-slate-200 font-medium">{analytics.totalPosts} historical posts</span> and{' '}
            <span className="text-slate-200 font-medium">{analytics.sentimentSummary.totalComments} community conversations</span> between{' '}
            <span className="text-slate-200 font-medium">{analytics.dateRange.start || 'N/A'}</span> and{' '}
            <span className="text-slate-200 font-medium">{analytics.dateRange.end || 'N/A'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAskAgent(`What should we post this week for ${brand.name}, and why?`)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Agent "What should we post?"</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Engagement Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {analytics.avgEngagementRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Total interactions / impressions
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Organic Reach</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {analytics.totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Verified impressions across channels
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Net Audience Sentiment</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {analytics.sentimentSummary.netSentiment > 0 ? '+' : ''}{analytics.sentimentSummary.netSentiment}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {analytics.sentimentSummary.positivePct}% Positive · {analytics.sentimentSummary.negativePct}% Negative
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Verified Evidence Records</span>
            <CalendarDays className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {analytics.totalPosts + analytics.sentimentSummary.totalComments}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {analytics.totalPosts} posts · {analytics.sentimentSummary.totalComments} comments
          </div>
        </div>
      </div>

      {/* Main Grid: Topic Benchmarks + Best Time Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Breakdown with Sample Size Discipline (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Topic Performance & Evidence Rigor</h2>
              <p className="text-xs text-slate-400">
                Sorted by average engagement rate. Topics with sample size N &lt; 3 marked as limited evidence.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Baseline: {analytics.avgEngagementRate}%</span>
          </div>

          <div className="space-y-3">
            {analytics.topicBreakdown.map((t) => {
              const delta = Number((t.avgEngagementRate - analytics.avgEngagementRate).toFixed(2));
              const isPositive = delta >= 0;
              return (
                <div
                  key={t.topic}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">{t.topic}</span>
                      <span className="text-[11px] text-slate-400">({t.sampleSize} posts)</span>
                      {t.isLimitedEvidence ? (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Limited Evidence (N &lt; 3)
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Statistically Grounded
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-100">{t.avgEngagementRate}%</span>
                        <span className={`text-[11px] ml-1.5 font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{delta}% vs avg
                        </span>
                      </div>
                      <button
                        onClick={() => onDraftForTopic(t.topic, 'carousel')}
                        className="px-2 py-1 text-[11px] text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/70 rounded transition-colors"
                      >
                        Draft Post
                      </button>
                    </div>
                  </div>

                  {/* Relative bar */}
                  <div className="mt-2 w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPositive ? 'bg-cyan-500' : 'bg-slate-600'}`}
                      style={{ width: `${Math.min(100, (t.avgEngagementRate / 10) * 100)}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Avg {t.avgReactions.toLocaleString()} reactions · {t.avgComments} comments · {t.avgShares} shares</span>
                    <button
                      onClick={() => onAskAgent(`Why did our ${t.topic} posts perform at ${t.avgEngagementRate}% engagement?`)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-0.5"
                    >
                      <span>Analyze with Agent</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best-Time Recommendations & Format Distribution (1 Col) */}
        <div className="space-y-6">
          {/* Best Time Windows */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-slate-100">Best Posting Windows</h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Calibrated to historical engagement velocity.
              </p>
            </div>

            <div className="space-y-3">
              {analytics.bestTimeWindows.map((w, idx) => (
                <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-cyan-300 font-semibold">{w.day}</span>
                    <span className="text-slate-200">{w.timeWindow}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Avg rate: <strong className="text-slate-200">{w.avgRate}%</strong></span>
                    <span>{w.postCount} post(s) recorded</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 leading-tight border-t border-slate-850 pt-1.5 flex items-start gap-1">
                    <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span>{w.note}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Explicit Disclaimer required by specification */}
            <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Methodology Disclaimer:</strong> These windows reflect historical sample averages for {brand.name}. They are observational estimates, not algorithmic guarantees.
              </span>
            </div>
          </div>

          {/* Format Comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <h2 className="text-sm font-semibold text-slate-100">Content Format Benchmark</h2>
              <p className="text-[11px] text-slate-400">Effectiveness by media container</p>
            </div>

            <div className="space-y-2">
              {analytics.formatBreakdown.map((fmt) => (
                <div key={fmt.format} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-850/60 last:border-0">
                  <span className="capitalize text-slate-300 font-medium">{fmt.format.replace('_', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100 font-semibold">{fmt.avgEngagementRate}%</span>
                    <span className="text-slate-500 text-[11px]">({fmt.count} posts)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Conversation Memory & Sentiment Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              Community Conversation Memory & Recurring Feedback
            </h2>
            <p className="text-xs text-slate-400">
              Audience comments categorized by theme and sentiment to surface product and content opportunities.
            </p>
          </div>
          <button
            onClick={() => onAskAgent(`What concerns has our audience raised recently for ${brand.name}?`)}
            className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-medium"
          >
            <span>Ask Agent About Concerns</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Recurring Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.topThemes.map((th) => (
            <div key={th.theme} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-300 tracking-wider">
                  {th.theme.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-400">{th.count} interactions</span>
              </div>
              <div className="text-xs text-slate-400">
                <span className="text-slate-500">Related Topic:</span> <span className="text-slate-300 font-medium">{th.topTopic}</span>
              </div>
              <div className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded border border-slate-800/80 line-clamp-3">
                "{th.sampleComment}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
