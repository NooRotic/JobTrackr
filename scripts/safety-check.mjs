#!/usr/bin/env node
/**
 * Pre-deploy safety guard for the PUBLIC JobTrackr repo.
 *
 * Prevents the failure class that bit us 2026-06-02: a route (src/routes/income)
 * `?raw`-imported PRIVATE docs from OUTSIDE the repo. That one happened to be
 * .gitignored so nothing leaked — but the guard was manual. This makes it automatic.
 *
 * Scans only GIT-TRACKED files (so gitignored local-only routes are fine), and FAILS
 * the build if any committed source file:
 *   1. imports (relative) from OUTSIDE the project root  — private cross-repo content
 *   2. imports from src/lib/data/personal or .../generated — real/gitignored data
 * It also asserts the sensitive dirs are still gitignored.
 *
 * Runs automatically via the `prebuild` npm script. Run manually: `bun run safety`.
 */
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_EXT = /\.(svelte|ts|js|mjs)$/;
const PRIVATE_DIRS = ['src/lib/data/personal', 'src/lib/data/generated'];
const MUST_BE_IGNORED = [...PRIVATE_DIRS, '.env', 'src/routes/income'];

function git(cmd) {
	return execSync(`git ${cmd}`, { cwd: projectRoot, encoding: 'utf8' });
}

let tracked;
try {
	tracked = git('ls-files').split('\n').filter(Boolean);
} catch {
	console.warn('[safety-check] git not available — skipping (non-git build context).');
	process.exit(0);
}

const problems = [];

// 1 + 2: scan tracked source files for leaky imports
const importRe = /(?:from|import)\s+['"]([^'"]+)['"]/g;
for (const file of tracked) {
	if (!SRC_EXT.test(file)) continue;
	const abs = join(projectRoot, file);
	if (!existsSync(abs)) continue;
	const code = readFileSync(abs, 'utf8');
	let m;
	while ((m = importRe.exec(code))) {
		const spec = m[1].split('?')[0]; // strip ?raw etc.
		if (!spec.startsWith('.')) continue; // only relative imports can escape
		const target = resolve(dirname(abs), spec);
		const rel = relative(projectRoot, target);
		if (rel.startsWith('..')) {
			problems.push(`${file}: imports from OUTSIDE the repo → "${m[1]}" (private cross-repo content must not be committed)`);
		} else if (PRIVATE_DIRS.some((d) => rel.replaceAll('\\', '/').startsWith(d))) {
			problems.push(`${file}: imports gitignored private data → "${m[1]}" (tracked code must not import personal/generated data)`);
		}
	}
}

// 3: assert sensitive paths are still gitignored
for (const p of MUST_BE_IGNORED) {
	try {
		git(`check-ignore -q "${p}"`);
	} catch {
		// non-zero exit = NOT ignored (only flag if the path actually exists)
		if (existsSync(join(projectRoot, p))) {
			problems.push(`${p}: exists but is NOT gitignored — add it to .gitignore (it holds private data / local-only routes)`);
		}
	}
}

if (problems.length) {
	console.error('\n❌ safety-check FAILED — private-data leak risk in the public repo:\n');
	for (const p of problems) console.error('   • ' + p);
	console.error('\nFix: keep private/local-only content in gitignored dirs and never import it from tracked code.\n');
	process.exit(1);
}

console.log('✅ safety-check passed — no private-data leaks in tracked files.');
