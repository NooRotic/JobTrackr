import type { CompanyTarget, SearchResult } from './types';

/**
 * Job title categories Indeed uses that match Walter's profile.
 * These are used as search terms when targeting a company.
 */
export const jobTitleCategories = [
	{ id: 'sse', label: 'Senior Software Engineer', keywords: 'Senior Software Engineer', default: true },
	{ id: 'video', label: 'Video Engineer', keywords: 'Video Engineer', default: true },
	{ id: 'frontend', label: 'Frontend Engineer', keywords: 'Frontend Engineer', default: true },
	{ id: 'web-dev', label: 'Senior Web Developer', keywords: 'Senior Web Developer', default: true },
	{ id: 'tech-lead', label: 'Technical Lead', keywords: 'Technical Lead', default: false },
	{ id: 'streaming', label: 'Streaming Engineer', keywords: 'Streaming Engineer', default: true },
	{ id: 'fullstack', label: 'Full Stack Engineer', keywords: 'Full Stack Engineer', default: false },
	{ id: 'player', label: 'Video Player Engineer', keywords: 'Video Player Engineer', default: true },
];

/**
 * Calculate a confidence % for how well a job matches Walter's profile.
 * Based on: title keywords, salary, video/streaming relevance, seniority.
 */
export function calculateConfidence(result: SearchResult): number {
	let score = 0;
	const title = result.role.toLowerCase();
	const notes = result.notes.toLowerCase();

	// Title keyword matching (max 40 pts)
	if (title.includes('video')) score += 30;
	else if (title.includes('streaming') || title.includes('media') || title.includes('player')) score += 28;
	else if (title.includes('cast') || title.includes('chromecast')) score += 35;
	else if (title.includes('frontend') || title.includes('front end') || title.includes('web')) score += 18;
	else if (title.includes('full stack') || title.includes('fullstack')) score += 15;

	if (title.includes('playback')) score += 10;

	// Seniority (max 20 pts)
	if (title.includes('senior staff') || title.includes('staff')) score += 20;
	else if (title.includes('senior') || title.includes('sr.') || title.includes('sr ')) score += 18;
	else if (title.includes('lead')) score += 16;
	else if (title.includes('ii') || title.includes('iii')) score += 10;

	// Role type fit (max 15 pts)
	if (title.includes('software engineer')) score += 15;
	else if (title.includes('developer')) score += 12;
	else if (title.includes('engineer')) score += 10;

	// Negative signals (subtract)
	if (title.includes('android') || title.includes('ios') || title.includes('mobile')) score -= 15;
	if (title.includes('ml') || title.includes('ai/ml') || title.includes('machine learning')) score -= 10;
	if (title.includes('manager') || title.includes('product') || title.includes('designer')) score -= 20;
	if (title.includes('data') || title.includes('cloud') || title.includes('devops')) score -= 15;
	if (title.includes('producer') || title.includes('content design') || title.includes('ux content')) score -= 20;

	// Salary (max 15 pts)
	const salaryMatch = result.salary.match(/\$(\d[\d,]*)/);
	if (salaryMatch) {
		const low = parseInt(salaryMatch[1].replace(/,/g, ''));
		if (low >= 174000) score += 15;
		else if (low >= 160000) score += 12;
		else if (low >= 140000) score += 8;
		else score += 3;
	}

	// Remote bonus (5 pts)
	if (result.remote) score += 5;

	// Notes signals (max 5 pts)
	if (notes.includes('video') || notes.includes('playback') || notes.includes('streaming')) score += 5;

	// Clamp to 0-100
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

export const companyTargets: CompanyTarget[] = [
	{
		id: 'target-youtube',
		name: 'YouTube',
		slug: 'youtube',
		description:
			"American video-sharing platform and Google subsidiary. HQ in San Bruno, CA. The world's largest video platform — their player, adaptive streaming (VP9/AV1 over DASH), ad insertion, and Cast SDK are all relevant to your background.",
		industry: 'Information Technology / Video Platform',
		location: 'San Bruno, CA',
		avgSalary: '$202,568/yr (Sr SWE average)',
		ceoApproval: 70,
		recommendToFriend: 75,
		interviewDifficulty: 'Easy (per Indeed data)',
		companyPageUrl: 'https://www.indeed.com/cmp/Youtube',
		logoUrl: null,
		whyTarget:
			"YouTube IS the video platform. Your 13 years as Xfinity Stream SME + Chromecast lead at Comcast is directly transferable. YouTube's player, adaptive streaming, ad insertion, and Cast SDK integration are all in your wheelhouse.",
		fitAngle:
			'Video player expertise, HLS/DASH ABR, Cast SDK (YouTube uses Cast natively), ad tech (SSAI/DAI), debugging tooling at scale.',
		jobs: [
			{
				id: 'yt-sr-staff-video-playback',
				role: 'Senior Staff Software Engineer, Video Playback, YouTube',
				company: 'YouTube',
				salary: '$262,000 – $365,000/yr',
				location: 'San Bruno, CA',
				remote: false,
				postedDate: '2026-01-29',
				url: 'https://to.indeed.com/aavv9lqjlbn7',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'VIDEO PLAYBACK at YouTube. This is the dream role. Sr Staff level, $262-365k. Exactly your domain — video player engineering at the largest video platform in the world.'
			},
			{
				id: 'yt-sr-infra',
				role: 'Senior Software Engineer, Infrastructure, YouTube',
				company: 'YouTube',
				salary: '$174,000 – $252,000/yr',
				location: 'San Bruno, CA',
				remote: false,
				postedDate: '2026-02-24',
				url: 'https://to.indeed.com/aasvbhs622bd',
				fit: 'NEEDS_REVIEW',
				priority: 'P2',
				notes: 'YouTube Infrastructure team. Not video playback specifically but infra at YouTube likely touches video delivery pipeline. Worth pulling JD.'
			},
			{
				id: 'yt-ai-ml-recs',
				role: 'Senior Software Engineer, AI/ML Recommendations, Rankings, Predictions, YouTube',
				company: 'YouTube',
				salary: '$174,000 – $252,000/yr',
				location: 'San Bruno, CA',
				remote: false,
				postedDate: '2026-03-02',
				url: 'https://to.indeed.com/aa2btxqzl4xj',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'AI/ML Recommendations — not your stack. ML model training is an honest gap.'
			},
			{
				id: 'yt-ai-ml',
				role: 'Senior Software Engineer, AI/ML, YouTube',
				company: 'YouTube',
				salary: '$174,000 – $252,000/yr',
				location: 'San Bruno, CA',
				remote: false,
				postedDate: '2026-02-16',
				url: 'https://to.indeed.com/aagr2x7nj6nj',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'AI/ML at YouTube — again, ML is an honest gap.'
			},
			{
				id: 'g-metering',
				role: 'Senior Software Engineer, Metering Solutions',
				company: 'Google',
				salary: '$174,000 – $252,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-02-11',
				url: 'https://to.indeed.com/aav2cpfpnq4b',
				fit: 'NEEDS_REVIEW',
				priority: 'P3',
				notes: 'Metering = usage/billing metrics. Could touch video consumption data. Generic Google role, not YouTube-branded.'
			},
			{
				id: 'g-ux-eng',
				role: 'Senior UX Engineer, Marketing Technology and Operations',
				company: 'Google',
				salary: '$159,000 – $231,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-05',
				url: 'https://to.indeed.com/aa2h62bfqvk4',
				fit: 'MEDIUM',
				priority: 'P3',
				notes: 'UX Engineer — frontend-heavy, marketing tech. You could do this but not your strongest play.'
			},
			{
				id: 'g-tech-lead-prototyping',
				role: 'Technical Lead, Prototyping Workflows',
				company: 'Google',
				salary: '$207,000 – $300,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-02-26',
				url: 'https://to.indeed.com/aapyp4rc7tlg',
				fit: 'NEEDS_REVIEW',
				priority: 'P2',
				notes: 'Tech Lead at Google, strong comp ($207-300k). Prototyping Workflows — could involve frontend tooling. Need JD.'
			},
			{
				id: 'g-fullstack-payments',
				role: 'Senior Software Engineer, Full Stack, Google Payments',
				company: 'Google',
				salary: '$174,000 – $252,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-13',
				url: 'https://to.indeed.com/aapvnzf9b6qx',
				fit: 'MEDIUM',
				priority: 'P3',
				notes: 'Full Stack at Google Payments. Not video but full stack JS is in your range. P3 — you could do this.'
			}
		],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-twitch',
		name: 'Twitch',
		slug: 'twitch',
		description:
			"World's largest live streaming platform, owned by Amazon. HQ at 350 Bush St, San Francisco, CA. 1,001-5,000 employees. Founded 2011. Jobs post under Amazon.com on Indeed. Live streaming is Twitch's entire product — HLS delivery, real-time video, chat, and streamer tooling at massive scale.",
		industry: 'Media & Communication',
		location: 'San Francisco, CA',
		avgSalary: '$212,809/yr (Sr SWE average)',
		ceoApproval: 57,
		recommendToFriend: 73,
		interviewDifficulty: 'Easy (per Indeed data)',
		companyPageUrl: 'https://www.indeed.com/cmp/Twitch',
		logoUrl: null,
		whyTarget:
			"Walter built live streaming with Constellation.tv, built Twitch integrations (ReactPlayer Twitch support, twitch-glazer), and has deep real-time video experience. Twitch uses HLS for live delivery — Walter's exact domain. Dream company #1.",
		fitAngle:
			'Live streaming (HLS), video player expertise, Twitch integration experience (built twitch-glazer + ReactPlayer Twitch support), real-time video at scale, Chromecast/Cast SDK.',
		jobs: [
			{
				id: 'twitch-swe-chat',
				role: 'Software Engineer I, Twitch Chat',
				company: 'Amazon.com',
				salary: '$127,100 – $185,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-06',
				url: 'https://to.indeed.com/aaqhftkx2jwc',
				fit: 'NEEDS_REVIEW',
				priority: 'P3',
				notes: 'Chat team, not video — but a foot in the door at Twitch. SWE I title (junior branding, Amazon style). Below salary floor but watch for Sr-level reposts.'
			},
			{
				id: 'twitch-swe-engagement-growth',
				role: 'Software Engineer I, Engagement Growth',
				company: 'Amazon.com',
				salary: '$127,100 – $185,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-21',
				url: 'https://to.indeed.com/aahx269xd6rf',
				fit: 'LOW',
				priority: 'P3',
				notes: 'Growth engineering, not video. Below salary floor. Foot-in-door option only.'
			},
			{
				id: 'twitch-swe-community-growth',
				role: 'Software Engineer I, Community Growth',
				company: 'Amazon.com',
				salary: '$127,100 – $185,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-19',
				url: 'https://to.indeed.com/aaz44mdq6x7w',
				fit: 'LOW',
				priority: 'P3',
				notes: 'Community growth, not video. Below salary floor. Same pattern as the other SWE I roles — Amazon uses junior titles at Twitch.'
			},
			{
				id: 'twitch-swe-streamer-monetization',
				role: 'Software Engineer I, Streamer Monetization Experience',
				company: 'Amazon.com',
				salary: '$127,100 – $185,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-20',
				url: 'https://to.indeed.com/aazhjyjklz6k',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Streamer-facing product — touches the video experience pipeline. Monetization on Twitch intersects with ad tech, which is in your wheelhouse. Still below floor on salary.'
			},
			{
				id: 'twitch-sdm-creator-sponsorships',
				role: 'Sr. Software Development Manager, Creator Sponsorships',
				company: 'Amazon.com',
				salary: '$212,700 – $287,700/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-13',
				url: 'https://to.indeed.com/aaqw2b4cfl2j',
				fit: 'NEEDS_REVIEW',
				priority: 'P2',
				notes: 'Senior-level comp ($212-287k), management role. Above salary floor. Sponsorships/ad product at Twitch — ad tech angle is relevant. Management track, not IC. Review JD carefully.'
			},
			{
				id: 'twitch-swe-creator-sponsorships',
				role: 'Software Engineer, Creator Sponsorships',
				company: 'Amazon.com',
				salary: '$127,100 – $185,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-11',
				url: 'https://to.indeed.com/aann7hw2pp78',
				fit: 'LOW',
				priority: 'P3',
				notes: 'Sponsorships IC engineer. Below salary floor. No video specifics. Watch for Sr-level video/player roles — none found today.'
			}
		],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-netflix',
		name: 'Netflix',
		slug: 'netflix',
		description:
			'Global streaming leader. HQ at 121 Albright Way, Los Gatos, CA. 5,001-10,000 employees, $10B+ revenue. Founded 1997, CEO Ted Sarandos. Netflix pioneered streaming and built one of the most sophisticated ABR video players in the world. They use MPEG-DASH exclusively (not HLS).',
		industry: 'Information Technology / Streaming',
		location: 'Los Gatos, CA',
		avgSalary: '$295,707/yr (Sr SWE average)',
		ceoApproval: 72,
		recommendToFriend: 74,
		interviewDifficulty: 'Medium, ~2 weeks (per Indeed data)',
		companyPageUrl: 'https://www.indeed.com/cmp/Netflix',
		logoUrl: null,
		whyTarget:
			"Netflix pioneered streaming. Their video player team built one of the most sophisticated ABR players in the world. They use DASH exclusively — Walter has deep MPEG-DASH experience from 13 years at Comcast competing directly with Netflix.",
		fitAngle:
			'MPEG-DASH expertise (Netflix is DASH-only), video player engineering, ABR algorithms, DRM (Widevine), debugging tooling at scale, 13 years at Comcast on a competing streaming platform.',
		jobs: [],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-tiktok',
		name: 'TikTok',
		slug: 'tiktok',
		description:
			"World's largest short-form video platform, owned by ByteDance. HQ in Los Angeles, CA. 10,000+ employees. Founded 2016, CEO Shou Zi Chew. Massive video engineering challenges — encoding, delivery, player optimization for billions of videos at global scale.",
		industry: 'Internet & Web Services',
		location: 'Los Angeles, CA',
		avgSalary: '$248,373/yr (Sr SWE average)',
		ceoApproval: 71,
		recommendToFriend: 65,
		interviewDifficulty: 'Medium, ~2 weeks (per Indeed data)',
		companyPageUrl: 'https://www.indeed.com/cmp/Tiktok',
		logoUrl: null,
		whyTarget:
			"World's largest short-form video platform. Massive video engineering challenges — encoding, delivery, player optimization for billions of videos. Walter already has \"Sr SWE - Video Experience\" saved from Indeed (saved-001).",
		fitAngle:
			'Video player expertise, streaming delivery at scale, TypeScript/React frontend, Video Experience team.',
		jobs: [],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-roku',
		name: 'Roku',
		slug: 'roku',
		description:
			'#1 TV streaming platform in the US. HQ at 1155 Coleman Ave, San Jose, CA. 1,001-5,000 employees, $500M-$1B revenue. Founded 2002, CEO Anthony Wood. Roku OS powers millions of TVs. Their player ecosystem, ad platform, and device middleware directly overlap with Walter\'s Chromecast/Cast experience.',
		industry: 'Media & Communication',
		location: 'San Jose, CA',
		avgSalary: '$248,354/yr (Sr SWE average)',
		ceoApproval: 55,
		recommendToFriend: 50,
		interviewDifficulty: 'Medium, ~2 weeks (per Indeed data)',
		companyPageUrl: 'https://www.indeed.com/cmp/Roku-1',
		logoUrl: null,
		whyTarget:
			"#1 TV streaming platform in the US. Chromecast → Roku is a direct lateral transfer. Cast SDK → Roku SDK. Video player engineering, ad tech (SSAI/DAI), device-level debugging — Walter's exact background.",
		fitAngle:
			'Chromecast → Roku direct lateral, Cast SDK → Roku SDK, video player engineering, ad tech (SSAI/DAI), device-level debugging, smart TV platform experience.',
		jobs: [],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-crunchyroll',
		name: 'Crunchyroll',
		slug: 'crunchyroll',
		description:
			"World's largest anime streaming platform. HQ in San Francisco, CA. 501-1,000 employees, $500M-$1B revenue. Founded 2006. AVOD + SVOD model — same business model as Xfinity Stream. Video delivery, player, and ad insertion are core to their product.",
		industry: 'Media & Communication',
		location: 'San Francisco, CA',
		avgSalary: '$172,932/yr (Sr SWE average)',
		ceoApproval: 41,
		recommendToFriend: 54,
		interviewDifficulty: 'Hard, ~2 weeks (per Indeed data)',
		companyPageUrl: 'https://www.indeed.com/cmp/Crunchyroll',
		logoUrl: null,
		whyTarget:
			"World's largest anime streaming platform. AVOD + SVOD model is the same as Xfinity Stream. Video delivery, player, and ad insertion are core to their product. Walter's Comcast AVOD experience is a direct match.",
		fitAngle:
			'Video player (HLS/DASH), AVOD/SVOD experience from Comcast, ad insertion (DAI/SSAI/CSAI), streaming delivery, DRM. Niche platform but video engineering is universal.',
		jobs: [],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-tubi',
		name: 'Tubi',
		slug: 'tubi',
		description:
			'Free ad-supported streaming (FAST/AVOD), owned by Fox. HQ in San Francisco, CA. 51-200 employees — a small team where seniority has outsized impact. Founded 2014. Walter already saved "Sr SWE, Video Player" at Tubi (since expired). Watch for repost.',
		industry: 'Media & Communication',
		location: 'San Francisco, CA',
		avgSalary: '$165,449/yr (Sr SWE average)',
		ceoApproval: 63,
		recommendToFriend: 50,
		interviewDifficulty: 'Medium, quick turnaround 1-2 days (per Indeed data)',
		companyPageUrl: 'https://www.indeed.com/cmp/Tubi',
		logoUrl: null,
		whyTarget:
			"Video player engineering is Tubi's core product. AVOD model means ad tech expertise matters enormously. Small team (51-200) where Walter's 25 years of video experience would have massive impact. Fox-owned adds stability.",
		fitAngle:
			'Video player engineering is their core product, AVOD/ad tech expertise, small team = big impact, Fox ownership = stable backing.',
		jobs: [],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-paramount',
		name: 'Paramount Global',
		slug: 'paramount',
		description:
			'Major media conglomerate owning Paramount+, CBS, MTV, Nickelodeon, and more. HQ in New York, NY. Paramount+ is a major streaming platform competing directly with Netflix and Xfinity Stream. Note: Indeed\'s "Paramount" company listing returns a construction company — no Indeed data available for Paramount Global.',
		industry: 'Media & Communication',
		location: 'New York, NY',
		avgSalary: null,
		ceoApproval: null,
		recommendToFriend: null,
		interviewDifficulty: null,
		companyPageUrl: null,
		logoUrl: null,
		whyTarget:
			"Paramount+ is a major streaming platform. Video player, ad tech, and streaming delivery all directly relevant. Direct competitor to Xfinity Stream — Walter knows this landscape inside out.",
		fitAngle:
			'Video player (HLS/DASH), ad insertion (DAI/SSAI), DRM, streaming at scale. Direct competitor to Xfinity Stream — insider knowledge of the competitive space.',
		jobs: [],
		dateResearched: '2026-03-21'
	},
	{
		id: 'target-fox',
		name: 'Fox',
		slug: 'fox',
		description:
			"Fox Corporation, parent of Tubi, Fox Sports, Fox News. Large media company with significant streaming infrastructure. Fox Sports and Fox News both have major streaming products. Fox owns Tubi — Walter's strongest video player target. No Indeed company data retrieved.",
		industry: 'Media & Communication',
		location: 'New York, NY',
		avgSalary: null,
		ceoApproval: null,
		recommendToFriend: null,
		interviewDifficulty: null,
		companyPageUrl: null,
		logoUrl: null,
		whyTarget:
			"Fox owns Tubi. Fox Sports streaming and Fox News streaming both require video delivery infrastructure. Applying to Fox directly could surface Tubi roles or adjacent streaming positions.",
		fitAngle:
			'Same as Tubi: video player engineering, AVOD/ad tech, broadcast streaming experience, Fox Sports live streaming.',
		jobs: [],
		dateResearched: '2026-03-21'
	}
];
