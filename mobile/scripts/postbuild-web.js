const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist-web');
const indexPath = path.join(dist, 'index.html');

fs.writeFileSync(
  path.join(dist, 'serve.json'),
  JSON.stringify({ rewrites: [{ source: '**', destination: '/index.html' }] }, null, 2),
);

const webCss = `
      html, body {
        height: 100%;
        width: 100%;
        margin: 0;
      }
      body {
        overflow: auto;
        background: #e8e8e8;
      }
      #root {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 100vh;
        width: 100%;
      }
      #root > div {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 100%;
        width: 100%;
      }
`;

let html = fs.readFileSync(indexPath, 'utf8');
if (html.includes('<style id="expo-reset">')) {
  html = html.replace(
    /<style id="expo-reset">[\s\S]*?<\/style>/,
    `<style id="expo-reset">${webCss}</style>`,
  );
}

// Expo `output: "single"` ignores app/+html.tsx, so inject PWA + SEO head tags
// and the service-worker registration here (idempotent).
const headTags = `
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#9CAAE4" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Tea Scan" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
    <meta name="description" content="Tea Scan — каталог китайского чая с умным AI-поиском по фото и подбором в стиле гунфу-ча." />
    <meta property="og:title" content="Tea Scan" />
    <meta property="og:description" content="Каталог китайского чая, умный поиск и подбор в стиле гунфу-ча." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/icons/icon-512.png" />
    <meta name="twitter:card" content="summary" />
    <script>if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}</script>
`;
if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `${headTags}  </head>`);
}

// Multi-size brand favicon (crisper than Expo's single-size one) + SEO extras.
const brandIco = path.join(__dirname, '..', 'assets', 'brand-favicon.ico');
if (fs.existsSync(brandIco)) {
  fs.copyFileSync(brandIco, path.join(dist, 'favicon.ico'));
}

const seoTags = `
    <link rel="canonical" href="https://plantscanners.com/" />
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Tea Scan',
      url: 'https://plantscanners.com/',
      description:
        'Каталог китайского чая с умным AI-поиском по фото и подбором в стиле гунфу-ча.',
    })}</script>
`;
if (!html.includes('application/ld+json')) {
  html = html.replace('</head>', `${seoTags}  </head>`);
}
// Match the viewport meta to the app frame (notch-safe in standalone).
html = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />',
);

fs.writeFileSync(indexPath, html);
