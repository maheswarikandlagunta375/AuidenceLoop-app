import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  AlertCircle, 
  ArrowRight,
  Bot,
  User,
  Info
} from 'lucide-react';
import { AgentChatMessage, Brand, CitationItem } from '../types';

interface AgentChatTabProps {
  brand: Brand;
  messages: AgentChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onInspectCitation: (citation: CitationItem) => void;
  onSelectAction: (actionText: string) => void;
}

export const AgentChatTab: React.FC<AgentChatTabProps> = ({
  brand,
  messages,
  onSendMessage,
  isLoading,
  onInspectCitation,
  onSelectAction
}) => {
  const [inputText, setInputText] = useState('');

  const presetQuestions = [
    'What should we post this week, and why?',
    'Why did our educational posts perform better?',
    'What concerns has our audience raised recently?',
    'Suggest three posts for Friday.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const q = inputText.trim();
    setInputText('');
    onSendMessage(q);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Agent Persona Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-slate-100">
                AudienceLoop Intelligence Agent
              </h1>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-900/60 px-2 py-0.5 rounded">
                {brand.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Strictly grounded in {brand.name}’s historical posts, engagement metrics, and community conversations. Cites stored records for every claim.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Grounded Retrieval Safeguards Active</span>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div>
        <div className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Suggested Questions Grounded in Brand Data:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(q)}
              disabled={isLoading}
              className="text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-colors text-left disabled:opacity-50"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-5 min-h-[350px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-3xl rounded-xl p-4 sm:p-5 text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-cyan-950/60 border border-cyan-800/80 text-slate-100'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-800/60">
                <span className="font-semibold text-slate-400">
                  {msg.sender === 'user' ? 'Brand Manager' : 'AudienceLoop Agent'}
                </span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Message Text with Markdown Formatting */}
              <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                {msg.text}
              </div>

              {/* Citations Tray */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CITED RECORDS & EVIDENCE INSPECTOR:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.citations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onInspectCitation(c)}
                        className="text-left bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-800/80 rounded-lg p-2.5 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-medium text-cyan-400">
                            [{c.id}]
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <div className="text-xs font-medium text-slate-200 truncate mt-0.5">
                          {c.title}
                        </div>
                        {c.metricsSnippet && (
                          <div className="text-[10px] text-slate-400 mt-1 truncate">
                            {c.metricsSnippet}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-up Actions */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-850 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500">Next Action:</span>
                  {msg.suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectAction(act)}
                      className="px-2 py-0.5 rounded text-cyan-300 hover:text-cyan-100 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-900/60 transition-colors flex items-center gap-1"
                    >
                      <span>{act}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-1 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span>Retrieving {brand.name} records and generating evidence-grounded response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-slate-900 border border-slate-800 focus-within:border-cyan-600 rounded-xl p-2 flex items-center gap-2 shadow-lg">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask AudienceLoop about ${brand.name}'s audience patterns, timing, or content strategy...`}
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Responses cite exact Post and Comment IDs from {brand.name}'s verified database.</span>
        </div>
      </form>
    </div>
  );
};
