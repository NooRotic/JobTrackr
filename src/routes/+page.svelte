<script lang="ts">
	import { applications, searches, activity } from '$lib/data';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import type { ApplicationStatus } from '$lib/data/types';

	// Computed stats
	const totalApplications = applications.filter((a) => a.status !== 'saved').length;
	const activeSearches = searches.length;
	const interviewsScheduled = applications.filter((a) => a.status === 'interview').length;
	const offers = applications.filter((a) => a.status === 'offer' || a.status === 'accepted').length;

	// Pipeline stages
	const pipeline: { status: ApplicationStatus; label: string }[] = [
		{ status: 'saved', label: 'Saved' },
		{ status: 'applied', label: 'Applied' },
		{ status: 'screening', label: 'Screening' },
		{ status: 'interview', label: 'Interview' },
		{ status: 'offer', label: 'Offer' }
	];

	const pipelineCounts = pipeline.map(({ status, label }) => ({
		status,
		label,
		count: applications.filter((a) => a.status === status).length
	}));

	const maxPipelineCount = Math.max(...pipelineCounts.map((p) => p.count), 1);

	const statusColors: Record<ApplicationStatus, string> = {
		saved: '#6366f1',
		applied: '#3b82f6',
		screening: '#f59e0b',
		interview: '#8b5cf6',
		offer: '#10b981',
		accepted: '#39ff14',
		rejected: '#ef4444'
	};

	// Recent activity (latest 6)
	const recentActivity = activity.slice(0, 6);

	const activityIcons: Record<string, string> = {
		search: '⌕',
		application: '◎',
		status_change: '→',
		interview: '◆',
		offer: '★'
	};

	// Recent searches
	const recentSearches = searches.slice(0, 3);
</script>

<svelte:head>
	<title>Dashboard — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-8">
	<!-- Page header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Dashboard
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			Your job search at a glance
		</p>
	</div>

	<!-- Stats grid -->
	<div class="stagger-children grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<StatCard label="Total Applications" value={totalApplications} icon="◎" trend="Since Feb 2026" />
		<StatCard label="Active Searches" value={activeSearches} icon="⌕" />
		<StatCard label="Interviews Scheduled" value={interviewsScheduled} icon="◆" accent={true} />
		<StatCard label="Offers" value={offers} icon="★" />
	</div>

	<!-- Pipeline -->
	<div class="card p-6">
		<h2 class="mb-6 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-secondary)">
			Application Pipeline
		</h2>

		<!-- Funnel bars -->
		<div class="mb-4 flex items-end gap-3">
			{#each pipelineCounts as stage}
				<div class="flex flex-1 flex-col items-center gap-2">
					<span class="text-lg font-bold tabular-nums" style="color: var(--color-text-primary)">
						{stage.count}
					</span>
					<div class="relative w-full overflow-hidden rounded-t-sm" style="height: 80px; background: rgba(255,255,255,0.04)">
						<div
							class="absolute bottom-0 w-full rounded-t-sm transition-all duration-700 ease-out"
							style="height: {(stage.count / maxPipelineCount) * 100}%; background: {statusColors[stage.status]}; opacity: 0.85"
						></div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Labels -->
		<div class="flex gap-3">
			{#each pipelineCounts as stage}
				<div class="flex flex-1 flex-col items-center">
					<span class="text-center text-xs font-medium" style="color: var(--color-text-secondary)">
						{stage.label}
					</span>
				</div>
			{/each}
		</div>

		<!-- Flow chips -->
		<div class="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
			{#each pipelineCounts as stage, i}
				<div class="flex min-w-0 flex-1 items-center">
					<div
						class="flex w-full items-center justify-center rounded-lg py-2 px-3 text-xs font-medium"
						style="background: {statusColors[stage.status]}18; border: 1px solid {statusColors[stage.status]}33; color: {statusColors[stage.status]}"
					>
						{stage.label}
						<span class="ml-1.5 font-bold">{stage.count}</span>
					</div>
				</div>
				{#if i < pipelineCounts.length - 1}
					<span class="shrink-0 text-xs" style="color: var(--color-text-muted)">→</span>
				{/if}
			{/each}
			<span class="shrink-0 text-xs" style="color: var(--color-text-muted)">→</span>
			<div
				class="flex min-w-0 flex-1 items-center justify-center rounded-lg py-2 px-3 text-xs font-medium"
				style="background: rgba(57,255,20,0.08); border: 1px solid rgba(57,255,20,0.2); color: var(--color-neon)"
			>
				Offer ✓
			</div>
		</div>
	</div>

	<!-- Bottom grid: activity + recent searches -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Activity feed -->
		<div class="card p-6">
			<div class="mb-5 flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-secondary)">
					Recent Activity
				</h2>
				<a href="/applications" class="text-xs transition-colors hover:text-white" style="color: var(--color-text-muted)">
					View all →
				</a>
			</div>

			<div class="space-y-4">
				{#each recentActivity as item}
					<div class="flex gap-3">
						<div
							class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
							style="background: rgba(255,255,255,0.06); color: var(--color-text-secondary)"
						>
							{activityIcons[item.type] ?? '•'}
						</div>
						<div class="min-w-0">
							<p class="text-sm font-medium leading-snug" style="color: var(--color-text-primary)">
								{item.message}
							</p>
							{#if item.meta}
								<p class="mt-0.5 truncate text-xs" style="color: var(--color-text-muted)">
									{item.meta}
								</p>
							{/if}
							<p class="mt-1 text-xs" style="color: var(--color-text-muted)">{item.date}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent searches -->
		<div class="card p-6">
			<div class="mb-5 flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-secondary)">
					Recent Searches
				</h2>
				<a href="/searches" class="text-xs transition-colors hover:text-white" style="color: var(--color-text-muted)">
					View all →
				</a>
			</div>

			<div class="space-y-3">
				{#each recentSearches as search}
					<a
						href="/searches"
						class="card-hover block rounded-lg p-3 transition-all"
						style="background: rgba(255,255,255,0.03); border: 1px solid var(--color-border)"
					>
						<p class="text-sm font-medium leading-snug" style="color: var(--color-text-primary)">
							{search.query}
						</p>
						<div class="mt-2 flex items-center gap-3">
							<span class="text-xs" style="color: var(--color-text-muted)">{search.date}</span>
							<span class="text-xs" style="color: var(--color-text-muted)">
								{search.results.length} results
							</span>
							{#if search.topLeads > 0}
								<span class="text-xs font-medium" style="color: var(--color-neon)">
									{search.topLeads} high-fit
								</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Quick links -->
	<div class="grid gap-4 sm:grid-cols-3">
		{#each [
			{ href: '/applications', label: 'Track Applications', desc: 'Kanban board view', icon: '◎' },
			{ href: '/searches', label: 'Browse Searches', desc: 'All saved search results', icon: '⌕' },
			{ href: '/companies', label: 'Company Research', desc: 'Ratings, culture, salary', icon: '⬡' }
		] as link}
			<a href={link.href} class="card card-hover group flex items-center gap-4 p-5">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl transition-colors"
					style="background: rgba(57,255,20,0.08); color: var(--color-neon)"
				>
					{link.icon}
				</div>
				<div>
					<p class="text-sm font-semibold" style="color: var(--color-text-primary)">{link.label}</p>
					<p class="text-xs" style="color: var(--color-text-muted)">{link.desc}</p>
				</div>
				<span
					class="ml-auto text-lg opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
					style="color: var(--color-neon)"
				>→</span>
			</a>
		{/each}
	</div>
</div>
