import type { ActivityItem } from './types';

export const activity: ActivityItem[] = [
	{
		id: 'act-001',
		type: 'interview',
		message: 'Panel interview scheduled with Mux',
		date: '2026-03-21',
		meta: 'March 28 — Video Infrastructure team'
	},
	{
		id: 'act-002',
		type: 'status_change',
		message: 'CastLabs moved to Screening',
		date: '2026-03-21',
		meta: 'Recruiter screen: March 25'
	},
	{
		id: 'act-003',
		type: 'application',
		message: 'Applied to Wistia — Senior Frontend Engineer',
		date: '2026-03-21',
		meta: 'Video Platform team'
	},
	{
		id: 'act-004',
		type: 'application',
		message: 'Applied to USA TODAY Co. — Senior Web Video Developer',
		date: '2026-03-21',
		meta: 'Below salary floor but strong video fit'
	},
	{
		id: 'act-005',
		type: 'search',
		message: '5 new searches completed',
		date: '2026-03-21',
		meta: 'Video Engineer, Streaming SWE, Chromecast, Frontend Philly'
	},
	{
		id: 'act-006',
		type: 'status_change',
		message: 'Mux moved from Applied to Interview',
		date: '2026-03-20',
		meta: 'Fast response — 2 days after apply'
	},
	{
		id: 'act-007',
		type: 'application',
		message: 'Applied to Mux — Senior Software Engineer',
		date: '2026-03-18',
		meta: 'Video Infrastructure team'
	},
	{
		id: 'act-008',
		type: 'status_change',
		message: 'Brightcove marked as Rejected',
		date: '2026-02-15',
		meta: 'Feedback: Go backend required'
	},
	{
		id: 'act-009',
		type: 'application',
		message: 'Applied to Brightcove — Senior Software Engineer',
		date: '2026-02-10',
		meta: 'Player Platform team'
	}
];
