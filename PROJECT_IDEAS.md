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

## Priority Order (suggested)

1. **GitHub Pages deployment** — quick win, portfolio value
2. **JD Analyzer** — immediate job search value
3. **Template System** — saves time on every new application
4. **Claude API chat (Option A)** — game changer for workflow
5. **SQLite backend** — needed before multi-user or heavy CRUD
6. **Drag-and-drop kanban** — polish
7. **Multi-platform search** — ambitious, save for later
