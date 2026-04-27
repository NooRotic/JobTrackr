#!/usr/bin/env node

/**
 * dedup-applications.mjs — Detect duplicate applications in JobTrackr
 *
 * Finds duplicates by:
 *   1. Normalized company + fuzzy role match
 *   2. Cross-platform URL matching (same job on Indeed + Greenhouse + Dice)
 *   3. Identical job IDs
 *
 * Usage:
 *   node scripts/dedup-applications.mjs              # report only
 *   node scripts/dedup-applications.mjs --json       # JSON output
 *
 * Does NOT modify files — reports only. You decide what to merge/remove.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// === Parse applications from TS source ===

function parseApplicationsFromFile(filePath) {
	const src = readFileSync(filePath, 'utf-8');
	const apps = [];
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
		const salary = get('salary');
		const dateApplied = get('dateApplied');
		const dateSaved = get('dateSaved');
		const source = get('source');
		if (id) {
			apps.push({ id, company, role, url, status, salary, dateApplied, dateSaved, source });
		}
	}
	return apps;
}

// === Normalization ===

function normalizeCompany(name) {
	return name
		.toLowerCase()
		.replace(/\(.*?\)/g, '') // strip parentheticals like (Amazon), (Google)
		.replace(/[^a-z0-9 ]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

const ROLE_STOPWORDS = new Set([
	'senior', 'sr', 'junior', 'jr', 'lead', 'staff', 'principal', 'head',
	'i', 'ii', 'iii', 'iv', 'v', '1', '2', '3', '4', '5',
	'engineer', 'engineering', 'developer', 'development',
	'software', 'swe', 'frontend', 'front', 'end', 'backend', 'back', 'full', 'stack',
	'remote', 'hybrid', 'contract',
]);

function normalizeRole(role) {
	return role
		.toLowerCase()
		.replace(/[^a-z0-9 /\-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function roleKeywords(role) {
	return normalizeRole(role)
		.split(/[\s/\-]+/)
		.filter((w) => w.length > 2 && !ROLE_STOPWORDS.has(w));
}

function roleSimilarity(a, b) {
	const wordsA = roleKeywords(a);
	const wordsB = roleKeywords(b);
	if (wordsA.length === 0 || wordsB.length === 0) return 0;

	const overlap = wordsA.filter((w) => wordsB.includes(w));
	const smaller = Math.min(wordsA.length, wordsB.length);
	return overlap.length / smaller;
}

// === URL cross-matching ===

/** Extract a platform-independent job identifier from URL */
function extractJobKey(url) {
	if (!url || url === '#') return null;

	// Greenhouse: /jobs/12345 or /jobs/12345002
	const gh = url.match(/greenhouse\.io\/[\w-]+\/jobs\/(\d+)/);
	if (gh) return `gh:${gh[1]}`;

	// Netflix: /job/790314073050
	const nf = url.match(/netflix\.net\/careers\/job\/(\d+)/);
	if (nf) return `nf:${nf[1]}`;

	// Dice: /job-detail/UUID
	const dice = url.match(/dice\.com\/job-detail\/([\w-]+)/);
	if (dice) return `dice:${dice[1]}`;

	// Indeed: jk=hex
	const indeed = url.match(/[?&]jk=([a-f0-9]+)/);
	if (indeed) return `indeed:${indeed[1]}`;

	// ZipRecruiter: /jobs/a/b?
	const zip = url.match(/ziprecruiter\.com.*[?&]jid=([\w-]+)/);
	if (zip) return `zip:${zip[1]}`;

	// Google Careers: /results/ID
	const goog = url.match(/careers\/applications\/jobs\/results\/(\d+)/);
	if (goog) return `goog:${goog[1]}`;

	// Disney Workday: req ID
	const disney = url.match(/(\d{8})/);
	if (disney && url.includes('disney')) return `disney:${disney[1]}`;

	return null;
}

// === Status ranking (higher = further in pipeline) ===

const STATUS_RANK = {
	saved: 0,
	applied: 1,
	screening: 2,
	interview: 3,
	offer: 4,
	accepted: 5,
	rejected: -1,
};

// === Main ===

function main() {
	const args = process.argv.slice(2);
	const jsonOutput = args.includes('--json');

	let applications;
	try {
		applications = parseApplicationsFromFile(
			join(ROOT, 'src/lib/data/personal/applications.ts')
		);
	} catch {
		applications = parseApplicationsFromFile(join(ROOT, 'src/lib/data/applications.ts'));
	}

	const duplicateGroups = [];

	// === Pass 1: Company + Role fuzzy match ===
	const companyGroups = new Map();
	for (const app of applications) {
		const key = normalizeCompany(app.company);
		if (!companyGroups.has(key)) companyGroups.set(key, []);
		companyGroups.get(key).push(app);
	}

	for (const [company, apps] of companyGroups) {
		if (apps.length < 2) continue;

		// Check each pair for role similarity
		const matched = new Set();
		for (let i = 0; i < apps.length; i++) {
			for (let j = i + 1; j < apps.length; j++) {
				if (matched.has(j)) continue;
				const sim = roleSimilarity(apps[i].role, apps[j].role);
				if (sim >= 0.6) {
					duplicateGroups.push({
						type: 'role-match',
						similarity: Math.round(sim * 100),
						entries: [apps[i], apps[j]],
						recommendation: recommend(apps[i], apps[j]),
					});
					matched.add(j);
				}
			}
		}
	}

	// === Pass 2: Cross-platform URL key match ===
	const keyMap = new Map();
	for (const app of applications) {
		const key = extractJobKey(app.url);
		if (!key) continue;
		if (!keyMap.has(key)) keyMap.set(key, []);
		keyMap.get(key).push(app);
	}

	for (const [key, apps] of keyMap) {
		if (apps.length < 2) {
			continue;
		}
		// Only report if not already caught by role-match
		const ids = apps.map((a) => a.id).sort().join(',');
		const alreadyFound = duplicateGroups.some(
			(g) => g.entries.map((e) => e.id).sort().join(',') === ids
		);
		if (!alreadyFound) {
			duplicateGroups.push({
				type: 'url-key-match',
				key,
				entries: apps,
				recommendation: recommend(apps[0], apps[1]),
			});
		}
	}

	// === Output ===
	if (!jsonOutput) {
		console.log(`Scanned ${applications.length} applications\n`);

		if (duplicateGroups.length === 0) {
			console.log('No duplicates found.');
		} else {
			console.log(`Found ${duplicateGroups.length} potential duplicate group(s):\n`);

			for (const group of duplicateGroups) {
				const tag = group.type === 'role-match'
					? `Role match (${group.similarity}%)`
					: `URL key match (${group.key})`;

				console.log(`--- ${tag} ---`);
				for (const e of group.entries) {
					const rank = STATUS_RANK[e.status] ?? 0;
					console.log(
						`  [${e.id}] ${e.company.padEnd(25)} ${e.role.substring(0, 45).padEnd(45)} ${e.status.padEnd(12)} ${e.url.substring(0, 60)}`
					);
				}
				console.log(`  Recommendation: ${group.recommendation}`);
				console.log();
			}
		}

		// Summary stats
		const companyCounts = [...companyGroups.entries()]
			.filter(([, apps]) => apps.length >= 2)
			.sort((a, b) => b[1].length - a[1].length);

		if (companyCounts.length > 0) {
			console.log('\n--- Companies with multiple applications ---');
			for (const [company, apps] of companyCounts) {
				const roles = apps.map((a) => a.role.substring(0, 40));
				console.log(`  ${apps[0].company} (${apps.length}): ${roles.join(' | ')}`);
			}
		}
	}

	// Write JSON report
	const outputDir = join(ROOT, 'src', 'lib', 'data', 'generated');
	mkdirSync(outputDir, { recursive: true });
	writeFileSync(
		join(outputDir, 'dedup-report.json'),
		JSON.stringify(
			{
				checkedAt: new Date().toISOString(),
				totalApplications: applications.length,
				duplicateGroups: duplicateGroups.length,
				groups: duplicateGroups,
				multiAppCompanies: [...companyGroups.entries()]
					.filter(([, apps]) => apps.length >= 2)
					.map(([, apps]) => ({
						company: apps[0].company,
						count: apps.length,
						roles: apps.map((a) => ({ id: a.id, role: a.role, status: a.status })),
					})),
			},
			null,
			'\t'
		)
	);

	if (jsonOutput) {
		console.log(
			JSON.stringify({ duplicates: duplicateGroups.length, groups: duplicateGroups }, null, 2)
		);
	} else {
		console.log(`\nReport written to src/lib/data/generated/dedup-report.json`);
	}
}

function recommend(a, b) {
	const rankA = STATUS_RANK[a.status] ?? 0;
	const rankB = STATUS_RANK[b.status] ?? 0;

	if (a.status === 'rejected' && b.status !== 'rejected') return `Keep ${b.id} (${b.status}), archive ${a.id} (rejected)`;
	if (b.status === 'rejected' && a.status !== 'rejected') return `Keep ${a.id} (${a.status}), archive ${b.id} (rejected)`;

	if (rankA > rankB) return `Keep ${a.id} (further in pipeline: ${a.status})`;
	if (rankB > rankA) return `Keep ${b.id} (further in pipeline: ${b.status})`;

	// Same status — keep the one with a date applied
	if (a.dateApplied && !b.dateApplied) return `Keep ${a.id} (has apply date)`;
	if (b.dateApplied && !a.dateApplied) return `Keep ${b.id} (has apply date)`;

	return `Review manually — same status (${a.status})`;
}

main();
