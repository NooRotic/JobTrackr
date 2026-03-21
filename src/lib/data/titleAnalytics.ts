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
		timesSearched: 8,
		timesRelevant: 6,
		notes: 'Broad but consistently effective. Most companies use this exact title. Best combined with a company name or domain keyword.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-frontend',
		title: 'Senior Frontend Engineer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 6,
		timesRelevant: 5,
		notes: 'Reliable for frontend-specific roles. Lower noise ratio than generic SSE. Strong results across company sizes.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-web-dev',
		title: 'Senior Web Developer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 4,
		timesRelevant: 3,
		notes: 'Indeed normalizes some frontend roles to this. Catches a different slice of postings than "Frontend Engineer".',
		lastUsed: '2026-03-20'
	},
	{
		id: 'ta-react-engineer',
		title: 'Senior React Engineer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 3,
		timesRelevant: 3,
		notes: 'Good for startups and product companies that list React explicitly. Less common at larger companies.',
		lastUsed: '2026-03-19'
	},

	// === SOMETIMES ===
	{
		id: 'ta-fullstack',
		title: 'Full Stack Engineer',
		source: 'indeed',
		verdict: 'sometimes',
		timesSearched: 5,
		timesRelevant: 2,
		notes: 'Too broad — pulls backend-heavy and infra roles. Use only when looking to expand scope.',
		lastUsed: '2026-03-20'
	},
	{
		id: 'ta-tech-lead',
		title: 'Technical Lead Frontend',
		source: 'indeed',
		verdict: 'sometimes',
		timesSearched: 3,
		timesRelevant: 1,
		notes: 'Mixed — many results are management track. Worth monitoring but filter aggressively.',
		lastUsed: '2026-03-18'
	},
	{
		id: 'ta-typescript-swe',
		title: 'Full Stack TypeScript',
		source: 'custom',
		verdict: 'sometimes',
		timesSearched: 2,
		timesRelevant: 1,
		notes: 'Catches TypeScript-first companies but many results are backend or infra-leaning. Good for startups.',
		lastUsed: '2026-03-20'
	},

	// === NEVER ===
	{
		id: 'ta-svelte',
		title: 'SvelteKit Developer',
		source: 'custom',
		verdict: 'never',
		timesSearched: 2,
		timesRelevant: 0,
		notes: 'Framework-specific searches return near-zero results on Indeed. Use broader titles and mention the framework in the cover letter.',
		lastUsed: '2026-03-15'
	},
	{
		id: 'ta-chromecast',
		title: 'Chromecast Developer',
		source: 'custom',
		verdict: 'never',
		timesSearched: 2,
		timesRelevant: 0,
		notes: 'Too niche. Companies that need CAF experience post under "Senior Software Engineer" or "Frontend Engineer, TV". Search by company instead.',
		lastUsed: '2026-03-12'
	},
	{
		id: 'ta-local',
		title: 'Frontend Engineer Philadelphia',
		source: 'custom',
		verdict: 'never',
		timesSearched: 1,
		timesRelevant: 0,
		notes: 'Local market search returned almost nothing at senior level. Always target remote. Philly can be a nice-to-have filter, not a primary one.',
		lastUsed: '2026-03-08'
	}
];
