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
import { profile as demoProfile } from './profile';
import { prepData as demoPrep } from './prep';
import { research as demoResearch } from './research';
import { recruiters as demoRecruiters } from './recruiters';

export { calculateConfidence, priorityFromConfidence };
export {
	STATUS_CONFIG,
	STATUS_MAP,
	STATUS_COLORS,
	STATUS_LABELS,
	ALL_STATUSES,
	PIPELINE_STATUSES,
	canTransition
} from './states';
export type { StatusConfig } from './states';
export {
	SCORE_WEIGHTS,
	SCORE_LABELS,
	SCORE_COLORS,
	SCORE_DIMENSIONS,
	calculateWeightedScore,
	scoreLabel,
	scoreColor
} from './scoring';

// Check demo mode: URL param overrides localStorage, localStorage persists across reloads
function isDemoMode(): boolean {
	if (!browser) return false;
	const params = new URLSearchParams(window.location.search);
	if (params.has('demo')) {
		const val = params.get('demo') === 'true';
		localStorage.setItem('jobtrackr-demo', val ? 'true' : 'false');
		return val;
	}
	return localStorage.getItem('jobtrackr-demo') === 'true';
}

let searches = demoSearches;
let applications = demoApplications;
let companies = demoCompanies;
let activity = demoActivity;
let companyTargets = demoTargets;
let jobTitleCategories = demoCats;
let titleAnalytics = demoAnalytics;
let profile = demoProfile;
let prepData = demoPrep;
let research = demoResearch;
let recruiters = demoRecruiters;

// Vite's import.meta.glob resolves to {} at build time when no files match,
// so personal/ files can be gitignored without breaking the CI build.
const personalModules = import.meta.glob<Record<string, unknown>>(
	'./personal/*.ts'
);

async function loadPersonal(name: string): Promise<Record<string, unknown> | null> {
	const loader = personalModules[`./personal/${name}.ts`];
	if (!loader) return null;
	try {
		return await loader();
	} catch {
		return null;
	}
}

if (!isDemoMode()) {
	const p1 = await loadPersonal('searches');
	if (p1) searches = p1.searches as typeof demoSearches;

	const p2 = await loadPersonal('applications');
	if (p2) applications = p2.applications as typeof demoApplications;

	const p3 = await loadPersonal('companies');
	if (p3) companies = p3.companies as typeof demoCompanies;

	const p4 = await loadPersonal('activity');
	if (p4) activity = p4.activity as typeof demoActivity;

	const p5 = await loadPersonal('targets');
	if (p5) {
		companyTargets = p5.companyTargets as typeof demoTargets;
		jobTitleCategories = p5.jobTitleCategories as typeof demoCats;
	}

	const p6 = await loadPersonal('titleAnalytics');
	if (p6) titleAnalytics = p6.titleAnalytics as typeof demoAnalytics;

	const p7 = await loadPersonal('profile');
	if (p7) profile = p7.profile as typeof demoProfile;

	const p8 = await loadPersonal('prep');
	if (p8) prepData = p8.prepData as typeof demoPrep;

	const p9 = await loadPersonal('research');
	if (p9) research = p9.research as typeof demoResearch;

	const p10 = await loadPersonal('recruiters');
	if (p10) recruiters = p10.recruiters as typeof demoRecruiters;
}

export {
	searches,
	applications,
	companies,
	activity,
	companyTargets,
	jobTitleCategories,
	titleAnalytics,
	profile,
	prepData,
	research,
	recruiters
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
	TitleVerdict,
	InterviewPlatform,
	InterviewStatus,
	InterviewRound,
	Interview,
	StoryCategory,
	InterviewStory,
	StudySection,
	PrepData,
	ResearchEntry,
	ResearchCategory,
	ScoreDimensions,
	Recruiter,
	RecruiterStatus,
	RecruiterTouch,
	SignalTier,
	RoleFocus,
	ContractType,
	TouchDirection,
	TouchChannel
} from './types';
