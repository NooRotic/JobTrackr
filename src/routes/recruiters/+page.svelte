<script lang="ts">
	import { recruiters, applications } from '$lib/data';
	import type { Recruiter, RecruiterStatus, SignalTier } from '$lib/data/types';
	import { RECRUITER_STATUS_CONFIG, ALL_RECRUITER_STATUSES } from '$lib/data/recruiterStates';
	import RecruiterStatusBadge from '$lib/components/RecruiterStatusBadge.svelte';
	import SignalTierBadge from '$lib/components/SignalTierBadge.svelte';

	const TODAY = new Date().toISOString().split('T')[0];

	let selected = $state<Recruiter | null>(null);
	let statusFilter = $state<RecruiterStatus | 'all'>('all');
	let tierFilter = $state<SignalTier | 'all'>('all');
	let searchQuery = $state('');

	function isOverdue(r: Recruiter): boolean {
		return !!r.nextStepDue && r.nextStepDue < TODAY;
	}

	function appsFor(recruiterId: string) {
		return applications.filter((a) => a.recruiterId === recruiterId);
	}

	const filtered = $derived(
		recruiters
			.filter((r) => statusFilter === 'all' || r.status === statusFilter)
			.filter((r) => tierFilter === 'all' || r.signalTier === tierFilter)
			.filter((r) => {
				if (!searchQuery.trim()) return true;
				const q = searchQuery.toLowerCase();
				return (
					r.name.toLowerCase().includes(q) ||
					r.firm.toLowerCase().includes(q) ||
					(r.clientCompany ?? '').toLowerCase().includes(q)
				);
			})
			.sort((a, b) => {
				const aOver = isOverdue(a);
				const bOver = isOverdue(b);
				if (aOver && !bOver) return -1;
				if (bOver && !aOver) return 1;
				return b.dateLastTouch.localeCompare(a.dateLastTouch);
			})
	);

	const overdueCount = $derived(recruiters.filter(isOverdue).length);
</script>

<svelte:head>
	<title>Recruiters — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
				Recruiters
			</h1>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				{recruiters.length} total
				{#if overdueCount > 0}
					·
					<span style="color: #f59e0b"
						>{overdueCount} overdue follow-up{overdueCount === 1 ? '' : 's'}</span
					>
				{/if}
			</p>
		</div>

		<input
			bind:value={searchQuery}
			placeholder="Search name, firm, or client…"
			class="rounded-lg px-3 py-2 text-sm sm:w-64"
			style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)"
		/>
	</div>

	<!-- Filter chips -->
	<div class="flex flex-wrap gap-2">
		<button
			onclick={() => (statusFilter = 'all')}
			class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
			style={statusFilter === 'all'
				? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border-color: rgba(57,255,20,0.3)'
				: 'background: rgba(255,255,255,0.03); color: var(--color-text-secondary); border-color: var(--color-border)'}
		>
			All Statuses
		</button>
		{#each RECRUITER_STATUS_CONFIG as s}
			<button
				onclick={() => (statusFilter = s.status)}
				class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
				style={statusFilter === s.status
					? `background: ${s.color}22; color: ${s.color}; border-color: ${s.color}55`
					: 'background: rgba(255,255,255,0.03); color: var(--color-text-secondary); border-color: var(--color-border)'}
			>
				{s.label}
			</button>
		{/each}

		<span class="mx-2" style="color: var(--color-text-muted)">|</span>

		{#each ['all', 'signal', 'noise', 'unrated'] as t}
			<button
				onclick={() => (tierFilter = t as SignalTier | 'all')}
				class="rounded-full border px-3 py-1 text-xs font-medium transition-all"
				style={tierFilter === t
					? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border-color: rgba(57,255,20,0.3)'
					: 'background: rgba(255,255,255,0.03); color: var(--color-text-secondary); border-color: var(--color-border)'}
			>
				{t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}
			</button>
		{/each}
	</div>

	<!-- Grid -->
	<div class="stagger-children grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each filtered as r (r.id)}
			{@const isSelected = selected?.id === r.id}
			{@const overdue = isOverdue(r)}
			{@const linked = appsFor(r.id)}

			<button
				onclick={() => (selected = isSelected ? null : r)}
				class="card card-hover cursor-pointer p-5 text-left transition-all"
				style={isSelected
					? 'border-color: rgba(57,255,20,0.35); box-shadow: 0 0 0 1px rgba(57,255,20,0.1), 0 8px 32px rgba(0,0,0,0.4)'
					: overdue
						? 'border-color: rgba(245,158,11,0.3)'
						: ''}
			>
				<!-- Top row -->
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<h3 class="truncate font-bold" style="color: var(--color-text-primary)">{r.name}</h3>
						<p class="mt-0.5 text-xs" style="color: var(--color-text-secondary)">{r.firm}</p>
					</div>
					<div class="flex shrink-0 flex-col items-end gap-1">
						<RecruiterStatusBadge status={r.status} />
						<SignalTierBadge tier={r.signalTier} />
					</div>
				</div>

				<!-- Meta -->
				{#if r.clientCompany}
					<p class="mt-3 text-xs" style="color: var(--color-text-muted)">
						Client: <span style="color: var(--color-text-secondary)">{r.clientCompany}</span>
					</p>
				{/if}

				<p class="mt-1 text-xs" style="color: var(--color-text-muted)">
					Last touch: {r.dateLastTouch} · {r.touches.length} touch{r.touches.length === 1
						? ''
						: 'es'}
					{#if linked.length > 0}
						· {linked.length} app{linked.length === 1 ? '' : 's'}
					{/if}
				</p>

				<!-- Overdue / next-step pill -->
				{#if overdue}
					<p class="mt-2 text-xs font-medium" style="color: #f59e0b">
						⚠ Overdue: {r.nextStep ?? 'follow up'} ({r.nextStepDue})
					</p>
				{:else if r.nextStep}
					<p class="mt-2 text-xs" style="color: var(--color-text-muted)">
						Next: {r.nextStep}
						{#if r.nextStepDue}
							<span style="color: var(--color-text-secondary)"> · due {r.nextStepDue}</span>
						{/if}
					</p>
				{/if}

				<!-- Expanded detail -->
				{#if isSelected}
					<div class="mt-4 space-y-4 border-t pt-4" style="border-color: var(--color-border)">
						<!-- Touch log -->
						<div>
							<p class="mb-2 text-xs font-medium" style="color: var(--color-text-muted)">
								Touch log ({r.touches.length})
							</p>
							<ul class="space-y-2">
								{#each [...r.touches].reverse() as t}
									<li class="text-xs">
										<span style="color: var(--color-text-muted)">{t.date}</span>
										<span style="color: var(--color-neon)">
											· {t.direction === 'in' ? '←' : '→'}
										</span>
										<span style="color: var(--color-text-muted)">{t.channel}</span>
										<span style="color: var(--color-text-secondary)"> — {t.summary}</span>
									</li>
								{/each}
							</ul>
						</div>

						<!-- Linked applications -->
						{#if linked.length > 0}
							<div>
								<p class="mb-2 text-xs font-medium" style="color: var(--color-text-muted)">
									Linked applications
								</p>
								<ul class="space-y-1">
									{#each linked as app}
										<li class="text-xs">
											<a
												href="/applications"
												class="transition-colors hover:opacity-80"
												style="color: var(--color-neon)"
												onclick={(e) => e.stopPropagation()}
											>
												{app.id}
											</a>
											<span style="color: var(--color-text-secondary)">
												· {app.company} — {app.role}</span
											>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Notes -->
						{#if r.notes}
							<div>
								<p class="mb-1 text-xs font-medium" style="color: var(--color-text-muted)">Notes</p>
								<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">
									{r.notes}
								</p>
							</div>
						{/if}

						<!-- Signal notes -->
						{#if r.signalNotes}
							<div>
								<p class="mb-1 text-xs font-medium" style="color: var(--color-text-muted)">
									Signal-tier reasoning
								</p>
								<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">
									{r.signalNotes}
								</p>
							</div>
						{/if}

						<!-- Contact methods -->
						<div class="flex flex-wrap gap-3 text-xs">
							{#if r.email}
								<a
									href="mailto:{r.email}"
									onclick={(e) => e.stopPropagation()}
									style="color: var(--color-neon)"
								>
									{r.email}
								</a>
							{/if}
							{#if r.phone}
								<span style="color: var(--color-text-muted)">{r.phone}</span>
							{/if}
							{#if r.linkedinUrl}
								<a
									href={r.linkedinUrl}
									target="_blank"
									rel="noopener noreferrer"
									onclick={(e) => e.stopPropagation()}
									style="color: var(--color-neon)"
								>
									LinkedIn ↗
								</a>
							{/if}
						</div>
					</div>
				{/if}
			</button>
		{/each}

		{#if filtered.length === 0}
			<div
				class="col-span-full rounded-lg py-12 text-center text-sm"
				style="border: 1px dashed var(--color-border); color: var(--color-text-muted)"
			>
				No recruiters match the current filters.
			</div>
		{/if}
	</div>

	<!-- Persistence note (matches Applications page convention) -->
	<div
		class="rounded-xl p-4"
		style="background: rgba(255,255,255,0.02); border: 1px dashed var(--color-border)"
	>
		<p class="text-xs" style="color: var(--color-text-muted)">
			Recruiter entries live in
			<code style="color: var(--color-neon)">src/lib/data/personal/recruiters.ts</code>. Update that
			file directly to log touches, change status, or link applications via the
			<code style="color: var(--color-neon)">recruiterId</code> field on
			<code style="color: var(--color-neon)">applications.ts</code>.
		</p>
	</div>
</div>
