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
 * Example company targets. Replace with your own target companies.
 */
export const companyTargets: CompanyTarget[] = [
	{
		id: 'target-example-co',
		name: 'Example Corp',
		slug: 'example-corp',
		description:
			'A large technology company with engineering offices worldwide. Strong engineering culture with a focus on developer experience and platform tooling.',
		industry: 'Technology',
		location: 'San Francisco, CA',
		avgSalary: '$195,000/yr (Sr SWE average)',
		ceoApproval: 78,
		recommendToFriend: 82,
		interviewDifficulty: 'Medium, ~2 weeks',
		companyPageUrl: null,
		logoUrl: null,
		whyTarget:
			'Strong engineering culture, competitive comp, interesting technical challenges at scale. Platform team works on tools used by thousands of engineers.',
		fitAngle:
			'Frontend expertise, TypeScript depth, experience building developer tools and debugging infrastructure.',
		jobs: [
			{
				id: 'ex-001',
				role: 'Senior Software Engineer, Platform',
				company: 'Example Corp',
				salary: '$180,000 – $240,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-15',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Platform team — developer tooling and infrastructure. Strong match for debugging/tooling background.'
			},
			{
				id: 'ex-002',
				role: 'Senior Frontend Engineer, Design Systems',
				company: 'Example Corp',
				salary: '$170,000 – $230,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-18',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Design systems team. React + TypeScript. Remote option available.'
			},
			{
				id: 'ex-003',
				role: 'Software Engineer III, Mobile',
				company: 'Example Corp',
				salary: '$150,000 – $200,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-10',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Mobile-focused, not web. Different stack.'
			}
		],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-streamify',
		name: 'Streamify',
		slug: 'streamify',
		description:
			'A mid-size streaming platform with 500+ employees. Known for engineering innovation and a fast-paced product culture. Competitive comp and strong remote policy.',
		industry: 'Media & Streaming',
		location: 'Austin, TX',
		avgSalary: '$185,000/yr (Sr SWE average)',
		ceoApproval: 72,
		recommendToFriend: 68,
		interviewDifficulty: 'Medium, ~1 week',
		companyPageUrl: null,
		logoUrl: null,
		whyTarget:
			'Growing streaming platform with interesting video delivery challenges. Smaller team means more ownership and impact per engineer.',
		fitAngle:
			'Frontend expertise with media playback experience. TypeScript-first stack aligns well.',
		jobs: [],
		dateResearched: '2026-03-21'
	}
];
