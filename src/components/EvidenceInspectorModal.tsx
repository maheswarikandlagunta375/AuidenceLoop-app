import React from 'react';
import { X, ExternalLink, Calendar, MessageSquare, ThumbsUp, Share2, Eye, ShieldCheck } from 'lucide-react';
import { CitationItem, PostRecord, CommunityCommentRecord } from '../types';

interface EvidenceInspectorModalProps {
  citation: CitationItem | null;
  onClose: () => void;
}

export const EvidenceInspectorModal: React.FC<EvidenceInspectorModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const rawPost = citation.type === 'post' ? (citation.rawRecord as PostRecord) : null;
  const rawComment = citation.type === 'comment' ? (citation.rawRecord as CommunityCommentRecord) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                AudienceLoop Grounded Evidence
                <span className="text-xs font-mono text-cyan-400">[{citation.id}]</span>
              </h3>
              <p className="text-xs text-slate-400">Verified record retrieved from brand storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Context citation badge */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-medium mb-1">Agent Citation Rationale</div>
            <div className="text-xs text-slate-200">{citation.relevance}</div>
          </div>

          {/* Record Details */}
          {rawPost && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> Impressions
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-1">
                    {rawPost.impressions.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-emerald-400" /> Reactions
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-1">
                    {rawPost.reactions.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-blue-400" /> Comments
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-1">
                    {rawPost.commentsCount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-purple-400" /> Shares
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-1">
                    {rawPost.shares.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Engagement Rate calculation proof */}
              <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-lg p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-medium">Verified Engagement Rate:</span>{' '}
                  <span className="text-cyan-300 font-bold">{rawPost.engagementRate}%</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  ({rawPost.reactions} + {rawPost.commentsCount} + {rawPost.shares}) / {rawPost.impressions}
                </div>
              </div>

              {/* Full Content */}
              <div>
                <div className="text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Post Content</span>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="capitalize">{rawPost.platform}</span>
                    <span>·</span>
                    <span className="capitalize">{rawPost.format}</span>
                    <span>·</span>
                    <span>{rawPost.dayOfWeek} {rawPost.hourOfDay}:00</span>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                  {rawPost.content}
                </div>
              </div>

              {/* Tags */}
              {rawPost.tags && rawPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
                  <span className="text-slate-500">Tags:</span>
                  {rawPost.tags.map((tag, idx) => (
                    <span key={idx} className="text-slate-300">
                      #{tag}{idx < rawPost.tags.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {rawComment && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400">Author</div>
                  <div className="text-xs font-mono font-medium text-slate-200 mt-1">
                    @{rawComment.author}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400">Theme</div>
                  <div className="text-xs font-medium text-slate-200 mt-1 uppercase">
                    {rawComment.theme}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                  <div className="text-[11px] text-slate-400">Sentiment Score</div>
                  <div className={`text-xs font-semibold mt-1 ${rawComment.sentimentScore > 0 ? 'text-emerald-400' : rawComment.sentimentScore < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {rawComment.sentiment.toUpperCase()} ({rawComment.sentimentScore > 0 ? '+' : ''}{rawComment.sentimentScore})
                  </div>
                </div>
              </div>

              {rawComment.postExcerpt && (
                <div className="text-xs text-slate-400">
                  <span className="text-slate-500 font-medium">In response to post:</span>{' '}
                  <span className="italic">"{rawComment.postExcerpt}"</span>
                </div>
              )}

              <div>
                <div className="text-xs font-medium text-slate-400 mb-1.5">
                  Sanitized Community Comment (Untrusted User Content)
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                  "{rawComment.content}"
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3 text-[11px] text-amber-300">
                Data Safeguard Active: Untrusted user input is strictly parsed for sentiment and recurring topics, with personal identifiers automatically masked and prompt directives stripped.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
