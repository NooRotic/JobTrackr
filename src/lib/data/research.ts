import type { ResearchEntry } from './types';

// Demo research entries — public-safe fictional data shipped with the repo.
// Real research lives in personal/research.ts (gitignored).
export const research: ResearchEntry[] = [
	{
		id: 'res-001',
		title: 'Initial Sweep — Frontend, Platform, Streaming',
		date: '2026-03-21',
		category: 'job-search',
		sources: ['Indeed', 'Greenhouse'],
		companies: ['NovaByte', 'StreamLine', 'Axiom Labs'],
		highlights: [
			'5 searches across senior frontend + streaming variants',
			'Niche keyword searches yielded fewest results — narrow funnel',
			'"Senior Streaming Engineer" had strongest signal-to-noise'
		],
		leadsFound: 12,
		tierACount: 3
	},
	{
		id: 'res-002',
		title: 'Deep Dive — Top-Tier Streaming Companies',
		date: '2026-03-23',
		category: 'company-deep-dive',
		sources: ['Greenhouse', 'Company Careers Pages'],
		companies: ['StreamLine', 'HexGrid'],
		highlights: [
			'StreamLine has 6+ player/platform roles open',
			'HexGrid OTT roles mostly require on-site',
			'StreamLine comp range $195-250k for Senior SWE'
		],
		leadsFound: 8,
		tierACount: 4
	},
	{
		id: 'res-003',
		title: 'Mid-Market Video Company Sweep',
		date: '2026-03-26',
		category: 'wide-sweep',
		sources: ['Indeed', 'Greenhouse', 'LinkedIn', 'Company sites'],
		companies: ['TerraScale', 'ChromaCast', 'BluePeak', 'CipherWave'],
		highlights: [
			'Expanded beyond top-tier to mid-market video infra companies',
			'ChromaCast and CipherWave have strong streaming infra roles',
			'TerraScale and BluePeak are on-site heavy'
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
		companies: ['PixelHelm', 'OrbitMint', 'NovaByte', 'StreamLine'],
		highlights: [
			'PixelHelm Live — Staff Frontend, strong video overlap',
			'OrbitMint — two frontend roles, good comp ($200-245k)',
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
		companies: ['Axiom Labs', 'HexGrid', 'TerraScale', 'ChromaCast'],
		highlights: [
			'HexGrid Web Player roles discovered — direct domain match',
			'Axiom Labs platform team — video + analytics, strong fit',
			'Expanded to include B-tier roles below salary floor'
		],
		leadsFound: 12,
		tierACount: 3
	}
];
