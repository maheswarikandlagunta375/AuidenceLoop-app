import { db } from '../server/db';

console.log('[Seed] Seeding AudienceLoop database with initial multi-week datasets...');
db.resetToDefaults();
console.log('✅ [Seed] Successfully seeded brands: CloudScale Analytics (B2B SaaS) & PulseFit Activewear (D2C Fitness).');
console.log('✅ [Seed] Stored in data/database.json');
