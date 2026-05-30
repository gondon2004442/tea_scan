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
fs.writeFileSync(indexPath, html);
