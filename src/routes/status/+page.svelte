<script lang="ts">
	import { applications, searches, companyTargets, titleAnalytics, activity } from '$lib/data';

	const applied = applications.filter((a) => a.status === 'applied');
	const screening = applications.filter((a) => a.status === 'screening');
	const interviewing = applications.filter((a) => a.status === 'interview');
	const offers = applications.filter((a) => a.status === 'offer');
	const totalSearchResults = searches.reduce((sum, s) => sum + s.results.length, 0);
	const p1Results = searches.flatMap((s) => s.results).filter((r) => r.priority === 'P1');
	const worksTitle = titleAnalytics.filter((t) => t.verdict === 'works');

	const sessionLog = [
		{
			date: '2026-03-21',
			label: 'Session 1',
			highlights: [
				'Indeed resume fixed + verified',
				'GitHub profile README created',
				'RipTheLeetBot audited + published',
				'JobTrackr built from scratch (7 pages)',
				'9 company targets researched',
				'Social media skill created',
				'69 tasks completed'
			]
		},
		{
			date: '2026-03-23',
			label: 'Session 2',
			highlights: [
				'Applied: Frame Set (Sr SWE, Remote)',
				'Applied: Twitch Chat (SWE I, Greenhouse)',
				'Applied: Twitch Ads Demand (SWE I, Greenhouse)',
				'Found Netflix TV & Web Player (Remote, ~$295k)',
				'Found YouTube Sr Staff Video Playback ($262-365k)',
				'Resume + PDF pipeline built',
				'Combined cover letter + portfolio template proven',
				'Greenhouse board search (Twitch, Tubi, Crunchyroll)',
				'Global memory consolidated across 11 projects'
			]
		}
	];
</script>

<svelte:head>
	<title>Status — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Job Search Status
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			Pipeline overview, progress log, and next actions
		</p>
	</div>

	<!-- Pipeline Stats -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Applied</p>
			<p class="mt-1 text-2xl font-black" style="color: #3b82f6">{applied.length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Screening</p>
			<p class="mt-1 text-2xl font-black" style="color: #f59e0b">{screening.length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Interview</p>
			<p class="mt-1 text-2xl font-black" style="color: #8b5cf6">{interviewing.length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Offers</p>
			<p class="mt-1 text-2xl font-black" style="color: #10b981">{offers.length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">P1 Leads</p>
			<p class="mt-1 text-2xl font-black" style="color: var(--color-neon)">{p1Results.length}</p>
		</div>
	</div>

	<!-- Applications -->
	<div class="card p-5">
		<h2 class="mb-4 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-neon)">
			Applications Submitted
		</h2>
		{#if applications.length === 0}
			<p class="text-sm" style="color: var(--color-text-muted)">No applications yet. Start applying!</p>
		{:else}
			<div class="space-y-3">
				{#each applications as app, i}
					<div
						class="flex flex-col gap-2 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between"
						style="background: rgba(255,255,255,0.02); border: 1px solid var(--color-border)"
					>
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="text-sm font-semibold" style="color: var(--color-text-primary)">{app.company}</span>
								<span
									class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
									style={app.status === 'applied' ? 'background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3)'
										: app.status === 'screening' ? 'background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3)'
										: app.status === 'interview' ? 'background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3)'
										: 'background: rgba(255,255,255,0.05); color: var(--color-text-muted); border: 1px solid var(--color-border)'}
								>
									{app.status}
								</span>
							</div>
							<p class="mt-1 text-xs" style="color: var(--color-text-secondary)">{app.role}</p>
							<p class="mt-1 text-xs" style="color: var(--color-text-muted)">{app.salary} · {app.remote ? '🌐 Remote' : app.location} · Applied {app.dateApplied}</p>
						</div>
						{#if app.url && app.url !== '#'}
							<a href={app.url} target="_blank" rel="noopener noreferrer"
								class="shrink-0 text-xs" style="color: var(--color-neon)">View ↗</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Next Actions -->
	<div class="card p-5" style="border-color: rgba(57,255,20,0.15)">
		<h2 class="mb-4 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-neon)">
			Next Actions
		</h2>
		<div class="space-y-2">
			{#each [
				{ priority: 'HIGH', action: 'Apply to Netflix TV & Web Player Platform', detail: 'USA Remote, ~$295k, JS/TS + streaming' },
				{ priority: 'HIGH', action: 'Apply to YouTube Sr Staff SWE, Video Playback', detail: '$262-365k, San Bruno. careers.google.com' },
				{ priority: 'HIGH', action: 'Apply to Tubi Sr SWE, OTT', detail: 'Roku/OTT streaming. Greenhouse.' },
				{ priority: 'MED', action: 'Apply to YouTube OTT Live Video Engineer', detail: '$126-181k. Google/YouTube.' },
				{ priority: 'MED', action: 'Apply to Crunchyroll SWE III, Roku', detail: '$164-205k, video streaming + DRM preferred.' },
				{ priority: 'MED', action: 'Apply to Twitch Streamer Monetization', detail: 'Another Twitch angle.' },
				{ priority: 'LOW', action: 'Deploy JobTrackr to GitHub Pages', detail: '~20 min' },
				{ priority: 'LOW', action: 'Package social-media skill as plugin', detail: '~40 min, follow PLAN.md' },
				{ priority: 'LOW', action: 'wsp-cast-receiver cleanup + publish', detail: '1-2 hrs' }
			] as item}
				<div class="flex items-start gap-3 rounded-lg px-3 py-2"
					style="background: rgba(255,255,255,0.015)">
					<span
						class="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold"
						style={item.priority === 'HIGH' ? 'background: rgba(239,68,68,0.15); color: #f87171'
							: item.priority === 'MED' ? 'background: rgba(245,158,11,0.15); color: #fbbf24'
							: 'background: rgba(255,255,255,0.05); color: var(--color-text-muted)'}
					>
						{item.priority}
					</span>
					<div>
						<p class="text-sm font-medium" style="color: var(--color-text-primary)">{item.action}</p>
						<p class="text-xs" style="color: var(--color-text-muted)">{item.detail}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Session Progress Log -->
	<div class="card p-5">
		<h2 class="mb-4 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-muted)">
			Progress Log
		</h2>
		<div class="space-y-6">
			{#each sessionLog as session}
				<div>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-sm font-bold" style="color: var(--color-text-primary)">{session.label}</span>
						<span class="text-xs" style="color: var(--color-text-muted)">{session.date}</span>
					</div>
					<ul class="space-y-1">
						{#each session.highlights as item}
							<li class="flex items-start gap-2 text-xs" style="color: var(--color-text-secondary)">
								<span class="mt-1 h-1 w-1 shrink-0 rounded-full" style="background: var(--color-neon)"></span>
								{item}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<!-- Quick Stats -->
	<div class="grid gap-3 sm:grid-cols-3">
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Searches Run</p>
			<p class="mt-1 text-lg font-bold" style="color: var(--color-text-primary)">{searches.length}</p>
			<p class="text-xs" style="color: var(--color-text-muted)">{totalSearchResults} total results</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Companies Targeted</p>
			<p class="mt-1 text-lg font-bold" style="color: var(--color-text-primary)">{companyTargets.length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Titles That Work</p>
			<p class="mt-1 text-lg font-bold" style="color: var(--color-text-primary)">{worksTitle.length}</p>
			<p class="text-xs" style="color: var(--color-text-muted)">of {titleAnalytics.length} tested</p>
		</div>
	</div>
</div>
