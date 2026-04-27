<script lang="ts">
	import { research } from '$lib/data';
	import type { ResearchCategory } from '$lib/data/types';

	type FilterTab = ResearchCategory | 'all';
	let activeTab = $state<FilterTab>('all');
	let expandedId = $state<string | null>(null);

	const categoryLabels: Record<ResearchCategory, string> = {
		'wide-sweep': 'Wide Sweep',
		'company-deep-dive': 'Deep Dive',
		'market-research': 'Market Research',
		'job-search': 'Job Search',
		'contract-sweep': 'Contract Sweep',
		submissions: 'Submissions'
	};

	const categoryColors: Record<ResearchCategory, string> = {
		'wide-sweep': '#3b82f6',
		'company-deep-dive': '#8b5cf6',
		'market-research': '#f59e0b',
		'job-search': '#10b981',
		'contract-sweep': '#ef4444',
		submissions: '#39ff14'
	};

	const sorted = $derived(
		[...research].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	);

	const filtered = $derived(
		activeTab === 'all' ? sorted : sorted.filter((r) => r.category === activeTab)
	);

	// Stats
	const totalLeads = $derived(research.reduce((sum, r) => sum + r.leadsFound, 0));
	const totalTierA = $derived(research.reduce((sum, r) => sum + r.tierACount, 0));
	const uniqueCompanies = $derived(
		new Set(research.flatMap((r) => r.companies).filter(Boolean)).size
	);
	const uniqueSources = $derived(
		new Set(research.flatMap((r) => r.sources)).size
	);

	// Category counts for filter tabs
	const categoryCounts = $derived(
		Object.keys(categoryLabels).reduce(
			(acc, cat) => {
				acc[cat as ResearchCategory] = research.filter((r) => r.category === cat).length;
				return acc;
			},
			{} as Record<ResearchCategory, number>
		)
	);

	function toggle(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	function daysAgo(dateStr: string): string {
		const diff = Math.floor(
			(Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
		);
		if (diff === 0) return 'Today';
		if (diff === 1) return 'Yesterday';
		return `${diff}d ago`;
	}
</script>

<svelte:head>
	<title>Research — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Research
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			{research.length} sessions · {totalLeads} leads found · {totalTierA} Tier A · {uniqueCompanies} companies · {uniqueSources} sources
		</p>
	</div>

	<!-- Stat Cards -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Sessions</p>
			<p class="mt-1 text-2xl font-bold" style="color: var(--color-text-primary)">{research.length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Total Leads</p>
			<p class="mt-1 text-2xl font-bold" style="color: var(--color-neon)">{totalLeads}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Tier A</p>
			<p class="mt-1 text-2xl font-bold" style="color: #8b5cf6">{totalTierA}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Companies</p>
			<p class="mt-1 text-2xl font-bold" style="color: var(--color-text-primary)">{uniqueCompanies}</p>
		</div>
	</div>

	<!-- Filter Tabs -->
	<div class="flex flex-wrap gap-2">
		<button
			onclick={() => (activeTab = 'all')}
			class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
			style={activeTab === 'all'
				? 'background: var(--color-neon); color: #0a0a0f'
				: 'background: rgba(255,255,255,0.05); color: var(--color-text-secondary)'}
		>
			All ({research.length})
		</button>
		{#each Object.entries(categoryLabels) as [cat, label]}
			{@const count = categoryCounts[cat as ResearchCategory]}
			{#if count > 0}
				<button
					onclick={() => (activeTab = cat as FilterTab)}
					class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
					style={activeTab === cat
						? `background: ${categoryColors[cat as ResearchCategory]}; color: #0a0a0f`
						: 'background: rgba(255,255,255,0.05); color: var(--color-text-secondary)'}
				>
					{label} ({count})
				</button>
			{/if}
		{/each}
	</div>

	<!-- Timeline -->
	<div class="stagger-children space-y-3">
		{#each filtered as entry}
			{@const isExpanded = expandedId === entry.id}
			<button
				onclick={() => toggle(entry.id)}
				class="card card-hover w-full cursor-pointer p-5 text-left transition-all"
				style={isExpanded
					? 'border-color: rgba(57,255,20,0.35); box-shadow: 0 0 0 1px rgba(57,255,20,0.1), 0 8px 32px rgba(0,0,0,0.4)'
					: ''}
			>
				<!-- Top row -->
				<div class="flex items-start justify-between gap-4">
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<span
								class="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
								style="background: {categoryColors[entry.category]}20; color: {categoryColors[entry.category]}; border: 1px solid {categoryColors[entry.category]}40"
							>
								{categoryLabels[entry.category]}
							</span>
							{#if entry.session}
								<span class="text-xs" style="color: var(--color-text-muted)">{entry.session}</span>
							{/if}
						</div>
						<h3 class="mt-2 font-bold leading-snug" style="color: var(--color-text-primary)">
							{entry.title}
						</h3>
					</div>
					<div class="shrink-0 text-right">
						<p class="text-xs font-medium" style="color: var(--color-neon)">{daysAgo(entry.date)}</p>
						<p class="mt-0.5 text-xs" style="color: var(--color-text-muted)">{entry.date}</p>
					</div>
				</div>

				<!-- Stats row -->
				<div class="mt-3 flex flex-wrap gap-4">
					<div class="flex items-center gap-1.5">
						<span class="text-xs" style="color: var(--color-text-muted)">Leads:</span>
						<span class="text-xs font-bold" style="color: var(--color-text-primary)">{entry.leadsFound}</span>
					</div>
					{#if entry.tierACount > 0}
						<div class="flex items-center gap-1.5">
							<span class="text-xs" style="color: var(--color-text-muted)">Tier A:</span>
							<span class="text-xs font-bold" style="color: var(--color-neon)">{entry.tierACount}</span>
						</div>
					{/if}
					{#if entry.companies.length > 0}
						<div class="flex items-center gap-1.5">
							<span class="text-xs" style="color: var(--color-text-muted)">Companies:</span>
							<span class="text-xs" style="color: var(--color-text-secondary)">{entry.companies.slice(0, 3).join(', ')}{entry.companies.length > 3 ? ` +${entry.companies.length - 3}` : ''}</span>
						</div>
					{/if}
				</div>

				<!-- Sources -->
				<div class="mt-2 flex flex-wrap gap-1.5">
					{#each entry.sources as source}
						<span
							class="rounded px-1.5 py-0.5 text-xs"
							style="background: rgba(255,255,255,0.05); color: var(--color-text-muted)"
						>
							{source}
						</span>
					{/each}
				</div>

				<!-- Expanded: highlights -->
				{#if isExpanded}
					<div class="mt-4 space-y-3 border-t pt-4" style="border-color: var(--color-border)">
						<div>
							<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
								Key Findings
							</p>
							<ul class="space-y-1.5">
								{#each entry.highlights as highlight}
									<li class="flex items-start gap-2 text-xs leading-relaxed" style="color: var(--color-text-secondary)">
										<span class="mt-0.5 shrink-0" style="color: var(--color-neon)">▸</span>
										{highlight}
									</li>
								{/each}
							</ul>
						</div>

						{#if entry.companies.length > 0}
							<div>
								<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
									Companies Covered
								</p>
								<div class="flex flex-wrap gap-1.5">
									{#each entry.companies as company}
										<span
											class="rounded px-2 py-0.5 text-xs font-medium"
											style="background: rgba(139,92,246,0.1); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2)"
										>
											{company}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						{#if entry.sourceFile}
							<p class="text-xs" style="color: var(--color-text-muted)">
								Source: {entry.sourceFile}
							</p>
						{/if}
					</div>
				{/if}
			</button>
		{/each}
	</div>

	{#if filtered.length === 0}
		<div class="card flex flex-col items-center justify-center p-12 text-center">
			<p class="text-lg font-bold" style="color: var(--color-text-primary)">No research found</p>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				No sessions match the selected filter.
			</p>
		</div>
	{/if}
</div>
