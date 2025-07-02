const fs = require('fs');
const data = JSON.parse(fs.readFileSync('cleaned_question_bank (1).json', 'utf8'));

function categorizeQuestion(q) {
  const t = q.toLowerCase();
  if (t.includes('dcf')||t.includes('discount')||t.includes('free cash flow')||t.includes('terminal value')||t.includes('present value')) return 'Valuation';
  if (t.includes('model')||t.includes('projection')||t.includes('forecast')||t.includes('3-statement')) return 'Financial Modeling';
  if (t.includes('ebitda')||t.includes('ebit')||t.includes('multiple')||t.includes('comparable')||t.includes('precedent')||t.includes('enterprise value')||t.includes('equity value')) return 'Valuation';
  if (t.includes('lbo')||t.includes('leveraged buyout')||t.includes('private equity')) return 'LBO';
  if (t.includes('m&a')||t.includes('merger')||t.includes('acquisition')||t.includes('synergy')) return 'M&A';
  if (t.includes('market')||t.includes('size')||t.includes('estimate')) return 'Market Sizing';
  if (t.includes('account')||t.includes('depreciation')||t.includes('revenue')||t.includes('expense')||t.includes('balance sheet')||t.includes('income statement')||t.includes('cash flow')||t.includes('gaap')||t.includes('10-k')||t.includes('10-q')) return 'Accounting';
  if (t.includes('debt')||t.includes('bond')||t.includes('loan')||t.includes('libor')||t.includes('sofr')||t.includes('coupon')||t.includes('yield')||t.includes('fixed income')||t.includes('capital markets')) return 'Other';
  return 'General';
}
function determineDifficulty(q) {
  const t = q.toLowerCase();
  if (t.includes('walk me through')||t.includes('explain')||t.includes('what is')||t.includes('how do you calculate')||t.includes('define')) return 'Medium';
  if (t.includes('why')||t.includes('when')||t.includes('compare')||t.includes('difference')) return 'Medium';
  if (t.includes('complex')||t.includes('advanced')||t.includes('detailed')||t.includes('how are')||t.includes('which approach')) return 'Hard';
  return 'Medium';
}
const questions = data.map(q => ({
  question: q.question.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
  category: categorizeQuestion(q.question),
  difficulty: determineDifficulty(q.question),
  answer: '',
  notes: '',
  isPreloaded: true
}));
console.log('export const technicalQuestionsData = [');
questions.forEach((q, i) => {
  console.log(`  {`);
  console.log(`    question: "${q.question.replace(/"/g, '\"')}",`);
  console.log(`    category: "${q.category}" as const,`);
  console.log(`    difficulty: "${q.difficulty}" as const,`);
  console.log(`    answer: "",`);
  console.log(`    notes: "",`);
  console.log(`    isPreloaded: true`);
  console.log(`  }${i < questions.length - 1 ? ',' : ''}`);
});
console.log('];'); 