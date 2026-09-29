export type Platform = 'linkedin' | 'twitter' | 'instagram' | 'threads';
export type Format = 'carousel' | 'infographic' | 'text' | 'short_video' | 'poll' | 'reels' | 'single_image';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type CalendarStatus = 'draft' | 'approved' | 'scheduled' | 'published';
export type ConversationTheme = 'feature_request' | 'question' | 'concern' | 'praise' | 'complaint' | 'general';
export type ConfidenceLevel = 'high' | 'medium' | 'hypothesis';

export interface AudienceInsight {
  id: string;
  title: string;
  detail: string;
  category: 'topic' | 'format' | 'tone' | 'time' | 'day' | 'sentiment';
  confidence: ConfidenceLevel;
  multiplier?: number;
  isNegative?: boolean;
  isNew: boolean;
}

export interface DriveFactor {
  name: string;
  multiplier: number;
  postCount: number;
  isTrustworthy: boolean;
}

export interface SentimentTopicSummary {
  topic: string;
  negativePct: number;
  commentCount: number;
  sampleQuote: string;
}

export interface ExperimentRecord {
  id: string;
  brandId: string;
  title: string;
  earlySignal: string;
  instruction: string;
  targetCount: number;
  publishedCount: number;
  status: 'running' | 'completed' | 'paused';
}

export interface WeeklyLearningPoint {
  week: string;
  high: number;
  medium: number;
  hypothesis: number;
}

export interface BestNextPostHypothesis {
  format: string;
  topic: string;
  tone: string;
  day: string;
  timeWindow: string;
  predictedEngagements: number;
  multiplier: number;
  lowConfidenceFactorsCount: number;
  totalFactorsCount: number;
}

export interface SimulationState {
  currentWeek: number;
  postsAnalysed: number;
  avgEngagementPerPost: number;
  highConfidenceInsightsCount: number;
  experimentsRunningCount: number;
  bestNextPost: BestNextPostHypothesis;
  insights: AudienceInsight[];
  driveFactors: Record<'format' | 'topic' | 'tone' | 'time' | 'day', DriveFactor[]>;
  sentimentTopics: SentimentTopicSummary[];
  experiments: ExperimentRecord[];
  learningOverTime: WeeklyLearningPoint[];
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  tone: string;
  targetAudience: string;
  defaultPlatforms: Platform[];
  keyGoals: string[];
  createdAt: string;
  simulatedDataLabel?: string;
}

export interface PostRecord {
  id: string;
  brandId: string;
  platform: Platform;
  content: string;
  publishedAt: string; // ISO string
  dayOfWeek: string;
  hourOfDay: number;
  topic: string;
  format: Format;
  impressions: number;
  reactions: number;
  commentsCount: number;
  shares: number;
  engagementRate: number; // percentage, e.g. 4.82
  sentimentScore: number; // -1.0 to 1.0
  sentimentLabel: Sentiment;
  tags: string[];
  source: 'csv_import' | 'synthetic_seed' | 'manual';
}

export interface CommunityCommentRecord {
  id: string;
  brandId: string;
  postId?: string;
  postExcerpt?: string;
  author: string;
  timestamp: string;
  content: string;
  sentiment: Sentiment;
  sentimentScore: number;
  topic: string;
  theme: ConversationTheme;
  isAddressed: boolean;
}

export interface CalendarPost {
  id: string;
  brandId: string;
  title: string;
  content: string;
  platform: Platform;
  format: Format;
  topic: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: CalendarStatus;
  goal: string;
  evidenceRationale: string;
  supportingPostIds: string[];
  estimatedEngagementRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackLoopRecord {
  id: string;
  brandId: string;
  recommendationDate: string;
  recommendationSummary: string;
  targetTopic: string;
  targetFormat: Format;
  recommendedDay: string;
  recommendedHour: number;
  baselineEngagementRate: number;
  status: 'validated' | 'refuted' | 'inconclusive';
  outcomeSummary: string;
  laterPostsAnalyzed: number;
  actualEngagementRate: number;
  evidenceDelta: number; // positive or negative difference
  supportingPostIds: string[];
}

export interface TopicMetric {
  topic: string;
  count: number;
  avgEngagementRate: number;
  avgReactions: number;
  avgComments: number;
  avgShares: number;
  isLimitedEvidence: boolean;
  sampleSize: number;
}

export interface FormatMetric {
  format: Format;
  count: number;
  avgEngagementRate: number;
  isLimitedEvidence: boolean;
  sampleSize: number;
}

export interface DayMetric {
  day: string;
  count: number;
  avgEngagementRate: number;
  isLimitedEvidence: boolean;
}

export interface HourMetric {
  day: string;
  hour: number;
  count: number;
  avgEngagementRate: number;
}

export interface BestTimeWindow {
  day: string;
  timeWindow: string;
  avgRate: number;
  postCount: number;
  confidence: 'high' | 'moderate' | 'limited';
  note: string;
}

export interface SentimentSummary {
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  netSentiment: number;
  totalComments: number;
}

export interface CommunityThemeSummary {
  theme: ConversationTheme;
  count: number;
  sampleComment: string;
  sentiment: Sentiment;
  topTopic: string;
}

export interface AnalyticsSummary {
  brandId: string;
  totalPosts: number;
  totalImpressions: number;
  avgEngagementRate: number;
  dateRange: { start: string; end: string };
  topicBreakdown: TopicMetric[];
  formatBreakdown: FormatMetric[];
  dayBreakdown: DayMetric[];
  hourlyHeatmap: HourMetric[];
  bestTimeWindows: BestTimeWindow[];
  sentimentSummary: SentimentSummary;
  topThemes: CommunityThemeSummary[];
}

export interface CitationItem {
  id: string;
  type: 'post' | 'comment' | 'metric_aggregate';
  title: string;
  date?: string;
  metricsSnippet?: string;
  contentSnippet?: string;
  relevance: string;
  rawRecord?: PostRecord | CommunityCommentRecord;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  citations?: CitationItem[];
  suggestedActions?: string[];
  isFallback?: boolean;
}

export interface DraftGenerationRequest {
  brandId: string;
  goal: string;
  topic: string;
  format: Format;
  platform: Platform;
  targetAudienceOverride?: string;
  customPrompt?: string;
}

export interface DraftGenerationResult {
  title: string;
  content: string;
  platform: Platform;
  format: Format;
  topic: string;
  goal: string;
  estimatedEngagementRate: number;
  evidenceRationale: string;
  supportingPostIds: string[];
  recommendedHashtags: string[];
}
