import type { RecruiterStatus } from './types';

export interface RecruiterStatusConfig {
	status: RecruiterStatus;
	label: string;
	color: string;
	/** Tailwind classes for the badge */
	badgeClass: string;
	/** Whether this status is "live" (counts toward active relationships) */
	live: boolean;
}

/**
 * Canonical recruiter status definitions.
 * Ordering matters: this array defines display order in filter chips.
 */
export const RECRUITER_STATUS_CONFIG: RecruiterStatusConfig[] = [
	{
		status: 'active',
		label: 'Active',
		color: '#39ff14',
		badgeClass: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',
		live: true
	},
	{
		status: 'awaiting-reply',
		label: 'Awaiting Reply',
		color: '#3b82f6',
		badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
		live: true
	},
	{
		status: 'cold-pitched',
		label: 'Cold Pitched',
		color: '#f59e0b',
		badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
		live: true
	},
	{
		status: 'declined',
		label: 'Declined',
		color: '#94a3b8',
		badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
		live: false
	},
	{
		status: 'placed',
		label: 'Placed',
		color: '#10b981',
		badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
		live: false
	},
	{
		status: 'closed',
		label: 'Closed',
		color: '#6b7280',
		badgeClass: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
		live: false
	}
];

export const RECRUITER_STATUS_MAP: Record<RecruiterStatus, RecruiterStatusConfig> =
	Object.fromEntries(RECRUITER_STATUS_CONFIG.map((s) => [s.status, s])) as Record<
		RecruiterStatus,
		RecruiterStatusConfig
	>;

export const ALL_RECRUITER_STATUSES: RecruiterStatus[] = RECRUITER_STATUS_CONFIG.map(
	(s) => s.status
);

export const LIVE_RECRUITER_STATUSES: RecruiterStatus[] = RECRUITER_STATUS_CONFIG.filter(
	(s) => s.live
).map((s) => s.status);

/** Signal tier display config */
export const SIGNAL_TIER_CONFIG = {
	signal: {
		label: 'Signal',
		color: '#39ff14',
		badgeClass: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30'
	},
	noise: {
		label: 'Noise',
		color: '#ef4444',
		badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30'
	},
	unrated: {
		label: 'Unrated',
		color: '#6b7280',
		badgeClass: 'bg-gray-500/15 text-gray-400 border-gray-500/30'
	}
} as const;
