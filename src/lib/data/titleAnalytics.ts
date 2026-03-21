import type { JobTitleAnalytics } from './types';

/**
 * Job title effectiveness tracking.
 * Tracks which search titles actually produce relevant results vs noise.
 * Updated over time as we run more searches.
 */
export const titleAnalytics: JobTitleAnalytics[] = [
	// === WORKS — these produce relevant hits ===
	{
		id: 'ta-senior-swe',
		title: 'Senior Software Engineer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 6,
		timesRelevant: 4,
		notes: 'Broad but effective. Most video/streaming roles use this title. Best when combined with company name or "video" keyword.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-video-engineer',
		title: 'Video Engineer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 3,
		timesRelevant: 2,
		notes: 'Niche but high signal. USA TODAY hit came from this. Indeed normalizes Burst Inc. as "video engineer" — rare category.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-video-player-engineer',
		title: 'Video Player Engineer',
		source: 'custom',
		verdict: 'works',
		timesSearched: 2,
		timesRelevant: 1,
		notes: 'Very niche. Tubi "Sr SWE, Video Player" was found via this. Low volume but perfect fit when it hits.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-senior-web-dev',
		title: 'Senior Web Developer',
		source: 'indeed',
		verdict: 'works',
		timesSearched: 2,
		timesRelevant: 1,
		notes: 'Indeed normalizes CAVEON as "senior web developer". Produces generic results but some remote hits.',
		lastUsed: '2026-03-21'
	},

	// === SOMETIMES — mixed results ===
	{
		id: 'ta-frontend-engineer',
		title: 'Frontend Engineer',
		source: 'indeed',
		verdict: 'sometimes',
		timesSearched: 3,
		timesRelevant: 1,
		notes: 'Produces lots of noise (React generic roles). Occasionally surfaces video-adjacent frontend roles. Better when paired with company name.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-streaming-engineer',
		title: 'Streaming Engineer',
		source: 'custom',
		verdict: 'sometimes',
		timesSearched: 2,
		timesRelevant: 0,
		notes: 'Too niche for Indeed. Zero results standalone. May work on LinkedIn or company career pages. Keep for targeted searches.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-fullstack',
		title: 'Full Stack Engineer',
		source: 'indeed',
		verdict: 'sometimes',
		timesSearched: 2,
		timesRelevant: 1,
		notes: 'Generic. Google Payments Full Stack came up. Produces P3 results, not P1. Use as fallback only.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-tech-lead',
		title: 'Technical Lead',
		source: 'indeed',
		verdict: 'sometimes',
		timesSearched: 1,
		timesRelevant: 1,
		notes: 'Google Tech Lead Prototyping Workflows hit. Results are mixed — lots of non-engineering "lead" roles.',
		lastUsed: '2026-03-21'
	},

	// === NEVER — these waste searches ===
	{
		id: 'ta-chromecast-dev',
		title: 'Chromecast Developer',
		source: 'custom',
		verdict: 'never',
		timesSearched: 2,
		timesRelevant: 0,
		notes: 'Zero results on Indeed. Too niche. Cast expertise is a differentiator to highlight in applications, not a search keyword.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-senior-frontend-philly',
		title: 'Senior Frontend Engineer (Philadelphia)',
		source: 'custom',
		verdict: 'never',
		timesSearched: 1,
		timesRelevant: 0,
		notes: 'Philly market is dead for this query. Only returned 1 result (Ruby on Rails, below floor). Search remote instead.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-cast-developer',
		title: 'Cast Application Framework',
		source: 'custom',
		verdict: 'never',
		timesSearched: 1,
		timesRelevant: 0,
		notes: 'Way too specific for Indeed. Use on LinkedIn or Google careers directly.',
		lastUsed: '2026-03-21'
	},
	{
		id: 'ta-dash-engineer',
		title: 'MPEG-DASH Engineer',
		source: 'custom',
		verdict: 'never',
		timesSearched: 1,
		timesRelevant: 0,
		notes: 'No results. Protocol-level searches do not work on Indeed. Look for "video" or "streaming" instead.',
		lastUsed: '2026-03-21'
	}
];
