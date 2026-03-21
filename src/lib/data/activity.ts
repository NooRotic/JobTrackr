import type { ActivityItem } from './types';

// Activity feed — add entries as you take actions in your job search.
export const activity: ActivityItem[] = [
	{
		id: 'act-001',
		type: 'offer',
		message: 'Offer received from DataWeave',
		date: '2026-03-20',
		meta: '$192k base + $40k RSU/yr + 15% bonus. Decision deadline 3/28.'
	},
	{
		id: 'act-002',
		type: 'search',
		message: 'Search: Senior Frontend Engineer — Remote, US',
		date: '2026-03-21',
		meta: '6 results — 2 P1, 1 P2, 1 P3, 2 SKIP'
	},
	{
		id: 'act-003',
		type: 'search',
		message: 'Saved Jobs sync pulled from Indeed',
		date: '2026-03-21',
		meta: '5 results — 2 P1, 1 P2, 2 expired/SKIP'
	},
	{
		id: 'act-004',
		type: 'application',
		message: 'Applied to StreamLine — Senior Software Engineer, Streaming',
		date: '2026-03-19',
		meta: 'Easy Apply. Cover letter highlighted video streaming background.'
	},
	{
		id: 'act-005',
		type: 'application',
		message: 'Applied to Axiom Labs — Sr. Frontend Engineer, Platform',
		date: '2026-03-18',
		meta: 'Company portal. Tailored cover letter sent.'
	},
	{
		id: 'act-006',
		type: 'search',
		message: 'Search: Technical Lead Frontend — US',
		date: '2026-03-18',
		meta: '3 results — 1 P1, 1 P3, 1 SKIP'
	},
	{
		id: 'act-007',
		type: 'search',
		message: 'Search: Senior Software Engineer React — Remote, US',
		date: '2026-03-19',
		meta: '4 results — 2 P1, 1 P2, 1 SKIP'
	},
	{
		id: 'act-008',
		type: 'status_change',
		message: 'HexGrid moved to Screening',
		date: '2026-03-20',
		meta: 'Recruiter outreach. Phone screen scheduled for 3/24.'
	},
	{
		id: 'act-009',
		type: 'interview',
		message: 'Tensor UI — take-home submitted',
		date: '2026-03-21',
		meta: 'Technical round complete. Built a real-time dashboard component with streaming data.'
	},
	{
		id: 'act-010',
		type: 'interview',
		message: 'CloudForge — final round confirmed',
		date: '2026-03-20',
		meta: 'Panel interview 3/25 at 2pm ET. Eng manager + 2 senior engineers + product.'
	},
	{
		id: 'act-011',
		type: 'search',
		message: 'Search: Full Stack TypeScript — Remote, US',
		date: '2026-03-20',
		meta: '5 results — 1 P1, 2 P2, 2 SKIP'
	},
	{
		id: 'act-012',
		type: 'status_change',
		message: 'Prism Digital — rejected after technical round',
		date: '2026-03-15',
		meta: 'Feedback: wanted more backend depth. Logging for future reference.'
	}
];
