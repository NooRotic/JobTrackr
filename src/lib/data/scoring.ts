import type { ScoreDimensions } from './types';

/**
 * Scoring weights — tune these to match your priorities.
 * Weights are relative (they get normalized to sum to 1.0).
 */
export const SCORE_WEIGHTS: Record<keyof ScoreDimensions, number> = {
	stackMatch: 25,
	domainFit: 25,
	compensation: 20,
	locationFit: 10,
	seniorityMatch: 10,
	companyTier: 10
};

export const SCORE_LABELS: Record<keyof ScoreDimensions, string> = {
	stackMatch: 'Stack Match',
	domainFit: 'Domain Fit',
	compensation: 'Compensation',
	locationFit: 'Location',
	seniorityMatch: 'Seniority',
	companyTier: 'Company'
};

export const SCORE_COLORS: Record<keyof ScoreDimensions, string> = {
	stackMatch: '#3b82f6',
	domainFit: '#8b5cf6',
	compensation: '#10b981',
	locationFit: '#f59e0b',
	seniorityMatch: '#ef4444',
	companyTier: '#6366f1'
};

/** All dimension keys in display order */
export const SCORE_DIMENSIONS = Object.keys(SCORE_WEIGHTS) as (keyof ScoreDimensions)[];

/** Calculate weighted average from dimensions (returns 0-5) */
export function calculateWeightedScore(dims: ScoreDimensions): number {
	const totalWeight = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
	let weightedSum = 0;
	for (const key of SCORE_DIMENSIONS) {
		weightedSum += dims[key] * SCORE_WEIGHTS[key];
	}
	return Math.round((weightedSum / totalWeight) * 10) / 10;
}

/** Score label: 4.5+ = Excellent, 3.5+ = Strong, 2.5+ = Moderate, 1.5+ = Weak, else = Poor */
export function scoreLabel(score: number): string {
	if (score >= 4.5) return 'Excellent';
	if (score >= 3.5) return 'Strong';
	if (score >= 2.5) return 'Moderate';
	if (score >= 1.5) return 'Weak';
	return 'Poor';
}

/** Score color (neon green for top, red for bottom) */
export function scoreColor(score: number): string {
	if (score >= 4.5) return '#39ff14';
	if (score >= 3.5) return '#10b981';
	if (score >= 2.5) return '#f59e0b';
	if (score >= 1.5) return '#ef4444';
	return '#6b7280';
}
