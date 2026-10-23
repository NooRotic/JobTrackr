export type ApplicationStatus =
	| 'saved'
	| 'applied'
	| 'screening'
	| 'interview'
	| 'offer'
	| 'accepted'
	| 'rejected'
	/** Listing died before it was ever submitted. Distinct from 'rejected' (they said no). */
	| 'expired';

export type FitRating = 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';

/**
 * Priority band for the morning Next Up list.
 * P0 = hard deadline or compliance. P1 = live conversation actively going cold.
 * P2 = ready to ship. P3 = relationship upkeep. P4 = housekeeping, nothing on fire.
 */
export type NextUpPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

export type NextUpKind = 'deadline' | 'email' | 'submit' | 'call' | 'admin';

export interface NextUpItem {
	id: string;
	priority: NextUpPriority;
	kind: NextUpKind;
	title: string;
	/** One line on what this actually is. */
	detail?: string;
	/** Why it is where it is in the list. The part that stops it being re-litigated each morning. */
	why?: string;
	/** ISO date with a real deadline attached. Drives the days-left countdown. */
	due?: string;
	/** ISO date this has been waiting since. Drives the days-cold counter. */
	waitingSince?: string;
	/** Where the material already lives, if it is already written. */
	source?: string;
	href?: string;
	done?: boolean;
}

/** Priority tiers for job results */
/**
 * Two independent ladders, added 2026-09-10 at Walter's direction.
 *
 *   P1..P3  = software career. P1 is the best match to 25 years of frontend/video work.
 *   N1..N3  = "normie" non-tech. N1 is the best non-tech job he would actually take.
 *
 * They are NOT comparable to each other. An N1 is not a demoted P1; it is the top of a
 * separate list, ranked on: can he get hired, can he get there, how fast does it pay.
 * Keeping them separate stops the non-tech list from reading as failure and stops the
 * tech list from burying a job that could pay a bill next week.
 *
 * HELD = borderline, never dropped. Carries a reason and a resolver. See
 * feedback_held_leads_process: one soft signal must never end a JD review.
 */
export type Priority = 'P1' | 'P2' | 'P3' | 'N1' | 'N2' | 'N3' | 'HELD' | 'SKIP';

/** Readiness state for an application */
export type DeployStatus = 'deploy-ready' | 'research' | 'none';

/** Where the job listing was found */
export type JobSource =
	| 'indeed'
	| 'google-careers'
	| 'netflix-jobs'
	| 'greenhouse'
	| 'workable'
	| 'ashby'
	| 'dice'
	| 'simplyhired'
	| 'builtin'
	| 'weworkremotely'
	| 'remoteok'
	| 'remote100k'
	| 'linkedin'
	| 'ziprecruiter'
	| 'glassdoor'
	| 'obsidi'
	| 'dayforce'
	| 'disney-careers'
	| 'amazon-jobs'
	| 'clipnet-careers'
	| 'company-site'
	| 'referral'
	| 'other';

/** Per-dimension scores for a job evaluation */
export interface ScoreDimensions {
	/** How well the tech stack matches (0-5) */
	stackMatch: number;
	/** Domain relevance — video/streaming/frontend (0-5) */
	domainFit: number;
	/** Compensation relative to target (0-5) */
	compensation: number;
	/** Remote/location fit (0-5) */
	locationFit: number;
	/** Seniority level alignment (0-5) */
	seniorityMatch: number;
	/** Company reputation and tier (0-5) */
	companyTier: number;
}

export interface Application {
	id: string;
	company: string;
	role: string;
	salary: string;
	location: string;
	remote: boolean;
	status: ApplicationStatus;
	dateApplied: string | null;
	dateSaved: string;
	url: string;
	notes: string;
	jobId?: string;
	deployStatus?: DeployStatus;
	deployPath?: string;
	/** Where the listing was found */
	source?: JobSource;
	/** Recruiter who sourced this application, if any */
	recruiterId?: string;
	/** Overall score 1-5 (weighted average of dimensions) */
	score?: number;
	/** Per-dimension breakdown */
	scoreDimensions?: ScoreDimensions;
	/**
	 * Manual submit-queue rank for deploy-ready packages. Lower = send sooner.
	 * Deliberately separate from dateSaved: the newest package is not always the one
	 * to send first (comp, fit, and confirmed-live status all outrank recency).
	 * Unset = unranked, sorts after everything ranked.
	 */
	submitPriority?: number;
	/** ISO date the listing was last verified against the EMPLOYER'S OWN source, not an aggregator. */
	lastVerified?: string;
	/**
	 * Result of that verification.
	 * 'unverifiable' = we could not tell (bot-blocked, or the stored url isn't a real posting).
	 * It is NOT a synonym for dead, and must not be rendered as one.
	 */
	verifiedStatus?: 'live' | 'dead' | 'unverifiable';
	/** Why verification failed, when verifiedStatus is 'unverifiable'. Shown in the UI. */
	verifyNote?: string;
}

export interface SearchResult {
	id: string;
	role: string;
	company: string;
	salary: string;
	location: string;
	remote: boolean;
	postedDate: string;
	url: string;
	fit: FitRating;
	priority: Priority;
	notes: string;
	expired?: boolean;
	expiredOn?: string;
	altUrl?: string;
	altUrlLabel?: string;
	source?: 'search' | 'saved';
	easyApply?: boolean;
	normalizedTitle?: string;
	jobDescription?: string;
}

export interface SavedSearch {
	id: string;
	query: string;
	date: string;
	totalResults: number;
	topLeads: number;
	results: SearchResult[];
	nextSteps: string[];
}

export interface CompanyResearch {
	id: string;
	name: string;
	rating: number | null;
	salaryRange: string;
	location: string;
	remote: boolean;
	size: string;
	industry: string;
	culture: string;
	pros: string[];
	cons: string[];
	notes: string;
	dateResearched: string;
}

export interface ActivityItem {
	id: string;
	type: 'search' | 'application' | 'status_change' | 'interview' | 'offer';
	message: string;
	date: string;
	meta?: string;
}

export interface DashboardStats {
	totalApplications: number;
	activeSearches: number;
	interviewsScheduled: number;
	offers: number;
}

/** Job title effectiveness tracking */
export type TitleVerdict = 'works' | 'sometimes' | 'never';

export interface JobTitleAnalytics {
	id: string;
	title: string;
	source: 'indeed' | 'custom';
	verdict: TitleVerdict;
	timesSearched: number;
	timesRelevant: number;
	notes: string;
	lastUsed: string;
}

/** Company target — a company you're actively hunting jobs at */
export interface CompanyTarget {
	id: string;
	name: string;
	slug: string;
	description: string;
	industry: string;
	location: string;
	avgSalary: string | null;
	ceoApproval: number | null;
	recommendToFriend: number | null;
	interviewDifficulty: string | null;
	companyPageUrl: string | null;
	logoUrl: string | null;
	whyTarget: string;
	fitAngle: string;
	jobs: SearchResult[];
	dateResearched: string;
}

// === Interview Prep Types ===

export type InterviewPlatform = 'Teams' | 'Zoom' | 'Google Meet' | 'Phone' | 'In-person' | 'Other';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type InterviewRound =
	| 'recruiter-screen'
	| 'hiring-manager'
	| 'technical'
	| 'system-design'
	| 'behavioral'
	| 'panel'
	| 'final'
	| 'offer-call';

export interface Interview {
	id: string;
	company: string;
	role: string;
	date: string;
	time: string;
	timezone: string;
	platform: InterviewPlatform;
	round: InterviewRound;
	interviewers: string[];
	meetingUrl?: string;
	status: InterviewStatus;
	prepNotes: string;
	postNotes?: string;
	selfRating?: number;
	followUpSent?: boolean;
}

export type StoryCategory =
	| 'ad-tech'
	| 'debugging'
	| 'leadership'
	| 'architecture'
	| 'impact'
	| 'collaboration'
	| 'streaming'
	| 'chromecast';

export interface InterviewStory {
	id: string;
	title: string;
	category: StoryCategory;
	content: string;
	landedWellAt: string[];
	addresses: string[];
}

export interface StudySection {
	id: string;
	title: string;
	content: string;
	tags: string[];
}

export interface PrepData {
	interviews: Interview[];
	stories: InterviewStory[];
	studySections: StudySection[];
}

// === Research Types ===

/** Category of research activity */
export type ResearchCategory =
	| 'wide-sweep'
	| 'company-deep-dive'
	| 'market-research'
	| 'job-search'
	| 'contract-sweep'
	| 'submissions';

export interface ResearchEntry {
	id: string;
	title: string;
	date: string;
	category: ResearchCategory;
	/** Which session produced this research (e.g. "Session 19") */
	session?: string;
	/** Sources searched (e.g. "Greenhouse, Indeed, Dice") */
	sources: string[];
	/** Companies covered in this research */
	companies: string[];
	/** Key findings — top-line summary bullets */
	highlights: string[];
	/** How many leads were found */
	leadsFound: number;
	/** Tier A leads count */
	tierACount: number;
	/** Link to the original markdown file in searches/ or companies/ */
	sourceFile?: string;
}

// === Recruiter Types ===

/** Where in the relationship a recruiter is */
export type RecruiterStatus =
	| 'active' // active back-and-forth conversation
	| 'awaiting-reply' // Owner sent something, waiting on them
	| 'cold-pitched' // they pitched, Owner hasn't replied yet
	| 'declined' // Owner declined or they passed — warm close
	| 'placed' // they successfully placed Owner (historical)
	| 'closed'; // dead thread, no further activity expected

/** Signal quality of the staffing firm — pulls from reference_dice_staffing_firm_triage.md */
export type SignalTier = 'signal' | 'noise' | 'unrated';

/** What kind of roles the recruiter sends */
export type RoleFocus = 'frontend' | 'fullstack' | 'video' | 'backend' | 'staff-plus' | 'mixed';

/** Engagement type the recruiter handles */
export type ContractType = 'contract' | 'c2h' | 'permanent' | 'mixed';

/** Direction of a touch event */
export type TouchDirection = 'in' | 'out';

/** Channel a touch happened on */
export type TouchChannel = 'email' | 'phone' | 'voicemail' | 'linkedin' | 'sms' | 'meeting';

export interface RecruiterTouch {
	/** ISO YYYY-MM-DD */
	date: string;
	direction: TouchDirection;
	channel: TouchChannel;
	/** One-line summary of what happened */
	summary: string;
}

export interface Recruiter {
	id: string;
	name: string;
	firm: string;
	email?: string;
	phone?: string;
	linkedinUrl?: string;

	roleFocus: RoleFocus[];
	contractTypes: ContractType[];

	/** Where Owner first met them */
	source: JobSource;

	signalTier: SignalTier;
	/** Why signal/noise — short note pulled from triage memory if known */
	signalNotes?: string;

	status: RecruiterStatus;
	touches: RecruiterTouch[];

	/** Free-text reminder, e.g. "nudge if no reply by 5/22" */
	nextStep?: string;
	/** ISO YYYY-MM-DD when nextStep becomes overdue */
	nextStepDue?: string;

	/** Application IDs this recruiter sourced */
	linkedAppIds: string[];

	/** Client company being staffed for, if known */
	clientCompany?: string;
	/** Observed compensation range from conversations */
	observedCompRange?: string;

	notes: string;
	dateFirstContact: string;
	/** Cached — set from latest touch date when writing */
	dateLastTouch: string;
}
