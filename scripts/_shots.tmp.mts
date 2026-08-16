import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const OUT = join(process.cwd(), 'out');
const MIME: Record<string,string> = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.avif':'image/avif', '.webp':'image/webp', '.png':'image/png', '.ico':'image/x-icon', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const body = await readFile(join(OUT, p));
    res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise<void>(r => server.listen(4911, r));

const browser = await chromium.launch({ channel: 'chromium', headless: true });
const shots: Array<[string, string, number, number, boolean]> = [
  ['/', 'home-desktop', 1440, 2400, false],
  ['/bemutatkozas/', 'about-portrait-check', 1440, 2400, false],
  ['/arak/elso-masszazs/', 'first-desktop', 1440, 2400, false],
  ['/', 'home-mobile', 390, 2400, false],
  
  
  
  
];
for (const [path, name, w, h] of shots) {
  const page = await browser.newPage({ viewport: { width: w as number, height: 900 } });
  await page.goto(`http://localhost:4911${path}`, { waitUntil: 'networkidle' });
  await page.evaluate(`(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => { y += 600; window.scrollTo(0, y); if (y < document.body.scrollHeight) setTimeout(step, 60); else { window.scrollTo(0,0); setTimeout(resolve, 400); } };
      step();
    });
  })()`);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `/tmp/shot-${name}.png`, fullPage: true });
  await page.close();
  console.log('shot', name);
}
await browser.close();
server.close();
