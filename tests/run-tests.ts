import { db as testDb } from '../server/db';
import { AIAgentService } from '../server/ai-agent';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('   AudienceLoop Automated Test Suite');
  console.log('====================================================\n');

  testDb.resetToDefaults();

  // Test 1: Brand Isolation
  console.log('--- Suite 1: Multi-Tenant Brand Isolation ---');
  const cloudscalePosts = testDb.getPosts('brand-cloudscale');
  const pulsefitPosts = testDb.getPosts('brand-pulsefit');

  assert(cloudscalePosts.length > 0, 'CloudScale has seeded posts');
  assert(pulsefitPosts.length > 0, 'PulseFit has seeded posts');

  const crossPollutionPost = cloudscalePosts.some((p) => p.brandId === 'brand-pulsefit');
  assert(!crossPollutionPost, 'No PulseFit posts leak into CloudScale queries');

  const cloudscaleComments = testDb.getComments('brand-cloudscale');
  const pulsefitComments = testDb.getComments('brand-pulsefit');
  const crossPollutionComment = cloudscaleComments.some((c) => c.brandId === 'brand-pulsefit');
  assert(!crossPollutionComment, 'No PulseFit comments leak into CloudScale comments query');

  // Test 2: Metric Calculations & Sample Size Rigor
  console.log('\n--- Suite 2: Analytics & Metric Calculations ---');
  const analytics = testDb.calculateAnalytics('brand-cloudscale');
  assert(analytics.totalPosts === cloudscalePosts.length, 'Analytics totalPosts matches actual record count');

  // Check engagement rate calculation on first post
  const p1 = cloudscalePosts[0];
  const expectedRate = Number((((p1.reactions + p1.commentsCount + p1.shares) / p1.impressions) * 100).toFixed(2));
  assert(Math.abs(p1.engagementRate - expectedRate) < 0.05, `Post engagement rate formula correct (${p1.engagementRate}% vs ${expectedRate}%)`);

  // Limited evidence flag test
  const limitedTopic = analytics.topicBreakdown.find((t) => t.count < 3);
  if (limitedTopic) {
    assert(limitedTopic.isLimitedEvidence === true, `Topic "${limitedTopic.topic}" with count ${limitedTopic.count} correctly flagged with limited evidence`);
  }
  const robustTopic = analytics.topicBreakdown.find((t) => t.count >= 3);
  if (robustTopic) {
    assert(robustTopic.isLimitedEvidence === false, `Topic "${robustTopic.topic}" with count ${robustTopic.count} is not marked limited evidence`);
  }

  // Best time windows note check
  assert(analytics.bestTimeWindows.length > 0, 'Calculated best time windows');
  assert(analytics.bestTimeWindows[0].note.includes('Statistical estimate'), 'Best time window has disclaimer note');

  // Test 3: CSV Import, Validation, and PII Masking
  console.log('\n--- Suite 3: CSV Import, Deduplication, & PII Safeguards ---');
  const sampleImportRows = [
    {
      platform: 'linkedin',
      content: 'Benchmarking query partition performance with zero-copy buffers. Reach out to engineer@cloudscale.internal or call 555-439-0199 for code access.',
      published_at: '2026-09-29 08:30:00',
      topic: 'Benchmarking',
      format: 'carousel',
      impressions: 25000,
      reactions: 900,
      comments: 80,
      shares: 120,
      tags: 'Benchmarking;Memory'
    },
    {
      // Missing content - should be rejected
      platform: 'linkedin',
      content: '',
      published_at: '2026-09-29 09:00:00',
      topic: 'General'
    }
  ];

  const importResult = testDb.importPostsFromRows('brand-cloudscale', sampleImportRows, {});
  assert(importResult.insertedCount === 1, 'Imported valid row and discarded empty content row');
  assert(importResult.rejectedCount === 1, 'Recorded rejection error for line with missing content');
  assert(importResult.piiMaskedCount >= 2, `Sanitized PII correctly (masked ${importResult.piiMaskedCount} PII tokens)`);

  const insertedPost = testDb.getPosts('brand-cloudscale').find((p) => p.content.includes('[EMAIL_MASKED]'));
  assert(!!insertedPost, 'Inserted post contains [EMAIL_MASKED]');
  assert(insertedPost?.content.includes('[PHONE_MASKED]') === true, 'Inserted post contains [PHONE_MASKED]');

  // Test duplicate prevention
  const dupResult = testDb.importPostsFromRows('brand-cloudscale', sampleImportRows, {});
  assert(dupResult.duplicateCount === 1, 'Duplicate post correctly detected and skipped');

  // Test 4: Evidence-Backed Recommendations & Grounding
  console.log('\n--- Suite 4: Evidence-Grounded AI Agent ---');
  const agent = new AIAgentService();
  const chatRes = await agent.answerBrandQuery('brand-cloudscale', 'What should we post this week, and why?');

  assert(chatRes.citations.length > 0, 'Agent returned evidence citations');
  const postCitation = chatRes.citations.find((c) => c.type === 'post');
  assert(!!postCitation, 'Agent provided post citation with historical metrics');
  assert(testDb.getPostById('brand-cloudscale', postCitation!.id) !== undefined, `Cited post ID ${postCitation?.id} exists in brand database`);

  // Verify numerical traceability
  const currentAnalytics = testDb.calculateAnalytics('brand-cloudscale');
  const topBenchmarking = currentAnalytics.topicBreakdown.find((t) => t.topic === 'Benchmarking');
  if (topBenchmarking) {
    const claimMatches =
      chatRes.answer.includes(String(topBenchmarking.avgEngagementRate)) ||
      chatRes.answer.includes(String(currentAnalytics.avgEngagementRate)) ||
      chatRes.citations.some((c) => chatRes.answer.includes(c.id));
    assert(claimMatches, `Agent answer grounded in database metrics or citations (${topBenchmarking.avgEngagementRate}% or ${currentAnalytics.avgEngagementRate}%)`);
  }

  // Summary
  console.log('\n====================================================');
  console.log(`Test Execution Finished: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
