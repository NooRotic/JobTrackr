import type { NextUpItem } from './types';

// DEMO DATA — fictional, safe to commit. The real list lives in the gitignored
// personal/nextUp.ts and overrides this at runtime (see index.ts).
export const nextUp: NextUpItem[] = [
	{
		id: 'demo-1',
		priority: 'P0',
		kind: 'deadline',
		title: 'Return signed program paperwork',
		detail: 'Form plus supporting activity report.',
		why: 'Already written. Blocked on sending, not on drafting.',
		due: '2026-08-20'
	},
	{
		id: 'demo-2',
		priority: 'P1',
		kind: 'email',
		title: 'Reply to recruiter asking for a comp number',
		detail: 'Third touch, band stated as negotiable.',
		why: 'They asked directly. Silence reads as disinterest.',
		waitingSince: '2026-08-08'
	},
	{
		id: 'demo-3',
		priority: 'P2',
		kind: 'submit',
		title: 'Submit NovaByte, Senior Frontend Engineer',
		detail: 'Package deploy-ready, listing verified live.',
		why: 'Score 4.0. Nothing blocking.'
	},
	{
		id: 'demo-4',
		priority: 'P4',
		kind: 'admin',
		title: 'Commit dashboard changes to a branch',
		why: 'Housekeeping. Nothing on fire.'
	}
];
