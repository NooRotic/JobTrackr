import type { SavedSearch } from './types';

export const searches: SavedSearch[] = [
	{
		id: 'search-001',
		query: 'Senior Frontend Engineer — Remote, US',
		date: '2026-03-21',
		totalResults: 6,
		topLeads: 3,
		nextSteps: [
			'Pull full JD on NovaByte Sr FE role',
			'Research Axiom Labs eng blog',
			'Confirm Prism Digital remote policy'
		],
		results: [
			{
				id: 'r-001',
				role: 'Senior Frontend Engineer',
				company: 'NovaByte',
				salary: '$175,000 – $215,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-20',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'React + TypeScript stack. Product team owns consumer-facing UI at scale.',
				jobDescription: `NovaByte is building the next generation of collaborative developer tooling. Our consumer product serves 4M+ active developers and our frontend team owns everything from the real-time editor to the deployment dashboard.\n\nWe're looking for a Senior Frontend Engineer who can own complex UI surfaces, drive technical decisions, and mentor junior engineers. You'll work closely with design and product to ship features that developers love.\n\nRequired: 5+ years of frontend experience, deep React + TypeScript expertise, strong understanding of browser performance and rendering, experience with component libraries and design systems.\n\nNice to have: Experience with WebSockets or collaborative real-time UIs, familiarity with bundler tooling (Vite, webpack), contributions to open-source projects.`
			},
			{
				id: 'r-002',
				role: 'Sr. Frontend Engineer — Platform',
				company: 'Axiom Labs',
				salary: '$185,000 – $240,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-19',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Platform team doing internal tooling + DX. Great comp. Need to validate stack depth.',
				jobDescription: `Axiom Labs is a data infrastructure company trusted by thousands of engineering teams. Our platform team builds the developer experience layer — from our query console to our CLI to the dashboards engineers rely on every day.\n\nAs a Senior Frontend Engineer on the Platform team you will own the query editor, streaming log viewer, and alert management surfaces. These are complex, high-traffic UIs where performance and reliability are non-negotiable.\n\nYou should be comfortable with TypeScript, React, and state management at scale. Experience with streaming data UIs (SSE, WebSocket, chunked responses) is a major plus. We care deeply about bundle size, accessibility, and developer ergonomics.\n\nCompensation: $185k–$240k base + equity + full benefits. Fully remote, US timezone preferred.`
			},
			{
				id: 'r-003',
				role: 'Frontend Engineer II',
				company: 'Prism Digital',
				salary: '$145,000 – $175,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-17',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Comp a bit low but interesting product. Title is II not Senior — confirm if negotiable.'
			},
			{
				id: 'r-004',
				role: 'Senior Frontend Engineer, Growth',
				company: 'CloudForge',
				salary: '$160,000 – $200,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-18',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P3',
				notes: 'Growth team — A/B testing heavy. Not the strongest angle but salary range works.'
			},
			{
				id: 'r-005',
				role: 'Frontend Developer',
				company: 'VelvetStack',
				salary: '$110,000 – $135,000/yr',
				location: 'Austin, TX',
				remote: false,
				postedDate: '2026-03-14',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Below salary floor, not remote, mid-level title.'
			},
			{
				id: 'r-006',
				role: 'React Developer',
				company: 'Mintline',
				salary: '$95,000 – $120,000/yr',
				location: 'Atlanta, GA',
				remote: false,
				postedDate: '2026-03-10',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Way below floor. Not senior. Local only.'
			}
		]
	},
	{
		id: 'search-002',
		query: 'Full Stack TypeScript — Remote, US',
		date: '2026-03-20',
		totalResults: 5,
		topLeads: 2,
		nextSteps: [
			'Check HexGrid engineering blog for stack details',
			'See if DataWeave has a senior IC track'
		],
		results: [
			{
				id: 'r-007',
				role: 'Senior Full Stack Engineer',
				company: 'HexGrid',
				salary: '$180,000 – $225,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-19',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'TypeScript end-to-end (Next.js + tRPC + Prisma). Small eng team with high ownership.',
				jobDescription: `HexGrid builds visualization and analytics tooling for infrastructure teams. Our entire stack is TypeScript — Next.js on the frontend, tRPC for type-safe APIs, PostgreSQL via Prisma, and Bun as our runtime.\n\nWe're a team of 12 engineers and we're looking for a Senior Full Stack Engineer who wants real ownership. You'll build product features from design to deployment, review infrastructure decisions, and set the patterns that the next 10 engineers will follow.\n\nWe care more about how you think than what you've used. Strong TypeScript fundamentals, a bias for simplicity, and experience shipping products that real users depend on are what we're after.\n\nSalary: $180k–$225k + meaningful equity. Fully async-friendly remote culture.`
			},
			{
				id: 'r-008',
				role: 'Full Stack Engineer — Data Platform',
				company: 'DataWeave',
				salary: '$170,000 – $210,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-18',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Data platform UIs. TypeScript + Python mix. Frontend-heavy enough to be interesting.'
			},
			{
				id: 'r-009',
				role: 'Full Stack Developer',
				company: 'Pulsar Inc',
				salary: '$155,000 – $185,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-15',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Remote and decent comp. Not senior title but salary floor clears. Research team size.'
			},
			{
				id: 'r-010',
				role: 'Web Engineer',
				company: 'Codex Systems',
				salary: '$125,000 – $155,000/yr',
				location: 'Denver, CO',
				remote: false,
				postedDate: '2026-03-12',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Not remote, below floor, generic title.'
			},
			{
				id: 'r-011',
				role: 'JavaScript Developer',
				company: 'PixelForge',
				salary: '$100,000 – $130,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-08',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Remote but way below salary floor. Junior-ish comp.'
			}
		]
	},
	{
		id: 'search-003',
		query: 'Senior Software Engineer React — Remote, US',
		date: '2026-03-19',
		totalResults: 4,
		topLeads: 3,
		nextSteps: [
			'Apply to StreamLine ASAP — strong match',
			'Research Tensor UI funding stage'
		],
		results: [
			{
				id: 'r-012',
				role: 'Senior Software Engineer — UI',
				company: 'StreamLine',
				salary: '$190,000 – $245,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-18',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Streaming platform with real media delivery challenges. UI team owns player and dashboard.'
			},
			{
				id: 'r-013',
				role: 'Senior React Engineer',
				company: 'Tensor UI',
				salary: '$165,000 – $210,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-17',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'AI-powered UI tooling startup. React-native product. Small team, high equity upside.'
			},
			{
				id: 'r-014',
				role: 'Software Engineer, Frontend',
				company: 'Codex Systems',
				salary: '$155,000 – $185,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-15',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Solid comp and remote. Enterprise dev tools space. Could be interesting.'
			},
			{
				id: 'r-015',
				role: 'React Developer',
				company: 'Mintline',
				salary: '$120,000 – $145,000/yr',
				location: 'Chicago, IL',
				remote: false,
				postedDate: '2026-03-09',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Not remote, below floor, non-senior title.'
			}
		]
	},
	{
		id: 'search-saved',
		query: 'Indeed Saved Jobs',
		date: '2026-03-21',
		totalResults: 5,
		topLeads: 3,
		nextSteps: [
			'Pull JD on NovaByte saved role before it expires',
			'Confirm CloudForge remote status',
			'Archive expired Pulsar listing'
		],
		results: [
			{
				id: 'saved-001',
				role: 'Senior Software Engineer — Streaming',
				company: 'StreamLine',
				salary: '$195,000 – $250,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-16',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Video streaming platform. Player team. Strong match for streaming background.',
				source: 'saved',
				easyApply: true,
				normalizedTitle: 'senior software engineer'
			},
			{
				id: 'saved-002',
				role: 'Frontend Platform Engineer',
				company: 'NovaByte',
				salary: 'Not listed',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-14',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Platform team. Good company size, solid eng culture from research.',
				source: 'saved',
				easyApply: false,
				normalizedTitle: 'frontend engineer'
			},
			{
				id: 'saved-003',
				role: 'Full Stack Engineer',
				company: 'CloudForge',
				salary: '$160,000 – $195,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-12',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Saved before confirming remote. Still need to verify.',
				source: 'saved',
				easyApply: true,
				normalizedTitle: 'full stack engineer'
			},
			{
				id: 'saved-004',
				role: 'Senior Web Engineer',
				company: 'Pulsar Inc',
				salary: 'Not listed',
				location: 'Remote',
				remote: true,
				postedDate: '2026-02-25',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P3',
				notes: 'Listing is old. Probably expired. Check before applying.',
				source: 'saved',
				easyApply: false,
				normalizedTitle: 'senior web engineer',
				expired: true
			},
			{
				id: 'saved-005',
				role: 'Software Engineer II',
				company: 'Mintline',
				salary: '$130,000 – $155,000/yr',
				location: 'New York, NY',
				remote: false,
				postedDate: '2026-02-18',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Saved by accident. Below floor, not remote, mid-level.',
				source: 'saved',
				easyApply: true,
				normalizedTitle: 'software engineer',
				expired: true
			}
		]
	},
	{
		id: 'search-005',
		query: 'Technical Lead Frontend — US',
		date: '2026-03-18',
		totalResults: 3,
		topLeads: 1,
		nextSteps: [
			'Confirm Axiom Labs lead role is IC-track not management'
		],
		results: [
			{
				id: 'r-016',
				role: 'Technical Lead, Frontend Engineering',
				company: 'Axiom Labs',
				salary: '$200,000 – $260,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-17',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Staff-level IC tech lead. Owns frontend architecture. Strong comp. Need to confirm no direct reports.'
			},
			{
				id: 'r-017',
				role: 'Frontend Team Lead',
				company: 'VelvetStack',
				salary: '$150,000 – $185,000/yr',
				location: 'Philadelphia, PA',
				remote: false,
				postedDate: '2026-03-13',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P3',
				notes: 'Local option but management track. Not ideal. Salary range OK but not great.'
			},
			{
				id: 'r-018',
				role: 'Engineering Manager — Frontend',
				company: 'Codex Systems',
				salary: '$170,000 – $210,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-11',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Management, not IC. Not the direction I want to go right now.'
			}
		]
	}
];
