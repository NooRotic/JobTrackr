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
import type { Application } from './types';

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
import { nextUp as demoNextUp } from './nextUp';

export { calculateConfidence, priorityFromConfidence };

/**
 * Canonical "most recent first" ordering for applications.
 *
 * The source arrays are authored oldest-first (app-001 -> app-131), and `.filter()`
 * preserves that order. Any view that filtered without sorting was therefore showing
 * the OLDEST packages at the top of the list/board. Import this and sort explicitly.
 *
 * Sorts on dateApplied when the application has moved (that's the event that matters),
 * falling back to dateSaved for anything still sitting in saved/research. Ties break on
 * the numeric id descending, which matters a lot here: bulk wide-sweep days write many
 * entries with an identical dateSaved, and without the tiebreak those still render in
 * authoring order (oldest first) inside the day.
 */
function idNum(id: string): number {
	const m = /(\d+)\s*$/.exec(id);
	return m ? Number(m[1]) : 0;
}

export function byRecency(a: Application, b: Application): number {
	const key = (x: Application) => x.dateApplied ?? x.dateSaved ?? '';
	const cmp = key(b).localeCompare(key(a));
	return cmp !== 0 ? cmp : idNum(b.id) - idNum(a.id);
}

/** Non-mutating `[...apps].sort(byRecency)`. Use in views so the source array is untouched. */
export function sortByRecency(apps: readonly Application[]): Application[] {
	return [...apps].sort(byRecency);
}

/**
 * Submit-queue ordering for anything that represents "what do I send next."
 *
 * Explicitly ranked packages (`submitPriority`) come first in rank order; everything
 * unranked falls through to `byRecency`. The two orderings are deliberately different:
 * recency answers "what happened last," submit priority answers "what should go out
 * first," and the newest package is frequently NOT the best one to send. Whatnot was
 * saved 2026-05-11 and is rank 1 on comp + confirmed-live; Stitch Fix was saved
 * 2026-07-31 and is rank 5.
 */
export function bySubmitQueue(a: Application, b: Application): number {
	const ra = a.submitPriority ?? Number.POSITIVE_INFINITY;
	const rb = b.submitPriority ?? Number.POSITIVE_INFINITY;
	if (ra !== rb) return ra - rb;
	return byRecency(a, b);
}

/** Non-mutating submit-queue sort. */
export function sortBySubmitQueue(apps: readonly Application[]): Application[] {
	return [...apps].sort(bySubmitQueue);
}
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
let nextUp = demoNextUp;

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

	const p11 = await loadPersonal('nextUp');
	if (p11) nextUp = p11.nextUp as typeof demoNextUp;
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
	recruiters,
	nextUp
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
	TouchChannel,
	NextUpItem,
	NextUpPriority,
	NextUpKind
} from './types';
