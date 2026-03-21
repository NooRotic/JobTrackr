import type { CompanyResearch } from './types';

// Only companies with real Indeed research data go here.
// Company targets with deeper research live in targets.ts.
export const companies: CompanyResearch[] = [
	{
		id: 'co-001',
		name: 'NovaByte',
		rating: 4.3,
		salaryRange: '$165,000 – $225,000/yr (Senior SWE)',
		location: 'Remote',
		remote: true,
		size: '800–1,200 employees',
		industry: 'Developer Tools',
		culture:
			'Strong async culture with clear documentation standards. Engineering-led org. Regular all-hands and eng offsites twice a year.',
		pros: [
			'Engineering-led decisions, minimal process overhead',
			'Top-of-market comp with meaningful equity',
			'Fully remote with flexible hours across US timezones',
			'Active open-source presence, eng blog with real depth'
		],
		cons: [
			'High performance bar — PIP culture reported by some',
			'Growth phase means priorities shift quickly',
			'Benefits outside US can be limited for contractors'
		],
		notes:
			'Indeed rating 4.3/5 from 180 reviews. CEO approval 81%. Strong glassdoor signal for frontend team. Multiple engineers mention strong TypeScript culture.',
		dateResearched: '2026-03-21'
	},
	{
		id: 'co-002',
		name: 'StreamLine',
		rating: 4.1,
		salaryRange: '$180,000 – $255,000/yr (Senior SWE)',
		location: 'Remote (HQ: Austin, TX)',
		remote: true,
		size: '400–700 employees',
		industry: 'Media & Streaming',
		culture:
			'Fast-paced product culture. Engineering and product work closely together. Weekly demos. Bias for shipping.',
		pros: [
			'Genuinely interesting video delivery challenges at scale',
			'Competitive comp and strong equity package',
			'Remote-first with async-friendly norms',
			'Positive reviews for IC career growth and internal mobility'
		],
		cons: [
			'On-call rotations can be intense during live events',
			'Tooling debt in some older services',
			'Some reviews mention unclear promotion criteria'
		],
		notes:
			'Media streaming company serving 10M+ concurrent viewers. Active Indeed job postings suggest growth phase. Strong match for streaming/video background.',
		dateResearched: '2026-03-20'
	},
	{
		id: 'co-003',
		name: 'Axiom Labs',
		rating: 4.5,
		salaryRange: '$185,000 – $270,000/yr (Senior SWE)',
		location: 'Remote',
		remote: true,
		size: '200–400 employees',
		industry: 'Data Infrastructure',
		culture:
			'Ops-focused eng culture with strong emphasis on reliability and observability. Engineers own their surfaces end-to-end.',
		pros: [
			'Top of market comp — regularly cited in eng comp surveys',
			'High eng autonomy and real ownership',
			'Product trusted by major engineering teams — good brand signal',
			'Transparent leadership, regular eng AMAs'
		],
		cons: [
			'Small team means wearing many hats',
			'Greenfield can tip into under-resourced if not careful',
			'Some reviews: "fast pace is exciting but can be draining"'
		],
		notes:
			'4.5 Indeed rating from 95 reviews. 89% CEO approval. One of the best-rated smaller companies in the data infra space. Strong hiring signal for senior frontend.',
		dateResearched: '2026-03-19'
	},
	{
		id: 'co-004',
		name: 'CloudForge',
		rating: 3.8,
		salaryRange: '$155,000 – $210,000/yr (Senior SWE)',
		location: 'Remote (HQ: Seattle, WA)',
		remote: true,
		size: '2,000–5,000 employees',
		industry: 'Cloud Infrastructure',
		culture:
			'Mid-size company in growth phase. More process than smaller companies. Engineering culture varies significantly by team.',
		pros: [
			'Good salary range and solid benefits package',
			'Large engineering org with many growth opportunities',
			'Stable revenue base — not dependent on VC runway'
		],
		cons: [
			'Reviews mention slow promotion cycles',
			'Some teams have legacy codebases with significant technical debt',
			'Reorg risk cited in recent reviews',
			'Manager quality inconsistent across teams'
		],
		notes:
			'3.8 Indeed rating — lower than peers. Worth deep-diving team/manager during interview. Growth team role has more A/B testing focus than product engineering.',
		dateResearched: '2026-03-18'
	},
	{
		id: 'co-005',
		name: 'HexGrid',
		rating: 4.6,
		salaryRange: '$175,000 – $235,000/yr (Senior SWE)',
		location: 'Remote',
		remote: true,
		size: '30–80 employees',
		industry: 'Developer Tools / Infrastructure',
		culture:
			'Early-stage startup culture with strong engineering standards. Small team, high ownership, async default. Docs-first.',
		pros: [
			'Meaningful equity at an early stage',
			'Very high ownership — you build and ship real product surfaces',
			'Async-friendly remote culture with excellent documentation norms',
			'TypeScript-first stack (Next.js, tRPC, Prisma, Bun)'
		],
		cons: [
			'Small team = limited redundancy if someone leaves',
			'Benefits may be lighter than large-company peers',
			'Runway dependent on next funding round'
		],
		notes:
			'Only 40 reviews on Indeed but 4.6 average — strong signal for small co. Recently raised Series A. Team is 12 engineers. Very strong TypeScript culture match.',
		dateResearched: '2026-03-20'
	},
	{
		id: 'co-006',
		name: 'DataWeave',
		rating: 3.9,
		salaryRange: '$160,000 – $215,000/yr (Senior SWE)',
		location: 'Remote (HQ: New York, NY)',
		remote: true,
		size: '500–900 employees',
		industry: 'Data Analytics',
		culture:
			'Product-driven culture with strong data science influence. Engineering is well-respected but data science leads roadmap priorities.',
		pros: [
			'Interesting data visualization and analytics UI challenges',
			'Competitive comp with annual bonus',
			'Good remote-first infrastructure and async tooling'
		],
		cons: [
			'Frontend often seen as secondary to data science priorities',
			'Some reviews mention slow decision-making at leadership level',
			'Mixed reviews on work-life balance in crunch periods'
		],
		notes:
			'Offer received here ($192k). Good company but frontend may not be the core product focus. Compare culture against Axiom Labs and HexGrid before deciding.',
		dateResearched: '2026-03-15'
	}
];
