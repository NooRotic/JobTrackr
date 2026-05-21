#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APPS_FILE = join(__dirname, '..', 'src', 'lib', 'data', 'personal', 'applications.ts');

// New entries (added 2026-05-01 / 2026-05-04) — false-flagged due to to.indeed.com bot blocking
const FALSE_FLAGGED = [
	'app-049','app-050','app-051','app-052','app-053','app-054','app-055',
	'app-058','app-059','app-060','app-061','app-062','app-063'
];

let src = readFileSync(APPS_FILE, 'utf-8');
let updates = 0;

for (const id of FALSE_FLAGGED) {
	const idIdx = src.indexOf(`id: '${id}'`);
	if (idIdx === -1) continue;
	const notesIdx = src.indexOf("notes: '", idIdx);
	if (notesIdx === -1) continue;
	const notesStart = notesIdx + "notes: '".length;
	const notesEnd = src.indexOf("',\n", notesStart);
	const currentNotes = src.slice(notesStart, notesEnd);
	const flagPattern = /^\[LISTING EXPIRED \d{4}-\d{2}-\d{2}\] /;
	if (flagPattern.test(currentNotes)) {
		const newNotes = currentNotes.replace(flagPattern, '');
		src = src.slice(0, notesStart) + newNotes + src.slice(notesEnd);
		updates++;
		console.log(`  ${id}: reverted`);
	}
}

writeFileSync(APPS_FILE, src, 'utf-8');
console.log(`\nReverted ${updates} false flags.`);
