import type { Recruiter } from './types';

/**
 * Demo recruiters — public-safe fictional data shipped with the repo.
 * Real data lives in personal/recruiters.ts (gitignored).
 *
 * These mirror the demo-data spirit of demo applications/companies:
 * fictional people at made-up firms, plausible touch patterns.
 */
export const recruiters: Recruiter[] = [
	{
		id: 'rec-001',
		name: 'Jamie Rivera',
		firm: 'PixelTrail Talent',
		email: 'jamie@pixeltrail.example',
		roleFocus: ['frontend', 'fullstack'],
		contractTypes: ['permanent'],
		source: 'linkedin',
		signalTier: 'signal',
		signalNotes: 'Strong inbound quality; 2 referrals last quarter converted to onsites.',
		status: 'active',
		touches: [
			{
				date: '2026-05-12',
				direction: 'in',
				channel: 'email',
				summary: 'Pitched Senior FE role at NovaByte ($175K)'
			},
			{
				date: '2026-05-13',
				direction: 'out',
				channel: 'email',
				summary: 'Replied with availability, asked for JD'
			}
		],
		nextStep: 'Awaiting JD',
		nextStepDue: '2026-05-20',
		linkedAppIds: [],
		clientCompany: 'NovaByte',
		observedCompRange: '$170-200K',
		notes: 'Quick replier, prefers email over phone.',
		dateFirstContact: '2026-04-02',
		dateLastTouch: '2026-05-13'
	},
	{
		id: 'rec-002',
		name: 'Marcus Chen',
		firm: 'BridgePoint Staffing',
		email: 'mchen@bridgepoint.example',
		phone: '+1 555-0143',
		roleFocus: ['video', 'staff-plus'],
		contractTypes: ['contract', 'c2h'],
		source: 'dice',
		signalTier: 'signal',
		signalNotes: 'Specialized streaming/OTT vertical — rate disclosure upfront.',
		status: 'awaiting-reply',
		touches: [
			{
				date: '2026-05-08',
				direction: 'out',
				channel: 'email',
				summary: 'Sent rate counter ($120/hr W2 for StreamLine contract)'
			}
		],
		nextStep: 'Nudge if silent by 5/22',
		nextStepDue: '2026-05-22',
		linkedAppIds: [],
		clientCompany: 'StreamLine',
		observedCompRange: '$100-130/hr W2',
		notes: 'Pushes for fast turnaround; honest about client constraints.',
		dateFirstContact: '2026-03-15',
		dateLastTouch: '2026-05-08'
	},
	{
		id: 'rec-003',
		name: 'Priya Shah',
		firm: 'GenericPlace Recruiters',
		email: 'priya@genericplace.example',
		roleFocus: ['mixed'],
		contractTypes: ['contract'],
		source: 'dice',
		signalTier: 'noise',
		signalNotes: 'Keyword-scrape outreach pattern — pitches off-stack SME roles.',
		status: 'closed',
		touches: [
			{
				date: '2026-04-22',
				direction: 'in',
				channel: 'email',
				summary: 'Pitched IAM SME role (off-stack keyword scrape)'
			},
			{
				date: '2026-04-22',
				direction: 'out',
				channel: 'email',
				summary: 'Declined politely, kept door open for in-stack roles'
			}
		],
		linkedAppIds: [],
		notes: 'Standard SME-scrape noise; declined to preserve relationship-warmth.',
		dateFirstContact: '2026-04-22',
		dateLastTouch: '2026-04-22'
	},
	{
		id: 'rec-004',
		name: 'Tom Whitman',
		firm: 'Apex Direct',
		email: 'twhitman@apexdirect.example',
		roleFocus: ['staff-plus', 'fullstack'],
		contractTypes: ['permanent'],
		source: 'referral',
		signalTier: 'unrated',
		status: 'cold-pitched',
		touches: [
			{
				date: '2026-05-15',
				direction: 'in',
				channel: 'linkedin',
				summary: 'LinkedIn DM about Staff SWE role at DataWeave'
			}
		],
		nextStep: 'Decide whether to engage',
		linkedAppIds: [],
		clientCompany: 'DataWeave',
		notes: 'New contact — need to verify firm legitimacy before replying.',
		dateFirstContact: '2026-05-15',
		dateLastTouch: '2026-05-15'
	}
];
