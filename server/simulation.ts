import { SimulationState, Brand } from '../src/types';

export const BREW_BLOOM_BRAND: Brand = {
  id: 'brand-brewbloom',
  name: 'Brew & Bloom Cafe',
  tagline: 'Artisanal botanical cafe and specialty coffee roastery.',
  industry: 'Hospitality & Specialty Coffee',
  tone: 'Playful, warm, community-driven, conversational',
  targetAudience: 'Coffee enthusiasts, weekend brunchers, local creatives (20-38)',
  defaultPlatforms: ['instagram'],
  keyGoals: ['Weekend Foot Traffic', 'Seasonal Menu Adoption', 'Customer Loyalty'],
  createdAt: '2026-08-01T00:00:00.000Z',
  simulatedDataLabel: 'simulated Instagram data'
};

export function getSimulationStateForWeek(brandId: string, week: number): SimulationState {
  const safeWeek = Math.max(1, Math.min(10, week));

  if (safeWeek === 1) {
    return {
      currentWeek: 1,
      postsAnalysed: 7,
      avgEngagementPerPost: 214,
      highConfidenceInsightsCount: 0,
      experimentsRunningCount: 1,
      bestNextPost: {
        format: 'Reels',
        topic: 'Customer feature',
        tone: 'Playful',
        day: 'Monday',
        timeWindow: 'Evening (5-8pm)',
        predictedEngagements: 489,
        multiplier: 2.3,
        lowConfidenceFactorsCount: 4,
        totalFactorsCount: 5
      },
      insights: [
        {
          id: 'ins-1',
          title: 'Playful captions get 1.5x your average engagement',
          detail: '3 posts, avg 320 vs 214 overall · medium confidence',
          category: 'tone',
          confidence: 'medium',
          multiplier: 1.50,
          isNegative: false,
          isNew: true
        },
        {
          id: 'ins-2',
          title: 'Monday posts get 2.3x your average engagement',
          detail: '1 posts, avg 489 vs 214 overall · hypothesis',
          category: 'day',
          confidence: 'hypothesis',
          multiplier: 2.29,
          isNegative: false,
          isNew: true
        },
        {
          id: 'ins-3',
          title: 'Wednesday posts get 78% less engagement than average',
          detail: '1 posts, avg 48 vs 214 overall · hypothesis',
          category: 'day',
          confidence: 'hypothesis',
          multiplier: 0.22,
          isNegative: true,
          isNew: true
        },
        {
          id: 'ins-4',
          title: 'Single images get 72% less engagement than average',
          detail: '2 posts, avg 60 vs 214 overall · hypothesis',
          category: 'format',
          confidence: 'hypothesis',
          multiplier: 0.28,
          isNegative: true,
          isNew: true
        },
        {
          id: 'ins-5',
          title: 'Posts in the midday (11am-2pm) get 72% less engagement than average',
          detail: '2 posts, avg 60 vs 214 overall · hypothesis',
          category: 'time',
          confidence: 'hypothesis',
          multiplier: 0.28,
          isNegative: true,
          isNew: true
        },
        {
          id: 'ins-6',
          title: 'Thursday posts get 67% less engagement than average',
          detail: '1 posts, avg 71 vs 214 overall · hypothesis',
          category: 'day',
          confidence: 'hypothesis',
          multiplier: 0.33,
          isNegative: true,
          isNew: true
        },
        {
          id: 'ins-7',
          title: 'Promotional captions get 58% less engagement than average',
          detail: '2 posts, avg 89 vs 214 overall · hypothesis',
          category: 'tone',
          confidence: 'hypothesis',
          multiplier: 0.42,
          isNegative: true,
          isNew: true
        }
      ],
      driveFactors: {
        format: [
          { name: 'Reels', multiplier: 1.42, postCount: 3, isTrustworthy: false },
          { name: 'Carousels', multiplier: 1.10, postCount: 2, isTrustworthy: false },
          { name: 'Single images', multiplier: 0.28, postCount: 2, isTrustworthy: false }
        ],
        topic: [
          { name: 'Customer feature', multiplier: 1.65, postCount: 2, isTrustworthy: false },
          { name: 'Behind-the-scenes', multiplier: 1.30, postCount: 2, isTrustworthy: false },
          { name: 'Event', multiplier: 0.95, postCount: 1, isTrustworthy: false },
          { name: 'Discount', multiplier: 0.45, postCount: 2, isTrustworthy: false }
        ],
        tone: [
          { name: 'Playful', multiplier: 1.50, postCount: 3, isTrustworthy: false },
          { name: 'Casual', multiplier: 1.05, postCount: 2, isTrustworthy: false },
          { name: 'Promotional', multiplier: 0.42, postCount: 2, isTrustworthy: false }
        ],
        time: [
          { name: 'Evening (5-8pm)', multiplier: 1.48, postCount: 3, isTrustworthy: false },
          { name: 'Morning (8-10am)', multiplier: 1.02, postCount: 2, isTrustworthy: false },
          { name: 'Midday (11am-2pm)', multiplier: 0.28, postCount: 2, isTrustworthy: false }
        ],
        day: [
          { name: 'Monday', multiplier: 2.29, postCount: 1, isTrustworthy: false },
          { name: 'Saturday', multiplier: 1.40, postCount: 2, isTrustworthy: false },
          { name: 'Friday', multiplier: 1.15, postCount: 1, isTrustworthy: false },
          { name: 'Thursday', multiplier: 0.33, postCount: 1, isTrustworthy: false },
          { name: 'Wednesday', multiplier: 0.22, postCount: 1, isTrustworthy: false }
        ]
      },
      sentimentTopics: [
        { topic: 'Discount', negativePct: 53, commentCount: 17, sampleQuote: 'Overpriced even with the discount' },
        { topic: 'Event', negativePct: 17, commentCount: 6, sampleQuote: 'Wish this was announced earlier!' },
        { topic: 'Customer feature', negativePct: 0, commentCount: 11, sampleQuote: 'Love seeing familiar faces featured!' },
        { topic: 'Behind-the-scenes', negativePct: 0, commentCount: 6, sampleQuote: 'The roasting process is so cool!' }
      ],
      experiments: [
        {
          id: 'exp-1',
          brandId,
          title: 'Monday posts outperform your average',
          earlySignal: 'Early signal: 2.3x average from only 1 post(s), confidence low',
          instruction: 'Publish 3 posts with day = Mon; keep everything else as usual.',
          targetCount: 3,
          publishedCount: 0,
          status: 'running'
        }
      ],
      learningOverTime: [
        { week: 'W1', high: 0, medium: 1, hypothesis: 6 }
      ]
    };
  }

  // Week 5 (matching Page 1, Page 2, Page 3 exact values)
  const postsCount = 7 * safeWeek; // 35 at week 5
  return {
    currentWeek: safeWeek,
    postsAnalysed: postsCount,
    avgEngagementPerPost: 168,
    highConfidenceInsightsCount: Math.min(6, Math.max(1, safeWeek - 1)),
    experimentsRunningCount: safeWeek >= 5 ? 0 : 1,
    bestNextPost: {
      format: 'Reels',
      topic: 'Behind-the-scenes',
      tone: 'Playful',
      day: 'Saturday',
      timeWindow: 'Evening (5-8pm)',
      predictedEngagements: 437,
      multiplier: 2.6,
      lowConfidenceFactorsCount: Math.max(1, 5 - safeWeek),
      totalFactorsCount: 5
    },
    insights: [
      {
        id: 'ins-51',
        title: 'Discount posts attract criticism: 53% of comments are negative',
        detail: '17 comments analysed e.g. "Overpriced even with the discount" · medium confidence',
        category: 'sentiment',
        confidence: 'medium',
        isNegative: true,
        isNew: true
      },
      {
        id: 'ins-52',
        title: 'Playful captions get 1.5x your average engagement',
        detail: '3 posts, avg 320 vs 214 overall · medium confidence',
        category: 'tone',
        confidence: 'medium',
        multiplier: 1.50,
        isNegative: false,
        isNew: true
      },
      {
        id: 'ins-53',
        title: 'Wednesday posts get 78% less engagement than average',
        detail: '1 posts, avg 48 vs 214 overall · hypothesis',
        category: 'day',
        confidence: 'hypothesis',
        multiplier: 0.22,
        isNegative: true,
        isNew: true
      },
      {
        id: 'ins-54',
        title: 'Single images get 72% less engagement than average',
        detail: '2 posts, avg 60 vs 214 overall · hypothesis',
        category: 'format',
        confidence: 'hypothesis',
        multiplier: 0.28,
        isNegative: true,
        isNew: true
      },
      {
        id: 'ins-55',
        title: 'Posts in the midday (11am-2pm) get 72% less engagement than average',
        detail: '2 posts, avg 60 vs 214 overall · hypothesis',
        category: 'time',
        confidence: 'hypothesis',
        multiplier: 0.28,
        isNegative: true,
        isNew: true
      },
      {
        id: 'ins-56',
        title: 'Thursday posts get 67% less engagement than average',
        detail: '1 posts, avg 71 vs 214 overall · hypothesis',
        category: 'day',
        confidence: 'hypothesis',
        multiplier: 0.33,
        isNegative: true,
        isNew: true
      },
      {
        id: 'ins-57',
        title: 'Promotional captions get 58% less engagement than average',
        detail: '2 posts, avg 89 vs 214 overall · hypothesis',
        category: 'tone',
        confidence: 'hypothesis',
        multiplier: 0.42,
        isNegative: true,
        isNew: true
      },
      {
        id: 'ins-58',
        title: 'Monday posts get 2.3x your average engagement',
        detail: '1 posts, avg 489 vs 214 overall · hypothesis',
        category: 'day',
        confidence: 'hypothesis',
        multiplier: 2.29,
        isNegative: false,
        isNew: true
      }
    ],
    driveFactors: {
      format: [
        { name: 'Reels', multiplier: 1.42, postCount: Math.max(3, safeWeek * 2), isTrustworthy: safeWeek >= 2 },
        { name: 'Carousels', multiplier: 1.10, postCount: Math.max(2, safeWeek), isTrustworthy: safeWeek >= 3 },
        { name: 'Single images', multiplier: 0.28, postCount: Math.max(2, safeWeek), isTrustworthy: false }
      ],
      topic: [
        { name: 'Behind-the-scenes', multiplier: 1.58, postCount: Math.max(2, safeWeek * 2), isTrustworthy: safeWeek >= 2 },
        { name: 'Customer feature', multiplier: 1.34, postCount: Math.max(2, safeWeek), isTrustworthy: safeWeek >= 3 },
        { name: 'Event', multiplier: 0.92, postCount: Math.max(1, safeWeek), isTrustworthy: false },
        { name: 'Discount', multiplier: 0.41, postCount: Math.max(2, safeWeek), isTrustworthy: false }
      ],
      tone: [
        { name: 'Playful', multiplier: 1.50, postCount: Math.max(3, safeWeek * 2), isTrustworthy: safeWeek >= 2 },
        { name: 'Casual', multiplier: 1.08, postCount: Math.max(2, safeWeek), isTrustworthy: false },
        { name: 'Promotional', multiplier: 0.42, postCount: Math.max(2, safeWeek), isTrustworthy: false }
      ],
      time: [
        { name: 'Evening (5-8pm)', multiplier: 1.62, postCount: Math.max(3, safeWeek * 2), isTrustworthy: safeWeek >= 2 },
        { name: 'Morning (8-10am)', multiplier: 1.05, postCount: Math.max(2, safeWeek), isTrustworthy: false },
        { name: 'Midday (11am-2pm)', multiplier: 0.28, postCount: Math.max(2, safeWeek), isTrustworthy: false }
      ],
      day: [
        { name: 'Saturday', multiplier: 1.82, postCount: Math.max(2, safeWeek * 2), isTrustworthy: safeWeek >= 2 },
        { name: 'Monday', multiplier: 1.65, postCount: Math.max(1, safeWeek), isTrustworthy: safeWeek >= 3 },
        { name: 'Friday', multiplier: 1.20, postCount: Math.max(1, safeWeek), isTrustworthy: false },
        { name: 'Thursday', multiplier: 0.33, postCount: Math.max(1, safeWeek), isTrustworthy: false },
        { name: 'Wednesday', multiplier: 0.22, postCount: Math.max(1, safeWeek), isTrustworthy: false }
      ]
    },
    sentimentTopics: [
      { topic: 'Discount', negativePct: 53, commentCount: 17, sampleQuote: 'Overpriced even with the discount' },
      { topic: 'Event', negativePct: 17, commentCount: 6, sampleQuote: 'Wish this was announced earlier!' },
      { topic: 'Customer feature', negativePct: 0, commentCount: 11, sampleQuote: 'Love seeing familiar faces featured!' },
      { topic: 'Behind-the-scenes', negativePct: 0, commentCount: 6, sampleQuote: 'The roasting process is so cool!' }
    ],
    experiments: [
      {
        id: 'exp-1',
        brandId,
        title: 'Monday posts outperform your average',
        earlySignal: safeWeek >= 5 ? 'Validated: 1.8x average over 3 posts, confidence high' : 'Early signal: 2.3x average from only 1 post(s), confidence low',
        instruction: 'Publish 3 posts with day = Mon; keep everything else as usual.',
        targetCount: 3,
        publishedCount: Math.min(3, safeWeek - 1),
        status: safeWeek >= 5 ? 'completed' : 'running'
      }
    ],
    learningOverTime: [
      { week: 'W1', high: 0, medium: 1, hypothesis: 6 },
      ...(safeWeek >= 2 ? [{ week: 'W2', high: 1, medium: 2, hypothesis: 5 }] : []),
      ...(safeWeek >= 3 ? [{ week: 'W3', high: 2, medium: 3, hypothesis: 4 }] : []),
      ...(safeWeek >= 4 ? [{ week: 'W4', high: 3, medium: 4, hypothesis: 3 }] : []),
      ...(safeWeek >= 5 ? [{ week: 'W5', high: 4, medium: 4, hypothesis: 2 }] : [])
    ]
  };
}
