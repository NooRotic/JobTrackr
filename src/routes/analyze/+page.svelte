<script lang="ts">
	import { applications } from '$lib/data';
	import ScoreBadge from '$lib/components/ScoreBadge.svelte';
	import ScoreBreakdown from '$lib/components/ScoreBreakdown.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { scoreLabel, scoreColor } from '$lib/data/scoring';

	// Show only scored applications, most recent first
	const scored = $derived(
		applications
			.filter((a) => a.score != null && a.scoreDimensions != null)
			.sort((a, b) => {
				const dateA = a.dateApplied || a.dateSaved;
				const dateB = b.dateApplied || b.dateSaved;
				return new Date(dateB).getTime() - new Date(dateA).getTime();
			})
	);

	const avgScore = $derived(
		scored.length > 0
			? Math.round((scored.reduce((sum, a) => sum + (a.score ?? 0), 0) / scored.length) * 10) / 10
			: 0
	);

	const topMatch = $derived(scored.length > 0 ? scored.reduce((a, b) => ((a.score ?? 0) > (b.score ?? 0) ? a : b)) : null);

	let expandedId = $state<string | null>(null);

	function toggle(id: string) {
		expandedId = expandedId === id ? null : id;
	}
</script>

<svelte:head>
	<title>Analyze — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			JD Analyzer
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			{scored.length} analyzed · avg {avgScore}/5 ({scoreLabel(avgScore)})
			{#if topMatch}
				· best match: {topMatch.company} ({topMatch.score}/5)
			{/if}
		</p>
		<p class="mt-2 text-xs" style="color: var(--color-text-muted)">
			Run <code class="rounded bg-white/5 px-1.5 py-0.5 font-mono">/analyze-jd</code> in Claude Code to evaluate a new JD
		</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Analyzed</p>
			<p class="mt-1 text-2xl font-bold" style="color: var(--color-text-primary)">{scored.length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Avg Score</p>
			<p class="mt-1 text-2xl font-bold" style="color: {scoreColor(avgScore)}">{avgScore}/5</p>
		</div>
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Excellent (4.5+)</p>
			<p class="mt-1 text-2xl font-bold" style="color: var(--color-neon)">{scored.filter((a) => (a.score ?? 0) >= 4.5).length}</p>
		</div>
		<div class="card p-4">
			<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">Below Floor</p>
			<p class="mt-1 text-2xl font-bold" style="color: #ef4444">{scored.filter((a) => (a.score ?? 0) < 2.5).length}</p>
		</div>
	</div>

	<!-- Score distribution -->
	{#if scored.length > 0}
		<div class="card p-5">
			<p class="mb-3 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
				Score Distribution
			</p>
			<div class="flex items-end gap-1" style="height: 60px">
				{#each [
					{ min: 0, max: 1.5, label: 'Poor', color: '#6b7280' },
					{ min: 1.5, max: 2.5, label: 'Weak', color: '#ef4444' },
					{ min: 2.5, max: 3.5, label: 'Moderate', color: '#f59e0b' },
					{ min: 3.5, max: 4.5, label: 'Strong', color: '#10b981' },
					{ min: 4.5, max: 5.1, label: 'Excellent', color: '#39ff14' }
				] as bucket}
					{@const count = scored.filter((a) => (a.score ?? 0) >= bucket.min && (a.score ?? 0) < bucket.max).length}
					{@const maxCount = Math.max(...[0, 1.5, 2.5, 3.5, 4.5].map((min, i) => scored.filter((a) => (a.score ?? 0) >= min && (a.score ?? 0) < [1.5, 2.5, 3.5, 4.5, 5.1][i]).length), 1)}
					<div class="flex flex-1 flex-col items-center gap-1">
						<div
							class="w-full rounded-t"
							style="height: {(count / maxCount) * 100}%; min-height: 2px; background: {bucket.color}; opacity: 0.8"
						></div>
						<span class="text-[9px]" style="color: var(--color-text-muted)">{bucket.label}</span>
						<span class="text-[10px] font-bold tabular-nums" style="color: {bucket.color}">{count}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Analyzed JDs -->
	<div class="stagger-children space-y-3">
		{#each scored as app}
			{@const isExpanded = expandedId === app.id}
			<button
				onclick={() => toggle(app.id)}
				class="card card-hover w-full cursor-pointer p-5 text-left transition-all"
				style={isExpanded
					? 'border-color: rgba(57,255,20,0.35); box-shadow: 0 0 0 1px rgba(57,255,20,0.1), 0 8px 32px rgba(0,0,0,0.4)'
					: ''}
			>
				<!-- Top row -->
				<div class="flex items-start justify-between gap-4">
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<h3 class="font-bold" style="color: var(--color-text-primary)">{app.company}</h3>
							<StatusBadge status={app.status} />
							<ScoreBadge score={app.score} />
						</div>
						<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">{app.role}</p>
					</div>
					<div class="shrink-0 text-right">
						<p class="text-sm font-medium" style="color: var(--color-neon)">{app.salary}</p>
						<p class="mt-0.5 text-xs" style="color: var(--color-text-muted)">
							{app.dateApplied ? `Applied ${app.dateApplied}` : `Saved ${app.dateSaved}`}
						</p>
					</div>
				</div>

				<!-- Tags -->
				<div class="mt-3 flex flex-wrap gap-2">
					{#if app.remote}
						<span class="rounded px-1.5 py-0.5 text-xs" style="background: rgba(57,255,20,0.08); color: var(--color-neon)">Remote</span>
					{:else}
						<span class="rounded px-1.5 py-0.5 text-xs" style="background: rgba(255,255,255,0.05); color: var(--color-text-muted)">{app.location}</span>
					{/if}
					{#if app.source}
						<span class="rounded px-1.5 py-0.5 text-xs" style="background: rgba(255,255,255,0.05); color: var(--color-text-muted)">{app.source}</span>
					{/if}
				</div>

				<!-- Expanded -->
				{#if isExpanded && app.scoreDimensions}
					<div class="mt-4 space-y-4 border-t pt-4" style="border-color: var(--color-border)">
						<div>
							<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
								Score Breakdown — {app.score}/5 ({scoreLabel(app.score ?? 0)})
							</p>
							<ScoreBreakdown dimensions={app.scoreDimensions} />
						</div>

						{#if app.notes}
							<div>
								<p class="mb-1.5 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Notes</p>
								<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">{app.notes}</p>
							</div>
						{/if}

						{#if app.url && app.url !== '#'}
							<a
								href={app.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-block text-xs font-medium"
								style="color: var(--color-neon)"
							>
								View listing ↗
							</a>
						{/if}
					</div>
				{/if}
			</button>
		{/each}
	</div>

	{#if scored.length === 0}
		<div class="card flex flex-col items-center justify-center p-12 text-center">
			<p class="text-lg font-bold" style="color: var(--color-text-primary)">No analyses yet</p>
			<p class="mt-2 text-sm" style="color: var(--color-text-secondary)">
				Run <code class="rounded bg-white/5 px-1.5 py-0.5 font-mono">/analyze-jd</code> in Claude Code to evaluate your first JD.
			</p>
			<p class="mt-1 text-xs" style="color: var(--color-text-muted)">
				Paste a JD URL or text and get a 6-dimension score breakdown, gap analysis, and fit assessment.
			</p>
		</div>
	{/if}
</div>
