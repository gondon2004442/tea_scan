import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const url = process.env.URL || 'http://localhost:3000/';
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'verify-output');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
});

async function snap(name) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
const myTeasText = await page.evaluate(() => document.body.innerText);
await snap('my-teas');

// Explore via tab (second pill button)
const tabs = page.locator('[role="button"]').filter({ hasText: '' });
const exploreBtn = page.locator('div').filter({ has: page.locator('img') }).nth(3);
await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')];
  const explore = imgs.find((i) => i.src.includes('icon-explore'));
  explore?.closest('[tabindex]')?.click?.() ?? explore?.parentElement?.click?.();
});
await page.waitForTimeout(800);
await page.goto(new URL('/explore', url).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const exploreText = await page.evaluate(() => document.body.innerText);
await snap('explore');

await page.goto(new URL('/tea/longjing', url).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const modalText = await page.evaluate(() => document.body.innerText);
await snap('modal');

await browser.close();

console.log('URL:', url);
console.log('MY_TEAS ok:', myTeasText.includes('9:41') && myTeasText.includes('Da Hong Pao'));
console.log('EXPLORE ok:', exploreText.includes('Morning') && exploreText.includes('Oolong'));
console.log('MODAL ok:', modalText.includes('Steeping time') && modalText.includes('5 g / 100 ml'));
console.log('ERRORS:', errors.length ? errors.join('\n') : '(none)');
console.log('SHOTS:', outDir);

const ok =
  myTeasText.includes('Da Hong') &&
  myTeasText.includes('teascan') &&
  exploreText.includes('Longjing') &&
  modalText.includes('80°C');
if (!ok) process.exitCode = 1;
