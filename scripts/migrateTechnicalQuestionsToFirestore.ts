// scripts/migrateTechnicalQuestionsToFirestore.ts
import { technicalQuestionsData } from '../lib/technicalQuestionsData.ts';
import { FirebaseService } from '../lib/firebaseService.ts';

const allowedCategories = [
  'Valuation',
  'Financial Modeling',
  'Accounting',
  'M&A',
  'LBO',
  'Market Sizing',
  'Other',
  'General',
];
const allowedDifficulties = ['Easy', 'Medium', 'Hard'];

async function migrate() {
  let count = 0;
  let skipped = 0;
  for (let i = 0; i < technicalQuestionsData.length; i++) {
    const q = technicalQuestionsData[i];
    try {
      // Strictly sanitize and set all fields
      const question = typeof q.question === 'string' ? q.question.trim() : '';
      const category = allowedCategories.includes(q.category) ? q.category : 'Other';
      const difficulty = allowedDifficulties.includes(q.difficulty) ? q.difficulty : 'Medium';
      const isPreloaded = typeof q.isPreloaded === 'boolean' ? q.isPreloaded : true;
      const payload = {
        question,
        category,
        difficulty,
        isPreloaded,
        answer: '',
        notes: '',
        lastUpdated: new Date().toISOString(),
      };
      console.log(`Uploading [${i}]:`, payload);
      await FirebaseService.addTechnicalQuestion(payload);
      count++;
      console.log(`Migrated: ${question.slice(0, 60)}...`);
    } catch (err) {
      console.error(`Error migrating question at index ${i}:`, q);
      console.error('Payload:', {
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        isPreloaded: q.isPreloaded
      });
      console.error('Firestore error:', err);
      skipped++;
      continue;
    }
  }
  console.log(`\nMigration complete. Total questions migrated: ${count}, skipped: ${skipped}`);
}

migrate(); 