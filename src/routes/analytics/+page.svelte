<script lang="ts">
	import { titleAnalytics } from '$lib/data';
	import type { TitleVerdict } from '$lib/data/types';

	let filterVerdict = $state<TitleVerdict | 'all'>('all');

	const filtered = $derived(
		filterVerdict === 'all'
			? titleAnalytics
			: titleAnalytics.filter((t) => t.verdict === filterVerdict)
	);

	const worksCount = titleAnalytics.filter((t) => t.verdict === 'works').length;
	const sometimesCount = titleAnalytics.filter((t) => t.verdict === 'sometimes').length;
	const neverCount = titleAnalytics.filter((t) => t.verdict === 'never').length;
	const totalSearches = titleAnalytics.reduce((sum, t) => sum + t.timesSearched, 0);
	const totalRelevant = titleAnalytics.reduce((sum, t) => sum + t.timesRelevant, 0);
	const hitRate = totalSearches > 0 ? Math.round((totalRelevant / totalSearches) * 100) : 0;

	const verdictConfig: Record<TitleVerdict, { label: string; color: string; icon: string; bg: string; border: string }> = {
		works: { label: 'Works', color: '#39FF14', icon: '✓', bg: 'rgba(57,255,20,0.1)', border: 'rgba(57,255,20,0.25)' },
		sometimes: { label: 'Sometimes', color: '#f59e0b', icon: '~', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
		never: { label: 'Never', color: '#ef4444', icon: '✕', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' }
	};

	function hitRateFor(t: typeof titleAnalytics[0]): number {
		return t.timesSearched > 0 ? Math.round((t.timesRelevant / t.timesSearched) * 100) : 0;
	}
</script>

<svelte:head>
	<title>Title Analytics — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Title Analytics
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			Track which job titles produce results and which waste searches
		</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Overall Hit Rate</p>
			<p class="mt-1 text-2xl font-black" style="color: var(--color-neon)">{hitRate}%</p>
			<p class="text-xs" style="color: var(--color-text-muted)">{totalRelevant}/{totalSearches} searches</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Works</p>
			<p class="mt-1 text-2xl font-black" style="color: #39FF14">{worksCount}</p>
			<p class="text-xs" style="color: var(--color-text-muted)">reliable titles</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Sometimes</p>
			<p class="mt-1 text-2xl font-black" style="color: #f59e0b">{sometimesCount}</p>
			<p class="text-xs" style="color: var(--color-text-muted)">mixed results</p>
		</div>
		<div class="card p-4">
			<p class="text-xs" style="color: var(--color-text-muted)">Never</p>
			<p class="mt-1 text-2xl font-black" style="color: #ef4444">{neverCount}</p>
			<p class="text-xs" style="color: var(--color-text-muted)">don't bother</p>
		</div>
	</div>

	<!-- Filter tabs -->
	<div class="flex gap-2">
		<button
			onclick={() => (filterVerdict = 'all')}
			class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
			style={filterVerdict === 'all'
				? 'background: rgba(255,255,255,0.08); color: var(--color-text-primary); border: 1px solid rgba(255,255,255,0.15)'
				: 'background: rgba(255,255,255,0.03); color: var(--color-text-muted); border: 1px solid var(--color-border)'}
		>
			All ({titleAnalytics.length})
		</button>
		{#each (['works', 'sometimes', 'never'] as const) as v}
			{@const cfg = verdictConfig[v]}
			{@const count = titleAnalytics.filter((t) => t.verdict === v).length}
			<button
				onclick={() => (filterVerdict = v)}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
				style={filterVerdict === v
					? `background: ${cfg.bg}; color: ${cfg.color}; border: 1px solid ${cfg.border}`
					: 'background: rgba(255,255,255,0.03); color: var(--color-text-muted); border: 1px solid var(--color-border)'}
			>
				{cfg.icon} {cfg.label} ({count})
			</button>
		{/each}
	</div>

	<!-- Title list -->
	<div class="stagger-children space-y-3">
		{#each filtered as title}
			{@const cfg = verdictConfig[title.verdict]}
			{@const rate = hitRateFor(title)}
			<div class="card overflow-hidden p-5">
				<div class="flex items-start gap-4">
					<!-- Verdict indicator -->
					<div
						class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold"
						style="background: {cfg.bg}; color: {cfg.color}; border: 1px solid {cfg.border}"
					>
						{cfg.icon}
					</div>

					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<p class="font-semibold" style="color: var(--color-text-primary)">
								{title.title}
							</p>
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
								style="background: {cfg.bg}; color: {cfg.color}; border: 1px solid {cfg.border}"
							>
								{cfg.label}
							</span>
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs"
								style="background: rgba(255,255,255,0.05); color: var(--color-text-muted)"
							>
								{title.source}
							</span>
						</div>

						<!-- Hit rate bar -->
						<div class="mt-3 flex items-center gap-3">
							<div class="h-2 flex-1 overflow-hidden rounded-full" style="background: rgba(255,255,255,0.06)">
								<div
									class="h-full rounded-full transition-all duration-500"
									style="width: {Math.max(2, rate)}%; background: {cfg.color}"
								></div>
							</div>
							<span class="shrink-0 text-xs font-bold" style="color: {cfg.color}">
								{rate}%
							</span>
						</div>

						<div class="mt-2 flex flex-wrap gap-4">
							<span class="text-xs" style="color: var(--color-text-muted)">
								Searched {title.timesSearched}x
							</span>
							<span class="text-xs" style="color: var(--color-text-muted)">
								Relevant {title.timesRelevant}x
							</span>
							<span class="text-xs" style="color: var(--color-text-muted)">
								Last: {title.lastUsed}
							</span>
						</div>

						<p class="mt-2 text-sm leading-relaxed" style="color: var(--color-text-secondary)">
							{title.notes}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Insights -->
	<div class="card space-y-3 p-5" style="border-color: rgba(139,92,246,0.2); background: rgba(139,92,246,0.03)">
		<p class="text-xs font-bold uppercase tracking-wider" style="color: #8b5cf6">
			Key Insights
		</p>
		<ul class="space-y-2">
			<li class="text-sm" style="color: var(--color-text-secondary)">
				<strong style="color: var(--color-neon)">Best performers:</strong> "Senior Software Engineer" + company name, and "Video Engineer" — use these first
			</li>
			<li class="text-sm" style="color: var(--color-text-secondary)">
				<strong style="color: #f59e0b">Diminishing returns:</strong> "Frontend Engineer" and "Full Stack" produce mostly P3 results — use as fallbacks
			</li>
			<li class="text-sm" style="color: var(--color-text-secondary)">
				<strong style="color: #ef4444">Dead ends:</strong> Protocol-specific searches (MPEG-DASH, Cast Framework, Chromecast) return zero on Indeed — save these for LinkedIn and company career pages
			</li>
			<li class="text-sm" style="color: var(--color-text-secondary)">
				<strong style="color: var(--color-text-muted)">Philadelphia:</strong> Dead market for frontend. Always search remote.
			</li>
		</ul>
	</div>
</div>
