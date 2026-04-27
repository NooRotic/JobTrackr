import type { Application, JobSource } from './types';

/**
 * Ghost job legitimacy scoring.
 *
 * Signals (career-ops Block G adapted):
 *   1. Link health — expired listing is the strongest ghost signal
 *   2. Staleness — days since applied with no status change
 *   3. Response gap — applied but still in "applied" status after N days
 *   4. Source platform — some platforms have higher ghost rates
 *   5. Repost detection — same role appearing as duplicate
 */

export type LegitimacyTier = 'high' | 'caution' | 'suspicious' | 'ghost';

export interface LegitimacyResult {
	tier: LegitimacyTier;
	score: number; // 0-100 (higher = more legitimate)
	signals: LegitimacySignal[];
}

export interface LegitimacySignal {
	type: 'positive' | 'negative' | 'neutral';
	label: string;
	weight: number;
}

// Platforms with known higher ghost/stale job rates
const HIGH_GHOST_SOURCES: JobSource[] = ['indeed', 'ziprecruiter', 'dice', 'glassdoor'];
const LOW_GHOST_SOURCES: JobSource[] = ['greenhouse', 'ashby', 'workable'];

export function assessLegitimacy(
	app: Application,
	linkStatus?: string,
	isDuplicate?: boolean
): LegitimacyResult {
	const signals: LegitimacySignal[] = [];
	let score = 50; // start neutral

	const now = Date.now();
	const daysSinceSaved = app.dateSaved
		? Math.floor((now - new Date(app.dateSaved).getTime()) / (1000 * 60 * 60 * 24))
		: 0;
	const daysSinceApplied = app.dateApplied
		? Math.floor((now - new Date(app.dateApplied).getTime()) / (1000 * 60 * 60 * 24))
		: null;

	// === Signal 1: Link health (strongest signal) ===
	if (linkStatus === 'active') {
		signals.push({ type: 'positive', label: 'Listing is live', weight: 25 });
		score += 25;
	} else if (linkStatus === 'expired') {
		signals.push({ type: 'negative', label: 'Listing expired/removed', weight: -35 });
		score -= 35;
	} else if (linkStatus === 'unknown') {
		signals.push({ type: 'neutral', label: 'Link status uncertain (JS-rendered)', weight: 0 });
	}

	// === Signal 2: Response staleness ===
	if (daysSinceApplied !== null) {
		if (app.status === 'applied') {
			if (daysSinceApplied > 30) {
				signals.push({
					type: 'negative',
					label: `${daysSinceApplied}d since applied, no response`,
					weight: -20
				});
				score -= 20;
			} else if (daysSinceApplied > 14) {
				signals.push({
					type: 'negative',
					label: `${daysSinceApplied}d since applied, no response`,
					weight: -10
				});
				score -= 10;
			} else {
				signals.push({
					type: 'neutral',
					label: `${daysSinceApplied}d since applied — within normal window`,
					weight: 0
				});
			}
		} else if (app.status === 'screening' || app.status === 'interview') {
			signals.push({ type: 'positive', label: `Company engaged (${app.status})`, weight: 20 });
			score += 20;
		} else if (app.status === 'offer' || app.status === 'accepted') {
			signals.push({ type: 'positive', label: 'Offer stage — confirmed real', weight: 30 });
			score += 30;
		}
	}

	// === Signal 3: Source platform ===
	if (app.source) {
		if (LOW_GHOST_SOURCES.includes(app.source)) {
			signals.push({ type: 'positive', label: `ATS source (${app.source}) — lower ghost rate`, weight: 10 });
			score += 10;
		} else if (HIGH_GHOST_SOURCES.includes(app.source)) {
			signals.push({ type: 'negative', label: `Aggregator source (${app.source}) — higher ghost rate`, weight: -5 });
			score -= 5;
		}
	}

	// === Signal 4: Listing age ===
	if (daysSinceSaved > 45) {
		signals.push({ type: 'negative', label: `Listing ${daysSinceSaved}d old — may be stale`, weight: -10 });
		score -= 10;
	} else if (daysSinceSaved < 7) {
		signals.push({ type: 'positive', label: 'Recently posted', weight: 5 });
		score += 5;
	}

	// === Signal 5: Duplicate/repost detection ===
	if (isDuplicate) {
		signals.push({ type: 'negative', label: 'Detected as duplicate/repost', weight: -10 });
		score -= 10;
	}

	// === Signal 6: Rejected status ===
	if (app.status === 'rejected') {
		// Rejection confirms the role was real (someone reviewed it)
		signals.push({ type: 'positive', label: 'Rejection received — confirms real role', weight: 15 });
		score += 15;
	}

	// Clamp
	score = Math.max(0, Math.min(100, score));

	// Determine tier
	let tier: LegitimacyTier;
	if (score >= 65) tier = 'high';
	else if (score >= 40) tier = 'caution';
	else if (score >= 20) tier = 'suspicious';
	else tier = 'ghost';

	return { tier, score, signals };
}

export const TIER_CONFIG: Record<LegitimacyTier, { label: string; color: string; icon: string }> = {
	high: { label: 'High Confidence', color: '#10b981', icon: '\u2713' },
	caution: { label: 'Proceed with Caution', color: '#f59e0b', icon: '\u26A0' },
	suspicious: { label: 'Suspicious', color: '#ef4444', icon: '\u2716' },
	ghost: { label: 'Likely Ghost Job', color: '#6b7280', icon: '\uD83D\uDC7B' }
};
