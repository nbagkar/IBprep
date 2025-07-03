// scripts/exportTechnicalQuestionsForFirestore.ts
import { technicalQuestionsData } from '../lib/technicalQuestionsData.ts';
import { writeFileSync } from 'fs';

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

const now = new Date().toISOString();

const sanitized = technicalQuestionsData.map(q => {
  const question = typeof q.question === 'string' ? q.question.trim() : '';
  const category = allowedCategories.includes(q.category) ? q.category : 'Other';
  const difficulty = allowedDifficulties.includes(q.difficulty) ? q.difficulty : 'Medium';
  const isPreloaded = typeof q.isPreloaded === 'boolean' ? q.isPreloaded : true;
  return {
    question,
    category,
    difficulty,
    isPreloaded,
    answer: '',
    notes: '',
    lastUpdated: now,
  };
});

writeFileSync('firestore_technical_questions.json', JSON.stringify(sanitized, null, 2));
console.log('Exported sanitized questions to firestore_technical_questions.json'); 