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
