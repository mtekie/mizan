import fs from 'fs';

let content = fs.readFileSync('./lib/data/banks.ts', 'utf-8');

const colors = [
    'bg-slate-700', 'bg-blue-800', 'bg-emerald-700', 'bg-teal-700',
    'bg-indigo-800', 'bg-purple-800', 'bg-cyan-800', 'bg-sky-800',
    'bg-rose-800', 'bg-fuchsia-800'
];

let cIdx = 0;

// Replace each object that has `id:` but NO `color:`
const newContent = content.replace(/{\s*id:\s*'([^']+)',([\s\S]*?)}/g, (match, id, rest) => {
    if (match.includes('color:')) return match;

    const color = colors[cIdx % colors.length];
    cIdx++;

    let logo = id.substring(0, 2).toUpperCase();

    // insert color and logo right after type
    const replaceStr = `color: '${color}', textColor: 'text-white',\n    logo: '${logo}',`;

    // Find where type: 'Microfinance' is
    if (match.includes("type: 'Microfinance'")) {
        return match.replace("type: 'Microfinance',", `type: 'Microfinance',\n    ${replaceStr}`);
    } else {
        return match.replace(/(name: [^,]+,)/, `$1\n    ${replaceStr}`);
    }
});

fs.writeFileSync('./lib/data/banks.ts', newContent, 'utf-8');
console.log('Themes injected successfully.');
