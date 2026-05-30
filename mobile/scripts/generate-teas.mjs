import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');
const csvPath = path.join(root, 'data', 'top-50-chinese-teas-gongfu.csv');
const rooteasCachePath = path.join(root, 'data', 'rooteas-products.json');
const outPath = path.join(process.cwd(), 'src', 'data', 'teas.generated.ts');
const unmatchedPath = path.join(process.cwd(), 'scripts', 'unmatched-teas.json');

const PRODUCT_LIST_URL = 'https://rooteas.com/products.json?limit=250';

const CATEGORY_BY_KEYWORD = [
  ['pu-erh', 'Pu-erh'],
  ['puerh', 'Pu-erh'],
  ['oolong', 'Oolong'],
  ['white', 'White'],
  ['green', 'Green'],
  ['hong', 'Red'],
  ['black', 'Red'],
  ['hei cha', 'Dark'],
  ['dark', 'Dark'],
  ['jasmine', 'Scented'],
];

function normalizeName(value) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(value) {
  return normalizeName(value).replace(/\s+/g, '-');
}

function inferCategory(name, order) {
  if (order <= 11) return 'Green';
  if (order <= 16) return 'White';
  if (order <= 19) return 'Yellow';
  if (order <= 31) return 'Oolong';
  if (order <= 37) return 'Red';
  if (order <= 40) return 'Scented';
  if (order <= 42) return 'Pu-erh';
  if (order <= 45) return 'Dark';
  if (order <= 48) return 'Pu-erh';
  if (order === 49) return 'Red';
  if (order === 50) return 'Oolong';

  const normalized = normalizeName(name);
  for (const [keyword, category] of CATEGORY_BY_KEYWORD) {
    if (normalized.includes(keyword)) return category;
  }
  return 'Oolong';
}

function inferIcon(timeToDrink) {
  const t = timeToDrink.toLowerCase();
  if (t.includes('evening')) return 'moon';
  return 'sun';
}

function inferNameWeight(name) {
  return normalizeName(name) === 'zui gui fei' ? 'medium' : 'semibold';
}

function parseCsv(raw) {
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const parts = lines[i].split(';');
    if (parts.length < 6) continue;
    rows.push({
      name: parts[0].trim(),
      steeping: parts[1].trim(),
      temperature: parts[2].trim(),
      leafRatio: parts[3].trim(),
      timeToDrink: parts[4].trim(),
      story: parts.slice(5).join(';').trim(),
    });
  }
  return rows;
}

function buildProductIndex(products) {
  return products.map((p) => ({
    title: p.title,
    normalized: normalizeName(p.title),
    image: p?.images?.[0]?.src ?? p?.image?.src ?? null,
  }));
}

function scoreMatch(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const aWords = new Set(a.split(' '));
  const bWords = new Set(b.split(' '));
  let overlap = 0;
  for (const w of aWords) if (bWords.has(w)) overlap += 1;
  return overlap / Math.max(aWords.size, bWords.size);
}

function pickImage(name, products) {
  const target = normalizeName(name);
  let best = null;
  let bestScore = 0;
  for (const p of products) {
    if (!p.image) continue;
    const s = scoreMatch(target, p.normalized);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }
  if (bestScore >= 0.65) return best.image;
  return null;
}

function escape(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function fetchJsonWithRetry(url, retries = 4) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(12000),
        headers: {
          'user-agent': 'tea-scan-data-sync/1.0',
          accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const waitMs = 500 * attempt;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }
  throw lastError;
}

async function main() {
  const csvRaw = await fs.readFile(csvPath, 'utf-8');
  const teas = parseCsv(csvRaw);
  let productData = null;
  try {
    const cached = await fs.readFile(rooteasCachePath, 'utf-8');
    productData = JSON.parse(cached);
  } catch {
    productData = await fetchJsonWithRetry(PRODUCT_LIST_URL);
    await fs.writeFile(rooteasCachePath, JSON.stringify(productData), 'utf-8');
  }
  const productIndex = buildProductIndex(productData.products ?? []);

  const unmatched = [];
  const seeds = teas.map((row, index) => {
    const order = index + 1;
    const id = slugify(row.name);
    const imageUrl = pickImage(row.name, productIndex);
    if (!imageUrl) unmatched.push({ id, name: row.name });
    return {
      id,
      order,
      name: row.name,
      category: inferCategory(row.name, order),
      timeToDrink: row.timeToDrink,
      steeping: row.steeping,
      temperature: row.temperature,
      leafRatio: row.leafRatio,
      story: row.story,
      imageUrl,
      timeIcon: inferIcon(row.timeToDrink),
      nameWeight: inferNameWeight(row.name),
    };
  });

  const output = `/* AUTO-GENERATED by scripts/generate-teas.mjs. Do not edit manually. */
export type TeaSeed = {
  id: string;
  order: number;
  name: string;
  category: string;
  timeToDrink: string;
  steeping: string;
  temperature: string;
  leafRatio: string;
  story: string;
  imageUrl: string | null;
  timeIcon: 'sun' | 'moon';
  nameWeight: 'semibold' | 'medium';
};

export const TEA_SEEDS: TeaSeed[] = [
${seeds
  .map(
    (t) =>
      `  { id: '${escape(t.id)}', order: ${t.order}, name: '${escape(t.name)}', category: '${escape(
        t.category,
      )}', timeToDrink: '${escape(t.timeToDrink)}', steeping: '${escape(
        t.steeping,
      )}', temperature: '${escape(t.temperature)}', leafRatio: '${escape(
        t.leafRatio,
      )}', story: '${escape(t.story)}', imageUrl: ${
        t.imageUrl ? `'${escape(t.imageUrl)}'` : 'null'
      }, timeIcon: '${t.timeIcon}', nameWeight: '${t.nameWeight}' },`,
  )
  .join('\n')}
];
`;

  await fs.writeFile(outPath, output, 'utf-8');
  await fs.writeFile(unmatchedPath, JSON.stringify(unmatched, null, 2), 'utf-8');
  console.log(`Generated ${seeds.length} teas.`);
  console.log(`Unmatched images: ${unmatched.length}. See scripts/unmatched-teas.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
