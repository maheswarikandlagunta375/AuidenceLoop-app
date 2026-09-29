import React, { useState } from 'react';
import { X, Beaker, Plus } from 'lucide-react';
import { ExperimentRecord } from '../types';

interface PlanExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  onAddExperiment: (exp: ExperimentRecord) => void;
}

export const PlanExperimentModal: React.FC<PlanExperimentModalProps> = ({
  isOpen,
  onClose,
  brandId,
  onAddExperiment
}) => {
  const [title, setTitle] = useState('Test Behind-the-Scenes reels on Saturday evening');
  const [earlySignal, setEarlySignal] = useState('Early signal: 1.8x engagement from 2 previous reels');
  const [instruction, setInstruction] = useState('Publish 3 reels featuring roastery origin stories on Saturday 6pm.');
  const [targetCount, setTargetCount] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newExp: ExperimentRecord = {
      id: `exp-${Date.now()}`,
      brandId,
      title: title.trim(),
      earlySignal: earlySignal.trim(),
      instruction: instruction.trim(),
      targetCount: Math.max(1, targetCount),
      publishedCount: 0,
      status: 'running'
    };

    onAddExperiment(newExp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Beaker className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Plan Marketing Experiment</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Experiment Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hypothesis / Early Signal</label>
            <input
              type="text"
              value={earlySignal}
              onChange={(e) => setEarlySignal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Testing Instruction</label>
            <textarea
              rows={2}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Posts to Verify</label>
            <input
              type="number"
              min={1}
              max={10}
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value, 10) || 3)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1761d8] hover:bg-[#124eb3] text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Experiment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
