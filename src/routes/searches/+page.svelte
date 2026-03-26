<script lang="ts">
	import { searches, applications } from '$lib/data';
	import FitBadge from '$lib/components/FitBadge.svelte';
	import PriorityBadge from '$lib/components/PriorityBadge.svelte';
	import type { Priority, SearchResult, SavedSearch, Application } from '$lib/data/types';

	type TabValue = 'P1' | 'P2' | 'P3' | 'ALL';

	let activeTab = $state<TabValue>('P1');
	let expandedId = $state<string | null>(null);

	// Track URLs saved this session (supplements static applications data)
	let sessionSaved = $state<string[]>([]);

	function isAlreadySaved(url: string): boolean {
		if (url === '#') return false;
		return applications.some((a) => a.url === url) || sessionSaved.includes(url);
	}

	function saveToApplications(result: SearchResult) {
		if (isAlreadySaved(result.url)) return;
		sessionSaved = [...sessionSaved, result.url];
	}

	function toggle(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	// Flatten all results across searches, keeping search context
	interface FlatResult {
		result: SearchResult;
		search: SavedSearch;
	}

	const allResults: FlatResult[] = searches.flatMap((s) =>
		s.results.map((r) => ({ result: r, search: s }))
	);

	const p1Results = $derived(allResults.filter((r) => r.result.priority === 'P1'));
	const p2Results = $derived(allResults.filter((r) => r.result.priority === 'P2'));
	const p3Results = $derived(allResults.filter((r) => r.result.priority === 'P3'));
	const activeResults = $derived(
		activeTab === 'ALL'
			? allResults.filter((r) => r.result.priority !== 'SKIP')
			: allResults.filter((r) => r.result.priority === activeTab)
	);

	const tabs: { value: TabValue; label: string; description: string }[] = [
		{ value: 'P1', label: 'P1', description: 'Strong fit — apply now' },
		{ value: 'P2', label: 'P2', description: 'Almost — worth a look' },
		{ value: 'P3', label: 'P3', description: 'Can totally do this' },
		{ value: 'ALL', label: 'All', description: 'Everything ranked' }
	];

	function countForTab(tab: TabValue): number {
		if (tab === 'ALL') return allResults.filter((r) => r.result.priority !== 'SKIP').length;
		return allResults.filter((r) => r.result.priority === tab).length;
	}
</script>

<svelte:head>
	<title>Searches — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Searches
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			{p1Results.length} strong fits · {p2Results.length} worth a look · {p3Results.length} you can do
		</p>
	</div>

	<!-- Priority Tabs -->
	<div class="flex gap-2">
		{#each tabs as tab}
			{@const count = countForTab(tab.value)}
			<button
				onclick={() => { activeTab = tab.value; expandedId = null; }}
				class="group relative flex flex-col items-center rounded-xl px-5 py-3 transition-all"
				style={activeTab === tab.value
					? tab.value === 'P1'
						? 'background: rgba(57,255,20,0.1); border: 1px solid rgba(57,255,20,0.3)'
						: tab.value === 'P2'
							? 'background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3)'
							: tab.value === 'P3'
								? 'background: rgba(14,165,233,0.1); border: 1px solid rgba(14,165,233,0.3)'
								: 'background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15)'
					: 'background: rgba(255,255,255,0.03); border: 1px solid var(--color-border)'}
			>
				<span
					class="text-lg font-black tracking-tight"
					style={activeTab === tab.value
						? tab.value === 'P1'
							? 'color: #39FF14'
							: tab.value === 'P2'
								? 'color: #f59e0b'
								: tab.value === 'P3'
									? 'color: #0ea5e9'
									: 'color: var(--color-text-primary)'
						: 'color: var(--color-text-muted)'}
				>
					{tab.label}
				</span>
				<span class="text-xs" style="color: var(--color-text-muted)">
					{count} {count === 1 ? 'job' : 'jobs'}
				</span>
			</button>
		{/each}
	</div>

	<!-- Tab description -->
	<p class="text-sm font-medium" style="color: var(--color-text-secondary)">
		{tabs.find((t) => t.value === activeTab)?.description}
	</p>

	<!-- Results -->
	{#if activeResults.length === 0}
		<div class="card flex flex-col items-center justify-center py-16 text-center">
			<p class="text-lg font-medium" style="color: var(--color-text-muted)">
				No jobs in this tier yet
			</p>
			<p class="mt-1 text-sm" style="color: var(--color-text-muted)">
				Run more searches to fill the pipeline
			</p>
		</div>
	{:else}
		<div class="stagger-children space-y-3">
			{#each activeResults as { result, search }}
				{@const isExpanded = expandedId === result.id}
				<div
					class="card overflow-hidden transition-all"
					style={result.priority === 'P1' ? 'border-color: rgba(57,255,20,0.15)' : ''}
				>
					<!-- Result row (clickable) -->
					<button
						onclick={() => toggle(result.id)}
						class="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
					>
						<!-- Priority indicator -->
						<div
							class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-black"
							style={result.priority === 'P1'
								? 'background: rgba(57,255,20,0.1); color: #39FF14'
								: result.priority === 'P2'
									? 'background: rgba(245,158,11,0.1); color: #f59e0b'
									: 'background: rgba(14,165,233,0.1); color: #0ea5e9'}
						>
							{result.priority}
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<p class="font-semibold leading-snug" style="color: var(--color-text-primary)" class:opacity-60={result.expired}>
									{result.role}
								</p>
								<PriorityBadge priority={result.priority} />
								{#if result.expired}
									<span class="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400">
										Expired
									</span>
								{/if}
								{#if result.source === 'saved'}
									<span class="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
										Saved
									</span>
								{/if}
							</div>
							<p class="mt-0.5 text-sm" style="color: var(--color-text-secondary)">
								{result.company}
							</p>
							<div class="mt-2 flex flex-wrap items-center gap-3">
								{#if result.salary !== 'Not listed'}
									<span class="text-sm font-medium" style="color: var(--color-neon)">
										{result.salary}
									</span>
								{:else}
									<span class="text-sm" style="color: var(--color-text-muted)">
										Salary not listed
									</span>
								{/if}
								<span class="text-xs" style="color: var(--color-text-muted)">
									{result.remote ? '🌐 Remote' : result.location}
								</span>
								<span class="text-xs" style="color: var(--color-text-muted)">
									{result.source === 'saved' ? 'Saved' : 'Posted'} {result.postedDate}
								</span>
								<span
									class="rounded-full px-2 py-0.5 text-xs"
									style="background: rgba(255,255,255,0.05); color: var(--color-text-muted)"
								>
									via: {search.query.split('—')[0].trim()}
								</span>
							</div>
						</div>

						<!-- Expand indicator -->
						<span
							class="mt-1 shrink-0 text-sm transition-transform duration-200"
							style="color: var(--color-text-muted); transform: rotate({isExpanded ? '90' : '0'}deg)"
						>
							›
						</span>
					</button>

					<!-- Expanded details -->
					{#if isExpanded}
						<div class="space-y-4 p-5" style="border-top: 1px solid var(--color-border); background: rgba(255,255,255,0.015)">
							<!-- Notes -->
							{#if result.notes}
								<div>
									<p class="mb-1 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
										Notes
									</p>
									<p class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
										{result.notes}
									</p>
								</div>
							{/if}

							<!-- Meta -->
							<div class="flex flex-wrap gap-3">
								<FitBadge fit={result.fit} />
								<span class="text-xs" style="color: var(--color-text-muted)">
									Search: {search.query}
								</span>
								<span class="text-xs" style="color: var(--color-text-muted)">
									Searched: {search.date}
								</span>
							</div>

							<!-- Job Description -->
							{#if result.jobDescription}
								<div class="rounded-lg p-4" style="background: rgba(255,255,255,0.02); border: 1px solid var(--color-border)">
									<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-neon)">
										Job Description
									</p>
									<div class="prose-sm max-h-80 overflow-y-auto text-sm leading-relaxed" style="color: var(--color-text-secondary)">
										<pre class="whitespace-pre-wrap font-sans">{result.jobDescription}</pre>
									</div>
								</div>
							{:else}
								<div class="rounded-lg px-4 py-3" style="background: rgba(255,255,255,0.02); border: 1px dashed var(--color-border)">
									<p class="text-xs" style="color: var(--color-text-muted)">
										JD not yet pulled — ask Claude to run <code style="color: var(--color-neon)">get_job_details</code> for this listing
									</p>
								</div>
							{/if}

							<!-- Actions -->
							<div class="flex gap-3">
								{#if result.url !== '#'}
									<a
										href={result.url}
										target="_blank"
										rel="noopener noreferrer"
										class="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
										style="background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.25)"
									>
										View on Indeed ↗
									</a>
								{/if}
								<button
									onclick={() => saveToApplications(result)}
									disabled={isAlreadySaved(result.url)}
									class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
									style={isAlreadySaved(result.url)
										? 'background: rgba(57,255,20,0.08); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2); cursor: default; opacity: 0.7'
										: 'background: rgba(255,255,255,0.04); color: var(--color-text-secondary); border: 1px solid var(--color-border)'}
								>
									{isAlreadySaved(result.url) ? 'Saved ✓' : 'Save to Applications'}
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Skipped jobs (collapsible) -->
	{#if allResults.filter((r) => r.result.priority === 'SKIP').length > 0 && activeTab === 'ALL'}
		{@const skipped = allResults.filter((r) => r.result.priority === 'SKIP')}
	<details class="card">
			<summary
				class="cursor-pointer p-5 text-sm font-medium"
				style="color: var(--color-text-muted)"
			>
				{skipped.length} skipped jobs (not a fit)
			</summary>
			<div class="divide-y" style="divide-color: var(--color-border)">
				{#each skipped as { result, search }}
					<div class="flex items-center gap-4 px-5 py-3 opacity-50">
						<span class="text-xs font-bold" style="color: var(--color-text-muted)">SKIP</span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm" style="color: var(--color-text-muted)">
								{result.role} — {result.company}
							</p>
						</div>
						<span class="text-xs" style="color: var(--color-text-muted)">{result.notes}</span>
					</div>
				{/each}
			</div>
		</details>
	{/if}
</div>
