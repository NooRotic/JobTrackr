import type { JobTitleAnalytics } from './types';

/**
 * Job title effectiveness tracking.
 * Tracks which search titles produce relevant results vs noise.
 * Update verdicts as you run more searches and learn what works.
 */
export const titleAnalytics: JobTitleAnalytics[] = [
	// === WORKS ===
	{
		id: 'ta-sse',
		title: 'Senior Software Engineer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 5,
		timesRelevant: 3,
		notes: 'Broad but effective. Most roles use this title. Best combined with company name or domain keyword.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-frontend',
		title: 'Frontend Engineer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 3,
		timesRelevant: 2,
		notes: 'Good for frontend-specific roles. Can be noisy — pair with company name for best results.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-web-dev',
		title: 'Senior Web Developer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 2,
		timesRelevant: 1,
		notes: 'Indeed normalizes some roles to this. Produces remote-friendly results.',
		lastUsed: '2026-03-21'
	},

	// === SOMETIMES ===
	{
		id: 'ta-fullstack',
		title: 'Full Stack Engineer',
		source: 'indeed',
		verdict: 'sometimes',
		timesSearched: 2,
		timesRelevant: 1,
		notes: 'Generic. Produces P3 results mostly. Use as a fallback.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-tech-lead',
		title: 'Technical Lead',
		source: 'indeed',
		verdict: 'sometimes',
		timesSearched: 1,
		timesRelevant: 1,
		notes: 'Results are mixed — many non-engineering "lead" roles show up.',
		lastUsed: '2026-03-21'
	},

	// === NEVER ===
	{
		id: 'ta-niche-framework',
		title: 'SvelteKit Developer',
		source: 'custom',
		verdict: 'never',
		timesSearched: 1,
		timesRelevant: 0,
		notes: 'Too niche for Indeed. Framework-specific searches return zero. Use broader titles instead.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-local-market',
		title: 'Frontend Engineer (Local City)',
		source: 'custom',
		verdict: 'never',
		timesSearched: 1,
		timesRelevant: 0,
		notes: 'Local market was dead for this query. Always search remote instead.',
		lastUsed: '2026-03-21'
	}
];
