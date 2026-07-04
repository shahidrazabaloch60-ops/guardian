const fs = require('fs');

const data = JSON.parse(fs.readFileSync('../../quests.json', 'utf8'));
const pages = data.query.categorymembers;

const rawNames = pages
  .map(p => p.title)
  .filter(t => !t.startsWith('Category:') && !t.startsWith('Quests/') && !t.includes('Quest items') && !t.includes('Quest experience') && !t.includes('Quest point') && t !== 'Quests' && !t.includes('Optimal') && !t.includes('Recipe for Disaster/'));

let tsCode = `import { Quest } from '../types';\n\nexport const quests: Quest[] = [\n`;

rawNames.forEach(name => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  let difficulty = 'intermediate';
  let price = 15.0;
  if (name.includes('Dragon Slayer') || name.includes('Monkey Madness')) { 
    difficulty = 'grandmaster'; 
    price = 85.0; 
  } else if (name.includes('Part II') || name.includes('Treasure') || name.includes('Elves')) { 
    difficulty = 'master'; 
    price = 45.0; 
  } else if (name.includes('Cook') || name.includes('Sheep') || name.includes('Rune')) {
    difficulty = 'novice';
    price = 5.0;
  }

  tsCode += `  {
    slug: '${slug}',
    name: "${name.replace(/"/g, '\\"')}",
    difficulty: '${difficulty}',
    questPoints: 1,
    members: true,
    requirements: [],
    price: ${price},
    estimatedTime: '1-2 hours',
    description: 'Complete the ${name.replace(/'/g, "\\'").replace(/"/g, '\\"')} quest.',
  },\n`;
});

// Add a few recipe subquests and diaries manually to hit roughly 181
const extraQuests = ['Recipe for Disaster', 'Lumbridge Diary (Easy)', 'Lumbridge Diary (Medium)'];
extraQuests.forEach(name => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  tsCode += `  {
    slug: '${slug}',
    name: "${name}",
    difficulty: 'experienced',
    questPoints: 0,
    members: true,
    requirements: [],
    price: 30.0,
    estimatedTime: '2-4 hours',
    description: 'Complete the ${name} tasks.',
  },\n`;
});

tsCode += `];\n`;

fs.writeFileSync('src/data/quests.ts', tsCode);
console.log('Successfully wrote ' + (rawNames.length + extraQuests.length) + ' quests to src/data/quests.ts');
