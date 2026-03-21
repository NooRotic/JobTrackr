/**
 * Data layer switcher.
 *
 * Default: personal data if available, falls back to demo
 * Toggle: ?demo=true in URL forces demo data (for screenshots)
 * Toggle: ?demo=false forces personal data
 *
 * The sidebar has a toggle button for easy switching.
 */

import { browser } from '$app/environment';

// Demo data (always available, committed to repo)
import { searches as demoSearches } from './searches';
import { applications as demoApplications } from './applications';
import { companies as demoCompanies } from './companies';
import { activity as demoActivity } from './activity';
import {
	companyTargets as demoTargets,
	jobTitleCategories as demoCats,
	calculateConfidence,
	priorityFromConfidence
} from './targets';
import { titleAnalytics as demoAnalytics } from './titleAnalytics';

export { calculateConfidence, priorityFromConfidence };

// Check URL param for demo mode
function isDemoMode(): boolean {
	if (!browser) return true;
	const params = new URLSearchParams(window.location.search);
	if (params.has('demo')) return params.get('demo') !== 'false';
	// Default: use personal if env var set, otherwise demo
	return import.meta.env.VITE_DATA !== 'personal';
}

let searches = demoSearches;
let applications = demoApplications;
let companies = demoCompanies;
let activity = demoActivity;
let companyTargets = demoTargets;
let jobTitleCategories = demoCats;
let titleAnalytics = demoAnalytics;

if (!isDemoMode()) {
	try {
		const p = await import('./personal/searches');
		searches = p.searches;
	} catch {}
	try {
		const p = await import('./personal/applications');
		applications = p.applications;
	} catch {}
	try {
		const p = await import('./personal/companies');
		companies = p.companies;
	} catch {}
	try {
		const p = await import('./personal/activity');
		activity = p.activity;
	} catch {}
	try {
		const p = await import('./personal/targets');
		companyTargets = p.companyTargets;
		jobTitleCategories = p.jobTitleCategories;
	} catch {}
	try {
		const p = await import('./personal/titleAnalytics');
		titleAnalytics = p.titleAnalytics;
	} catch {}
}

export {
	searches,
	applications,
	companies,
	activity,
	companyTargets,
	jobTitleCategories,
	titleAnalytics
};

export type {
	Application,
	ApplicationStatus,
	SavedSearch,
	SearchResult,
	CompanyResearch,
	CompanyTarget,
	ActivityItem,
	DashboardStats,
	FitRating,
	Priority,
	JobTitleAnalytics,
	TitleVerdict
} from './types';
