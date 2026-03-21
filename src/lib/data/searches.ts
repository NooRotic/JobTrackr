import type { SavedSearch } from './types';

export const searches: SavedSearch[] = [
	{
		id: 'search-001',
		query: 'Senior Frontend Engineer — Remote, US',
		date: '2026-03-21',
		totalResults: 4,
		topLeads: 2,
		nextSteps: ['Pull full JD on Acme Corp role', 'Research NovaTech stack'],
		results: [
			{
				id: 'r-001',
				role: 'Senior Frontend Engineer',
				company: 'Acme Corp',
				salary: '$160,000 – $195,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-20',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'React + TypeScript focus. Strong match for frontend-heavy profiles.'
			},
			{
				id: 'r-002',
				role: 'Senior Software Engineer',
				company: 'NovaTech',
				salary: '$170,000 – $210,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-18',
				url: '#',
				fit: 'NEEDS_REVIEW',
				priority: 'P1',
				notes: 'Good comp, unknown company. Need to pull JD and research team.'
			},
			{
				id: 'r-003',
				role: 'Full Stack Developer',
				company: 'WidgetWorks',
				salary: '$120,000 – $150,000/yr',
				location: 'Chicago, IL',
				remote: false,
				postedDate: '2026-03-15',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Below salary floor, not remote.'
			},
			{
				id: 'r-004',
				role: 'Frontend Tech Lead',
				company: 'StreamLine Inc',
				salary: '$180,000 – $220,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-19',
				url: '#',
				fit: 'HIGH',
				priority: 'P2',
				notes: 'Tech lead role — great comp. Management track, need to confirm IC option.'
			}
		]
	},
	{
		id: 'search-002',
		query: 'Software Engineer TypeScript — Remote, US',
		date: '2026-03-21',
		totalResults: 3,
		topLeads: 1,
		nextSteps: ['Review CloudBase JD for team fit'],
		results: [
			{
				id: 'r-005',
				role: 'Senior Software Engineer',
				company: 'CloudBase',
				salary: '$175,000 – $230,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-20',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'TypeScript-first stack. Infrastructure team. Strong comp.'
			},
			{
				id: 'r-006',
				role: 'Backend Engineer',
				company: 'DataPulse',
				salary: '$140,000 – $170,000/yr',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-17',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P3',
				notes: 'Backend-heavy but TypeScript. Could do it, not the strongest angle.'
			},
			{
				id: 'r-007',
				role: 'Junior Developer',
				company: 'StartupXYZ',
				salary: '$80,000 – $100,000/yr',
				location: 'San Francisco, CA',
				remote: false,
				postedDate: '2026-03-10',
				url: '#',
				fit: 'LOW',
				priority: 'SKIP',
				notes: 'Junior level, way below floor.'
			}
		]
	},
	{
		id: 'saved-demo',
		query: 'Indeed Saved Jobs',
		date: '2026-03-21',
		totalResults: 3,
		topLeads: 2,
		nextSteps: ['Pull JDs when available'],
		results: [
			{
				id: 'saved-001',
				role: 'Senior Software Engineer — Platform',
				company: 'MediaStream Co.',
				salary: 'Not listed',
				location: 'Remote',
				remote: true,
				postedDate: '2026-03-15',
				url: '#',
				fit: 'HIGH',
				priority: 'P1',
				notes: 'Platform engineering at a media company. Strong fit.',
				source: 'saved',
				easyApply: true,
				normalizedTitle: 'senior software engineer'
			},
			{
				id: 'saved-002',
				role: 'Frontend Engineer',
				company: 'PixelForge',
				salary: 'Not listed',
				location: 'Austin, TX',
				remote: false,
				postedDate: '2026-03-10',
				url: '#',
				fit: 'MEDIUM',
				priority: 'P2',
				notes: 'Frontend role, not remote. Interesting product though.',
				source: 'saved',
				easyApply: false,
				normalizedTitle: 'frontend engineer'
			},
			{
				id: 'saved-003',
				role: 'Software Engineer II',
				company: 'RetailTech',
				salary: 'Not listed',
				location: 'Remote',
				remote: true,
				postedDate: '2026-02-28',
				url: '#',
				fit: 'LOW',
				priority: 'P3',
				notes: 'Mid-level title but remote. Could do it.',
				source: 'saved',
				easyApply: true,
				normalizedTitle: 'software engineer',
				expired: true
			}
		]
	}
];
