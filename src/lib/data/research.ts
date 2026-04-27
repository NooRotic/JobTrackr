import type { ResearchEntry } from './types';

export const research: ResearchEntry[] = [
	{
		id: 'res-001',
		title: 'Initial Job Searches — Video, Frontend, Chromecast',
		date: '2026-03-21',
		category: 'job-search',
		sources: ['Indeed', 'Greenhouse'],
		companies: ['NovaByte', 'StreamLine', 'Axiom Labs'],
		highlights: [
			'5 searches across core title variants',
			'Chromecast Developer yielded fewest results — niche',
			'Senior Video Engineer had strongest signal'
		],
		leadsFound: 12,
		tierACount: 3
	},
	{
		id: 'res-002',
		title: 'YouTube & Netflix Deep Research',
		date: '2026-03-23',
		category: 'company-deep-dive',
		sources: ['Greenhouse', 'Netflix Jobs', 'Google Careers'],
		companies: ['YouTube', 'Netflix'],
		highlights: [
			'Netflix has 6+ player/streaming roles open',
			'YouTube OTT roles require on-site (San Bruno/NYC)',
			'Netflix comp range $388-558k for SWE 4/5'
		],
		leadsFound: 8,
		tierACount: 4
	},
	{
		id: 'res-003',
		title: 'Broad Video Company Sweep',
		date: '2026-03-26',
		category: 'wide-sweep',
		sources: ['Indeed', 'Greenhouse', 'LinkedIn', 'Company sites'],
		companies: ['TikTok', 'Mux', 'Brightcove', 'Roku', 'Crunchyroll'],
		highlights: [
			'Expanded beyond top-tier to mid-market video companies',
			'Mux and Brightcove have strong streaming infra roles',
			'Roku/Crunchyroll roles are on-site heavy'
		],
		leadsFound: 10,
		tierACount: 2
	},
	{
		id: 'res-004',
		title: 'Session 7 Wide Sweep',
		date: '2026-04-03',
		category: 'wide-sweep',
		session: 'Session 7',
		sources: ['Indeed', 'Greenhouse', 'Dice', 'LinkedIn', 'Ashby', 'Workable'],
		companies: ['eBay', 'Machinify', 'Anthropic', 'YouTube'],
		highlights: [
			'eBay Live — Staff Frontend, strong video overlap',
			'Machinify — two frontend roles, good comp ($200-245k)',
			'First non-video-specific roles added to pipeline'
		],
		leadsFound: 15,
		tierACount: 4
	},
	{
		id: 'res-005',
		title: 'Session 12 Wide Sweep',
		date: '2026-04-10',
		category: 'wide-sweep',
		session: 'Session 12',
		sources: ['Indeed', 'Greenhouse', 'Dice', 'LinkedIn'],
		companies: ['Flock Safety', 'Disney', 'TextNow', 'Resultstack'],
		highlights: [
			'Disney Web Player roles discovered — direct domain match',
			'Flock Safety VMS — video + IoT, strong fit',
			'Expanded to include B-tier roles below salary floor'
		],
		leadsFound: 12,
		tierACount: 3
	}
];
