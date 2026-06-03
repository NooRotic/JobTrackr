#!/usr/bin/env node
/**
 * Generate the social-preview OG image (1200x630) for JobTrackr.
 * Renders a branded card in the dashboard's own theme and writes static/og.png.
 * Run: node scripts/generate-og.mjs   (or: bun scripts/generate-og.mjs)
 */
import puppeteer from 'puppeteer';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../static/og.png');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #0a0a0f;
    color: #f0f0f4;
    position: relative;
    overflow: hidden;
  }
  /* neon glow blob, top-right */
  .glow {
    position: absolute; top: -180px; right: -160px;
    width: 560px; height: 560px; border-radius: 50%;
    background: radial-gradient(circle, rgba(57,255,20,0.18), rgba(57,255,20,0) 70%);
  }
  /* subtle grid */
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 70%);
  }
  .wrap { position: relative; padding: 80px; height: 100%; display: flex; flex-direction: column; }
  .brandrow { display: flex; align-items: center; gap: 22px; }
  .logo {
    width: 92px; height: 92px; border-radius: 20px;
    background: #39ff14; color: #0a0a0f;
    display: flex; align-items: center; justify-content: center;
    font-size: 58px; font-weight: 800;
    box-shadow: 0 0 48px rgba(57,255,20,0.45);
  }
  .brandname { font-size: 40px; font-weight: 700; letter-spacing: -0.5px; }
  .brandsub { font-size: 20px; color: #7a7a8e; margin-top: 2px; }
  .hero { margin-top: auto; }
  .title { font-size: 92px; font-weight: 800; letter-spacing: -2px; line-height: 1.02; }
  .title .accent { color: #39ff14; }
  .desc { font-size: 32px; color: #b8b8c8; margin-top: 22px; max-width: 920px; line-height: 1.35; }
  .rule { height: 4px; width: 120px; background: #39ff14; border-radius: 2px; margin-top: 30px; box-shadow: 0 0 20px rgba(57,255,20,0.5); }
  .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 44px; }
  .stack { font-size: 22px; color: #7a7a8e; letter-spacing: 0.3px; }
  .repo { font-size: 22px; color: #39ff14; font-weight: 600; }
</style></head><body>
  <div class="glow"></div>
  <div class="grid"></div>
  <div class="wrap">
    <div class="brandrow">
      <div class="logo">J</div>
      <div>
        <div class="brandname">JobTrackr</div>
        <div class="brandsub">Open source · MIT</div>
      </div>
    </div>
    <div class="hero">
      <div class="title">Developer-first<br><span class="accent">job-search</span> dashboard</div>
      <div class="desc">Track applications, pipeline, company targets, and interview prep. No database, no backend.</div>
      <div class="rule"></div>
      <div class="footer">
        <div class="stack">SvelteKit 5 · Svelte 5 · Tailwind · Bun</div>
        <div class="repo">github.com/NooRotic/JobTrackr</div>
      </div>
    </div>
  </div>
</body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log('Wrote', out);
