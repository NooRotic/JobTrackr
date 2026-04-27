<script lang="ts">
	import { applications } from '$lib/data';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import DeployBadge from '$lib/components/DeployBadge.svelte';
	import LegitimacyBadge from '$lib/components/LegitimacyBadge.svelte';
	import { assessLegitimacy, type LegitimacyTier } from '$lib/data/legitimacy';
	import { loadLinkHealth, getLinkStatus, type LinkHealthData } from '$lib/data/linkHealth';

	let linkHealth = $state<LinkHealthData | null>(null);
	loadLinkHealth().then((d) => (linkHealth = d));

	const applied = applications.filter((a) => a.status === 'applied');
	const deployReady = applications.filter((a) => a.status === 'saved' && a.deployStatus === 'deploy-ready');
	const research = applications.filter((a) => a.status === 'saved' && a.deployStatus === 'research');

	// Legitimacy summary for applied apps
	const legitimacySummary = $derived(() => {
		const counts: Record<LegitimacyTier, number> = { high: 0, caution: 0, suspicious: 0, ghost: 0 };
		for (const app of applied) {
			const ls = linkHealth ? getLinkStatus(app.id, linkHealth).status : undefined;
			const result = assessLegitimacy(app, ls);
			counts[result.tier]++;
		}
		return counts;
	});
</script>

<svelte:head>
	<title>Pipeline — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-8">
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Pipeline
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			{applied.length} applied · {deployReady.length} ready to submit · {research.length} research
		</p>
		{#if linkHealth}
			{@const summary = legitimacySummary()}
			{#if summary.suspicious > 0 || summary.ghost > 0}
				<p class="mt-1 text-xs" style="color: #ef4444">
					{summary.suspicious + summary.ghost} application{summary.suspicious + summary.ghost > 1 ? 's' : ''} flagged as suspicious/ghost
				</p>
			{/if}
		{/if}
	</div>

	<!-- Applied -->
	<div>
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-widest" style="color: #3b82f6">
			Applied ({applied.length})
		</h2>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr style="border-bottom: 1px solid var(--color-border)">
						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Company</th>
						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Role</th>
						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Salary</th>
						<th class="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Remote</th>
						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Date</th>
						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Link</th>
						<th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Legitimacy</th>
					</tr>
				</thead>
				<tbody>
					{#each applied as app, i}
						<tr style={i < applied.length - 1 ? 'border-bottom: 1px solid var(--color-border)' : ''} class="hover:bg-white/[0.02]">
							<td class="px-3 py-2.5 font-medium" style="color: var(--color-text-primary)">{app.company}</td>
							<td class="px-3 py-2.5 max-w-[200px]" style="color: var(--color-text-secondary)">
								<span class="block truncate">{app.role}</span>
							</td>
							<td class="px-3 py-2.5 whitespace-nowrap text-xs font-medium" style="color: var(--color-neon)">{app.salary}</td>
							<td class="px-3 py-2.5 text-center">{app.remote ? '🌐' : '—'}</td>
							<td class="px-3 py-2.5 whitespace-nowrap text-xs" style="color: var(--color-text-muted)">{app.dateApplied}</td>
							<td class="px-3 py-2.5">
								{#if app.url && app.url !== '#'}
									<a href={app.url} target="_blank" rel="noopener noreferrer" class="text-xs" style="color: var(--color-neon)">View ↗</a>
								{/if}
							</td>
							<td class="px-3 py-2.5">
								{#if true}
									{@const ls = linkHealth ? getLinkStatus(app.id, linkHealth).status : undefined}
									{@const legit = assessLegitimacy(app, ls)}
									<LegitimacyBadge tier={legit.tier} score={legit.score} signals={legit.signals} />
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Deploy-Ready -->
	<div>
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-neon)">
			Ready to Submit ({deployReady.length})
		</h2>
		<div class="space-y-3">
			{#each deployReady as app}
				<div class="card overflow-hidden" style="border-color: rgba(57,255,20,0.12)">
					<div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="text-sm font-bold" style="color: var(--color-text-primary)">{app.company}</span>
								<DeployBadge status={app.deployStatus} />
								{#if app.remote}
									<span class="text-xs" style="color: var(--color-text-muted)">🌐 Remote</span>
								{:else}
									<span class="text-xs" style="color: var(--color-text-muted)">{app.location}</span>
								{/if}
							</div>
							<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">{app.role}</p>
							<p class="mt-1 text-sm font-medium" style="color: var(--color-neon)">{app.salary}</p>
							{#if app.notes}
								<p class="mt-2 text-xs leading-relaxed" style="color: var(--color-text-muted)">{app.notes}</p>
							{/if}
							{#if app.deployPath}
								<p class="mt-1 text-[10px]" style="color: var(--color-text-muted)">📁 {app.deployPath}</p>
							{/if}
						</div>
						<div class="flex shrink-0 gap-2">
							{#if app.url && app.url !== '#'}
								<a href={app.url} target="_blank" rel="noopener noreferrer"
									class="rounded-lg px-4 py-2 text-xs font-medium transition-all hover:opacity-80"
									style="background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.25)">
									Apply Now ↗
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Research -->
	<div>
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-widest" style="color: #a78bfa">
			Research ({research.length})
		</h2>
		<div class="space-y-3">
			{#each research as app}
				<div class="card overflow-hidden" style="border-color: rgba(139,92,246,0.12)">
					<div class="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="text-sm font-bold" style="color: var(--color-text-primary)">{app.company}</span>
								<DeployBadge status={app.deployStatus} />
								{#if app.remote}
									<span class="text-xs" style="color: var(--color-text-muted)">🌐 Remote</span>
								{:else}
									<span class="text-xs" style="color: var(--color-text-muted)">{app.location}</span>
								{/if}
							</div>
							<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">{app.role}</p>
							<p class="mt-1 text-sm font-medium" style="color: var(--color-neon)">{app.salary}</p>
							{#if app.notes}
								<p class="mt-2 text-xs leading-relaxed" style="color: var(--color-text-muted)">{app.notes}</p>
							{/if}
						</div>
						<div class="flex shrink-0 gap-2">
							{#if app.url && app.url !== '#'}
								<a href={app.url} target="_blank" rel="noopener noreferrer"
									class="rounded-lg px-4 py-2 text-xs font-medium transition-all hover:opacity-80"
									style="background: rgba(139,92,246,0.1); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2)">
									View JD ↗
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
