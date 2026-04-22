#!/usr/bin/env node
/**
 * Take screenshots of all JobTrackr pages for the README.
 * Requires: bun run dev running on localhost:5173
 * Usage: node scripts/take-screenshots.mjs
 */

import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

const BASE = process.env.VITE_HOST || 'http://172.26.80.1:5173';
const OUT = resolve('screenshots');
mkdirSync(OUT, { recursive: true });

const pages = [
  { path: '/?demo=true', name: 'dashboard', wait: 1000 },
  { path: '/searches?demo=true', name: 'searches', wait: 800 },
  { path: '/targets?demo=true', name: 'targets', wait: 800 },
  { path: '/applications?demo=true', name: 'applications', wait: 800 },
  { path: '/analytics?demo=true', name: 'analytics', wait: 800 },
  { path: '/profile?demo=true', name: 'profile', wait: 800 },
];

console.log('Launching browser...');
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--window-size=1440,900']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

for (const { path, name, wait } of pages) {
  const url = `${BASE}${path}`;
  console.log(`  Capturing ${name} (${url})...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, wait));
  await page.screenshot({
    path: resolve(OUT, `${name}.png`),
    fullPage: false,
  });
}

await browser.close();
console.log(`\nDone! Screenshots saved to ${OUT}/`);
console.log(pages.map(p => `  ${p.name}.png`).join('\n'));
