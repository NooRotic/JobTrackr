# Recruiters View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/recruiters` route to JobTrackr that tracks the relationship side of the job search — who's pitched Walter, when, what came of it, and which applications they sourced.

**Architecture:** New data layer (`recruiters.ts` + `personal/recruiters.ts`) mirroring the existing applications dual-data pattern. New route page using the grid-of-expandable-cards pattern from `/companies`, not kanban. Touch log + linked-application cross-reference live inside the expanded card detail. Optional `recruiterId` field on `Application` enables back-linking. Phase 1 only — no Gmail MCP, no notifications, no analytics (those are deferred future work).

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), TypeScript 5, Tailwind 4. No new dependencies.

**Verification convention:** This codebase has no test framework (no vitest/playwright in `package.json` devDependencies). Verification per task is `bun run check` (svelte-check) for type safety, plus a manual browser smoke at the end. This matches existing convention for all other features in the dashboard.

---

## Source material for personal data seeding

The personal recruiter data (Task 4) is seeded from these memory files. The implementing agent does not need to invent names or details — read them out of memory:

- `C:\Users\NooRo\.claude\projects\C--Dev-projects-indeed-me\memory\project_session_state_20260514.md` — Rohit, Soni, Ravinder, Divya, Sanmitha, Suganth (current pipeline)
- `C:\Users\NooRo\.claude\projects\C--Dev-projects-indeed-me\memory\project_brainstorm_queue.md` — Meredith Beck (KForce), Tarun (Mindlance), Ian (GlobalMeet) — older threads named in the original brainstorm source line
- `C:\Users\NooRo\.claude\projects\C--Dev-projects-indeed-me\memory\reference_dice_staffing_firm_triage.md` — signal/noise tier rankings per firm (Pyramid/VDart/Codex/Beacon Hill = signal; Robert Half/V-CENTRIX/Apetan = noise)
- `C:\Users\NooRo\.claude\projects\C--Dev-projects-indeed-me\memory\project_endure_opensesame_call_20260511.md` — Rohit/Endure details (rate, non-exclusivity, client de-anonymized as OpenSesame)

---

## File structure

**New files:**
- `src/lib/data/types.ts` — modify (add Recruiter types)
- `src/lib/data/recruiterStates.ts` — create (status config, mirror states.ts pattern)
- `src/lib/data/recruiters.ts` — create (demo data)
- `src/lib/data/personal/recruiters.ts` — create (real data, gitignored via existing personal/ pattern)
- `src/lib/data/index.ts` — modify (wire recruiters into demo/live toggle)
- `src/lib/components/SignalTierBadge.svelte` — create
- `src/lib/components/RecruiterStatusBadge.svelte` — create
- `src/routes/recruiters/+page.svelte` — create
- `src/routes/+layout.svelte` — modify (add nav entry)

**Responsibility split:**
- Types live in `types.ts` (single source of truth).
- Status display config (label/color/badge classes) lives in `recruiterStates.ts`, mirroring how `states.ts` does it for application statuses — keeps display config out of types and out of components.
- Demo and personal data files have identical shape; only `index.ts` knows about the toggle.
- Badges are dumb display components — they take a status and render. No data fetching.
- The route page handles all filter/sort/select state via Svelte 5 runes — same pattern as `/applications`.

---

## Task 1: Add Recruiter types

**Files:**
- Modify: `src/lib/data/types.ts` (append at end of file)
- Modify: `src/lib/data/index.ts` (re-export types)

- [ ] **Step 1: Add the type definitions to `src/lib/data/types.ts`**

Append at the end of the file:

```typescript
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
```

- [ ] **Step 2: Re-export types from `src/lib/data/index.ts`**

Add to the type re-export block at the bottom of `src/lib/data/index.ts` (currently ends with `ScoreDimensions`):

```typescript
export type {
	// ... existing exports preserved ...
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
```

- [ ] **Step 3: Verify types compile**

Run: `bun run check`
Expected: PASS with 0 type errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/types.ts src/lib/data/index.ts
git commit -m "feat(recruiters): add Recruiter and RecruiterTouch types"
```

---

## Task 2: Recruiter status config

**Files:**
- Create: `src/lib/data/recruiterStates.ts`

- [ ] **Step 1: Create the status config file**

Create `src/lib/data/recruiterStates.ts`:

```typescript
import type { RecruiterStatus } from './types';

export interface RecruiterStatusConfig {
	status: RecruiterStatus;
	label: string;
	color: string;
	/** Tailwind classes for the badge */
	badgeClass: string;
	/** Whether this status is "live" (counts toward active relationships) */
	live: boolean;
}

/**
 * Canonical recruiter status definitions.
 * Ordering matters: this array defines display order in filter chips.
 */
export const RECRUITER_STATUS_CONFIG: RecruiterStatusConfig[] = [
	{
		status: 'active',
		label: 'Active',
		color: '#39ff14',
		badgeClass: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30',
		live: true
	},
	{
		status: 'awaiting-reply',
		label: 'Awaiting Reply',
		color: '#3b82f6',
		badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
		live: true
	},
	{
		status: 'cold-pitched',
		label: 'Cold Pitched',
		color: '#f59e0b',
		badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
		live: true
	},
	{
		status: 'declined',
		label: 'Declined',
		color: '#94a3b8',
		badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
		live: false
	},
	{
		status: 'placed',
		label: 'Placed',
		color: '#10b981',
		badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
		live: false
	},
	{
		status: 'closed',
		label: 'Closed',
		color: '#6b7280',
		badgeClass: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
		live: false
	}
];

export const RECRUITER_STATUS_MAP: Record<RecruiterStatus, RecruiterStatusConfig> =
	Object.fromEntries(RECRUITER_STATUS_CONFIG.map((s) => [s.status, s])) as Record<
		RecruiterStatus,
		RecruiterStatusConfig
	>;

export const ALL_RECRUITER_STATUSES: RecruiterStatus[] = RECRUITER_STATUS_CONFIG.map(
	(s) => s.status
);

export const LIVE_RECRUITER_STATUSES: RecruiterStatus[] = RECRUITER_STATUS_CONFIG.filter(
	(s) => s.live
).map((s) => s.status);

/** Signal tier display config */
export const SIGNAL_TIER_CONFIG = {
	signal: {
		label: 'Signal',
		color: '#39ff14',
		badgeClass: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30'
	},
	noise: {
		label: 'Noise',
		color: '#ef4444',
		badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30'
	},
	unrated: {
		label: 'Unrated',
		color: '#6b7280',
		badgeClass: 'bg-gray-500/15 text-gray-400 border-gray-500/30'
	}
} as const;
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/recruiterStates.ts
git commit -m "feat(recruiters): add status config module"
```

---

## Task 3: Demo recruiters data

**Files:**
- Create: `src/lib/data/recruiters.ts`

- [ ] **Step 1: Create demo data**

Create `src/lib/data/recruiters.ts`:

```typescript
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
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/recruiters.ts
git commit -m "feat(recruiters): add demo recruiter data"
```

---

## Task 4: Personal recruiters data (seeded from memory)

**Files:**
- Create: `src/lib/data/personal/recruiters.ts`

> **Implementer note:** Read the memory files listed in the "Source material" section at the top of this plan. The entries below are the seeded state as of 2026-05-18 — extracted from `project_session_state_20260514.md` and `project_brainstorm_queue.md`. Do not invent details beyond what's in those files. Where a touch summary is uncertain, write a short factual placeholder like "Outbound nudge" rather than fabricating content.

- [ ] **Step 1: Create the personal data file**

Create `src/lib/data/personal/recruiters.ts`:

```typescript
import type { Recruiter } from '../types';

/**
 * Real recruiter contacts. This file is gitignored via the existing
 * src/lib/data/personal/ pattern. Update as touches happen.
 *
 * Seed as of 2026-05-18 — extracted from project_session_state_20260514.md
 * and project_brainstorm_queue.md.
 */
export const recruiters: Recruiter[] = [
	{
		id: 'rec-001',
		name: 'Rohit Gavali',
		firm: 'Endure Tech',
		clientCompany: 'OpenSesame (Portland OR, 201-500, $25-100M rev)',
		roleFocus: ['video', 'frontend'],
		contractTypes: ['contract'],
		source: 'linkedin',
		signalTier: 'signal',
		signalNotes: 'Real client problem (Safari/Firefox DRM JWT debug), non-exclusivity confirmed, disclosed rate band $120-125 with room to counter.',
		status: 'awaiting-reply',
		touches: [
			{
				date: '2026-05-08',
				direction: 'in',
				channel: 'email',
				summary: 'Initial pitch — Principal FrontEnd / Video.js contract'
			},
			{
				date: '2026-05-11',
				direction: 'in',
				channel: 'meeting',
				summary: 'Phone call: client de-anonymized as OpenSesame, rate $125 W2/$120 C2C floated, Walter countered $125-150'
			}
		],
		nextStep: 'Nudge re: client response (was due 5/15; 4 days overdue as of 2026-05-18)',
		nextStepDue: '2026-05-15',
		linkedAppIds: ['app-078'],
		observedCompRange: '$120-150/hr',
		notes: 'Awaiting client response via Rohit. Walter explicitly deferred nudge from 5/14.',
		dateFirstContact: '2026-05-08',
		dateLastTouch: '2026-05-11'
	},
	{
		id: 'rec-002',
		name: 'Soni Sharma',
		firm: 'Spectraforce',
		clientCompany: 'Meta — Horizon Multimedia',
		roleFocus: ['video', 'staff-plus'],
		contractTypes: ['contract'],
		source: 'linkedin',
		signalTier: 'unrated',
		signalNotes: 'Spectraforce-tier; same Meta req being worked by Ravinder and Divya (triangulation pattern).',
		status: 'awaiting-reply',
		touches: [
			{
				date: '2026-05-05',
				direction: 'in',
				channel: 'email',
				summary: 'Initial Meta Horizon Multimedia pitch'
			},
			{
				date: '2026-05-06',
				direction: 'out',
				channel: 'email',
				summary: 'Outbound reply with stack match framing'
			}
		],
		nextStep: 'Hold — triangulation pressure with Ravinder + Divya is the lever',
		linkedAppIds: [],
		notes: 'Silent since 5/6. Part of three-recruiter triangulation on same Meta req.',
		dateFirstContact: '2026-05-05',
		dateLastTouch: '2026-05-06'
	},
	{
		id: 'rec-003',
		name: 'Ravinder',
		firm: 'Spectraforce',
		clientCompany: 'Meta — Horizon Multimedia',
		roleFocus: ['video', 'staff-plus'],
		contractTypes: ['contract'],
		source: 'linkedin',
		signalTier: 'unrated',
		status: 'awaiting-reply',
		touches: [
			{
				date: '2026-05-07',
				direction: 'in',
				channel: 'email',
				summary: 'Initial Meta Horizon pitch (same req as Soni)'
			},
			{
				date: '2026-05-08',
				direction: 'out',
				channel: 'email',
				summary: 'Outbound reply'
			}
		],
		linkedAppIds: [],
		notes: 'Silent since 5/8. Same req as rec-002 and rec-004.',
		dateFirstContact: '2026-05-07',
		dateLastTouch: '2026-05-08'
	},
	{
		id: 'rec-004',
		name: 'Divya Bhatia',
		firm: 'Spectraforce',
		clientCompany: 'Meta — Horizon Multimedia',
		roleFocus: ['video', 'staff-plus'],
		contractTypes: ['contract'],
		source: 'linkedin',
		signalTier: 'unrated',
		status: 'awaiting-reply',
		touches: [
			{
				date: '2026-05-11',
				direction: 'in',
				channel: 'email',
				summary: 'Initial Meta Horizon pitch (same req as Soni and Ravinder)'
			},
			{
				date: '2026-05-14',
				direction: 'out',
				channel: 'email',
				summary: 'Revised reply 17:30 ET — triangulation framing, asked Divya to sync internally with Soni and Ravinder'
			}
		],
		linkedAppIds: [],
		notes: 'Most recent of the three Spectraforce contacts on the same Meta Horizon req.',
		dateFirstContact: '2026-05-11',
		dateLastTouch: '2026-05-14'
	},
	{
		id: 'rec-005',
		name: 'Sanmitha E',
		firm: 'vDart',
		roleFocus: ['mixed'],
		contractTypes: ['contract'],
		source: 'dice',
		signalTier: 'signal',
		signalNotes: 'vDart is signal-tier per reference_dice_staffing_firm_triage.md — kept warm despite this specific pitch being off-stack.',
		status: 'declined',
		touches: [
			{
				date: '2026-05-13',
				direction: 'in',
				channel: 'email',
				summary: 'IAM SME pitch (SME keyword-scrape pattern)'
			},
			{
				date: '2026-05-14',
				direction: 'out',
				channel: 'email',
				summary: 'Relationship-warm decline; explicit invite for video/Smart TV roles'
			}
		],
		linkedAppIds: [],
		notes: 'SME keyword scrape per reference_sme_keyword_scrape_pattern.md. Door left open for in-stack roles.',
		dateFirstContact: '2026-05-13',
		dateLastTouch: '2026-05-14'
	},
	{
		id: 'rec-006',
		name: 'Suganth T',
		firm: 'vDart',
		roleFocus: ['mixed'],
		contractTypes: ['contract'],
		source: 'dice',
		signalTier: 'signal',
		signalNotes: 'vDart signal-tier; similar SME-scrape pattern as Sanmitha.',
		status: 'cold-pitched',
		touches: [
			{
				date: '2026-05-11',
				direction: 'in',
				channel: 'email',
				summary: 'AI Developer Tools Consultant pitch (SME-scrape pattern)'
			}
		],
		nextStep: 'Decide whether to decline-with-warmth or ignore',
		linkedAppIds: [],
		notes: 'Walter has draft reply from 5/12, never sent. His call whether to engage.',
		dateFirstContact: '2026-05-11',
		dateLastTouch: '2026-05-11'
	},
	{
		id: 'rec-007',
		name: 'Meredith Beck',
		firm: 'KForce',
		clientCompany: 'JPMC',
		roleFocus: ['frontend', 'fullstack'],
		contractTypes: ['c2h', 'permanent'],
		source: 'linkedin',
		signalTier: 'unrated',
		status: 'awaiting-reply',
		touches: [
			{
				date: '2026-05-05',
				direction: 'out',
				channel: 'email',
				summary: 'Counter sent on JPMC role'
			}
		],
		linkedAppIds: [],
		notes: 'Counter sent 5/5, no response yet as of brainstorm queue entry 5/6.',
		dateFirstContact: '2026-04-28',
		dateLastTouch: '2026-05-05'
	},
	{
		id: 'rec-008',
		name: 'Tarun',
		firm: 'Mindlance',
		roleFocus: ['mixed'],
		contractTypes: ['contract'],
		source: 'linkedin',
		signalTier: 'unrated',
		status: 'cold-pitched',
		touches: [
			{
				date: '2026-05-05',
				direction: 'in',
				channel: 'email',
				summary: 'Initial pitch (per brainstorm queue source line)'
			}
		],
		linkedAppIds: [],
		notes: 'Listed among 5 active recruiter threads as of 2026-05-06 brainstorm queue.',
		dateFirstContact: '2026-05-05',
		dateLastTouch: '2026-05-05'
	},
	{
		id: 'rec-009',
		name: 'Ian',
		firm: 'GlobalMeet',
		roleFocus: ['video'],
		contractTypes: ['mixed'],
		source: 'linkedin',
		signalTier: 'unrated',
		status: 'cold-pitched',
		touches: [
			{
				date: '2026-05-04',
				direction: 'in',
				channel: 'email',
				summary: 'Initial pitch (per brainstorm queue source line)'
			}
		],
		linkedAppIds: [],
		notes: 'Listed among 5 active recruiter threads as of 2026-05-06 brainstorm queue.',
		dateFirstContact: '2026-05-04',
		dateLastTouch: '2026-05-04'
	}
];
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 3: Commit**

The personal/ directory is gitignored per existing convention; this commit may show 0 files staged depending on `.gitignore`. Stage explicitly using `git add -f` only if Walter wants the seed checked in (default: no — keep gitignored).

```bash
git status   # confirm personal/recruiters.ts is gitignored
```

If gitignored (expected), no commit. If not gitignored, ask Walter before deciding.

---

## Task 5: Wire recruiters into the data index

**Files:**
- Modify: `src/lib/data/index.ts`

- [ ] **Step 1: Add demo import**

In `src/lib/data/index.ts`, add to the demo imports block (after the `demoResearch` line, around line 27):

```typescript
import { recruiters as demoRecruiters } from './recruiters';
```

- [ ] **Step 2: Add the mutable binding**

In the same file, add after `let research = demoResearch;` (around line 71):

```typescript
let recruiters = demoRecruiters;
```

- [ ] **Step 3: Add the personal-data override**

In the same file, inside the `if (!isDemoMode()) {` block (around line 73), add after the last `try { ... } catch {}` block:

```typescript
	try {
		const p = await import('./personal/recruiters');
		recruiters = p.recruiters;
	} catch {}
```

- [ ] **Step 4: Add to the exports block**

Update the value exports (around line 113):

```typescript
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
```

- [ ] **Step 5: Verify**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/index.ts
git commit -m "feat(recruiters): wire data into demo/live toggle"
```

---

## Task 6: Optional Application↔Recruiter link

**Files:**
- Modify: `src/lib/data/types.ts`

- [ ] **Step 1: Add optional field to `Application`**

In `src/lib/data/types.ts`, modify the `Application` interface. Add this field after `source?: JobSource;`:

```typescript
	/** Recruiter who sourced this application, if any */
	recruiterId?: string;
```

- [ ] **Step 2: Verify**

Run: `bun run check`
Expected: PASS — no callers reference the field yet, so adding an optional one is safe.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/types.ts
git commit -m "feat(applications): add optional recruiterId back-link"
```

> **Note for implementer:** Backfilling existing applications with `recruiterId` is out of scope for this plan. The field is now available; Walter or a future task can wire it up retroactively (e.g. `app-078` → `rec-001`).

---

## Task 7: SignalTierBadge component

**Files:**
- Create: `src/lib/components/SignalTierBadge.svelte`

- [ ] **Step 1: Create the component**

Create `src/lib/components/SignalTierBadge.svelte`:

```svelte
<script lang="ts">
	import type { SignalTier } from '$lib/data/types';
	import { SIGNAL_TIER_CONFIG } from '$lib/data/recruiterStates';

	let { tier }: { tier: SignalTier } = $props();

	let cfg = $derived(SIGNAL_TIER_CONFIG[tier]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.badgeClass}"
>
	{cfg.label}
</span>
```

- [ ] **Step 2: Verify**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/SignalTierBadge.svelte
git commit -m "feat(recruiters): add SignalTierBadge component"
```

---

## Task 8: RecruiterStatusBadge component

**Files:**
- Create: `src/lib/components/RecruiterStatusBadge.svelte`

- [ ] **Step 1: Create the component**

Create `src/lib/components/RecruiterStatusBadge.svelte`:

```svelte
<script lang="ts">
	import type { RecruiterStatus } from '$lib/data/types';
	import { RECRUITER_STATUS_MAP } from '$lib/data/recruiterStates';

	let { status }: { status: RecruiterStatus } = $props();

	let cfg = $derived(RECRUITER_STATUS_MAP[status]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.badgeClass}"
>
	{cfg.label}
</span>
```

- [ ] **Step 2: Verify**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/RecruiterStatusBadge.svelte
git commit -m "feat(recruiters): add RecruiterStatusBadge component"
```

---

## Task 9: Recruiters route page

**Files:**
- Create: `src/routes/recruiters/+page.svelte`

- [ ] **Step 1: Create the route page**

Create `src/routes/recruiters/+page.svelte`:

```svelte
<script lang="ts">
	import { recruiters, applications } from '$lib/data';
	import type { Recruiter, RecruiterStatus, SignalTier } from '$lib/data/types';
	import {
		RECRUITER_STATUS_CONFIG,
		ALL_RECRUITER_STATUSES
	} from '$lib/data/recruiterStates';
	import RecruiterStatusBadge from '$lib/components/RecruiterStatusBadge.svelte';
	import SignalTierBadge from '$lib/components/SignalTierBadge.svelte';

	const TODAY = new Date().toISOString().split('T')[0];

	let selected = $state<Recruiter | null>(null);
	let statusFilter = $state<RecruiterStatus | 'all'>('all');
	let tierFilter = $state<SignalTier | 'all'>('all');
	let searchQuery = $state('');

	function isOverdue(r: Recruiter): boolean {
		return !!r.nextStepDue && r.nextStepDue < TODAY;
	}

	function appsFor(recruiterId: string) {
		return applications.filter((a) => a.recruiterId === recruiterId);
	}

	const filtered = $derived(
		recruiters
			.filter((r) => statusFilter === 'all' || r.status === statusFilter)
			.filter((r) => tierFilter === 'all' || r.signalTier === tierFilter)
			.filter((r) => {
				if (!searchQuery.trim()) return true;
				const q = searchQuery.toLowerCase();
				return (
					r.name.toLowerCase().includes(q) ||
					r.firm.toLowerCase().includes(q) ||
					(r.clientCompany ?? '').toLowerCase().includes(q)
				);
			})
			.sort((a, b) => {
				const aOver = isOverdue(a);
				const bOver = isOverdue(b);
				if (aOver && !bOver) return -1;
				if (bOver && !aOver) return 1;
				return b.dateLastTouch.localeCompare(a.dateLastTouch);
			})
	);

	const overdueCount = $derived(recruiters.filter(isOverdue).length);
</script>

<svelte:head>
	<title>Recruiters — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
				Recruiters
			</h1>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				{recruiters.length} total
				{#if overdueCount > 0}
					·
					<span style="color: #f59e0b">{overdueCount} overdue follow-up{overdueCount === 1 ? '' : 's'}</span>
				{/if}
			</p>
		</div>

		<input
			bind:value={searchQuery}
			placeholder="Search name, firm, or client…"
			class="rounded-lg px-3 py-2 text-sm sm:w-64"
			style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)"
		/>
	</div>

	<!-- Filter chips -->
	<div class="flex flex-wrap gap-2">
		<button
			onclick={() => (statusFilter = 'all')}
			class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
			style={statusFilter === 'all'
				? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border-color: rgba(57,255,20,0.3)'
				: 'background: rgba(255,255,255,0.03); color: var(--color-text-secondary); border-color: var(--color-border)'}
		>
			All Statuses
		</button>
		{#each RECRUITER_STATUS_CONFIG as s}
			<button
				onclick={() => (statusFilter = s.status)}
				class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
				style={statusFilter === s.status
					? `background: ${s.color}22; color: ${s.color}; border-color: ${s.color}55`
					: 'background: rgba(255,255,255,0.03); color: var(--color-text-secondary); border-color: var(--color-border)'}
			>
				{s.label}
			</button>
		{/each}

		<span class="mx-2" style="color: var(--color-text-muted)">|</span>

		{#each ['all', 'signal', 'noise', 'unrated'] as t}
			<button
				onclick={() => (tierFilter = t as SignalTier | 'all')}
				class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
				style={tierFilter === t
					? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border-color: rgba(57,255,20,0.3)'
					: 'background: rgba(255,255,255,0.03); color: var(--color-text-secondary); border-color: var(--color-border)'}
			>
				{t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}
			</button>
		{/each}
	</div>

	<!-- Grid -->
	<div class="stagger-children grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each filtered as r (r.id)}
			{@const isSelected = selected?.id === r.id}
			{@const overdue = isOverdue(r)}
			{@const linked = appsFor(r.id)}

			<button
				onclick={() => (selected = isSelected ? null : r)}
				class="card card-hover cursor-pointer p-5 text-left transition-all"
				style={isSelected
					? 'border-color: rgba(57,255,20,0.35); box-shadow: 0 0 0 1px rgba(57,255,20,0.1), 0 8px 32px rgba(0,0,0,0.4)'
					: overdue
						? 'border-color: rgba(245,158,11,0.3)'
						: ''}
			>
				<!-- Top row -->
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<h3 class="truncate font-bold" style="color: var(--color-text-primary)">{r.name}</h3>
						<p class="mt-0.5 text-xs" style="color: var(--color-text-secondary)">{r.firm}</p>
					</div>
					<div class="flex shrink-0 flex-col items-end gap-1">
						<RecruiterStatusBadge status={r.status} />
						<SignalTierBadge tier={r.signalTier} />
					</div>
				</div>

				<!-- Meta -->
				{#if r.clientCompany}
					<p class="mt-3 text-xs" style="color: var(--color-text-muted)">
						Client: <span style="color: var(--color-text-secondary)">{r.clientCompany}</span>
					</p>
				{/if}

				<p class="mt-1 text-xs" style="color: var(--color-text-muted)">
					Last touch: {r.dateLastTouch} · {r.touches.length} touch{r.touches.length === 1 ? '' : 'es'}
					{#if linked.length > 0}
						· {linked.length} app{linked.length === 1 ? '' : 's'}
					{/if}
				</p>

				<!-- Overdue / next-step pill -->
				{#if overdue}
					<p class="mt-2 text-xs font-medium" style="color: #f59e0b">
						⚠ Overdue: {r.nextStep ?? 'follow up'} ({r.nextStepDue})
					</p>
				{:else if r.nextStep}
					<p class="mt-2 text-xs" style="color: var(--color-text-muted)">
						Next: {r.nextStep}
						{#if r.nextStepDue}
							<span style="color: var(--color-text-secondary)"> · due {r.nextStepDue}</span>
						{/if}
					</p>
				{/if}

				<!-- Expanded detail -->
				{#if isSelected}
					<div class="mt-4 space-y-4 border-t pt-4" style="border-color: var(--color-border)">
						<!-- Touch log -->
						<div>
							<p class="mb-2 text-xs font-medium" style="color: var(--color-text-muted)">
								Touch log ({r.touches.length})
							</p>
							<ul class="space-y-2">
								{#each [...r.touches].reverse() as t}
									<li class="text-xs">
										<span style="color: var(--color-text-muted)">{t.date}</span>
										<span style="color: var(--color-neon)"> · {t.direction === 'in' ? '←' : '→'} </span>
										<span style="color: var(--color-text-muted)">{t.channel}</span>
										<span style="color: var(--color-text-secondary)"> — {t.summary}</span>
									</li>
								{/each}
							</ul>
						</div>

						<!-- Linked applications -->
						{#if linked.length > 0}
							<div>
								<p class="mb-2 text-xs font-medium" style="color: var(--color-text-muted)">
									Linked applications
								</p>
								<ul class="space-y-1">
									{#each linked as app}
										<li class="text-xs">
											<a
												href="/applications"
												class="transition-colors hover:opacity-80"
												style="color: var(--color-neon)"
												onclick={(e) => e.stopPropagation()}
											>
												{app.id}
											</a>
											<span style="color: var(--color-text-secondary)"> · {app.company} — {app.role}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Notes -->
						{#if r.notes}
							<div>
								<p class="mb-1 text-xs font-medium" style="color: var(--color-text-muted)">Notes</p>
								<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">
									{r.notes}
								</p>
							</div>
						{/if}

						<!-- Signal notes -->
						{#if r.signalNotes}
							<div>
								<p class="mb-1 text-xs font-medium" style="color: var(--color-text-muted)">
									Signal-tier reasoning
								</p>
								<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">
									{r.signalNotes}
								</p>
							</div>
						{/if}

						<!-- Contact methods -->
						<div class="flex flex-wrap gap-3 text-xs">
							{#if r.email}
								<a
									href="mailto:{r.email}"
									onclick={(e) => e.stopPropagation()}
									style="color: var(--color-neon)"
								>
									{r.email}
								</a>
							{/if}
							{#if r.phone}
								<span style="color: var(--color-text-muted)">{r.phone}</span>
							{/if}
							{#if r.linkedinUrl}
								<a
									href={r.linkedinUrl}
									target="_blank"
									rel="noopener noreferrer"
									onclick={(e) => e.stopPropagation()}
									style="color: var(--color-neon)"
								>
									LinkedIn ↗
								</a>
							{/if}
						</div>
					</div>
				{/if}
			</button>
		{/each}

		{#if filtered.length === 0}
			<div
				class="col-span-full rounded-lg py-12 text-center text-sm"
				style="border: 1px dashed var(--color-border); color: var(--color-text-muted)"
			>
				No recruiters match the current filters.
			</div>
		{/if}
	</div>

	<!-- Persistence note (matches Applications page convention) -->
	<div class="rounded-xl p-4" style="background: rgba(255,255,255,0.02); border: 1px dashed var(--color-border)">
		<p class="text-xs" style="color: var(--color-text-muted)">
			Recruiter entries live in
			<code style="color: var(--color-neon)">src/lib/data/personal/recruiters.ts</code>.
			Update that file directly to log touches, change status, or link applications via the
			<code style="color: var(--color-neon)">recruiterId</code> field on
			<code style="color: var(--color-neon)">applications.ts</code>.
		</p>
	</div>
</div>
```

- [ ] **Step 2: Verify**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/routes/recruiters/+page.svelte
git commit -m "feat(recruiters): add /recruiters route with filter + detail"
```

---

## Task 10: Nav integration

**Files:**
- Modify: `src/routes/+layout.svelte` (lines 24-36 — the `navItems` array)

- [ ] **Step 1: Add the Recruiters nav entry**

In `src/routes/+layout.svelte`, modify the `navItems` array. Insert the Recruiters entry directly after Applications:

```typescript
	const navItems = [
		{ href: '/', label: 'Dashboard', icon: '◈' },
		{ href: '/pipeline', label: 'Pipeline', icon: '⚡' },
		{ href: '/searches', label: 'Searches', icon: '⌕' },
		{ href: '/targets', label: 'Targets', icon: '◎' },
		{ href: '/applications', label: 'Applications', icon: '▣' },
		{ href: '/recruiters', label: 'Recruiters', icon: '☎' },
		{ href: '/companies', label: 'Companies', icon: '⬡' },
		{ href: '/research', label: 'Research', icon: '⊞' },
		{ href: '/analyze', label: 'Analyze', icon: '⊘' },
		{ href: '/analytics', label: 'Analytics', icon: '◆' },
		{ href: '/prep', label: 'Prep', icon: '◧' },
		{ href: '/profile', label: 'Profile', icon: '◉' }
	];
```

- [ ] **Step 2: Verify**

Run: `bun run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat(recruiters): add sidebar nav entry"
```

---

## Task 11: Manual verification

**Files:** none modified

- [ ] **Step 1: Start the dev server**

```bash
bun run dev
```

Expected: server starts on `http://localhost:5173` (or next free port) with no errors in terminal.

- [ ] **Step 2: Visual smoke test — demo mode**

In a browser:

1. Open `http://localhost:5173/?demo=true`
2. Click **Recruiters** in the sidebar (between Applications and Companies)
3. Verify the page renders 4 demo recruiters (Jamie Rivera, Marcus Chen, Priya Shah, Tom Whitman)
4. Click any card — it expands to show touch log, notes, contact methods
5. Toggle status filter chips — grid filters as expected
6. Toggle signal tier filter chips — grid filters as expected
7. Type "rivera" in search — only Jamie's card remains
8. Clear search

Expected: no console errors, all interactions work.

- [ ] **Step 3: Visual smoke test — live mode**

1. Click the data toggle in the sidebar footer (turns green = "Live Data")
2. Page reloads
3. Recruiters page now shows 9 real recruiters (Rohit, Soni, Ravinder, Divya, Sanmitha, Suganth, Meredith, Tarun, Ian)
4. Rohit Gavali (rec-001) should appear at top with **⚠ Overdue** pill (nextStepDue 2026-05-15, today 2026-05-18+)
5. Expanding Rohit's card shows the 2-touch log (5/8 email, 5/11 phone meeting) and signal notes

Expected: overdue sort works, all 9 entries render, no console errors.

- [ ] **Step 4: Type-check + lint sweep**

```bash
bun run check
bun run lint
```

Expected: both pass with 0 errors. `lint` may warn about formatting; if so, run `bun run format` and re-stage any auto-fixed files.

- [ ] **Step 5: Final commit (if any format fixes)**

```bash
git add -A
git commit -m "chore(recruiters): prettier auto-format pass"
```

(Skip if no formatting fixes needed.)

---

## Out of scope (deferred — write a Phase 2 spec later if Walter requests)

- Gmail MCP integration to auto-pull touch log entries from email threads
- Notification/tickler delivery (push, email, dashboard banner) for `nextStepDue`
- Recruiter-level analytics (which firms produce real opportunities vs time sinks)
- Edit-in-UI: currently `personal/recruiters.ts` is the only write path. Matches existing convention for applications/companies.
- Cross-page back-link UI on the Applications page (showing the linked recruiter on each app card)
- Bulk-import/CSV
- Multi-user / auth (single-user tool per existing design)

---

## Self-Review Notes

**Spec coverage check (vs `project_brainstorm_queue.md` requirements):**

| Brainstorm field requirement | Task |
|---|---|
| Name | Task 1 (`name`) |
| Firm | Task 1 (`firm`) |
| Role-type focus | Task 1 (`roleFocus`) |
| Source (Dice/LinkedIn/Indeed/referral/cold) | Task 1 (`source: JobSource`) |
| Signal/noise rating | Task 1 (`signalTier`), Task 2 (display config), Task 7 (badge) |
| Touch log (timestamped, direction, summary, date) | Task 1 (`RecruiterTouch`), Task 9 (timeline render) |
| Current status | Task 1 (`status`), Task 2 (config), Task 8 (badge) |
| Next-step tickler with date | Task 1 (`nextStep`, `nextStepDue`), Task 9 (overdue pill) |
| Linked applications | Task 1 (`linkedAppIds`), Task 6 (reciprocal `recruiterId`), Task 9 (linked apps list) |
| Company notes freeform | Task 1 (`notes`), Task 9 (notes section) |
| Filters: firm, status, recency, due date | Task 9 (status filter, tier filter, search by firm/name/client) |
| Sort: most recent touch first, overdue pinned | Task 9 (`filtered` derived sort) |
| New `/recruiters` route | Task 9 |
| Card-based layout | Task 9 (grid of expandable cards, mirrors Companies page) |
| Read from `personal/recruiters.ts` | Tasks 4 and 5 |

**Placeholder scan:** No TBDs, no "implement later", no "similar to Task N", no "add appropriate error handling" — all code is concrete and complete.

**Type-consistency check:** `recruiters` (lowercase plural) is used consistently as the exported binding name in tasks 3, 4, 5, 9. `Recruiter` is the singular type. `RECRUITER_STATUS_MAP` is used in task 8 and matches what's defined in task 2. `SIGNAL_TIER_CONFIG` is used in task 7 and matches task 2.

**Filter-by-firm vs filter-by-firm-name discrepancy:** the brainstorm queue asked for "filter by firm" but Task 9 implements name/firm/client search via a text input, not a dedicated firm dropdown. This is a conscious simplification — with 9 entries seeded, a dropdown would be noise; text search covers the same surface. If pipeline grows past ~30 recruiters, add a firm dropdown then.

