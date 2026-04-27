import type { ApplicationStatus } from './types';

export interface StatusConfig {
	/** Machine-readable key */
	status: ApplicationStatus;
	/** Human label */
	label: string;
	/** Hex color for charts and indicators */
	color: string;
	/** Tailwind classes for StatusBadge */
	badgeClass: string;
	/** Valid next statuses from this state */
	transitions: ApplicationStatus[];
	/** Whether this is a terminal state (no further progression) */
	terminal: boolean;
	/** Whether this status appears in the pipeline funnel */
	pipeline: boolean;
}

/**
 * Canonical status definitions — single source of truth.
 *
 * Ordering matters: this array defines the pipeline progression
 * from first (saved) to last (rejected).
 */
export const STATUS_CONFIG: StatusConfig[] = [
	{
		status: 'saved',
		label: 'Saved',
		color: '#6366f1',
		badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
		transitions: ['applied', 'rejected'],
		terminal: false,
		pipeline: true
	},
	{
		status: 'applied',
		label: 'Applied',
		color: '#3b82f6',
		badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
		transitions: ['screening', 'interview', 'rejected'],
		terminal: false,
		pipeline: true
	},
	{
		status: 'screening',
		label: 'Screening',
		color: '#f59e0b',
		badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
		transitions: ['interview', 'rejected'],
		terminal: false,
		pipeline: true
	},
	{
		status: 'interview',
		label: 'Interview',
		color: '#8b5cf6',
		badgeClass: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
		transitions: ['offer', 'rejected'],
		terminal: false,
		pipeline: true
	},
	{
		status: 'offer',
		label: 'Offer',
		color: '#10b981',
		badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
		transitions: ['accepted', 'rejected'],
		terminal: false,
		pipeline: true
	},
	{
		status: 'accepted',
		label: 'Accepted',
		color: '#39ff14',
		badgeClass: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',
		transitions: [],
		terminal: true,
		pipeline: false
	},
	{
		status: 'rejected',
		label: 'Rejected',
		color: '#ef4444',
		badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
		transitions: [],
		terminal: true,
		pipeline: false
	}
];

// === Derived lookups (computed once, used everywhere) ===

/** Status → config lookup */
export const STATUS_MAP: Record<ApplicationStatus, StatusConfig> =
	Object.fromEntries(STATUS_CONFIG.map((s) => [s.status, s])) as Record<ApplicationStatus, StatusConfig>;

/** Status → hex color */
export const STATUS_COLORS: Record<ApplicationStatus, string> =
	Object.fromEntries(STATUS_CONFIG.map((s) => [s.status, s.color])) as Record<ApplicationStatus, string>;

/** Status → label */
export const STATUS_LABELS: Record<ApplicationStatus, string> =
	Object.fromEntries(STATUS_CONFIG.map((s) => [s.status, s.label])) as Record<ApplicationStatus, string>;

/** All statuses in pipeline order */
export const ALL_STATUSES: ApplicationStatus[] = STATUS_CONFIG.map((s) => s.status);

/** Pipeline-visible statuses only (for funnel charts) */
export const PIPELINE_STATUSES: StatusConfig[] = STATUS_CONFIG.filter((s) => s.pipeline);

/** Check if a transition is valid */
export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
	return STATUS_MAP[from].transitions.includes(to);
}
