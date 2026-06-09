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
await page.evaluate(() => {
  window.localStorage.clear();
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const loginUrl = page.url();
const loginText = await page.evaluate(() => document.body.innerText);
const loginMetrics = await page.evaluate(() => {
  const hello = [...document.querySelectorAll('*')].find(
    (node) => node.textContent?.trim() === 'hello',
  );
  const subtitle = [...document.querySelectorAll('*')].find(
    (node) => node.textContent?.trim() === 'Start enjoying your teas',
  );
  const fontFamily = hello ? window.getComputedStyle(hello).fontFamily : '';
  let textStackOk = false;
  if (hello && subtitle) {
    const a = hello.getBoundingClientRect();
    const b = subtitle.getBoundingClientRect();
    textStackOk = b.top >= a.bottom - 4;
  }
  return { fontFamily, textStackOk };
});
await snap('01-login');

await page.getByRole('button', { name: 'Sign in with Google' }).click();
await page.waitForTimeout(1000);
const afterLoginUrl = page.url();
const afterLoginText = await page.evaluate(() => document.body.innerText);
await snap('02-explore-first');

const pillOverlap = await page.evaluate(() => {
  const morning = [...document.querySelectorAll('*')].find(
    (node) => node.textContent?.trim() === 'Morning',
  );
  const buttons = [...document.querySelectorAll('[role="button"]')];
  const pill = buttons.find((node) => {
    const rect = node.getBoundingClientRect();
    return rect.width >= 60 && rect.width <= 70 && rect.height >= 45 && rect.height <= 55;
  });
  if (!morning || !pill) return { ok: false, reason: 'elements not found' };
  const a = morning.getBoundingClientRect();
  const b = pill.getBoundingClientRect();
  const overlap =
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  return { ok: !overlap, pillBottom: b.y + b.height, morningTop: a.y };
});

await page.getByText('Longjing', { exact: true }).click();
await page.waitForTimeout(600);
await page.getByText('Add to My teas', { exact: true }).click();
await page.waitForTimeout(500);
await page.goto(new URL('/explore', url).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const exploreDualText = await page.evaluate(() => document.body.innerText);
await snap('04-explore-dual');

await page.goto(new URL('/my-teas', url).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const myTeasText = await page.evaluate(() => document.body.innerText);
await snap('05-my-teas');

await browser.close();

const kapakanaOk = /kapakana/i.test(loginMetrics.fontFamily);
const loginTextStackOk = loginMetrics.textStackOk;
const loginOk = loginUrl.includes('/login') && loginText.includes('hello');
const exploreAfterLoginOk =
  afterLoginUrl.includes('/explore') &&
  afterLoginText.includes('Morning') &&
  !afterLoginText.includes("Let's add");
const pillOk = pillOverlap.ok === true;
const exploreDualOk = exploreDualText.includes('Longjing');
const myTeasOk = myTeasText.includes('Longjing');

console.log('URL:', url);
console.log('KAPAKANA_FONT ok:', kapakanaOk, `(${loginMetrics.fontFamily})`);
console.log('LOGIN_TEXT_STACK ok:', loginTextStackOk);
console.log('LOGIN_PAGE ok:', loginOk);
console.log('EXPLORE_AFTER_LOGIN ok:', exploreAfterLoginOk);
console.log('PILL_NO_OVERLAP ok:', pillOk, pillOverlap.reason ? `(${pillOverlap.reason})` : '');
console.log('EXPLORE_DUAL ok:', exploreDualOk);
console.log('MY_TEAS_AFTER_ADD ok:', myTeasOk);
console.log('ERRORS:', errors.length ? errors.join('\n') : '(none)');
console.log('SHOTS:', outDir);

const ok =
  kapakanaOk &&
  loginTextStackOk &&
  loginOk &&
  exploreAfterLoginOk &&
  pillOk &&
  exploreDualOk &&
  myTeasOk;
if (!ok) process.exitCode = 1;
