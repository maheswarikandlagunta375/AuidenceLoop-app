import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { Brand, Platform } from '../types';

interface NewBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBrand: (brandData: Partial<Brand>) => Promise<void>;
}

export const NewBrandModal: React.FC<NewBrandModalProps> = ({ isOpen, onClose, onCreateBrand }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [tagline, setTagline] = useState('');
  const [tone, setTone] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['linkedin', 'twitter']);
  const [goalsText, setGoalsText] = useState('Brand Authority, Community Growth');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !industry.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateBrand({
        name: name.trim(),
        industry: industry.trim(),
        tagline: tagline.trim(),
        tone: tone.trim() || 'Professional and informative',
        targetAudience: targetAudience.trim() || 'General industry professionals',
        defaultPlatforms: selectedPlatforms,
        keyGoals: goalsText.split(',').map((g) => g.trim()).filter(Boolean)
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100">Create Brand Workspace</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Brand Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex AI Research"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Industry / Category *</label>
            <input
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Enterprise AI & Machine Learning Infrastructure"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tagline / Mission</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Scalable inference architectures for frontier models"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Brand Voice & Tone</label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g. Rigorous, technical, peer-reviewed, measured"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. ML researchers, AI infrastructure engineers, CTOs"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Social Channels</label>
            <div className="flex gap-2">
              {(['linkedin', 'twitter', 'instagram', 'threads'] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`capitalize px-2.5 py-1 rounded text-xs border transition-colors ${
                    selectedPlatforms.includes(p)
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creating...' : 'Create Workspace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
