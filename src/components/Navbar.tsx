import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  RotateCcw, 
  Download, 
  BarChart3, 
  MessageSquare, 
  PenTool, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  UploadCloud,
  Check
} from 'lucide-react';
import { Brand } from '../types';

interface NavbarProps {
  brands: Brand[];
  activeBrand: Brand | null;
  onSelectBrand: (brandId: string) => void;
  onOpenNewBrandModal: () => void;
  onResetData: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brands,
  activeBrand,
  onSelectBrand,
  onOpenNewBrandModal,
  onResetData,
  activeTab,
  onSelectTab
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'chat', label: 'Engagement Agent', icon: MessageSquare },
    { id: 'draft', label: 'Draft Studio', icon: PenTool },
    { id: 'calendar', label: 'Content Calendar', icon: CalendarIcon },
    { id: 'feedback', label: 'Strategy Feedback Loop', icon: TrendingUp },
    { id: 'import', label: 'CSV Import', icon: UploadCloud }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-bold text-white text-base">
              ∞
            </div>
            <div>
              <span className="font-semibold text-slate-100 text-sm tracking-tight">AudienceLoop</span>
              <span className="hidden sm:inline text-xs text-slate-400 font-normal ml-2">Social Media Engagement Agent</span>
            </div>
          </div>

          {/* Brand Workspace Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-slate-100">{activeBrand?.name || 'Select Workspace'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Brand Workspaces
                </div>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectBrand(b.id)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-start justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-200">{b.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{b.industry}</div>
                    </div>
                    {activeBrand?.id === b.id && (
                      <Check className="w-4 h-4 text-cyan-400 mt-0.5" />
                    )}
                  </button>
                ))}
                <div className="my-1 border-t border-slate-800" />
                <button
                  onClick={onOpenNewBrandModal}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center gap-2 text-xs font-medium text-cyan-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Brand Workspace</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Quick Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/api/sample-csv/posts"
            download="sample_social_posts.csv"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            title="Download sample posts CSV with metric columns"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Sample CSV</span>
          </a>

          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            title="Reset database to initial realistic multi-week synthetic dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Brand Context Sub-Bar */}
      {activeBrand && (
        <div className="bg-slate-950/60 border-t border-slate-850 px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-y-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">{activeBrand.industry}</span>
            <span aria-hidden="true">·</span>
            <span>Tone: <span className="text-slate-300">{activeBrand.tone}</span></span>
            <span aria-hidden="true" className="hidden md:inline">·</span>
            <span className="hidden md:inline">Audience: <span className="text-slate-300">{activeBrand.targetAudience}</span></span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Channels: {activeBrand.defaultPlatforms.map(p => p.toUpperCase()).join(', ')}</span>
            <span>·</span>
            <span className="text-emerald-400/90 font-medium">Tenant Isolated</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs (Functional Segmented Buttons per Frontend Design Constitution) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
