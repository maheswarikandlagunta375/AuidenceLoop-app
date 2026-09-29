import fs from 'fs';
import path from 'path';
import {
  Brand,
  PostRecord,
  CommunityCommentRecord,
  CalendarPost,
  FeedbackLoopRecord,
  AnalyticsSummary,
  TopicMetric,
  FormatMetric,
  DayMetric,
  HourMetric,
  BestTimeWindow,
  SentimentSummary,
  CommunityThemeSummary,
  Platform,
  Format,
  Sentiment,
  ConversationTheme
} from '../src/types';
import {
  INITIAL_BRANDS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_CALENDAR,
  INITIAL_FEEDBACK
} from '../data/seed-data';

const DATA_FILE = path.resolve(process.cwd(), 'data', 'database.json');

// PII Sanitization Patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
  /system\s+prompt/gi,
  /you\s+are\s+now\s+a/gi,
  /bypass\s+safety/gi
];

export interface ImportValidationResult {
  success: boolean;
  insertedCount: number;
  duplicateCount: number;
  rejectedCount: number;
  piiMaskedCount: number;
  errors: Array<{ line: number; reason: string }>;
  sampleInserted?: Array<PostRecord | CommunityCommentRecord>;
}

export class DatabaseStore {
  private brands: Brand[] = [];
  private posts: PostRecord[] = [];
  private comments: CommunityCommentRecord[] = [];
  private calendar: CalendarPost[] = [];
  private feedback: FeedbackLoopRecord[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.brands = data.brands || [];
        this.posts = data.posts || [];
        this.comments = data.comments || [];
        this.calendar = data.calendar || [];
        this.feedback = data.feedback || [];
        console.log(`[DB] Loaded data from ${DATA_FILE} (${this.brands.length} brands, ${this.posts.length} posts, ${this.comments.length} comments)`);
        return;
      }
    } catch (err) {
      console.warn('[DB] Could not read existing database.json, seeding defaults.', err);
    }

    // Seed defaults
    this.resetToDefaults();
  }

  public resetToDefaults(): void {
    this.brands = JSON.parse(JSON.stringify(INITIAL_BRANDS));
    this.posts = JSON.parse(JSON.stringify(INITIAL_POSTS));
    this.comments = JSON.parse(JSON.stringify(INITIAL_COMMENTS));
    this.calendar = JSON.parse(JSON.stringify(INITIAL_CALENDAR));
    this.feedback = JSON.parse(JSON.stringify(INITIAL_FEEDBACK));
    this.save();
    console.log('[DB] Seeded default database.');
  }

  public save(): void {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            brands: this.brands,
            posts: this.posts,
            comments: this.comments,
            calendar: this.calendar,
            feedback: this.feedback
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      console.error('[DB] Failed to save database.json:', err);
    }
  }

  // PII & Prompt Masking
  public sanitizeText(text: string): { cleanText: string; piiCount: number } {
    let piiCount = 0;
    let cleanText = text || '';

    cleanText = cleanText.replace(EMAIL_REGEX, () => {
      piiCount++;
      return '[EMAIL_MASKED]';
    });

    cleanText = cleanText.replace(PHONE_REGEX, (match) => {
      // Avoid masking single small integers like "2026"
      if (match.length >= 7) {
        piiCount++;
        return '[PHONE_MASKED]';
      }
      return match;
    });

    // Strip rogue instruction tokens
    for (const pattern of INJECTION_PATTERNS) {
      cleanText = cleanText.replace(pattern, '[REDACTED_PROMPT_DIRECTIVE]');
    }

    return { cleanText, piiCount };
  }

  // Brand Queries (Strict Multi-Tenant Isolation)
  public getBrands(): Brand[] {
    return this.brands;
  }

  public getBrand(brandId: string): Brand | undefined {
    return this.brands.find((b) => b.id === brandId);
  }

  public createBrand(brand: Brand): Brand {
    this.brands.push(brand);
    this.save();
    return brand;
  }

  // Posts with Brand Isolation
  public getPosts(brandId: string, limit?: number): PostRecord[] {
    const list = this.posts.filter((p) => p.brandId === brandId);
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return limit ? list.slice(0, limit) : list;
  }

  public getPostById(brandId: string, postId: string): PostRecord | undefined {
    return this.posts.find((p) => p.brandId === brandId && p.id === postId);
  }

  // Comments with Brand Isolation
  public getComments(brandId: string, limit?: number): CommunityCommentRecord[] {
    const list = this.comments.filter((c) => c.brandId === brandId);
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return limit ? list.slice(0, limit) : list;
  }

  // Calendar with Brand Isolation
  public getCalendar(brandId: string): CalendarPost[] {
    const list = this.calendar.filter((c) => c.brandId === brandId);
    list.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
    return list;
  }

  public createCalendarPost(post: CalendarPost): CalendarPost {
    this.calendar.push(post);
    this.save();
    return post;
  }

  public updateCalendarPost(brandId: string, id: string, updates: Partial<CalendarPost>): CalendarPost | null {
    const idx = this.calendar.findIndex((c) => c.brandId === brandId && c.id === id);
    if (idx === -1) return null;
    this.calendar[idx] = {
      ...this.calendar[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.calendar[idx];
  }

  public deleteCalendarPost(brandId: string, id: string): boolean {
    const initialLen = this.calendar.length;
    this.calendar = this.calendar.filter((c) => !(c.brandId === brandId && c.id === id));
    if (this.calendar.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Feedback Loop Records with Brand Isolation
  public getFeedback(brandId: string): FeedbackLoopRecord[] {
    const list = this.feedback.filter((f) => f.brandId === brandId);
    list.sort((a, b) => new Date(b.recommendationDate).getTime() - new Date(a.recommendationDate).getTime());
    return list;
  }

  // Analytics Calculation Engine (Calculates true metrics, rates, and flags sample size)
  public calculateAnalytics(brandId: string): AnalyticsSummary {
    const posts = this.getPosts(brandId);
    const comments = this.getComments(brandId);

    if (posts.length === 0) {
      return {
        brandId,
        totalPosts: 0,
        totalImpressions: 0,
        avgEngagementRate: 0,
        dateRange: { start: '', end: '' },
        topicBreakdown: [],
        formatBreakdown: [],
        dayBreakdown: [],
        hourlyHeatmap: [],
        bestTimeWindows: [],
        sentimentSummary: { positivePct: 0, neutralPct: 0, negativePct: 0, netSentiment: 0, totalComments: 0 },
        topThemes: []
      };
    }

    const totalImpressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
    const totalEngagementRateSum = posts.reduce((sum, p) => sum + p.engagementRate, 0);
    const avgEngagementRate = Number((totalEngagementRateSum / posts.length).toFixed(2));

    // Date range
    const timestamps = posts.map((p) => new Date(p.publishedAt).getTime());
    const minDate = new Date(Math.min(...timestamps)).toISOString().split('T')[0];
    const maxDate = new Date(Math.max(...timestamps)).toISOString().split('T')[0];

    // Topic Breakdown
    const topicMap: Record<string, { count: number; sumRate: number; sumReactions: number; sumComments: number; sumShares: number }> = {};
    for (const post of posts) {
      const topic = post.topic || 'General';
      if (!topicMap[topic]) {
        topicMap[topic] = { count: 0, sumRate: 0, sumReactions: 0, sumComments: 0, sumShares: 0 };
      }
      topicMap[topic].count += 1;
      topicMap[topic].sumRate += post.engagementRate;
      topicMap[topic].sumReactions += post.reactions || 0;
      topicMap[topic].sumComments += post.commentsCount || 0;
      topicMap[topic].sumShares += post.shares || 0;
    }

    const topicBreakdown: TopicMetric[] = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      count: data.count,
      avgEngagementRate: Number((data.sumRate / data.count).toFixed(2)),
      avgReactions: Math.round(data.sumReactions / data.count),
      avgComments: Math.round(data.sumComments / data.count),
      avgShares: Math.round(data.sumShares / data.count),
      isLimitedEvidence: data.count < 3, // Flag when N < 3
      sampleSize: data.count
    }));
    topicBreakdown.sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);

    // Format Breakdown
    const formatMap: Record<string, { count: number; sumRate: number }> = {};
    for (const post of posts) {
      const fmt = post.format || 'text';
      if (!formatMap[fmt]) {
        formatMap[fmt] = { count: 0, sumRate: 0 };
      }
      formatMap[fmt].count += 1;
      formatMap[fmt].sumRate += post.engagementRate;
    }

    const formatBreakdown: FormatMetric[] = Object.entries(formatMap).map(([fmt, data]) => ({
      format: fmt as Format,
      count: data.count,
      avgEngagementRate: Number((data.sumRate / data.count).toFixed(2)),
      isLimitedEvidence: data.count < 3,
      sampleSize: data.count
    }));
    formatBreakdown.sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);

    // Day Breakdown
    const dayMap: Record<string, { count: number; sumRate: number }> = {};
    const standardDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const post of posts) {
      const day = post.dayOfWeek || 'Wednesday';
      if (!dayMap[day]) {
        dayMap[day] = { count: 0, sumRate: 0 };
      }
      dayMap[day].count += 1;
      dayMap[day].sumRate += post.engagementRate;
    }

    const dayBreakdown: DayMetric[] = standardDays.map((day) => {
      const d = dayMap[day] || { count: 0, sumRate: 0 };
      return {
        day,
        count: d.count,
        avgEngagementRate: d.count > 0 ? Number((d.sumRate / d.count).toFixed(2)) : 0,
        isLimitedEvidence: d.count < 3
      };
    });

    // Hourly Heatmap
    const hourlyMap: Record<string, { count: number; sumRate: number }> = {};
    for (const post of posts) {
      const key = `${post.dayOfWeek}-${post.hourOfDay}`;
      if (!hourlyMap[key]) {
        hourlyMap[key] = { count: 0, sumRate: 0 };
      }
      hourlyMap[key].count += 1;
      hourlyMap[key].sumRate += post.engagementRate;
    }

    const hourlyHeatmap: HourMetric[] = Object.entries(hourlyMap).map(([key, data]) => {
      const [day, hourStr] = key.split('-');
      return {
        day,
        hour: parseInt(hourStr, 10),
        count: data.count,
        avgEngagementRate: Number((data.sumRate / data.count).toFixed(2))
      };
    });
    hourlyHeatmap.sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);

    // Best Time Windows (with statistical confidence & disclaimer note)
    const bestTimeWindows: BestTimeWindow[] = [];
    const topHourly = hourlyHeatmap.slice(0, 3);
    for (const item of topHourly) {
      const nextHour = (item.hour + 1) % 24;
      const ampm = item.hour >= 12 ? 'PM' : 'AM';
      const formattedHour = item.hour % 12 === 0 ? 12 : item.hour % 12;
      const nextAmpm = nextHour >= 12 ? 'PM' : 'AM';
      const formattedNext = nextHour % 12 === 0 ? 12 : nextHour % 12;

      bestTimeWindows.push({
        day: item.day,
        timeWindow: `${formattedHour}:00 ${ampm} - ${formattedNext}:00 ${nextAmpm}`,
        avgRate: item.avgEngagementRate,
        postCount: item.count,
        confidence: item.count >= 3 ? 'high' : item.count === 2 ? 'moderate' : 'limited',
        note: `Historical baseline average across ${item.count} recorded post(s). Statistical estimate; real algorithm reach may vary.`
      });
    }

    // Sentiment Breakdown
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let sumScore = 0;

    for (const c of comments) {
      sumScore += c.sentimentScore || 0;
      if (c.sentiment === 'positive') positiveCount++;
      else if (c.sentiment === 'negative') negativeCount++;
      else neutralCount++;
    }

    const totalComments = comments.length || 1;
    const sentimentSummary: SentimentSummary = {
      positivePct: Math.round((positiveCount / totalComments) * 100),
      neutralPct: Math.round((neutralCount / totalComments) * 100),
      negativePct: Math.round((negativeCount / totalComments) * 100),
      netSentiment: comments.length > 0 ? Number((sumScore / comments.length).toFixed(2)) : 0,
      totalComments: comments.length
    };

    // Top Themes & Recurring Audience Questions
    const themeMap: Record<string, { count: number; sampleComment: string; sentiment: Sentiment; topic: string }> = {};
    for (const c of comments) {
      const theme = c.theme || 'general';
      if (!themeMap[theme]) {
        themeMap[theme] = {
          count: 0,
          sampleComment: c.content,
          sentiment: c.sentiment,
          topic: c.topic
        };
      }
      themeMap[theme].count += 1;
    }

    const topThemes: CommunityThemeSummary[] = Object.entries(themeMap).map(([theme, val]) => ({
      theme: theme as ConversationTheme,
      count: val.count,
      sampleComment: val.sampleComment,
      sentiment: val.sentiment,
      topTopic: val.topic
    }));
    topThemes.sort((a, b) => b.count - a.count);

    return {
      brandId,
      totalPosts: posts.length,
      totalImpressions,
      avgEngagementRate,
      dateRange: { start: minDate, end: maxDate },
      topicBreakdown,
      formatBreakdown,
      dayBreakdown,
      hourlyHeatmap,
      bestTimeWindows,
      sentimentSummary,
      topThemes
    };
  }

  // CSV Import Logic with Mapping, Deduplication, and PII Masking
  public importPostsFromRows(
    brandId: string,
    rows: Record<string, any>[],
    columnMapping: Record<string, string>
  ): ImportValidationResult {
    const inserted: PostRecord[] = [];
    let duplicateCount = 0;
    let piiMaskedCount = 0;
    const errors: Array<{ line: number; reason: string }> = [];

    // Map columns: required keys: content, published_at (or date), platform
    const contentKey = columnMapping['content'] || 'content';
    const dateKey = columnMapping['published_at'] || columnMapping['date'] || 'published_at';
    const platformKey = columnMapping['platform'] || 'platform';
    const topicKey = columnMapping['topic'] || 'topic';
    const formatKey = columnMapping['format'] || 'format';
    const impressionsKey = columnMapping['impressions'] || 'impressions';
    const reactionsKey = columnMapping['reactions'] || columnMapping['likes'] || 'reactions';
    const commentsKey = columnMapping['comments'] || columnMapping['comments_count'] || 'comments';
    const sharesKey = columnMapping['shares'] || 'shares';
    const tagsKey = columnMapping['tags'] || 'tags';

    const existingContents = new Set(this.posts.filter((p) => p.brandId === brandId).map((p) => p.content.trim().toLowerCase()));

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    rows.forEach((row, index) => {
      const lineNumber = index + 2; // header is line 1

      const rawContent = row[contentKey];
      if (!rawContent || typeof rawContent !== 'string' || rawContent.trim() === '') {
        errors.push({ line: lineNumber, reason: 'Missing or empty post content.' });
        return;
      }

      const { cleanText, piiCount } = this.sanitizeText(rawContent.trim());
      if (piiCount > 0) {
        piiMaskedCount += piiCount;
      }

      // Check duplicates
      const normalized = cleanText.toLowerCase();
      if (existingContents.has(normalized)) {
        duplicateCount++;
        return;
      }
      existingContents.add(normalized);

      // Parse date
      const rawDate = row[dateKey];
      let dateObj = new Date(rawDate);
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date(); // fallback to now
      }

      const dayOfWeek = days[dateObj.getDay()];
      const hourOfDay = dateObj.getHours();

      // Platform
      const rawPlatform = (row[platformKey] || 'linkedin').toLowerCase();
      const validPlatform: Platform = ['linkedin', 'twitter', 'instagram', 'threads'].includes(rawPlatform)
        ? (rawPlatform as Platform)
        : 'linkedin';

      // Format
      const rawFormat = (row[formatKey] || 'text').toLowerCase();
      const validFormat: Format = ['carousel', 'infographic', 'text', 'short_video', 'poll'].includes(rawFormat)
        ? (rawFormat as Format)
        : 'text';

      // Numbers
      const impressions = Math.max(0, parseInt(row[impressionsKey] || '1000', 10) || 1000);
      const reactions = Math.max(0, parseInt(row[reactionsKey] || '50', 10) || 50);
      const commentsCount = Math.max(0, parseInt(row[commentsKey] || '5', 10) || 5);
      const shares = Math.max(0, parseInt(row[sharesKey] || '2', 10) || 2);

      const engagementRate = Number((((reactions + commentsCount + shares) / impressions) * 100).toFixed(2));
      const topic = row[topicKey] ? String(row[topicKey]).trim() : 'General';

      // Tags
      let tags: string[] = [];
      if (row[tagsKey]) {
        tags = String(row[tagsKey])
          .split(/[;,]/)
          .map((t) => t.trim())
          .filter(Boolean);
      }

      const newPost: PostRecord = {
        id: `post-imp-${Date.now()}-${index}`,
        brandId,
        platform: validPlatform,
        content: cleanText,
        publishedAt: dateObj.toISOString(),
        dayOfWeek,
        hourOfDay,
        topic,
        format: validFormat,
        impressions,
        reactions,
        commentsCount,
        shares,
        engagementRate,
        sentimentScore: 0.5,
        sentimentLabel: 'positive',
        tags,
        source: 'csv_import'
      };

      inserted.push(newPost);
    });

    if (inserted.length > 0) {
      this.posts.push(...inserted);
      this.save();
    }

    return {
      success: inserted.length > 0 || duplicateCount > 0,
      insertedCount: inserted.length,
      duplicateCount,
      rejectedCount: errors.length,
      piiMaskedCount,
      errors,
      sampleInserted: inserted.slice(0, 3)
    };
  }

  // Import Community Comments with PII Masking
  public importCommentsFromRows(
    brandId: string,
    rows: Record<string, any>[]
  ): ImportValidationResult {
    const inserted: CommunityCommentRecord[] = [];
    let duplicateCount = 0;
    let piiMaskedCount = 0;
    const errors: Array<{ line: number; reason: string }> = [];

    const existing = new Set(this.comments.filter((c) => c.brandId === brandId).map((c) => c.content.toLowerCase()));

    rows.forEach((row, index) => {
      const line = index + 2;
      const rawContent = row.content || row.comment || row.text;
      if (!rawContent || typeof rawContent !== 'string') {
        errors.push({ line, reason: 'Empty comment content' });
        return;
      }

      const { cleanText, piiCount } = this.sanitizeText(rawContent);
      if (piiCount > 0) {
        piiMaskedCount += piiCount;
      }

      if (existing.has(cleanText.toLowerCase())) {
        duplicateCount++;
        return;
      }
      existing.add(cleanText.toLowerCase());

      const rawAuthor = row.author || 'community_user';
      const maskedAuthor = this.sanitizeText(rawAuthor).cleanText.replace(/\s+/g, '_');

      const rawDate = row.timestamp || row.date || new Date().toISOString();
      const timestamp = !isNaN(new Date(rawDate).getTime()) ? new Date(rawDate).toISOString() : new Date().toISOString();

      const theme = (row.theme || 'question') as ConversationTheme;
      const topic = row.topic || 'General';

      // Basic sentiment detection
      const lower = cleanText.toLowerCase();
      let sentiment: Sentiment = 'neutral';
      let score = 0.0;
      if (lower.includes('great') || lower.includes('love') || lower.includes('elite') || lower.includes('win') || lower.includes('saved')) {
        sentiment = 'positive';
        score = 0.85;
      } else if (lower.includes('spike') || lower.includes('bug') || lower.includes('broken') || lower.includes('complaint') || lower.includes('joke') || lower.includes('negative')) {
        sentiment = 'negative';
        score = -0.65;
      }

      const record: CommunityCommentRecord = {
        id: `comm-imp-${Date.now()}-${index}`,
        brandId,
        postId: row.post_id || undefined,
        postExcerpt: row.post_excerpt || undefined,
        author: maskedAuthor,
        timestamp,
        content: cleanText,
        sentiment,
        sentimentScore: score,
        topic,
        theme,
        isAddressed: false
      };

      inserted.push(record);
    });

    if (inserted.length > 0) {
      this.comments.push(...inserted);
      this.save();
    }

    return {
      success: inserted.length > 0,
      insertedCount: inserted.length,
      duplicateCount,
      rejectedCount: errors.length,
      piiMaskedCount,
      errors
    };
  }
}

export const db = new DatabaseStore();
