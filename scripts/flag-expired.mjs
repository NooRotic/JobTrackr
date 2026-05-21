#!/usr/bin/env node

/**
 * flag-expired.mjs — Mark expired applications in applications.ts
 *
 * Reads link-checker JSON output and prefixes the `notes` field of any
 * application with status="expired" with a [LISTING EXPIRED YYYY-MM-DD] flag.
 *
 * Idempotent: won't double-flag entries that already have the marker.
 *
 * Usage:
 *   node scripts/check-links.mjs --json > /tmp/links.json
 *   node scripts/flag-expired.mjs /tmp/links.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APPS_FILE = join(__dirname, '..', 'src', 'lib', 'data', 'personal', 'applications.ts');

const linksPath = process.argv[2];
if (!linksPath) {
	console.error('Usage: node flag-expired.mjs <path-to-links.json>');
	process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const flag = `[LISTING EXPIRED ${today}] `;

const links = JSON.parse(readFileSync(linksPath, 'utf-8'));
const expired = links.results.filter((r) => r.status === 'expired');

console.log(`Found ${expired.length} expired listings.`);

let src = readFileSync(APPS_FILE, 'utf-8');
let updates = 0;

for (const item of expired) {
	// Find the entry by id, then update its notes
	const idPattern = `id: '${item.id}'`;
	const idIdx = src.indexOf(idPattern);
	if (idIdx === -1) {
		console.warn(`  ${item.id} not found, skipping`);
		continue;
	}

	// Find the notes field that follows
	const notesIdx = src.indexOf("notes: '", idIdx);
	if (notesIdx === -1) continue;

	const notesStart = notesIdx + "notes: '".length;
	const notesEnd = src.indexOf("',\n", notesStart);
	if (notesEnd === -1) continue;

	const currentNotes = src.slice(notesStart, notesEnd);

	// Skip if already flagged
	if (currentNotes.startsWith('[LISTING EXPIRED')) continue;

	const newNotes = flag + currentNotes;
	src = src.slice(0, notesStart) + newNotes + src.slice(notesEnd);
	updates++;
	console.log(`  ${item.id} ${item.company}: flagged`);
}

if (updates > 0) {
	writeFileSync(APPS_FILE, src, 'utf-8');
	console.log(`\nUpdated ${updates} entries in applications.ts`);
} else {
	console.log('\nNo updates needed.');
}
