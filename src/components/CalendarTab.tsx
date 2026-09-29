import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Filter, 
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { CalendarPost, CalendarStatus, Platform } from '../types';

interface CalendarTabProps {
  posts: CalendarPost[];
  onUpdateStatus: (postId: string, status: CalendarStatus) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  brandName: string;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  posts,
  onUpdateStatus,
  onDeletePost,
  brandName
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const filteredPosts = posts.filter((p) => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchPlatform = platformFilter === 'all' || p.platform === platformFilter;
    return matchStatus && matchPlatform;
  });

  const getStatusBadge = (status: CalendarStatus) => {
    switch (status) {
      case 'published':
        return <span className="text-emerald-400 font-medium">Published (Staged)</span>;
      case 'approved':
        return <span className="text-cyan-400 font-medium">Approved for Publish</span>;
      case 'scheduled':
        return <span className="text-purple-400 font-medium">Scheduled</span>;
      default:
        return <span className="text-slate-400 font-medium">Draft</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-medium mb-1">
            Editorial Content Pipeline · {brandName}
          </div>
          <h1 className="text-lg font-semibold text-slate-100">
            Social Media Content Calendar
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Review, approve, and stage upcoming posts generated from evidence-backed brand recommendations.
          </p>
        </div>

        {/* Integration Safeguard Notice */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2 max-w-md">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Publishing Transparency:</strong> Real API publishing is disabled in this staging prototype. Status updates simulate editorial approvals without automated live broadcasts.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Filter Status:</span>
          {(['all', 'draft', 'approved', 'scheduled', 'published'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`capitalize px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === st
                  ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Platform:</span>
          {(['all', 'linkedin', 'twitter', 'instagram', 'threads'] as const).map((pl) => (
            <button
              key={pl}
              onClick={() => setPlatformFilter(pl)}
              className={`capitalize px-2.5 py-1 rounded-md transition-colors ${
                platformFilter === pl
                  ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {pl}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <Calendar className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p className="text-xs">No posts matching filter in {brandName}'s calendar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-colors"
            >
              {/* Card Top */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 capitalize">{post.platform}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 capitalize">{post.format.replace('_', ' ')}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{post.topic}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{post.scheduledDate}</span>
                    <span className="text-slate-500">at</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.scheduledTime}</span>
                  </div>

                  <div className="text-xs">
                    {getStatusBadge(post.status)}
                  </div>
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm font-semibold text-slate-100">{post.title}</h3>
                <p className="text-xs text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-850">
                  {post.content}
                </p>
              </div>

              {/* Evidence Rationale & Expected Engagement */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Expected Benchmark:</strong> {post.estimatedEngagementRate}% engagement rate
                  </span>
                </div>
                <div className="text-slate-400 truncate max-w-md">
                  Rationale: {post.evidenceRationale}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Workflow State:</span>
                  {(['draft', 'approved', 'scheduled', 'published'] as CalendarStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(post.id, st)}
                      className={`capitalize px-2 py-0.5 rounded text-[11px] transition-colors ${
                        post.status === st
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
