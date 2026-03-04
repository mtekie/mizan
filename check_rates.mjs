import { readFileSync } from 'fs';

try {
  const content = readFileSync('./lib/data/products.ts', 'utf-8');
  // Just find lines with "interestRate" to see if there are strings
  const lines = content.split('\n');
  const badRates = [];
  const badMax = [];
  let currentId = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('id:')) {
      currentId = line.trim();
    }
    if (line.includes('interestRate:') && line.includes('"')) {
      badRates.push({ id: currentId, line: line.trim() });
    }
    if (line.includes('interestMax:') && line.includes('"')) {
      badMax.push({ id: currentId, line: line.trim() });
    }
  }
  
  console.log('Bad rates:', badRates);
  console.log('Bad maxes:', badMax);
} catch (e) {
  console.error(e);
}
