const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5181';
const OUT_DIR = path.join(__dirname, '../screenshots/experian');

async function wait(page, ms) {
  await new Promise(r => setTimeout(r, ms));
}

async function screenshot(page, filename, waitMs = 1800) {
  await wait(page, waitMs);
  const fp = path.join(OUT_DIR, filename);
  await page.screenshot({ path: fp, fullPage: true });
  console.log('✓', filename);
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // ── Login via the prod server ──────────────────────────────────────────────
  console.log('Loading app...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
  await wait(page, 1000);

  // Check if login form is shown
  const hasLoginForm = await page.$('input[type="password"]');
  if (hasLoginForm) {
    console.log('Logging in...');
    await page.type('input[type="text"]', 'TAU');
    await page.type('input[type="password"]', 'Demo2026');
    await page.click('button[type="submit"]');
    await wait(page, 2000);
  }

  // ── Switch to Experian client ──────────────────────────────────────────────
  console.log('Switching to Experian client...');
  const switched = await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const s of selects) {
      const opts = Array.from(s.options);
      const opt = opts.find(o => o.value === 'experian');
      if (opt) {
        s.value = 'experian';
        s.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }
    return false;
  });
  console.log('Client switched:', switched);
  await wait(page, 1000);

  // Helper: click nav button by partial text
  async function clickNav(text) {
    return page.evaluate((t) => {
      const btns = Array.from(document.querySelectorAll('nav button, .nav button'));
      const b = btns.find(b => b.textContent.includes(t));
      if (b) { b.click(); return true; }
      // fallback: any button
      const all = Array.from(document.querySelectorAll('button'));
      const b2 = all.find(b => b.textContent.includes(t));
      if (b2) { b2.click(); return true; }
      return false;
    }, text);
  }

  // Helper: trigger resize events so Recharts re-measures containers
  async function triggerResize() {
    // Scroll through the page to trigger all chart renders, then scroll back
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      const step = 400;
      for (let y = 0; y < h; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('resize'));
      await new Promise(r => setTimeout(r, 300));
      window.dispatchEvent(new Event('resize'));
    });
    await wait(page, 600);
  }

  // ── YouTube Dashboard ──────────────────────────────────────────────────────
  console.log('Clicking YouTube Performance tab...');
  const ytOk = await clickNav('YouTube Performance');
  console.log('YouTube tab:', ytOk);
  await wait(page, 1500);
  await triggerResize();
  await screenshot(page, '01-youtube-dashboard.png', 2000);

  // ── YouTube Creative Manager ───────────────────────────────────────────────
  console.log('Clicking YouTube Creative Manager tab...');
  await clickNav('YouTube Creative Manager');
  await wait(page, 1200);
  await triggerResize();
  await screenshot(page, '02-youtube-creative-manager.png', 1500);

  // ── Search Dashboard ───────────────────────────────────────────────────────
  console.log('Clicking Search Performance tab...');
  await clickNav('Search Performance');
  await wait(page, 1500);
  await triggerResize();
  await screenshot(page, '03-search-dashboard.png', 2000);

  // ── Google Copy Creator ────────────────────────────────────────────────────
  console.log('Clicking Google Copy Creator tab...');
  await clickNav('Google Copy Creator');
  await wait(page, 1000);
  await triggerResize();
  await screenshot(page, '04-copy-creator-empty.png', 1000);

  // Generate variations
  console.log('Generating copy variations...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(b => b.textContent.includes('Generate'));
    if (b) b.click();
  });
  await wait(page, 2000);
  await triggerResize();
  await screenshot(page, '05-copy-creator-results.png', 2000);

  // ── A/B Tests view of Creative Manager ────────────────────────────────────
  console.log('Back to YT Creative Manager, A/B Tests tab...');
  await clickNav('YouTube Creative Manager');
  await wait(page, 1200);
  await triggerResize();
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(b => b.textContent.includes('A/B Test'));
    if (b) b.click();
  });
  await screenshot(page, '06-youtube-abtests.png', 1500);

  await browser.close();
  
  console.log('\n✅ Screenshots complete:');
  fs.readdirSync(OUT_DIR).forEach(f => console.log(' ', f));
})().catch(e => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
