# JobTrackr

A developer-first job search dashboard. Track applications, run targeted company searches, analyze which job titles actually produce results, and manage your entire pipeline — all from a fast, local-first web app.

Built for developers who want to treat their job search like an engineering problem.

![SvelteKit](https://img.shields.io/badge/SvelteKit-5-ff3e00?style=flat-square&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Bun](https://img.shields.io/badge/Bun-1.x-fbf0df?style=flat-square&logo=bun)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Why This Exists

Job searching as a developer is chaotic. You're juggling Indeed, LinkedIn, company career pages, spreadsheets, and notes scattered everywhere. JobTrackr puts it all in one place with the features that actually matter:

- **Priority tiers** so you focus on P1 roles first, not everything at once
- **Confidence scoring** so you can objectively compare how well roles match your profile
- **Title analytics** so you stop wasting searches on keywords that never produce results
- **Company targeting** so you can deep-dive a specific company across multiple job titles

No database. No auth. No server. Clone it, customize the data files, and run it locally.

---

## Features

- **Dashboard** — stats overview, application pipeline funnel, recent activity
- **Searches** — priority-tiered job listings (P1/P2/P3) with expandable results, inline JD display, fit badges
- **Company Targets** — deep-dive job hunting by company with confidence scoring, company intel (salary, ratings, CEO approval), and strategic fit analysis
- **Applications** — Kanban board and table view for tracking application status through the pipeline
- **Companies** — card grid of researched companies with ratings, salary data, culture notes
- **Title Analytics** — track which job title searches actually produce results vs waste time (Works / Sometimes / Never)
- **Profile** — career profile with target roles, strengths, gaps, and talking points

### Priority Tiers

| Tier | Meaning | Color |
|---|---|---|
| **P1** | Strong fit — apply now | Green |
| **P2** | Almost — worth a look | Amber |
| **P3** | You can do this | Blue |
| **Skip** | Not a fit | Gray |

### Confidence Scoring

Company target jobs get an auto-calculated **confidence %** (0-100) based on title keywords, seniority level, role type, salary range, remote availability, and domain relevance. Customize the scoring algorithm in `targets.ts` to match your own strengths.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev/) with Svelte 5 (runes: `$state`, `$derived`, `$props`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite` |
| Language | [TypeScript](https://www.typescriptlang.org/) — strict, fully typed data layer |
| Runtime | [Bun](https://bun.sh/) — fast installs, fast dev server |
| Data | Plain TypeScript files — no database, no auth, fully portable |
| Theme | Dark mode, `#39FF14` neon green accent |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/NooRotic/JobTrackr.git
cd JobTrackr

# Install dependencies (requires Bun — https://bun.sh)
bun install

# Start the dev server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Customizing for Your Job Search

All data lives in `src/lib/data/`. Plain TypeScript with typed interfaces — no database, no migration, no setup.

| File | What to customize |
|---|---|
| `types.ts` | All TypeScript interfaces — extend as needed |
| `searches.ts` | Your saved job searches with results and priority tiers |
| `targets.ts` | Company targets, job title categories, confidence scoring weights |
| `titleAnalytics.ts` | Job title effectiveness tracking (works / sometimes / never) |
| `applications.ts` | Application pipeline entries |
| `companies.ts` | Company research cards |
| `activity.ts` | Recent activity log |

The repo ships with **example data** so you can see how everything works. Replace it with your own data to start tracking your search.

### Importing Indeed Saved Jobs

If you grab the JSON from Indeed's saved jobs API (`/api/v1/appStatusJobs`), you can parse it and add entries to `searches.ts`. The JSON includes useful metadata like `normalizedJobTitle`, `indeedApplyable`, and `jobExpired`.

### Keeping Your Data Private

Your personal job search data should not be committed to a public repo. Create a `src/lib/data/personal/` directory (already in `.gitignore`) and keep your real data there. Swap the imports in `index.ts` to point at your personal files locally.

---

## Project Structure

```
src/
  lib/
    components/       # Shared UI (StatusBadge, FitBadge, PriorityBadge, StatCard)
    data/             # All typed data — example data ships with repo
      personal/       # Your real data (gitignored)
  routes/
    +layout.svelte    # Root layout with sidebar nav
    +page.svelte      # Dashboard home
    searches/         # Priority-tiered job board (P1/P2/P3)
    targets/          # Company-targeted search with confidence scoring
    applications/     # Kanban board + table view
    companies/        # Company research card grid
    analytics/        # Job title effectiveness tracking
    profile/          # Career profile with talking points
```

---

## Building for Production

```bash
bun run build
bun run preview
```

Deploy to Vercel, Cloudflare Pages, or any Node host with the appropriate SvelteKit adapter.

---

## Contributing

PRs welcome. This is intentionally simple — no database, no auth, no server-side rendering of dynamic data. The goal is a fast, portable dashboard that any developer can fork and run locally in under a minute.

Ideas for contribution:
- LinkedIn data import
- Browser extension for one-click save from job boards
- AI-powered JD analysis and fit scoring
- Persistent storage (SQLite or IndexedDB)

---

## License

MIT — see [LICENSE](./LICENSE).
