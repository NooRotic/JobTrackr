# JobTrackr

A developer-first job search dashboard built with SvelteKit 5 and Bun. Track applications, run targeted company searches, analyze which job titles actually work, and manage your entire pipeline — all from a fast, local-first web app.

![SvelteKit](https://img.shields.io/badge/SvelteKit-5-ff3e00?style=flat-square&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Bun](https://img.shields.io/badge/Bun-1.x-fbf0df?style=flat-square&logo=bun)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Features

- **Dashboard** — stats overview, application pipeline funnel, recent activity, quick links
- **Searches** — priority-tiered job listings (P1/P2/P3), expandable results with fit badges, salary, Indeed saved jobs import
- **Company Targets** — deep-dive job hunting by company with confidence scoring, company intel, fit analysis, and "Why This Company / Your Angle" strategy cards
- **Applications** — Kanban board and table view for tracking application status through the pipeline
- **Companies** — card grid of researched companies with ratings, salary data, culture notes
- **Title Analytics** — track which job title searches actually produce results vs waste time. Verdicts: Works / Sometimes / Never
- **Profile** — career profile with target roles, strengths, gaps, and interview talking points

### Priority Tiers

Jobs are classified into priority tiers so you can focus on what matters:

| Tier | Meaning | Color |
|---|---|---|
| **P1** | Strong fit — apply now | Green |
| **P2** | Almost a good fit — worth a look | Amber |
| **P3** | You can totally do this | Blue |
| **Skip** | Not a fit | Gray |

### Confidence Scoring

Company target jobs get an auto-calculated **confidence %** (0-100) based on:
- Title keyword match (video, streaming, player, cast, frontend)
- Seniority level (Sr Staff > Senior > Lead > III)
- Role type relevance
- Salary vs your floor
- Remote availability
- Domain relevance signals

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
git clone https://github.com/NooRotic/JobTrackr
cd JobTrackr

# Install dependencies (requires Bun — https://bun.sh)
bun install

# Start the dev server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Customizing for Your Own Search

All data lives in `/src/lib/data/`. Plain TypeScript with typed interfaces — no database, no migration, no setup.

| File | What to edit |
|---|---|
| `types.ts` | All TypeScript interfaces — extend as needed |
| `searches.ts` | Saved job searches with results and priority tiers |
| `targets.ts` | Company targets, job title categories, confidence scoring algorithm |
| `titleAnalytics.ts` | Job title effectiveness tracking (works/sometimes/never) |
| `applications.ts` | Application pipeline entries |
| `companies.ts` | Company research cards |
| `activity.ts` | Recent activity log |

Update the profile data at the top of `/src/routes/profile/+page.svelte` with your own info.

### Importing Indeed Saved Jobs

If you can grab the JSON from `https://myjobs.indeed.com/api/v1/appStatusJobs`, you can parse it and add entries to `searches.ts`. The JSON includes useful metadata like `normalizedJobTitle`, `indeedApplyable`, and `jobExpired`.

---

## Project Structure

```
src/
  lib/
    components/       # Shared UI (StatusBadge, FitBadge, PriorityBadge, StatCard)
    data/             # All typed data — searches, targets, analytics, applications
  routes/
    +layout.svelte    # Root layout with sidebar nav
    +page.svelte      # Dashboard home
    searches/         # Priority-tiered job board (P1/P2/P3)
    targets/          # Company-targeted deep search with confidence scoring
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

The default adapter is `@sveltejs/adapter-auto`. Deploy to Vercel, Cloudflare Pages, or any Node host.

---

## Contributing

PRs welcome. This is intentionally simple — no database, no auth, no server-side rendering of dynamic data. The goal is a fast, portable dashboard that any developer can fork and run locally in under a minute.

---

## License

MIT — see [LICENSE](./LICENSE).
