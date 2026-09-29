import React, { useState } from 'react';
import { X, Send, Bot, User, ShieldCheck, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { AgentChatMessage, CitationItem, Brand } from '../types';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand;
  messages: AgentChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onInspectCitation: (citation: CitationItem) => void;
  onSelectAction: (actionText: string) => void;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
  brand,
  messages,
  onSendMessage,
  isLoading,
  onInspectCitation,
  onSelectAction
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white border-l border-slate-200 w-full max-w-xl h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Engagement Agent</span>
                <span className="text-[11px] font-normal text-slate-500">· {brand.name}</span>
              </h3>
              <p className="text-[11px] text-slate-500">Grounded in verified historical metrics & conversations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-[11px]">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(q)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-full font-medium transition-colors"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Chat log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-[#1761d8] text-white'
                    : 'bg-slate-100/90 text-slate-800 border border-slate-200/80'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Citations tray */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <span>CITED EVIDENCE:</span>
                    </div>
                    <div className="space-y-1">
                      {msg.citations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => onInspectCitation(c)}
                          className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 rounded p-2 text-[11px] transition-colors group flex items-start justify-between gap-1"
                        >
                          <div>
                            <div className="font-semibold text-blue-700 group-hover:underline">
                              [{c.id}] {c.title}
                            </div>
                            {c.metricsSnippet && (
                              <div className="text-[10px] text-slate-500">{c.metricsSnippet}</div>
                            )}
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested actions */}
                {msg.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-1 text-[10px]">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectAction(act)}
                        className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium border border-blue-200 flex items-center gap-1"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-500">
                Retrieving verified {brand.name} records...
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus-within:border-blue-600">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about publishing times, community feedback..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-3 py-1.5 bg-[#1761d8] hover:bg-[#124eb3] disabled:opacity-40 text-white rounded-md text-xs font-semibold flex items-center gap-1"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
