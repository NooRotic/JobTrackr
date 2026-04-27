#!/usr/bin/env node

/**
 * check-links.mjs — HTTP link health checker for JobTrackr
 *
 * Tests application URLs for liveness without Playwright.
 * Uses fetch + pattern detection for expired/closed signals.
 *
 * Usage:
 *   node scripts/check-links.mjs                 # check all applications
 *   node scripts/check-links.mjs --active-only   # skip rejected/accepted
 *   node scripts/check-links.mjs --json          # output JSON for dashboard
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// === Parse applications from TS source (no import needed) ===

function parseApplicationsFromFile(filePath) {
	const src = readFileSync(filePath, 'utf-8');
	const apps = [];
	// Match each object block in the array
	const objRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/gs;
	for (const match of src.matchAll(objRegex)) {
		const block = match[0];
		const get = (key) => {
			const m = block.match(new RegExp(`${key}:\\s*'([^']*)'`));
			return m ? m[1] : '';
		};
		const id = get('id');
		const company = get('company');
		const role = get('role');
		const url = get('url');
		const status = get('status');
		if (id && url) {
			apps.push({ id, company, role, url, status });
		}
	}
	return apps;
}

// === Pattern detection (adapted from career-ops liveness-core) ===

const EXPIRED_PATTERNS = [
	/job (is )?no longer available/i,
	/job.*no longer open/i,
	/position has been filled/i,
	/this job has expired/i,
	/job posting has expired/i,
	/no longer accepting applications/i,
	/this (position|role|job) (is )?no longer/i,
	/this job (listing )?is closed/i,
	/job (listing )?not found/i,
	/the page you are looking for doesn.t exist/i,
	/applications?\s+(?:(?:have|are|is)\s+)?closed/i,
	/404|page not found/i,
];

const ACTIVE_PATTERNS = [
	/\bapply\b/i,
	/submit application/i,
	/easy apply/i,
	/start application/i,
];

// URLs that are known to be JS-rendered and can't be checked via fetch
const JS_RENDERED_DOMAINS = [
	'google.com/about/careers',
	'lifeattiktok.com',
	'disney.wd5.myworkdayjobs.com',
];

function isJsRendered(url) {
	return JS_RENDERED_DOMAINS.some((d) => url.includes(d));
}

async function checkUrl(url) {
	if (!url || url === '#') {
		return { status: 'skip', reason: 'no URL' };
	}

	if (isJsRendered(url)) {
		return { status: 'unknown', reason: 'JS-rendered site (needs browser)', httpStatus: null };
	}

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 12000);

		const res = await fetch(url, {
			signal: controller.signal,
			redirect: 'follow',
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
				Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			},
		});

		clearTimeout(timeout);

		const httpStatus = res.status;

		// Hard HTTP failures
		if (httpStatus === 404 || httpStatus === 410) {
			return { status: 'expired', reason: `HTTP ${httpStatus}`, httpStatus };
		}

		if (httpStatus >= 500) {
			return { status: 'error', reason: `HTTP ${httpStatus}`, httpStatus };
		}

		// Check redirect — if we ended up at a generic careers page, listing is gone
		const finalUrl = res.url;
		if (finalUrl !== url) {
			const originalPath = new URL(url).pathname;
			const finalPath = new URL(finalUrl).pathname;
			// Redirected away from specific job to generic page
			if (originalPath.length > 20 && finalPath.length < 15) {
				return {
					status: 'expired',
					reason: `redirected to generic page: ${finalUrl}`,
					httpStatus,
				};
			}
		}

		// Try to read body for pattern matching
		let body = '';
		try {
			body = await res.text();
		} catch {
			// Some responses are too large or fail to read
		}

		if (body) {
			// Check expired patterns first
			for (const pattern of EXPIRED_PATTERNS) {
				if (pattern.test(body)) {
					return {
						status: 'expired',
						reason: `page content: "${pattern.source}"`,
						httpStatus,
					};
				}
			}

			// Check for apply button presence
			const hasApply = ACTIVE_PATTERNS.some((p) => p.test(body));
			if (hasApply) {
				return { status: 'active', reason: 'apply button detected', httpStatus };
			}

			// Has substantial content but no apply button
			if (body.length > 2000) {
				return {
					status: 'unknown',
					reason: 'content present but no apply button found',
					httpStatus,
				};
			}
		}

		// HTTP 200 but minimal content
		return {
			status: httpStatus === 200 ? 'unknown' : 'error',
			reason: httpStatus === 200 ? 'minimal response content' : `HTTP ${httpStatus}`,
			httpStatus,
		};
	} catch (err) {
		const msg = err.name === 'AbortError' ? 'timeout (12s)' : err.message.split('\n')[0];
		return { status: 'error', reason: msg, httpStatus: null };
	}
}

async function main() {
	const args = process.argv.slice(2);
	const activeOnly = args.includes('--active-only');
	const jsonOutput = args.includes('--json');

	// Parse applications from TS source files (avoids $lib alias issues)
	let applications;
	try {
		applications = parseApplicationsFromFile(join(ROOT, 'src/lib/data/personal/applications.ts'));
	} catch {
		applications = parseApplicationsFromFile(join(ROOT, 'src/lib/data/applications.ts'));
	}

	let apps = [...applications];
	if (activeOnly) {
		apps = apps.filter((a) => a.status !== 'rejected' && a.status !== 'accepted');
	}

	if (!jsonOutput) {
		console.log(`Checking ${apps.length} application URLs...\n`);
	}

	const results = [];
	const icons = { active: '\u2705', expired: '\u274C', unknown: '\u2753', error: '\u26A0\uFE0F', skip: '\u23ED\uFE0F' };

	for (const app of apps) {
		const result = await checkUrl(app.url);
		const entry = {
			id: app.id,
			company: app.company,
			role: app.role,
			url: app.url,
			appStatus: app.status,
			...result,
			checkedAt: new Date().toISOString(),
		};
		results.push(entry);

		if (!jsonOutput) {
			console.log(
				`${icons[result.status] || '?'} ${result.status.padEnd(9)} ${app.company.padEnd(20)} ${app.role.substring(0, 40)}`
			);
			if (result.status !== 'active' && result.status !== 'skip') {
				console.log(`           ${result.reason}`);
			}
		}
	}

	// Summary
	const counts = { active: 0, expired: 0, unknown: 0, error: 0, skip: 0 };
	for (const r of results) counts[r.status] = (counts[r.status] || 0) + 1;

	if (!jsonOutput) {
		console.log(
			`\nResults: ${counts.active} active  ${counts.expired} expired  ${counts.unknown} unknown  ${counts.error} error  ${counts.skip} skip`
		);
	}

	// Write JSON output for dashboard consumption
	const outputDir = join(ROOT, 'src', 'lib', 'data', 'generated');
	mkdirSync(outputDir, { recursive: true });
	writeFileSync(
		join(outputDir, 'link-health.json'),
		JSON.stringify({ checkedAt: new Date().toISOString(), summary: counts, results }, null, '\t')
	);

	if (jsonOutput) {
		console.log(JSON.stringify({ summary: counts, results }, null, 2));
	} else {
		console.log(`\nResults written to src/lib/data/generated/link-health.json`);
	}

	process.exit(counts.expired > 0 ? 1 : 0);
}

main().catch((err) => {
	console.error('Fatal:', err.message);
	process.exit(1);
});
