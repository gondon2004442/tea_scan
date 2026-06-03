import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');
const csvPath = path.join(root, 'data', 'top-50-chinese-teas-gongfu.csv');
const rooteasCachePath = path.join(root, 'data', 'rooteas-products.json');
const outPath = path.join(process.cwd(), 'src', 'data', 'teas.generated.ts');
const unmatchedPath = path.join(process.cwd(), 'scripts', 'unmatched-teas.json');

const PRODUCT_LIST_URL = 'https://rooteas.com/products.json?limit=250';

/** Manual map: tea slug → rooteas product title fragments (from rooteas.com catalog) */
const TEA_IMAGE_ALIASES = {
  'tie-guan-yin': ['tie guan yin', 'huang guan yin', 'lan xiang huang'],
  'da-hong-pao': ['da hong pao', 'tao xiang da hong pao', 'peach mantle'],
  'wuyi-rougui': ['rou gui', 'classic rou gui', 'hui yuan keng', 'bonfire night'],
  'wuyi-shui-xian': ['shui xian', 'wu san di', 'gao cong shui xian', 'old bush shui xian'],
  'wuyi-qi-lan': ['qi lan', 'wonderful orchid', 'golden edged qi lan'],
  'wuyi-ba-xian': ['bai ji guan', 'ban tian yao', 'tie luo han'],
  'fenghuang-dan-cong-mi-lan-xiang': ['bai ya qi lan', 'rui xiang', 'shi ru'],
  'fenghuang-dan-cong-ya-shi-xiang': ['rui xiang', 'zui gui fei'],
  'dong-ding-oolong': ['dong ding'],
  'oriental-beauty': ['oriental beauty'],
  'ali-shan-high-mountain-oolong': ['alishan', 'high mountain oolong'],
  'golden-osmanthus-oolong': ['milky oolong', 'jin xuan', 'huang mei gui'],
  'zheng-shan-xiao-zhong': ['lapsang souchong', 'tongmuguan lapsang'],
  'qimen-hong-cha': ['mei zhan jin', 'tongmuguan wild black', 'tongmuguan black'],
  'dian-hong-golden-needle': ['tongmuguan jin jun mei', 'mei zhan'],
  'jinjunmei': ['jin jun mei', 'tongmuguan jin jun mei'],
  'laoshan-black': ['tongmuguan wild black', 'mei zhan jin'],
  'yingde-hong-cha': ['mei zhan jin', 'hua xiang jin mu dan'],
  'bai-hao-yin-zhen': ['silver needle'],
  'bai-mu-dan': ['white peony', 'king peony', 'autumn dew'],
  'shou-mei': ['shou mei', 'bear s bait'],
  'gong-mei': ['gong mei', 'shou mei'],
  'jasmine-dragon-pearls': ['jasmine dragon pearl'],
  'jasmine-mo-li-hua-cha': ['jasmine chun hao', 'jasmine mao feng', 'jasmine snowflakes', 'fuzhou jasmine'],
  'rose-black-tea': ['peach mood', 'peachy lapsang'],
  'pu-erh-sheng-yiwu-gushu': ['bear s bait', 'autumn dew'],
  'pu-erh-shou-menghai-ripe': ['bear s bait', '2017 shou mei'],
  'liu-bao-hei-cha': ['bear s bait', '2017 shou mei'],
  'anhua-hei-cha': ['bear s bait', '2017 shou mei'],
  'fuzhuan-brick-tea': ['bear s bait'],
  'tuocha': ['bear s bait'],
  'pu-erh-bing-cha': ['bear s bait', 'autumn dew'],
  'chenpi-pu-erh': ['bear s bait'],
  'gu-shu-hong': ['tongmuguan wild black', 'mei zhan jin'],
  'huangjin-gui': ['huang mei gui', 'golden edged qi lan'],
  'longjing': ['jasmine mao feng', 'jasmine chun hao'],
  'bi-luo-chun': ['jasmine mao feng', 'summer bath'],
  'huangshan-maofeng': ['jasmine chun hao', 'silver needle'],
  'lu-an-guapian': ['summer bath', 'fo shou'],
  'xinyang-maojian': ['jasmine mao feng'],
  'enshi-yulu': ['silver needle', 'first pick fuding'],
  'mengding-ganlu': ['autumn dew', 'silver needle'],
  'taiping-houkui': ['jasmine mao feng', 'zhang ping'],
  'anji-baicha': ['silver needle', 'white peony'],
  'gunpowder': ['jasmine dragon pearl'],
  'chunmee': ['jasmine chun hao'],
  'junshan-yinzhen': ['silver needle'],
  'mengding-huangya': ['autumn dew', 'white peony'],
  'huoshan-huangya': ['white peony', 'king peony'],
  'ya-bao': ['silver needle', 'bear s bait'],
};

const CATEGORY_FALLBACK_HINTS = {
  Green: ['jasmine', 'fo shou', 'summer bath', 'dragon pearl', 'zhang ping'],
  White: ['silver needle', 'white peony', 'autumn dew', 'shou mei', 'gong mei', 'bear', 'king peony'],
  Yellow: ['silver needle', 'white peony', 'autumn dew'],
  Oolong: [
    'oolong',
    'da hong pao',
    'rou gui',
    'shui xian',
    'tie guan yin',
    'zui gui fei',
    'bai ji guan',
    'ban tian yao',
    'rui xiang',
  ],
  Red: ['black tea', 'lapsang', 'mei zhan', 'jin jun mei', 'peach mood', 'bonfire', 'tongmuguan'],
  Scented: ['jasmine', 'peach', 'snowflake'],
  'Pu-erh': ['bear', 'shou mei', 'aged', 'autumn dew'],
  Dark: ['bear', 'shou mei', '2017', '2019'],
};

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

/** Rooteas product shots with leaves in bowl/gaiwan — not packaging/coins/cakes */
function isBowlStyleImageUrl(imageUrl) {
  if (!imageUrl) return false;
  const src = imageUrl.toLowerCase();
  if (/coin|cake|brick|sampler|box|gift|year-of|parallel-brew/i.test(src)) {
    return false;
  }
  if (
    /rock-oolong|rock-tea|black-tea|oolong|jasmine|silver-needle|white-peony|shui-xian|rou-gui|da-hong-pao|tie-guan|mei-zhan|huang-mei|bai-ji|ban-tian|shui-jin|tie-luo|rui-xiang|fo-shou(?!.*coin)|dragon-pearl|mao-feng|chun-hao|snowflake|lapsang|jin-jun|tongmuguan|alishan|dong-ding|oriental-beauty|milky-oolong|shi-ru|peony|king-peony|autumn-dew(?!.*cake)|bear(?!.*cake)/i.test(
      src,
    )
  ) {
    return true;
  }
  return false;
}

function buildProductIndex(products) {
  return products
    .map((p) => ({
      title: p.title,
      normalized: normalizeName(p.title),
      image: p?.images?.[0]?.src ?? p?.image?.src ?? null,
    }))
    .filter((p) => isBowlStyleImageUrl(p.image));
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

function pickByAliases(aliases, products) {
  for (const alias of aliases) {
    const needle = normalizeName(alias);
    let best = null;
    let bestScore = 0;
    for (const p of products) {
      if (!p.image) continue;
      const s = scoreMatch(needle, p.normalized);
      if (s > bestScore) {
        bestScore = s;
        best = p;
      }
    }
    if (bestScore >= 0.5 && best && isBowlStyleImageUrl(best.image)) return best.image;
  }
  return null;
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
  if (bestScore >= 0.55 && best && isBowlStyleImageUrl(best.image)) return best.image;
  return null;
}

function pickCategoryFallback(category, order, products, usedUrls) {
  const hints = CATEGORY_FALLBACK_HINTS[category] ?? ['oolong'];
  const pool = products.filter(
    (p) => p.image && hints.some((h) => p.normalized.includes(normalizeName(h))),
  );
  const candidates = pool.length > 0 ? pool : products.filter((p) => p.image);
  if (candidates.length === 0) return null;

  for (let offset = 0; offset < candidates.length; offset += 1) {
    const candidate = candidates[(order + offset) % candidates.length];
    if (!usedUrls.has(candidate.image)) return candidate.image;
  }
  return candidates[order % candidates.length].image;
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
    productData = await fetchJsonWithRetry(PRODUCT_LIST_URL);
    await fs.writeFile(rooteasCachePath, JSON.stringify(productData), 'utf-8');
    console.log('Fetched fresh rooteas catalog.');
  } catch {
    const cached = await fs.readFile(rooteasCachePath, 'utf-8');
    productData = JSON.parse(cached);
    console.log('Using cached rooteas catalog.');
  }

  const productIndex = buildProductIndex(productData.products ?? []);
  const allProductImages = productIndex.map((p) => p.image).filter(isBowlStyleImageUrl);
  const usedUrls = new Set();
  const unmatched = [];

  function takeUniqueUrl(preferred) {
    if (preferred && !usedUrls.has(preferred)) {
      usedUrls.add(preferred);
      return preferred;
    }
    for (let offset = 0; offset < allProductImages.length; offset += 1) {
      const candidate = allProductImages[offset];
      if (!usedUrls.has(candidate)) {
        usedUrls.add(candidate);
        return candidate;
      }
    }
    return preferred ?? allProductImages[0] ?? null;
  }

  const seeds = teas.map((row, index) => {
    const order = index + 1;
    const id = slugify(row.name);
    const category = inferCategory(row.name, order);

    const directMatch =
      pickImage(row.name, productIndex) ??
      pickByAliases(TEA_IMAGE_ALIASES[id] ?? [], productIndex);

    const imageUrl = directMatch ? takeUniqueUrl(directMatch) : null;

    if (!imageUrl) {
      unmatched.push({ id, name: row.name, category });
    }

    return {
      id,
      order,
      name: row.name,
      category,
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
  const withImages = seeds.filter((t) => t.imageUrl).length;
  const placeholders = seeds.length - withImages;
  console.log(`Generated ${seeds.length} teas. Bowl images: ${withImages}/${seeds.length}.`);
  console.log(`Placeholder (no bowl on rooteas): ${placeholders}.`);
  console.log(`Unmatched: ${unmatched.length}. See scripts/unmatched-teas.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
