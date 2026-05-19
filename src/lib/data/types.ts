export type ApplicationStatus =
	| 'saved'
	| 'applied'
	| 'screening'
	| 'interview'
	| 'offer'
	| 'accepted'
	| 'rejected';

export type FitRating = 'HIGH' | 'MEDIUM' | 'LOW' | 'NEEDS_REVIEW';

/** Priority tiers for job results */
export type Priority = 'P1' | 'P2' | 'P3' | 'SKIP';


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
	| 'tiktok-careers'
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
	/** Overall score 1-5 (weighted average of dimensions) */
	score?: number;
	/** Per-dimension breakdown */
	scoreDimensions?: ScoreDimensions;
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
export type InterviewRound = 'recruiter-screen' | 'hiring-manager' | 'technical' | 'system-design' | 'behavioral' | 'panel' | 'final' | 'offer-call';

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
	| 'active'           // active back-and-forth conversation
	| 'awaiting-reply'   // Walter sent something, waiting on them
	| 'cold-pitched'     // they pitched, Walter hasn't replied yet
	| 'declined'         // Walter declined or they passed — warm close
	| 'placed'           // they successfully placed Walter (historical)
	| 'closed';          // dead thread, no further activity expected

/** Signal quality of the staffing firm — pulls from reference_dice_staffing_firm_triage.md */
export type SignalTier = 'signal' | 'noise' | 'unrated';

/** What kind of roles the recruiter sends */
export type RoleFocus =
	| 'frontend'
	| 'fullstack'
	| 'video'
	| 'backend'
	| 'staff-plus'
	| 'mixed';

/** Engagement type the recruiter handles */
export type ContractType = 'contract' | 'c2h' | 'permanent' | 'mixed';

/** Direction of a touch event */
export type TouchDirection = 'in' | 'out';

/** Channel a touch happened on */
export type TouchChannel =
	| 'email'
	| 'phone'
	| 'voicemail'
	| 'linkedin'
	| 'sms'
	| 'meeting';

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

	/** Where Walter first met them */
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
