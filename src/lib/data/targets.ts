import type { CompanyTarget, SearchResult } from './types';

/**
 * Job title categories to use when targeting a company.
 * Toggle these on/off in the UI. Customize to match your profile.
 */
export const jobTitleCategories = [
	{ id: 'sse', label: 'Senior Software Engineer', keywords: 'Senior Software Engineer', default: true },
	{ id: 'frontend', label: 'Frontend Engineer', keywords: 'Frontend Engineer', default: true },
	{ id: 'fullstack', label: 'Full Stack Engineer', keywords: 'Full Stack Engineer', default: false },
	{ id: 'web-dev', label: 'Senior Web Developer', keywords: 'Senior Web Developer', default: true },
	{ id: 'tech-lead', label: 'Technical Lead', keywords: 'Technical Lead', default: false },
	{ id: 'backend', label: 'Backend Engineer', keywords: 'Backend Engineer', default: false },
];

/**
 * Calculate a confidence % for how well a job matches the user's profile.
 * Customize the scoring weights to match your own strengths.
 */
export function calculateConfidence(result: SearchResult): number {
	let score = 0;
	const title = result.role.toLowerCase();

	// Title keyword matching (max 35 pts)
	if (title.includes('senior') || title.includes('sr.') || title.includes('sr ')) score += 18;
	else if (title.includes('staff')) score += 20;
	else if (title.includes('lead')) score += 16;
	else if (title.includes('ii') || title.includes('iii')) score += 10;

	// Role type (max 15 pts)
	if (title.includes('software engineer')) score += 15;
	else if (title.includes('developer')) score += 12;
	else if (title.includes('engineer')) score += 10;

	// Frontend signal (max 15 pts) — customize for your domain
	if (title.includes('frontend') || title.includes('front end') || title.includes('web')) score += 15;
	else if (title.includes('full stack') || title.includes('fullstack')) score += 10;

	// Negative signals
	if (title.includes('junior') || title.includes('intern')) score -= 20;
	if (title.includes('manager') || title.includes('director')) score -= 15;

	// Salary (max 15 pts)
	const salaryMatch = result.salary.match(/\$(\d[\d,]*)/);
	if (salaryMatch) {
		const low = parseInt(salaryMatch[1].replace(/,/g, ''));
		if (low >= 170000) score += 15;
		else if (low >= 150000) score += 12;
		else if (low >= 120000) score += 8;
		else score += 3;
	}

	// Remote bonus (5 pts)
	if (result.remote) score += 5;

	return Math.max(0, Math.min(100, score));
}

/**
 * Derive priority from confidence score
 */
export function priorityFromConfidence(confidence: number): 'P1' | 'P2' | 'P3' | 'SKIP' {
	if (confidence >= 65) return 'P1';
	if (confidence >= 45) return 'P2';
	if (confidence >= 25) return 'P3';
	return 'SKIP';
}

/**
 * Company targets — companies actively hunted for open roles.
 */
export const companyTargets: CompanyTarget[] = [
	{
		id: 'target-novabyte',
		name: 'NovaByte',
		slug: 'novabyte',
		description:
			'NovaByte is a large developer tools company with 800–1,200 employees. They build collaborative coding infrastructure used by millions of developers globally. Known for a strong engineering culture, top-of-market comp, and a fully remote workforce.',
		industry: 'Developer Tools',
		location: 'Remote (HQ: San Francisco, CA)',
		avgSalary: '$195,000/yr (Sr SWE average)',
		ceoApproval: 81,
		recommendToFriend: 85,
		interviewDifficulty: 'Medium-Hard, ~3 weeks',
		companyPageUrl: '#',
		logoUrl: null,
		whyTarget:
			'Top-of-market comp, strong TypeScript culture, and genuinely hard frontend problems at scale. Platform team works on infrastructure that thousands of developers use daily. High engineering bar means strong peers.',
		fitAngle:
			'Deep React + TypeScript experience, performance optimization background, and interest in developer tooling align well with their platform team focus.',
		jobs: [
			{
				id: 'nb-001',
				role: 'Senior Frontend Engineer',
				company: 'NovaByte',
				salary: '$175,000 – $215,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-20',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Product team — consumer-facing UI. React + TypeScript. 5M+ DAU surface.'
			},
			{
				id: 'nb-002',
				role: 'Frontend Platform Engineer',
				company: 'NovaByte',
				salary: 'Not listed',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-14',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Platform team. Internal tooling + shared component systems. High ownership.'
			},
			{
				id: 'nb-003',
				role: 'Full Stack Engineer — Growth',
				company: 'NovaByte',
				salary: '$160,000 – $200,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-11',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Growth team. More A/B testing than product eng. Secondary target if P1s fall through.'
			},
			{
				id: 'nb-004',
				role: 'iOS Engineer',
				company: 'NovaByte',
				salary: '$170,000 – $210,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-08',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Mobile native — not web. Different stack entirely.'
			}
		],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-streamline',
		name: 'StreamLine',
		slug: 'streamline',
		description:
			'StreamLine is a mid-size streaming media company with 400–700 employees. They deliver live and on-demand video to 10M+ concurrent viewers. The engineering team is split between player/client, backend streaming infrastructure, and the web dashboard.',
		industry: 'Media & Streaming',
		location: 'Remote (HQ: Austin, TX)',
		avgSalary: '$210,000/yr (Sr SWE average)',
		ceoApproval: 74,
		recommendToFriend: 71,
		interviewDifficulty: 'Medium, ~2 weeks',
		companyPageUrl: '#',
		logoUrl: null,
		whyTarget:
			'Real video streaming challenges at scale — player performance, adaptive bitrate, live event delivery. The web team owns surfaces that millions of viewers see. Strong comp and growing headcount.',
		fitAngle:
			'Media playback experience, frontend performance optimization, and TypeScript depth are exactly what their web player and dashboard teams need.',
		jobs: [
			{
				id: 'sl-001',
				role: 'Senior Software Engineer — Streaming',
				company: 'StreamLine',
				salary: '$195,000 – $250,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-16',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Player team. Video delivery, adaptive bitrate, low-latency live streaming.',
				jobDescription: `StreamLine is looking for a Senior Software Engineer to join our Streaming team. You'll work on the core video delivery pipeline that serves 10M+ concurrent viewers across web, mobile, and connected TV.\n\nThe web player team owns the browser-based playback experience — from adaptive bitrate logic to subtitle rendering to live event handling. We work with HLS, DASH, and proprietary streaming protocols. Performance is a first-class concern.\n\nYou should have strong JavaScript/TypeScript fundamentals and ideally some exposure to media APIs (HTMLVideoElement, MSE, EME). Experience debugging browser performance and rendering pipelines is highly valued.\n\nWhat we offer: $195k–$250k base, significant equity, unlimited PTO, fully remote with flexible hours.`
			},
			{
				id: 'sl-002',
				role: 'Senior Software Engineer — UI',
				company: 'StreamLine',
				salary: '$190,000 – $245,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-18',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Dashboard and analytics UI. React + TypeScript. Strong frontend focus.'
			},
			{
				id: 'sl-003',
				role: 'Backend Engineer — Ingest',
				company: 'StreamLine',
				salary: '$180,000 – $230,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-10',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Ingest pipeline — Go + Rust. Not a frontend role. Different stack.'
			}
		],
		dateResearched: '2026-03-20'
	},
	{
		id: 'target-tensor-ui',
		name: 'Tensor UI',
		slug: 'tensor-ui',
		description:
			'Tensor UI is a small AI-powered UI tooling startup (~25 employees). They are building tools that help engineering teams design, prototype, and ship React components faster using AI assistance. Pre-Series A, strong technical founders.',
		industry: 'AI Developer Tools',
		location: 'Remote',
		avgSalary: null,
		ceoApproval: null,
		recommendToFriend: null,
		interviewDifficulty: null,
		companyPageUrl: '#',
		logoUrl: null,
		whyTarget:
			'Intersection of AI and frontend tooling — a genuinely new problem space. Early-stage means real equity upside and the ability to shape the product from the ground up.',
		fitAngle:
			'Strong React + TypeScript depth, interest in developer tooling, and experience building complex UI surfaces make this a natural fit for their core product team.',
		jobs: [],
		dateResearched: '2026-03-21'
	}
];
