# JobTrackr — Project Ideas & Future Features

> Brainstorm doc. Track ideas, LOE estimates, and priorities for future development.

---

## V2 — Claude Integration (Chat in App)

### Vision
A chat panel inside JobTrackr where you can have working sessions like we do in Claude Code — job searching, JD review, company prep, cover letter generation — without switching to a terminal.

### Architecture Options

**Option A: Claude API Direct (recommended start)**
- SvelteKit server endpoint calls Claude API
- Chat panel in sidebar or slide-over
- Context: passes profile, applications, search history to Claude
- Claude responds with actions that write to data files or local DB
- **LOE: 2-3 days (~15-16 hrs)**
- **Cost: ~$0.01-0.05 per turn**
- **Limitation:** No Indeed MCP — paste JDs/URLs manually

**Option B: Claude API + MCP Bridge**
- Everything in A + backend calls Indeed MCP tools
- "Search Twitch" → Indeed search_jobs → results stream into UI
- **LOE: 4-5 days**
- **Limitation:** MCP server needs to be running locally

**Option C: Agent SDK**
- Anthropic Agent SDK with persistent memory, full tool suite
- **LOE: 1-2 weeks**
- **Overkill for single-user tool — save for if this goes multi-user**

### Option A Task Breakdown
| Task | Time |
|---|---|
| Claude API key in .env | 5 min |
| SvelteKit server endpoint for chat | 2 hrs |
| Chat panel UI (slide-over or sidebar) | 3 hrs |
| Context injection (profile, apps, searches) | 2 hrs |
| "Write to data" actions (add app, update status) | 3 hrs |
| Cover letter generation with voice/tone | 2 hrs |
| PDF trigger from chat | 1 hr |
| Testing + polish | 2 hrs |

### What It Enables
- "Search Netflix for senior roles" → results appear in searches
- "Review this JD" → paste URL, get fit assessment
- "Write a cover letter for this" → generates in your voice
- "Add this as saved" → updates applications data
- "What should I apply to next?" → reads pipeline, recommends

---

## Data Layer Improvements

### SQLite or IndexedDB Backend
- Replace TypeScript data files with a real database
- Enable CRUD from the UI without editing .ts files
- Persist changes across sessions natively
- **LOE: 4-6 hrs**

### Indeed Saved Jobs Auto-Sync
- Periodic import from Indeed's saved jobs JSON
- Detect new saves, expired listings, status changes
- **LOE: 2-3 hrs** (if Indeed API is accessible)

### Application Status Webhooks
- Watch email for Indeed/Greenhouse/Netflix responses
- Auto-update status when rejection/interview emails arrive
- **LOE: Research needed — depends on email integration approach**

---

## UI Improvements

### PDF Preview in App
- Render cover letter / portfolio PDFs inline before downloading
- Side-by-side editor: markdown left, PDF preview right
- **LOE: 3-4 hrs** (pdf.js or iframe embed)

### Drag-and-Drop Kanban
- Move application cards between columns with drag
- Persist status change on drop
- **LOE: 2-3 hrs** (svelte-dnd-action or custom)

### Dark/Light Theme Toggle
- Currently dark only
- Some users may prefer light for daytime use
- **LOE: 1-2 hrs** (CSS variables already in place)

### Mobile Responsive Polish
- Sidebar collapse works but kanban and targets pages need scroll optimization
- **LOE: 2-3 hrs**

---

## Search & Discovery

### Multi-Platform Search
- Search Indeed, Greenhouse, LinkedIn, ZipRecruiter from one interface
- Aggregate and deduplicate results
- **LOE: 1-2 weeks** (each platform has different scraping challenges)

### Company Profile Cards Auto-Generation
- Pull company data from Indeed/Glassdoor/LinkedIn when adding a target
- Auto-populate ratings, salary, culture, CEO approval
- **LOE: 3-4 hrs** (if Indeed MCP available)

### JD Analyzer
- Paste a JD, get: stack match %, keyword extraction, fit assessment, gap analysis
- Suggest which talking points to use
- **LOE: 2-3 hrs** (Claude API call with profile context)

---

## Cover Letter & Portfolio

### Template System
- Save the proven combined cover letter + portfolio template
- Swap company-specific copy, accent colors, and screenshots per application
- One-click generate from a saved template
- **LOE: 4-5 hrs**

### Company Color Themes
- Auto-detect or manually set brand colors per company
- Currently have: neon green (default), Twitch purple, Netflix red, Phillies red
- Store in company target data
- **LOE: 1-2 hrs**

### PDF Size Optimizer
- Already have image compression (800px max, 75% JPEG)
- Add option for high-quality vs compressed output
- **LOE: 30 min**

---

## Deployment & Publishing

### GitHub Pages Deployment
- Static adapter for SvelteKit
- GitHub Actions workflow: push to main → build → deploy
- Demo data only (personal data gitignored)
- **LOE: 20-30 min**

### Social Media Skill Plugin
- Package the social-media skill as a public Claude Code plugin
- `/social-media` command generates posts for any project
- Plan ready at `/mnt/c/dev/projects/claude-skill-social-media/PLAN.md`
- **LOE: 40 min**

---

## API Integrations (Long-Term / SaaS Path)

### Indeed GraphQL Partner API
- **Endpoint:** `POST https://apis.indeed.com/graphql` (OAuth 2-legged)
- **Docs:** https://docs.indeed.com/api/graphql_schema (requires partner auth)
- **Three APIs available:**
  - **Job Sync API** — create, update, expire job postings. Mutations: `createSourcedJobPostings`, `expireSourcedJobsBySourcedPostingId`. Structured data: salary, qualifications, benefits, employer info.
  - **Disposition Sync API** — send/receive application status updates (hired, rejected, interviewing). Mutation: `partnerDisposition.send`.
  - **Employer Data API** — access employer/company data programmatically.
- **Simulated environment:** https://simulated-apis.indeed.com/graphql (for testing)
- **Current value:** Low for personal job search (partner/employer API, not job seeker)
- **Future value:** High if JobTrackr goes multi-user/SaaS — job posting sync, disposition tracking, structured employer data
- **Blocker:** Requires Indeed Partner account + OAuth credentials. Not available to individual developers currently.
- **LOE:** Research phase — need to investigate partner onboarding process

### Greenhouse API
- Greenhouse boards are publicly accessible (job-boards.greenhouse.io/{company})
- Could build a scraper/fetcher for target companies' open roles
- Auto-refresh company target listings on a schedule
- **LOE: 3-4 hrs** per company integration

### Google Careers / Netflix Jobs
- Both render via JS — need headless browser or find API endpoints
- Netflix explore.jobs.netflix.net has a REST-ish API behind the scenes
- Google Careers uses a proprietary frontend, harder to automate
- **LOE: Research needed**

---

## Onboarding & Public Readiness

### New User Onboarding Flow
Currently a new user must: clone → bun install → bun run dev → manually read README to understand personal/ dir. No guided setup.

**What's needed for a truly public, useful tool:**
- **First-run wizard** — detect empty personal/ dir, offer to scaffold data files from templates with prompts ("What's your name?", "Target salary?", "Primary stack?")
- **GETTING_STARTED.md** — step-by-step walkthrough with screenshots for non-technical users
- **`npx create-jobtrackr`** scaffolding CLI — clone + configure in one command
- **In-app help tooltips** — explain P1/P2/P3 tiers, confidence scoring, what each page does
- **Example data annotations** — comments in demo data files explaining each field's purpose
- **Import wizards** — paste an Indeed saved jobs JSON, paste a JD URL, import from LinkedIn
- **LOE: 1-2 days** for the full onboarding flow

### Data File Documentation
- Each data file (searches.ts, applications.ts, etc.) needs inline comments explaining the interface
- A `SCHEMA.md` or interactive docs page showing all types with examples
- **LOE: 2-3 hrs**

---

## Priority Order (suggested)

1. **GitHub Pages deployment** — quick win, portfolio value
2. **Claude API chat (Option A) + JD Analyzer** — chat panel with built-in JD analysis, cover letter gen, fit assessment
3. **Template System** — saves time on every new application
4. **New user onboarding flow** — first-run wizard, GETTING_STARTED.md, tooltips
5. **SQLite backend** — needed before multi-user or heavy CRUD
6. **Drag-and-drop kanban** — polish
7. **Multi-platform search** — ambitious, save for later
8. **Indeed GraphQL integration** — SaaS path, needs partner access
9. **Greenhouse auto-refresh** — useful now, moderate effort
