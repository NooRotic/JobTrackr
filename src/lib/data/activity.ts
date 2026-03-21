import type { ActivityItem } from './types';

// Activity feed — add entries as you take actions in your job search.
export const activity: ActivityItem[] = [
	{
		id: 'act-001',
		type: 'search',
		message: 'Initial job searches completed',
		date: '2026-03-21',
		meta: 'Frontend Engineer, TypeScript SWE — Remote'
	},
	{
		id: 'act-002',
		type: 'search',
		message: 'Company target search: Example Corp',
		date: '2026-03-21',
		meta: '3 roles found, 2 high-confidence'
	}
];
