import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { db } from './db';
import { aiAgent } from './ai-agent';
import { Brand, CalendarPost, Platform, Format } from '../src/types';

export const apiRouter = Router();

// 1. Brands
apiRouter.get('/brands', (req: Request, res: Response) => {
  res.json(db.getBrands());
});

apiRouter.get('/brands/:id', (req: Request, res: Response) => {
  const brand = db.getBrand(req.params.id);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  res.json(brand);
});

apiRouter.post('/brands', (req: Request, res: Response) => {
  const { name, tagline, industry, tone, targetAudience, defaultPlatforms, keyGoals } = req.body;
  if (!name || !industry) {
    res.status(400).json({ error: 'Name and industry are required' });
    return;
  }

  const id = `brand-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
  const brand: Brand = {
    id,
    name,
    tagline: tagline || '',
    industry,
    tone: tone || 'Professional and informative',
    targetAudience: targetAudience || 'General audience',
    defaultPlatforms: defaultPlatforms || ['linkedin', 'twitter'],
    keyGoals: keyGoals || ['Engagement', 'Audience Growth'],
    createdAt: new Date().toISOString()
  };

  db.createBrand(brand);
  res.status(201).json(brand);
});

// 2. Analytics
apiRouter.get('/brands/:id/analytics', (req: Request, res: Response) => {
  const brand = db.getBrand(req.params.id);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  const analytics = db.calculateAnalytics(req.params.id);
  res.json(analytics);
});

// 3. Posts
apiRouter.get('/brands/:id/posts', (req: Request, res: Response) => {
  const brand = db.getBrand(req.params.id);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
  const posts = db.getPosts(req.params.id, limit);
  res.json(posts);
});

// 4. Comments (Community Conversation Memory)
apiRouter.get('/brands/:id/comments', (req: Request, res: Response) => {
  const brand = db.getBrand(req.params.id);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
  const comments = db.getComments(req.params.id, limit);
  res.json(comments);
});

// 5. CSV Import for Posts
apiRouter.post('/brands/:id/import-posts', (req: Request, res: Response) => {
  const brandId = req.params.id;
  const brand = db.getBrand(brandId);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }

  const { csvText, rows, columnMapping = {} } = req.body;
  let parsedRows: any[] = rows;

  if (csvText && typeof csvText === 'string') {
    const parseResult = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (parseResult.errors && parseResult.errors.length > 0 && parseResult.data.length === 0) {
      res.status(400).json({ error: 'Failed to parse CSV', details: parseResult.errors });
      return;
    }
    parsedRows = parseResult.data;
  }

  if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
    res.status(400).json({ error: 'No data rows provided for import.' });
    return;
  }

  const result = db.importPostsFromRows(brandId, parsedRows, columnMapping);
  res.json(result);
});

// 6. CSV Import for Comments
apiRouter.post('/brands/:id/import-comments', (req: Request, res: Response) => {
  const brandId = req.params.id;
  const brand = db.getBrand(brandId);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }

  const { csvText, rows } = req.body;
  let parsedRows: any[] = rows;

  if (csvText && typeof csvText === 'string') {
    const parseResult = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (parseResult.errors && parseResult.errors.length > 0 && parseResult.data.length === 0) {
      res.status(400).json({ error: 'Failed to parse CSV', details: parseResult.errors });
      return;
    }
    parsedRows = parseResult.data;
  }

  if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
    res.status(400).json({ error: 'No comment rows provided for import.' });
    return;
  }

  const result = db.importCommentsFromRows(brandId, parsedRows);
  res.json(result);
});

// 7. Reset to default seeds
apiRouter.post('/brands/:id/reset', (req: Request, res: Response) => {
  db.resetToDefaults();
  res.json({ message: 'Database reset to default seed data successfully.' });
});

// 8. Grounded AI Chat Agent
apiRouter.post('/brands/:id/chat', async (req: Request, res: Response) => {
  const brandId = req.params.id;
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Query text is required' });
    return;
  }

  try {
    const response = await aiAgent.answerBrandQuery(brandId, query.trim());
    res.json(response);
  } catch (err: any) {
    console.error('[API] Chat agent error:', err);
    res.status(500).json({ error: err.message || 'Internal agent error' });
  }
});

// 9. Draft Generator
apiRouter.post('/brands/:id/draft', async (req: Request, res: Response) => {
  const brandId = req.params.id;
  const { goal, topic, format, platform, customPrompt } = req.body;

  if (!topic || !format || !platform) {
    res.status(400).json({ error: 'Topic, format, and platform are required' });
    return;
  }

  try {
    const draft = await aiAgent.generatePostDraft({
      brandId,
      goal: goal || 'Community Engagement',
      topic,
      format: format as Format,
      platform: platform as Platform,
      customPrompt
    });
    res.json(draft);
  } catch (err: any) {
    console.error('[API] Draft generator error:', err);
    res.status(500).json({ error: err.message || 'Draft generation error' });
  }
});

// 10. Calendar CRUD
apiRouter.get('/brands/:id/calendar', (req: Request, res: Response) => {
  res.json(db.getCalendar(req.params.id));
});

apiRouter.post('/brands/:id/calendar', (req: Request, res: Response) => {
  const brandId = req.params.id;
  const { title, content, platform, format, topic, scheduledDate, scheduledTime, status, goal, evidenceRationale, supportingPostIds, estimatedEngagementRate } = req.body;

  if (!title || !content || !scheduledDate) {
    res.status(400).json({ error: 'Title, content, and scheduledDate are required' });
    return;
  }

  const newPost: CalendarPost = {
    id: `cal-${Date.now()}`,
    brandId,
    title,
    content,
    platform: platform || 'linkedin',
    format: format || 'carousel',
    topic: topic || 'General',
    scheduledDate,
    scheduledTime: scheduledTime || '09:00',
    status: status || 'draft',
    goal: goal || 'Engagement',
    evidenceRationale: evidenceRationale || 'Created manually by team.',
    supportingPostIds: supportingPostIds || [],
    estimatedEngagementRate: estimatedEngagementRate || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const saved = db.createCalendarPost(newPost);
  res.status(201).json(saved);
});

apiRouter.patch('/brands/:id/calendar/:postId', (req: Request, res: Response) => {
  const updated = db.updateCalendarPost(req.params.id, req.params.postId, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Calendar post not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/brands/:id/calendar/:postId', (req: Request, res: Response) => {
  const ok = db.deleteCalendarPost(req.params.id, req.params.postId);
  if (!ok) {
    res.status(404).json({ error: 'Calendar post not found' });
    return;
  }
  res.json({ success: true });
});

// 11. Feedback Loop
apiRouter.get('/brands/:id/feedback', (req: Request, res: Response) => {
  res.json(db.getFeedback(req.params.id));
});

// 12. Sample CSVs for demo
apiRouter.get('/sample-csv/posts', (req: Request, res: Response) => {
  const filePath = path.resolve(process.cwd(), 'data', 'samples', 'sample_social_posts.csv');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sample_social_posts.csv"');
    res.sendFile(filePath);
  } else {
    res.status(404).send('Sample file not found');
  }
});

// 13. Simulation State & Advance Week
import { getSimulationStateForWeek } from './simulation';

const brandWeekMap: Record<string, number> = {
  'brand-brewbloom': 5,
  'brand-cloudscale': 4,
  'brand-pulsefit': 4
};

apiRouter.get('/brands/:id/simulation', (req: Request, res: Response) => {
  const brandId = req.params.id;
  const brand = db.getBrand(brandId);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  const currentWeek = brandWeekMap[brandId] || 5;
  const simState = getSimulationStateForWeek(brandId, currentWeek);
  res.json(simState);
});

apiRouter.post('/brands/:id/simulation/advance', (req: Request, res: Response) => {
  const brandId = req.params.id;
  const { weeks = 1 } = req.body;
  const prevWeek = brandWeekMap[brandId] || 1;
  const newWeek = Math.min(10, prevWeek + Number(weeks));
  brandWeekMap[brandId] = newWeek;
  const simState = getSimulationStateForWeek(brandId, newWeek);
  res.json(simState);
});

apiRouter.post('/brands/:id/simulation/reset', (req: Request, res: Response) => {
  const brandId = req.params.id;
  const { targetWeek = 1 } = req.body;
  brandWeekMap[brandId] = Number(targetWeek);
  const simState = getSimulationStateForWeek(brandId, Number(targetWeek));
  res.json(simState);
});

apiRouter.get('/brands/:id/export-csv', (req: Request, res: Response) => {
  const brandId = req.params.id;
  const posts = db.getPosts(brandId);
  const csv = Papa.unparse(posts.map((p) => ({
    platform: p.platform,
    content: p.content,
    published_at: p.publishedAt,
    topic: p.topic,
    format: p.format,
    impressions: p.impressions,
    reactions: p.reactions,
    comments: p.commentsCount,
    shares: p.shares,
    engagement_rate: p.engagementRate,
    tags: p.tags.join(';')
  })));

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${brandId}-posts.csv"`);
  res.send(csv);
});

