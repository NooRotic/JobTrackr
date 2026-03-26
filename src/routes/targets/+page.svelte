<script lang="ts">
	import { companyTargets, jobTitleCategories, calculateConfidence, applications } from '$lib/data';
	import PriorityBadge from '$lib/components/PriorityBadge.svelte';
	import type { SearchResult } from '$lib/data/types';

	let activeTarget = $state(companyTargets[0]?.slug ?? '');
	let expandedJobId = $state<string | null>(null);
	let showSearchConfig = $state(false);
	let sortBy = $state<'confidence' | 'salary' | 'date'>('confidence');
	let hideSkipped = $state(true);

	// Track which title categories are enabled
	let enabledCategories = $state<Record<string, boolean>>(
		Object.fromEntries(jobTitleCategories.map((c) => [c.id, c.default]))
	);

	const target = $derived(companyTargets.find((t) => t.slug === activeTarget));

	// Score and sort jobs
	const scoredJobs = $derived(() => {
		if (!target) return [];
		return target.jobs
			.map((job) => ({ ...job, confidence: calculateConfidence(job) }))
			.filter((j) => !hideSkipped || j.priority !== 'SKIP')
			.sort((a, b) => {
				if (sortBy === 'confidence') return b.confidence - a.confidence;
				if (sortBy === 'salary') {
					const aSal = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
					const bSal = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
					return bSal - aSal;
				}
				return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
			});
	});

	const activeCategories = $derived(
		jobTitleCategories.filter((c) => enabledCategories[c.id])
	);

	function toggleJob(id: string) {
		expandedJobId = expandedJobId === id ? null : id;
	}

	function confidenceColor(pct: number): string {
		if (pct >= 65) return '#39FF14';
		if (pct >= 45) return '#f59e0b';
		if (pct >= 25) return '#0ea5e9';
		return '#6b7280';
	}

	function confidenceBarWidth(pct: number): string {
		return `${Math.max(4, pct)}%`;
	}

	// Track URLs saved this session
	let sessionSaved = $state<string[]>([]);

	function isAlreadySaved(url: string): boolean {
		if (url === '#') return false;
		return applications.some((a) => a.url === url) || sessionSaved.includes(url);
	}

	function saveToApplications(job: SearchResult) {
		if (isAlreadySaved(job.url)) return;
		sessionSaved = [...sessionSaved, job.url];
	}
</script>

<svelte:head>
	<title>Company Targets — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
				Company Targets
			</h1>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				Deep-dive job hunting by company · {activeCategories.length} title categories active
			</p>
		</div>
		<button
			onclick={() => (showSearchConfig = !showSearchConfig)}
			class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
			style={showSearchConfig
				? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.25)'
				: 'background: rgba(255,255,255,0.05); color: var(--color-text-secondary); border: 1px solid var(--color-border)'}
		>
			{showSearchConfig ? 'Hide' : 'Configure'} Search Titles
		</button>
	</div>

	<!-- Search Title Categories (collapsible) -->
	{#if showSearchConfig}
		<div class="card space-y-4 p-5">
			<p class="text-xs font-bold uppercase tracking-wider" style="color: var(--color-text-muted)">
				Job Title Categories
			</p>
			<p class="text-xs" style="color: var(--color-text-secondary)">
				These are the Indeed-normalized titles that match your profile. Toggle which ones to use when searching a company.
			</p>
			<div class="flex flex-wrap gap-2">
				{#each jobTitleCategories as cat}
					<button
						onclick={() => (enabledCategories[cat.id] = !enabledCategories[cat.id])}
						class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
						style={enabledCategories[cat.id]
							? 'background: rgba(57,255,20,0.1); color: #39FF14; border: 1px solid rgba(57,255,20,0.25)'
							: 'background: rgba(255,255,255,0.03); color: var(--color-text-muted); border: 1px solid var(--color-border); opacity: 0.6'}
					>
						{enabledCategories[cat.id] ? '✓' : '○'} {cat.label}
					</button>
				{/each}
			</div>
			<div class="rounded-lg p-3" style="background: rgba(139,92,246,0.05); border: 1px solid rgba(139,92,246,0.1)">
				<p class="text-xs" style="color: #8b5cf6">
					<strong>How it works:</strong> When you ask Claude to search a company, these titles are used as search queries.
					Example: "Search TikTok" → runs {activeCategories.length} searches: {activeCategories.map((c) => `"${c.keywords}"`).join(', ')}
				</p>
			</div>
		</div>
	{/if}

	<!-- Company Tabs -->
	<div class="flex flex-wrap gap-2">
		{#each companyTargets as ct}
			{@const jobCount = ct.jobs.filter((j) => !hideSkipped || j.priority !== 'SKIP').length}
			<button
				onclick={() => { activeTarget = ct.slug; expandedJobId = null; }}
				class="rounded-xl px-5 py-3 transition-all"
				style={activeTarget === ct.slug
					? 'background: rgba(57,255,20,0.1); border: 1px solid rgba(57,255,20,0.3)'
					: 'background: rgba(255,255,255,0.03); border: 1px solid var(--color-border)'}
			>
				<span
					class="text-sm font-semibold"
					style={activeTarget === ct.slug ? 'color: #39FF14' : 'color: var(--color-text-muted)'}
				>
					{ct.name}
				</span>
				<span class="ml-1 text-xs opacity-60" style="color: var(--color-text-muted)">{jobCount}</span>
			</button>
		{/each}
		<button
			class="rounded-xl border border-dashed px-5 py-3 text-sm transition-all hover:bg-white/[0.03]"
			style="border-color: var(--color-border); color: var(--color-text-muted)"
			disabled
		>
			+ Add Company
		</button>
	</div>

	{#if target}
		<!-- Company Overview Card -->
		<div class="card space-y-4 p-6">
			<div class="flex items-start justify-between gap-4">
				<div>
					<h2 class="text-xl font-bold" style="color: var(--color-text-primary)">
						{target.name}
					</h2>
					<p class="mt-1 text-sm" style="color: var(--color-text-muted)">
						{target.industry} · {target.location}
					</p>
				</div>
				<div class="flex gap-2">
					{#if target.companyPageUrl}
						<a
							href={target.companyPageUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80"
							style="background: rgba(255,255,255,0.05); color: var(--color-text-secondary); border: 1px solid var(--color-border)"
						>
							Indeed Profile ↗
						</a>
					{/if}
				</div>
			</div>

			<p class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
				{target.description}
			</p>

			<!-- Stats row -->
			<div class="flex flex-wrap gap-4">
				{#if target.avgSalary}
					<div class="rounded-lg px-4 py-2" style="background: rgba(57,255,20,0.06)">
						<p class="text-xs" style="color: var(--color-text-muted)">Avg Salary</p>
						<p class="text-sm font-bold" style="color: var(--color-neon)">{target.avgSalary}</p>
					</div>
				{/if}
				{#if target.ceoApproval}
					<div class="rounded-lg px-4 py-2" style="background: rgba(255,255,255,0.03)">
						<p class="text-xs" style="color: var(--color-text-muted)">CEO Approval</p>
						<p class="text-sm font-bold" style="color: var(--color-text-primary)">{target.ceoApproval}%</p>
					</div>
				{/if}
				{#if target.recommendToFriend}
					<div class="rounded-lg px-4 py-2" style="background: rgba(255,255,255,0.03)">
						<p class="text-xs" style="color: var(--color-text-muted)">Recommend</p>
						<p class="text-sm font-bold" style="color: var(--color-text-primary)">{target.recommendToFriend}%</p>
					</div>
				{/if}
				{#if target.interviewDifficulty}
					<div class="rounded-lg px-4 py-2" style="background: rgba(255,255,255,0.03)">
						<p class="text-xs" style="color: var(--color-text-muted)">Interview</p>
						<p class="text-sm font-bold" style="color: var(--color-text-primary)">{target.interviewDifficulty}</p>
					</div>
				{/if}
			</div>

			<!-- Why Target + Fit Angle -->
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="rounded-lg p-4" style="background: rgba(57,255,20,0.04); border: 1px solid rgba(57,255,20,0.1)">
					<p class="mb-2 text-xs font-bold uppercase tracking-wider" style="color: var(--color-neon)">
						Why This Company
					</p>
					<p class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
						{target.whyTarget}
					</p>
				</div>
				<div class="rounded-lg p-4" style="background: rgba(139,92,246,0.04); border: 1px solid rgba(139,92,246,0.1)">
					<p class="mb-2 text-xs font-bold uppercase tracking-wider" style="color: #8b5cf6">
						Your Angle
					</p>
					<p class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
						{target.fitAngle}
					</p>
				</div>
			</div>
		</div>

		<!-- Controls bar -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h3 class="text-lg font-semibold" style="color: var(--color-text-primary)">
				Open Positions
				<span class="text-sm font-normal" style="color: var(--color-text-muted)">
					({scoredJobs().length} shown)
				</span>
			</h3>

			<div class="flex items-center gap-3">
				<!-- Hide skipped toggle -->
				<button
					onclick={() => (hideSkipped = !hideSkipped)}
					class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
					style={hideSkipped
						? 'background: rgba(57,255,20,0.08); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)'
						: 'background: rgba(255,255,255,0.04); color: var(--color-text-muted); border: 1px solid var(--color-border)'}
				>
					{hideSkipped ? 'Hiding' : 'Showing'} skipped
				</button>

				<!-- Sort -->
				{#each [
					{ value: 'confidence', label: 'Confidence' },
					{ value: 'salary', label: 'Salary' },
					{ value: 'date', label: 'Date' }
				] as s}
					<button
						onclick={() => (sortBy = s.value as typeof sortBy)}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
						style={sortBy === s.value
							? 'background: rgba(57,255,20,0.08); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)'
							: 'background: rgba(255,255,255,0.04); color: var(--color-text-muted); border: 1px solid var(--color-border)'}
					>
						{s.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Jobs list -->
		{#if scoredJobs().length === 0}
			<div class="card flex flex-col items-center justify-center py-16 text-center">
				<p class="text-lg font-medium" style="color: var(--color-text-muted)">No matching jobs</p>
				<p class="mt-1 text-sm" style="color: var(--color-text-muted)">
					Try showing skipped jobs or running a new search
				</p>
			</div>
		{:else}
			<div class="stagger-children space-y-3">
				{#each scoredJobs() as job}
					{@const isExpanded = expandedJobId === job.id}
					<div
						class="card overflow-hidden transition-all"
						style={job.confidence >= 65 ? 'border-color: rgba(57,255,20,0.15)' : ''}
					>
						<button
							onclick={() => toggleJob(job.id)}
							class="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
						>
							<!-- Confidence gauge -->
							<div class="mt-0.5 flex shrink-0 flex-col items-center gap-1">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black"
									style="background: {confidenceColor(job.confidence)}15; color: {confidenceColor(job.confidence)}"
								>
									{job.confidence}
								</div>
								<span class="text-[10px] font-medium" style="color: var(--color-text-muted)">conf%</span>
							</div>

							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-2">
									<p class="font-semibold leading-snug" style="color: var(--color-text-primary)" class:opacity-50={job.priority === 'SKIP'}>
										{job.role}
									</p>
									<PriorityBadge priority={job.priority} />
									{#if job.expired}
										<span class="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400">
											Expired
										</span>
									{/if}
									{#if job.easyApply}
										<span class="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
											Easy Apply
										</span>
									{/if}
								</div>

								<p class="mt-0.5 text-sm" style="color: var(--color-text-secondary)">{job.company}</p>

								<!-- Confidence bar -->
								<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full" style="background: rgba(255,255,255,0.06)">
									<div
										class="h-full rounded-full transition-all duration-500"
										style="width: {confidenceBarWidth(job.confidence)}; background: {confidenceColor(job.confidence)}"
									></div>
								</div>

								<div class="mt-2 flex flex-wrap items-center gap-3">
									{#if job.salary !== 'Not listed'}
										<span class="text-sm font-medium" style="color: var(--color-neon)">{job.salary}</span>
									{:else}
										<span class="text-sm" style="color: var(--color-text-muted)">Salary not listed</span>
									{/if}
									<span class="text-xs" style="color: var(--color-text-muted)">
										{job.remote ? '🌐 Remote' : job.location}
									</span>
									<span class="text-xs" style="color: var(--color-text-muted)">
										Posted {job.postedDate}
									</span>
								</div>
							</div>

							<span
								class="mt-1 shrink-0 text-sm transition-transform duration-200"
								style="color: var(--color-text-muted); transform: rotate({isExpanded ? '90' : '0'}deg)"
							>
								›
							</span>
						</button>

						{#if isExpanded}
							<div class="space-y-4 p-5" style="border-top: 1px solid var(--color-border); background: rgba(255,255,255,0.015)">
								{#if job.notes}
									<div>
										<p class="mb-1 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
											Analysis
										</p>
										<p class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
											{job.notes}
										</p>
									</div>
								{/if}

								<!-- Confidence breakdown -->
								<div class="rounded-lg p-3" style="background: rgba(255,255,255,0.02); border: 1px solid var(--color-border)">
									<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
										Confidence Score: {job.confidence}%
									</p>
									<p class="text-xs" style="color: var(--color-text-muted)">
										Based on: title keyword match, seniority level, role type, salary range, location, and video/streaming relevance signals.
									</p>
								</div>

								<!-- Job Description -->
								{#if job.jobDescription}
									<div class="rounded-lg p-4" style="background: rgba(255,255,255,0.02); border: 1px solid var(--color-border)">
										<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-neon)">
											Job Description
										</p>
										<div class="max-h-80 overflow-y-auto text-sm leading-relaxed" style="color: var(--color-text-secondary)">
											<pre class="whitespace-pre-wrap font-sans">{job.jobDescription}</pre>
										</div>
									</div>
								{:else}
									<div class="rounded-lg px-4 py-3" style="background: rgba(255,255,255,0.02); border: 1px dashed var(--color-border)">
										<p class="text-xs" style="color: var(--color-text-muted)">
											JD not yet pulled — ask Claude to run <code style="color: var(--color-neon)">get_job_details</code> for this listing
										</p>
									</div>
								{/if}

								<div class="flex gap-3">
									{#if job.url !== '#'}
										<a
											href={job.url}
											target="_blank"
											rel="noopener noreferrer"
											class="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
											style="background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.25)"
										>
											View on Indeed ↗
										</a>
									{/if}
									<button
										onclick={() => saveToApplications(job)}
										disabled={isAlreadySaved(job.url)}
										class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
										style={isAlreadySaved(job.url)
											? 'background: rgba(57,255,20,0.08); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2); cursor: default; opacity: 0.7'
											: 'background: rgba(255,255,255,0.04); color: var(--color-text-secondary); border: 1px solid var(--color-border)'}
									>
										{isAlreadySaved(job.url) ? 'Saved ✓' : 'Save to Applications'}
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Update / Refresh banner -->
		<div class="card flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:text-left"
			style="border-color: rgba(139,92,246,0.2); background: rgba(139,92,246,0.03)">
			<div class="flex-1">
				<p class="text-sm font-semibold" style="color: var(--color-text-primary)">
					Update search for {target.name}
				</p>
				<p class="mt-1 text-xs" style="color: var(--color-text-muted)">
					Run in Claude Code: "Search {target.name} with my job title categories" — will query {activeCategories.length} titles and refresh results with new confidence scores
				</p>
			</div>
			<button
				class="shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold transition-all hover:opacity-90"
				style="background: rgba(139,92,246,0.15); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.3)"
			>
				↻ Refresh Search
			</button>
		</div>

		<p class="text-xs" style="color: var(--color-text-muted)">
			Last searched: {target.dateResearched} · Confidence scores auto-calculated from title, salary, seniority, and domain relevance
		</p>
	{/if}
</div>
