/**
 * Data layer switcher.
 *
 * Default: demo data (safe for screenshots and public repo)
 * Personal: VITE_DATA=personal bun run dev
 *
 * To use your real data, copy your files into src/lib/data/personal/
 * and start the dev server with the env var set.
 */

// Demo data (always available, committed to repo)
import { searches as demoSearches } from './searches';
import { applications as demoApplications } from './applications';
import { companies as demoCompanies } from './companies';
import { activity as demoActivity } from './activity';
import { companyTargets as demoTargets, jobTitleCategories as demoCats, calculateConfidence, priorityFromConfidence } from './targets';
import { titleAnalytics as demoAnalytics } from './titleAnalytics';

// Re-export functions (same regardless of data mode)
export { calculateConfidence, priorityFromConfidence };

// Try personal data if env var is set
let usePersonal = false;
try {
	if (import.meta.env.VITE_DATA === 'personal') {
		usePersonal = true;
	}
} catch {}

let searches = demoSearches;
let applications = demoApplications;
let companies = demoCompanies;
let activity = demoActivity;
let companyTargets = demoTargets;
let jobTitleCategories = demoCats;
let titleAnalytics = demoAnalytics;

if (usePersonal) {
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

export { searches, applications, companies, activity, companyTargets, jobTitleCategories, titleAnalytics };

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
