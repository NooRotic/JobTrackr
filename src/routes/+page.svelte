<script lang="ts">
	import { applications, searches, activity, companyTargets, calculateConfidence } from '$lib/data';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import PriorityBadge from '$lib/components/PriorityBadge.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import type { ApplicationStatus, SearchResult } from '$lib/data/types';

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

	// Get applied job IDs and URLs to filter out already-applied leads
	const appliedJobIds = new Set(applications.map((a) => a.jobId).filter(Boolean));
	const appliedUrls = new Set(applications.map((a) => a.url).filter((u) => u && u !== '#'));
	// Also extract Indeed job keys from URLs for cross-format matching
	const appliedIndeedKeys = new Set(
		[...appliedUrls, ...applications.map((a) => a.url)].filter(Boolean).map((u) => {
			const match = u.match(/[?&]jk=([a-f0-9]+)/);
			return match ? match[1] : null;
		}).filter(Boolean) as string[]
	);

	function isAlreadyApplied(url: string, id?: string): boolean {
		if (id && appliedJobIds.has(id)) return true;
		if (url !== '#' && appliedUrls.has(url)) return true;
		// Check Indeed job key across different URL formats
		const keyMatch = url.match(/[?&]jk=([a-f0-9]+)/);
		if (keyMatch && appliedIndeedKeys.has(keyMatch[1])) return true;
		// Check if indeed.com/to.indeed.com point to same job
		const shortMatch = url.match(/to\.indeed\.com\/([a-z0-9]+)/);
		if (shortMatch) {
			// Can't reliably match short URLs to full URLs, but check company+role dedup below
		}
		return false;
	}

	// Also deduplicate by company+role combo
	const appliedCompanyRoles = new Set(
		applications.map((a) => `${a.company.toLowerCase()}|${a.role.toLowerCase()}`)
	);

	// Collect ALL P1 leads from searches + company targets, excluding already applied
	interface Lead {
		role: string;
		company: string;
		salary: string;
		location: string;
		remote: boolean;
		url: string;
		priority: string;
		notes: string;
		source: string;
		confidence?: number;
		expired?: boolean;
	}

	const allLeads: Lead[] = [];

	// From searches
	for (const search of searches) {
		for (const r of search.results) {
			if (r.priority === 'SKIP') continue;
			if (isAlreadyApplied(r.url)) continue;
			if (appliedCompanyRoles.has(`${r.company.toLowerCase()}|${r.role.toLowerCase()}`)) continue;
			if (r.expired) continue;
			allLeads.push({
				...r,
				source: `Search: ${search.query.split('—')[0].trim()}`
			});
		}
	}

	// From company targets
	for (const target of companyTargets) {
		for (const job of target.jobs) {
			if (job.priority === 'SKIP') continue;
			if (isAlreadyApplied(job.url)) continue;
			if (appliedCompanyRoles.has(`${job.company.toLowerCase()}|${job.role.toLowerCase()}`)) continue;
			if (job.expired) continue;
			// Avoid duplicates (same URL already from searches)
			if (allLeads.some((l) => l.url === job.url && job.url !== '#')) continue;
			allLeads.push({
				...job,
				source: `Target: ${target.name}`,
				confidence: calculateConfidence(job)
			});
		}
	}

	// Sort: P1 first, then P2, then P3. Within tier, by confidence or salary
	const priorityOrder = { P1: 0, P2: 1, P3: 2, SKIP: 3 };
	const sortedLeads = allLeads.sort((a, b) => {
		const pa = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
		const pb = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
		if (pa !== pb) return pa - pb;
		return (b.confidence ?? 0) - (a.confidence ?? 0);
	});

	const topLeads = sortedLeads.slice(0, 8);
	const p1Count = allLeads.filter((l) => l.priority === 'P1').length;

	// Recent activity (latest 6)
	const recentActivity = activity.slice(0, 6);

	const activityIcons: Record<string, string> = {
		search: '⌕',
		application: '◎',
		status_change: '→',
		interview: '◆',
		offer: '★'
	};
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
		<StatCard label="Applied" value={totalApplications} icon="◎" trend="{applications.filter(a => a.status === 'applied').length} pending response" />
		<StatCard label="P1 Leads" value={p1Count} icon="★" accent={true} />
		<StatCard label="Interviews" value={interviewsScheduled} icon="◆" />
		<StatCard label="Offers" value={offers} icon="✓" />
	</div>

	<!-- Top Leads — Apply Now -->
	<div class="card p-6">
		<div class="mb-5 flex items-center justify-between">
			<div>
				<h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-neon)">
					Top Leads — Apply Now
				</h2>
				<p class="mt-1 text-xs" style="color: var(--color-text-muted)">
					{p1Count} P1 leads across searches and company targets · excludes already applied
				</p>
			</div>
			<a href="/searches" class="text-xs transition-colors hover:text-white" style="color: var(--color-text-muted)">
				All searches →
			</a>
		</div>

		{#if topLeads.length === 0}
			<p class="py-8 text-center text-sm" style="color: var(--color-text-muted)">
				No unapplied leads. Run more searches or check company targets.
			</p>
		{:else}
			<div class="space-y-2">
				{#each topLeads as lead}
					<div
						class="flex flex-col gap-2 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between"
						style="background: rgba(255,255,255,0.02); border: 1px solid {lead.priority === 'P1' ? 'rgba(57,255,20,0.15)' : 'var(--color-border)'}"
					>
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="text-sm font-semibold" style="color: var(--color-text-primary)">{lead.role}</span>
								<PriorityBadge priority={lead.priority} />
								{#if lead.confidence}
									<span class="text-xs font-bold" style="color: {lead.confidence >= 65 ? '#39FF14' : lead.confidence >= 45 ? '#f59e0b' : '#0ea5e9'}">
										{lead.confidence}%
									</span>
								{/if}
							</div>
							<div class="mt-1 flex flex-wrap items-center gap-3">
								<span class="text-xs" style="color: var(--color-text-secondary)">{lead.company}</span>
								<span class="text-xs font-medium" style="color: var(--color-neon)">
									{lead.salary !== 'Not listed' ? lead.salary : 'Salary TBD'}
								</span>
								<span class="text-xs" style="color: var(--color-text-muted)">
									{lead.remote ? '🌐 Remote' : lead.location}
								</span>
								<span class="rounded-full px-2 py-0.5 text-[10px]"
									style="background: rgba(255,255,255,0.04); color: var(--color-text-muted)">
									{lead.source}
								</span>
							</div>
						</div>
						{#if lead.url !== '#'}
							<a
								href={lead.url}
								target="_blank"
								rel="noopener noreferrer"
								class="shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-all hover:opacity-80"
								style="background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.25)"
							>
								Apply ↗
							</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Pipeline + Activity -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Pipeline -->
		<div class="card p-6">
			<h2 class="mb-5 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-secondary)">
				Pipeline
			</h2>
			<div class="mb-4 flex items-end gap-3">
				{#each pipelineCounts as stage}
					<div class="flex flex-1 flex-col items-center gap-2">
						<span class="text-lg font-bold tabular-nums" style="color: var(--color-text-primary)">
							{stage.count}
						</span>
						<div class="relative w-full overflow-hidden rounded-t-sm" style="height: 60px; background: rgba(255,255,255,0.04)">
							<div
								class="absolute bottom-0 w-full rounded-t-sm transition-all duration-700 ease-out"
								style="height: {(stage.count / maxPipelineCount) * 100}%; background: {statusColors[stage.status]}; opacity: 0.85"
							></div>
						</div>
						<span class="text-center text-xs font-medium" style="color: var(--color-text-secondary)">
							{stage.label}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Activity feed -->
		<div class="card p-6">
			<div class="mb-5 flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-secondary)">
					Recent Activity
				</h2>
				<a href="/status" class="text-xs transition-colors hover:text-white" style="color: var(--color-text-muted)">
					Full status →
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
	</div>

	<!-- Quick links -->
	<div class="grid gap-4 sm:grid-cols-4">
		{#each [
			{ href: '/applications', label: 'Applications', desc: 'Kanban + table', icon: '◎' },
			{ href: '/targets', label: 'Targets', desc: 'Company deep-dive', icon: '◎' },
			{ href: '/searches', label: 'Searches', desc: 'P1/P2/P3 results', icon: '⌕' },
			{ href: '/status', label: 'Status', desc: 'Progress + next steps', icon: '⚡' }
		] as link}
			<a href={link.href} class="card card-hover group flex items-center gap-3 p-4">
				<div
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition-colors"
					style="background: rgba(57,255,20,0.08); color: var(--color-neon)"
				>
					{link.icon}
				</div>
				<div>
					<p class="text-sm font-semibold" style="color: var(--color-text-primary)">{link.label}</p>
					<p class="text-xs" style="color: var(--color-text-muted)">{link.desc}</p>
				</div>
				<span
					class="ml-auto text-sm opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
					style="color: var(--color-neon)"
				>→</span>
			</a>
		{/each}
	</div>
</div>
