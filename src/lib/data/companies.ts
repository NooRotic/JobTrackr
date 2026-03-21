import type { CompanyResearch } from './types';

export const companies: CompanyResearch[] = [
	{
		id: 'co-001',
		name: 'Mux',
		rating: 4.7,
		salaryRange: '$180,000 – $220,000/yr',
		location: 'San Francisco, CA',
		remote: true,
		size: '200–500',
		industry: 'Video Infrastructure / Developer Tools',
		culture: 'Engineering-first, high autonomy, strong async culture',
		pros: [
			'Top-tier video infra company',
			'Developer-first product philosophy',
			'Strong engineering blog and OSS presence',
			'Competitive comp + equity',
			'Fully remote'
		],
		cons: ['Series C — some scaling pains', 'Smaller team = more scope per person'],
		notes:
			'Best possible fit for video engineering background. HLS/DASH expertise directly relevant. Active Mux player contributor community.',
		dateResearched: '2026-03-15'
	},
	{
		id: 'co-002',
		name: 'CastLabs',
		rating: 4.2,
		salaryRange: '$160,000 – $190,000/yr',
		location: 'Berlin, Germany (Remote-global)',
		remote: true,
		size: '100–200',
		industry: 'Video Streaming / DRM / Smart TV',
		culture: 'International team, async-first, deep technical focus',
		pros: [
			'Chromecast CAF expertise highly valued',
			'Smart TV + streaming specialization',
			'Established in DRM/CDN space',
			'Remote-global team'
		],
		cons: ['European HQ — some timezone friction', 'Niche market may limit growth'],
		notes:
			'Strong Chromecast angle. Job listing explicitly mentions CAF. Worth prioritizing given unique skill match.',
		dateResearched: '2026-03-19'
	},
	{
		id: 'co-003',
		name: 'Wistia',
		rating: 4.5,
		salaryRange: '$160,000 – $195,000/yr',
		location: 'Cambridge, MA',
		remote: true,
		size: '100–200',
		industry: 'Video Marketing / SaaS',
		culture: 'Creative, maker culture, strong brand identity, remote-friendly',
		pros: [
			'Video-first product company',
			'Strong engineering culture and blog',
			'Stable, profitable SaaS',
			'Remote-friendly'
		],
		cons: [
			'Marketing video focus (not streaming/broadcast)',
			'Smaller eng team than ideal',
			'Not a pure engineering-led company'
		],
		notes:
			'Good fit for frontend video skills. Not a streaming platform per se — more video for marketing. Still strong match for player engineering.',
		dateResearched: '2026-03-21'
	},
	{
		id: 'co-004',
		name: 'Peacock (NBCUniversal)',
		rating: 3.8,
		salaryRange: '$175,000 – $210,000/yr',
		location: 'New York, NY',
		remote: false,
		size: '10,000+',
		industry: 'Streaming / Broadcast Media',
		culture: 'Large corp culture, moving fast on streaming competitive pressure',
		pros: [
			'Top streaming platform engineering problems',
			'Great comp range',
			'Resume credibility — major media company',
			'Scale and technical challenges'
		],
		cons: [
			'In-office in NYC — commute issue from Philly',
			'Large corp = bureaucracy',
			'Streaming wars may affect budget'
		],
		notes:
			'Would be a dream role technically, but NYC office requirement is a real barrier. Need to ask directly about hybrid/remote before applying.',
		dateResearched: '2026-03-21'
	},
	{
		id: 'co-005',
		name: 'Brightcove',
		rating: 3.5,
		salaryRange: '$150,000 – $200,000/yr',
		location: 'Boston, MA',
		remote: true,
		size: '500–1,000',
		industry: 'Video Cloud / Enterprise Streaming',
		culture: 'Established player, slower innovation pace in recent years',
		pros: [
			'Market leader in enterprise video',
			'Video player engineering is core to product',
			'Name recognition in media industry'
		],
		cons: [
			'Passed on application — asked for Go backend',
			'Growth trajectory unclear',
			'Culture reviews mixed on innovation pace'
		],
		notes:
			'Applied Feb 2026, rejected after screen. Feedback: Go backend required. Re-evaluate in 6 months if Go skills improve.',
		dateResearched: '2026-02-08'
	},
	{
		id: 'co-006',
		name: 'Uber',
		rating: 3.9,
		salaryRange: '$198,000 – $242,000/yr',
		location: 'Seattle, WA',
		remote: false,
		size: '10,000+',
		industry: 'Rideshare / Technology',
		culture: 'High performance, competitive, fast-moving',
		pros: ['Top-tier comp', 'Massive engineering scale', 'Name brand for resume'],
		cons: [
			'Seattle office — not remote',
			'Unknown if streaming team specifically',
			'Large corp culture',
			'Relocation would be required'
		],
		notes:
			'Great comp. Need to confirm: is this the live video/streaming team or unrelated infra? JD review pending.',
		dateResearched: '2026-03-21'
	}
];
