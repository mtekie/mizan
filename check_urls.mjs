import fs from 'fs';

const content = fs.readFileSync('./lib/data/products.ts', 'utf-8');
const lines = content.split('\n');
const ids = [];
for (const line of lines) {
    const match = line.match(/"id":\s*['"]([^'"]+)['"]/);
    if (match) ids.push(match[1]);
}

console.log(`Checking ${ids.length} products...`);
const check = async () => {
    let errs = 0;
    for (const id of ids) {
        try {
            const res = await fetch(`http://localhost:3001/catalogue/${id}`);
            if (!res.ok) {
                console.log(`Error ${res.status} on product ${id}`);
                errs++;
            }
        } catch (e) {
            console.log(`Failed request for ${id}`, e.message);
        }
    }
    console.log(`Total errors: ${errs}`);
};
check();
