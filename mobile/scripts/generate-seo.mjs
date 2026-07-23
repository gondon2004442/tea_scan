// Generates static, crawlable SEO pages (English) from the tea catalog:
//   /catalog/                 — index of all teas grouped by category
//   /tea/<slug>/              — one page per tea (description + gongfu brewing)
//   /guide/gongfu-brewing/    — how-to-brew guide
//   /sitemap.xml              — home + all of the above
// These are plain HTML served by Firebase Hosting (the SPA rewrite only catches
// paths that do NOT exist as files/dirs), so the app and its login stay untouched.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist-web');
const SITE = 'https://plantscanners.com';
const APP_URL = `${SITE}/explore`;

// ---- Load catalog data from the generated TS module -----------------------
const seedsSrc = fs.readFileSync(path.join(root, 'src/data/teas.generated.ts'), 'utf8');
const arrMatch = seedsSrc.match(/TEA_SEEDS[^=]*=\s*(\[[\s\S]*?\n\]);/);
if (!arrMatch) throw new Error('Could not locate TEA_SEEDS array');
// The array is trusted, first-party data (object literals) — eval to a JS value.
// eslint-disable-next-line no-eval
const TEAS = eval(`(${arrMatch[1]})`);

const CATEGORY_ORDER = ['Green', 'White', 'Yellow', 'Oolong', 'Red', 'Dark', 'Pu-erh', 'Scented'];
const CATEGORY_BLURB = {
  Green: 'Fresh, grassy and delicate — unoxidised Chinese green teas.',
  White: 'Minimally processed buds and leaves with a soft, sweet character.',
  Yellow: 'Rare teas with a gentle sealed-yellowing step for a mellow cup.',
  Oolong: 'Partially oxidised teas, from floral high-mountain to roasted rock oolongs.',
  Red: 'Fully oxidised Chinese black (“red”) teas — malty, sweet and warming.',
  Dark: 'Post-fermented dark teas that deepen and mellow with age.',
  'Pu-erh': 'Aged and fermented teas from Yunnan, earthy and long-lasting.',
  Scented: 'Green or white bases scented with jasmine and other blossoms.',
};

// ---- Helpers --------------------------------------------------------------
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function writePage(relDir, html) {
  const dir = path.join(dist, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

function teaImage(slug) {
  const src = path.join(root, 'assets/images/teas', `${slug}.webp`);
  if (fs.existsSync(src)) {
    const outDir = path.join(dist, 'tea-img');
    fs.mkdirSync(outDir, { recursive: true });
    fs.copyFileSync(src, path.join(outDir, `${slug}.webp`));
    return `/tea-img/${slug}.webp`;
  }
  return '/icons/icon-512.png';
}

const CSS = `
:root{--ink:#180036;--muted:#5b5470;--purple:#9CAAE4;--green:#DCE49C;--line:rgba(0,0,0,.1)}
*{box-sizing:border-box}
body{margin:0;font-family:'Manrope',system-ui,-apple-system,sans-serif;color:var(--ink);background:#fff;line-height:1.6}
a{color:#3A2A6B}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
header.site{border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);z-index:5}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;text-decoration:none;color:var(--ink)}
.brand img{width:28px;height:28px;border-radius:7px}
.cta{display:inline-block;background:var(--ink);color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:600;font-size:14px}
.hero{background:linear-gradient(180deg,var(--purple),#F5EEFF);padding:36px 0}
.hero.green{background:linear-gradient(180deg,var(--green),#fff)}
h1{font-size:32px;line-height:1.2;margin:.2em 0}
h2{font-size:22px;margin:1.4em 0 .4em}
.crumbs{font-size:13px;color:var(--muted);margin:14px 0}
.crumbs a{color:var(--muted)}
.tag{display:inline-block;font-size:13px;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:3px 12px;margin:2px 6px 2px 0}
.brew{border:1px solid var(--line);border-radius:16px;padding:6px 18px;margin:18px 0}
.brew div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid var(--line)}
.brew div:last-child{border-bottom:0}
.brew div>span{color:var(--muted)}
.brew b{font-weight:600;text-align:right}
img.leaf{width:100%;max-width:280px;border-radius:16px;display:block;margin:10px 0}
ul.teas{list-style:none;padding:0;margin:8px 0 24px}
ul.teas li{padding:10px 0;border-bottom:1px solid var(--line)}
ul.teas li a{font-weight:600;text-decoration:none}
ul.teas li span{color:var(--muted);font-size:14px}
footer.site{border-top:1px solid var(--line);margin-top:40px;padding:24px 0;color:var(--muted);font-size:14px}
footer.site a{color:var(--muted)}
.section{padding:26px 0}
`;

function shell({ title, description, canonical, ogImage, jsonLd, hero, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="${canonical}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:image" content="${SITE}${ogImage}"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="icon" href="/favicon.ico" sizes="any"/>
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>${CSS}</style>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
<header class="site"><div class="wrap">
  <a class="brand" href="/catalog/"><img src="/icons/icon-192.png" alt="Tea Scan"/>Tea Scan</a>
  <a class="cta" href="${APP_URL}">Open the app →</a>
</div></header>
<div class="hero${hero === 'green' ? ' green' : ''}"><div class="wrap">${body.head}</div></div>
<main class="wrap section">${body.main}</main>
<footer class="site"><div class="wrap">
  <p><a href="/catalog/">Tea catalog</a> · <a href="/guide/gongfu-brewing/">Gongfu brewing guide</a> · <a href="${APP_URL}">Open the app</a></p>
  <p>Tea Scan — a catalogue of Chinese tea with gongfu brewing guidance and AI-powered search.</p>
</div></footer>
</body>
</html>`;
}

// ---- Per-tea pages --------------------------------------------------------
let teaCount = 0;
for (const tea of TEAS) {
  const slug = tea.id;
  const img = teaImage(slug);
  const url = `${SITE}/tea/${slug}/`;
  const cat = tea.category;
  const related = TEAS.filter((t) => t.category === cat && t.id !== slug).slice(0, 6);
  const title = `${tea.name} — ${cat} tea & gongfu brewing | Tea Scan`;
  const description = `${tea.name}: ${tea.story} Brew it gongfu style at ${tea.temperature}, ${tea.leafRatio}.`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${tea.name} — ${cat} tea and how to brew it gongfu style`,
    about: `${tea.name} Chinese ${cat} tea`,
    image: `${SITE}${img}`,
    description: tea.story,
    mainEntityOfPage: url,
  };
  const body = {
    head: `
      <nav class="crumbs"><a href="/catalog/">Catalog</a> › <a href="/catalog/#${cat.toLowerCase()}">${esc(cat)}</a> › ${esc(tea.name)}</nav>
      <h1>${esc(tea.name)}</h1>
      <p>${esc(cat)} tea · best in the ${esc(tea.timeToDrink.toLowerCase())}</p>`,
    main: `
      <img class="leaf" src="${img}" alt="${esc(tea.name)} — Chinese ${esc(cat.toLowerCase())} tea leaves" loading="lazy"/>
      <p>${esc(tea.story)}</p>

      <h2>How to brew ${esc(tea.name)} gongfu style</h2>
      <p>Use a small gaiwan or clay teapot with a high leaf-to-water ratio and multiple short infusions — the gongfu cha way to get the most from ${esc(tea.name)}.</p>
      <div class="brew">
        <div><span>Water temperature</span><b>${esc(tea.temperature)}</b></div>
        <div><span>Leaf ratio</span><b>${esc(tea.leafRatio)}</b></div>
        <div><span>Infusions</span><b>${esc(tea.steeping)}</b></div>
        <div><span>Best time to drink</span><b>${esc(tea.timeToDrink)}</b></div>
        <div><span>Type</span><b>Chinese ${esc(cat)} tea</b></div>
      </div>
      <p><a class="cta" href="${APP_URL}">Brew it in the app →</a></p>

      ${
        related.length
          ? `<h2>More ${esc(cat)} teas</h2><ul class="teas">${related
              .map(
                (t) =>
                  `<li><a href="/tea/${t.id}/">${esc(t.name)}</a> <span>— ${esc(t.timeToDrink)}</span></li>`,
              )
              .join('')}</ul>`
          : ''
      }
      <p><a href="/catalog/">← Back to the full Chinese tea catalog</a></p>`,
  };
  writePage(`tea/${slug}`, shell({ title, description, canonical: url, ogImage: img, jsonLd, hero: 'purple', body }));
  teaCount += 1;
}

// ---- Catalog index --------------------------------------------------------
const byCat = CATEGORY_ORDER.filter((c) => TEAS.some((t) => t.category === c));
const catalogUrl = `${SITE}/catalog/`;
const catalogBody = {
  head: `
    <h1>Chinese Tea Catalog</h1>
    <p>${TEAS.length} classic Chinese teas — green, white, yellow, oolong, red (black), dark, pu-erh and scented — each with gongfu brewing guidance.</p>`,
  main: `
    <p>Browse the full catalogue of Chinese loose-leaf teas below, grouped by type. Every tea has its origin story and a gongfu cha brewing recipe: water temperature, leaf ratio and infusion times. Looking for something specific? <a href="${APP_URL}">Open the app</a> to search by name or photo and take a taste quiz.</p>
    ${byCat
      .map(
        (cat) => `
      <h2 id="${cat.toLowerCase()}">${esc(cat)} tea</h2>
      <p>${esc(CATEGORY_BLURB[cat] || '')}</p>
      <ul class="teas">${TEAS.filter((t) => t.category === cat)
        .map(
          (t) =>
            `<li><a href="/tea/${t.id}/">${esc(t.name)}</a> <span>— brew at ${esc(t.temperature)}, ${esc(t.leafRatio)}</span></li>`,
        )
        .join('')}</ul>`,
      )
      .join('')}
    <p><a href="/guide/gongfu-brewing/">Read the gongfu brewing guide →</a></p>`,
};
const catalogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Chinese Tea Catalog',
  numberOfItems: TEAS.length,
  itemListElement: TEAS.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    url: `${SITE}/tea/${t.id}/`,
  })),
};
writePage(
  'catalog',
  shell({
    title: 'Chinese Tea Catalog — 50+ Gongfu Teas & Brewing Guide | Tea Scan',
    description:
      'A catalogue of classic Chinese teas — green, oolong, pu-erh, white, black (red) and more — with gongfu cha brewing recipes (temperature, ratio, steeping times).',
    canonical: catalogUrl,
    ogImage: '/icons/icon-512.png',
    jsonLd: catalogJsonLd,
    hero: 'green',
    body: catalogBody,
  }),
);

// ---- Gongfu brewing guide -------------------------------------------------
const guideUrl = `${SITE}/guide/gongfu-brewing/`;
writePage(
  'guide/gongfu-brewing',
  shell({
    title: 'How to Brew Tea Gongfu Style (Gongfu Cha) — Beginner Guide | Tea Scan',
    description:
      'A simple guide to gongfu cha: how to brew Chinese tea with a gaiwan, the right water temperature, leaf-to-water ratio and short multiple infusions.',
    canonical: guideUrl,
    ogImage: '/icons/icon-512.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to brew tea gongfu style (gongfu cha)',
      description:
        'Brew Chinese tea the gongfu way with a small vessel, high leaf ratio and multiple short infusions.',
      step: [
        { '@type': 'HowToStep', name: 'Warm the vessel', text: 'Rinse a gaiwan or small clay teapot with hot water.' },
        { '@type': 'HowToStep', name: 'Add leaves', text: 'Use roughly 5–8 g of leaf per 100 ml of water.' },
        { '@type': 'HowToStep', name: 'Rinse (optional)', text: 'For oolong and pu-erh, do a quick 5-second rinse and discard.' },
        { '@type': 'HowToStep', name: 'Short infusions', text: 'Steep for 10–30 seconds, then add a few seconds to each following infusion.' },
      ],
    },
    hero: 'purple',
    body: {
      head: `
        <nav class="crumbs"><a href="/catalog/">Catalog</a> › Gongfu brewing guide</nav>
        <h1>How to brew tea gongfu style</h1>
        <p>Gongfu cha — small vessel, lots of leaf, many short infusions.</p>`,
      main: `
        <p><b>Gongfu cha</b> (功夫茶) means brewing tea “with skill”. Instead of one long steep in a big mug, you use a small gaiwan or clay teapot, a high leaf-to-water ratio, and a series of short infusions. Each infusion reveals a slightly different side of the same leaves.</p>
        <h2>The basics</h2>
        <div class="brew">
          <div><span>Vessel</span><b>Gaiwan or small clay teapot (~100 ml)</b></div>
          <div><span>Leaf ratio</span><b>~5–8 g per 100 ml</b></div>
          <div><span>Water</span><b>75–95 °C depending on the tea</b></div>
          <div><span>Infusions</span><b>10–30 s, adding a few seconds each round</b></div>
        </div>
        <h2>Step by step</h2>
        <ol>
          <li>Rinse the gaiwan with hot water to warm it.</li>
          <li>Add the leaves (see each tea's page for the exact ratio).</li>
          <li>For oolong, dark and pu-erh teas, do a quick 5-second rinse and pour it away.</li>
          <li>Pour water along the side, steep a short time, then decant completely.</li>
          <li>Re-steep, adding a few seconds each time. Good teas last many infusions.</li>
        </ol>
        <h2>Water temperature by type</h2>
        <ul>
          <li><b>Green &amp; yellow:</b> 75–85 °C</li>
          <li><b>White:</b> 85–90 °C</li>
          <li><b>Oolong, red (black), dark, pu-erh:</b> 90–95 °C</li>
        </ul>
        <p>Every tea in our <a href="/catalog/">Chinese tea catalog</a> lists its own temperature, ratio and infusion schedule.</p>
        <p><a class="cta" href="${APP_URL}">Try it in the app →</a></p>`,
    },
  }),
);

// ---- sitemap.xml (overwrites the static placeholder) ----------------------
const urls = [
  { loc: `${SITE}/`, pri: '1.0' },
  { loc: catalogUrl, pri: '0.9' },
  { loc: guideUrl, pri: '0.7' },
  ...TEAS.map((t) => ({ loc: `${SITE}/tea/${t.id}/`, pri: '0.8' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

console.log(`SEO: generated ${teaCount} tea pages + catalog + guide, sitemap has ${urls.length} urls`);
