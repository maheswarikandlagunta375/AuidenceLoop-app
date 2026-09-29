import React, { useState, useEffect, useCallback } from 'react';
import { AgentHeader } from './components/AgentHeader';
import { StatCards } from './components/StatCards';
import { BestNextPostCard } from './components/BestNextPostCard';
import { AudienceInsightsList } from './components/AudienceInsightsList';
import { DashboardPanels } from './components/DashboardPanels';
import { PlanExperimentModal } from './components/PlanExperimentModal';
import { UploadCsvModal } from './components/UploadCsvModal';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { EvidenceInspectorModal } from './components/EvidenceInspectorModal';
import { DraftStudioTab } from './components/DraftStudioTab';
import { CalendarTab } from './components/CalendarTab';
import { FeedbackLoopTab } from './components/FeedbackLoopTab';
import { NewBrandModal } from './components/NewBrandModal';
import {
  Brand,
  SimulationState,
  PostRecord,
  CalendarPost,
  FeedbackLoopRecord,
  AgentChatMessage,
  CitationItem,
  CalendarStatus,
  ExperimentRecord,
  AudienceInsight,
  Format
} from './types';
import { X } from 'lucide-react';

export default function App() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string>('brand-brewbloom');
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);

  // Simulation State
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>([]);
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackLoopRecord[]>([]);

  // Modals & Drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isUploadCsvOpen, setIsUploadCsvOpen] = useState(false);
  const [isPlanExperimentOpen, setIsPlanExperimentOpen] = useState(false);
  const [isNewBrandOpen, setIsNewBrandOpen] = useState(false);
  const [inspectedCitation, setInspectedCitation] = useState<CitationItem | null>(null);

  // Agent Chat state
  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Toast notification
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // 1. Fetch Brands
  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch('/api/brands');
      if (res.ok) {
        const data: Brand[] = await res.json();
        setBrands(data);
        if (data.length > 0 && !activeBrandId) {
          setActiveBrandId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  }, [activeBrandId]);

  // 2. Fetch Simulation State & Brand Records
  const fetchBrandSimulation = useCallback(async (brandId: string) => {
    try {
      const [bRes, simRes, pRes, cRes, fRes] = await Promise.all([
        fetch(`/api/brands/${brandId}`),
        fetch(`/api/brands/${brandId}/simulation`),
        fetch(`/api/brands/${brandId}/posts`),
        fetch(`/api/brands/${brandId}/calendar`),
        fetch(`/api/brands/${brandId}/feedback`)
      ]);

      if (bRes.ok) {
        const bData: Brand = await bRes.json();
        setActiveBrand(bData);
      }
      if (simRes.ok) {
        const sData: SimulationState = await simRes.json();
        setSimState(sData);
      }
      if (pRes.ok) {
        const pData: PostRecord[] = await pRes.json();
        setPosts(pData);
      }
      if (cRes.ok) {
        const cData: CalendarPost[] = await cRes.json();
        setCalendarPosts(cData);
      }
      if (fRes.ok) {
        const fData: FeedbackLoopRecord[] = await fRes.json();
        setFeedbackRecords(fData);
      }
    } catch (err) {
      console.error('Failed to fetch simulation data:', err);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    if (activeBrandId) {
      fetchBrandSimulation(activeBrandId);
    }
  }, [activeBrandId, fetchBrandSimulation]);

  // Set initial chat greeting
  useEffect(() => {
    if (!activeBrand) return;

    setChatMessages([
      {
        id: `welcome-${activeBrand.id}`,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        text: `Hi! I am the Social Media Engagement Agent for **${activeBrand.name}**.

I continuously analyze your posts, community sentiment, and conversation memory. Every recommendation I generate is grounded in ${activeBrand.name}'s verified records with zero hallucinations.

Ask me anything about what to post next, best times, or audience concerns!`,
        suggestedActions: [
          'What should we post this week, and why?',
          'Why did our educational posts perform better?',
          'What concerns has our audience raised recently?',
          'Suggest three posts for Friday.'
        ]
      }
    ]);
  }, [activeBrand]);

  // Advance week handler (+1 or +4)
  const handleAdvanceWeek = async (weeks: number) => {
    if (!activeBrandId) return;
    try {
      const res = await fetch(`/api/brands/${activeBrandId}/simulation/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks })
      });
      if (res.ok) {
        const updated: SimulationState = await res.json();
        setSimState(updated);
        showToast(`Advanced to Learning Week ${updated.currentWeek}! New engagement data assimilated.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset demo handler (Week 1)
  const handleResetDemo = async () => {
    if (!activeBrandId) return;
    try {
      const res = await fetch(`/api/brands/${activeBrandId}/simulation/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetWeek: 1 })
      });
      if (res.ok) {
        const updated: SimulationState = await res.json();
        setSimState(updated);
        showToast('Reset simulation to Learning Week 1 (early hypothesis phase).');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV handler
  const handleExportCsv = () => {
    if (!activeBrandId) return;
    window.location.href = `/api/brands/${activeBrandId}/export-csv`;
  };

  // Send Chat message
  const handleSendChatMessage = async (query: string) => {
    if (!activeBrandId) return;

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: query
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await fetch(`/api/brands/${activeBrandId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!res.ok) throw new Error('Agent failed to respond');
      const data = await res.json();

      const agentMsg: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        text: data.answer,
        citations: data.citations,
        suggestedActions: data.suggestedActions,
        isFallback: data.isFallback
      };

      setChatMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: AgentChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        text: `Error retrieving grounded records: ${err.message || 'Server error'}. Please try again.`
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Add experiment handler
  const handleAddExperiment = (exp: ExperimentRecord) => {
    if (!simState) return;
    setSimState({
      ...simState,
      experiments: [exp, ...simState.experiments],
      experimentsRunningCount: simState.experimentsRunningCount + 1
    });
    showToast(`Experiment "${exp.title}" launched!`);
  };

  // Save draft to calendar
  const handleSaveToCalendar = async (newPost: any) => {
    if (!activeBrandId) return;
    try {
      const res = await fetch(`/api/brands/${activeBrandId}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        await fetchBrandSimulation(activeBrandId);
        showToast('Post draft saved to Content Calendar!');
        setIsDraftModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calendar status update
  const handleUpdateCalendarStatus = async (postId: string, status: CalendarStatus) => {
    if (!activeBrandId) return;
    try {
      const res = await fetch(`/api/brands/${activeBrandId}/calendar/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setCalendarPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, status, updatedAt: new Date().toISOString() } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calendar post deletion
  const handleDeleteCalendarPost = async (postId: string) => {
    if (!activeBrandId) return;
    try {
      const res = await fetch(`/api/brands/${activeBrandId}/calendar/${postId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCalendarPosts((prev) => prev.filter((p) => p.id !== postId));
        showToast('Post removed from calendar.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create brand handler
  const handleCreateBrand = async (brandData: Partial<Brand>) => {
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData)
      });
      if (res.ok) {
        const created: Brand = await res.json();
        await fetchBrands();
        setActiveBrandId(created.id);
        showToast(`Created brand workspace: ${created.name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          {notification}
        </div>
      )}

      {/* Header Matching Page 1 / Page 4 */}
      <AgentHeader
        brands={brands}
        activeBrand={activeBrand}
        onSelectBrand={(id) => {
          setActiveBrandId(id);
          showToast(`Switched workspace to ${brands.find((b) => b.id === id)?.name || id}`);
        }}
        onOpenNewBrand={() => setIsNewBrandOpen(true)}
        learningWeek={simState?.currentWeek || 5}
        onAdvanceWeek={handleAdvanceWeek}
        onResetDemo={handleResetDemo}
        onOpenUploadCsv={() => setIsUploadCsvOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenDraft={() => setIsDraftModalOpen(true)}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Main Dashboard Layout Matching Screenshots */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {simState ? (
          <>
            {/* 1. Four Big Stat Cards */}
            <StatCards
              postsAnalysed={simState.postsAnalysed}
              avgEngagementPerPost={simState.avgEngagementPerPost}
              highConfidenceInsightsCount={simState.highConfidenceInsightsCount}
              experimentsRunningCount={simState.experimentsRunningCount}
            />

            {/* 2. Hero Best Next Post Card */}
            <BestNextPostCard
              hypothesis={simState.bestNextPost}
              onDraftPost={() => setIsDraftModalOpen(true)}
              onInspectEvidence={() => {
                // Inspect evidence
                const firstPost = posts[0];
                if (firstPost) {
                  setInspectedCitation({
                    id: firstPost.id,
                    type: 'post',
                    title: `${firstPost.topic} (${firstPost.format}) on ${firstPost.dayOfWeek}`,
                    date: firstPost.publishedAt.split('T')[0],
                    metricsSnippet: `${firstPost.engagementRate}% engagement rate`,
                    relevance: `Supporting benchmark factor for ${simState.bestNextPost.topic}`,
                    rawRecord: firstPost
                  });
                }
              }}
            />

            {/* 3. What I've Learned About Your Audience (Page 2) */}
            <AudienceInsightsList
              insights={simState.insights}
              onSelectInsight={(ins: AudienceInsight) => {
                setIsChatOpen(true);
                handleSendChatMessage(`Tell me more about this insight: "${ins.title}". What is the evidence behind it?`);
              }}
            />

            {/* 4. 2x2 Grid (Page 3) */}
            <DashboardPanels
              driveFactors={simState.driveFactors}
              sentimentTopics={simState.sentimentTopics}
              experiments={simState.experiments}
              learningOverTime={simState.learningOverTime}
              onOpenPlanExperiment={() => setIsPlanExperimentOpen(true)}
            />
          </>
        ) : (
          <div className="py-24 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading engagement agent data...</p>
          </div>
        )}
      </main>

      {/* Slide-over Agent Chat Drawer */}
      <AgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        brand={activeBrand || { name: 'Brew & Bloom Cafe' } as Brand}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        isLoading={isChatLoading}
        onInspectCitation={(c) => setInspectedCitation(c)}
        onSelectAction={(actionText) => {
          if (actionText.toLowerCase().includes('generate draft') || actionText.toLowerCase().includes('draft')) {
            setIsDraftModalOpen(true);
          } else if (actionText.toLowerCase().includes('calendar') || actionText.toLowerCase().includes('schedule')) {
            setIsCalendarModalOpen(true);
          } else {
            handleSendChatMessage(actionText);
          }
        }}
      />

      {/* Draft Studio Modal View */}
      {isDraftModalOpen && activeBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800 relative">
            <div className="sticky top-0 z-10 px-6 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100">Post Draft Studio & Strategy Calibrator</h2>
              <button onClick={() => setIsDraftModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <DraftStudioTab
              brand={activeBrand}
              initialTopic={simState?.bestNextPost.topic}
              initialFormat={simState?.bestNextPost.format.toLowerCase() as Format}
              onSaveToCalendar={handleSaveToCalendar}
            />
          </div>
        </div>
      )}

      {/* Content Calendar Modal View */}
      {isCalendarModalOpen && activeBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800 relative">
            <div className="sticky top-0 z-10 px-6 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100">Editorial Content Calendar ({activeBrand.name})</h2>
              <button onClick={() => setIsCalendarModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <CalendarTab
              posts={calendarPosts}
              onUpdateStatus={handleUpdateCalendarStatus}
              onDeletePost={handleDeleteCalendarPost}
              brandName={activeBrand.name}
            />
          </div>
        </div>
      )}

      {/* Strategy Feedback Audit Modal View */}
      {isFeedbackModalOpen && activeBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800 relative">
            <div className="sticky top-0 z-10 px-6 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100">Closed-Loop Strategy Audit vs Reality</h2>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FeedbackLoopTab
              brand={activeBrand}
              records={feedbackRecords}
              onDraftStrategyPost={(topic, format) => {
                setIsFeedbackModalOpen(false);
                setIsDraftModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Plan Experiment Modal */}
      <PlanExperimentModal
        isOpen={isPlanExperimentOpen}
        onClose={() => setIsPlanExperimentOpen(false)}
        brandId={activeBrandId}
        onAddExperiment={handleAddExperiment}
      />

      {/* Upload CSV Modal */}
      <UploadCsvModal
        isOpen={isUploadCsvOpen}
        onClose={() => setIsUploadCsvOpen(false)}
        brandId={activeBrandId}
        brandName={activeBrand?.name || 'Brew & Bloom Cafe'}
        onImportSuccess={async () => {
          await fetchBrandSimulation(activeBrandId);
          showToast('CSV posts and metrics successfully ingested!');
        }}
      />

      {/* Evidence Inspector Modal */}
      <EvidenceInspectorModal
        citation={inspectedCitation}
        onClose={() => setInspectedCitation(null)}
      />

      {/* New Brand Modal */}
      <NewBrandModal
        isOpen={isNewBrandOpen}
        onClose={() => setIsNewBrandOpen(false)}
        onCreateBrand={handleCreateBrand}
      />
    </div>
  );
}
