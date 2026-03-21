<script lang="ts">
	import { applications } from '$lib/data';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import type { Application, ApplicationStatus } from '$lib/data/types';

	type ViewMode = 'kanban' | 'table';
	let viewMode = $state<ViewMode>('kanban');

	const columns: { status: ApplicationStatus; label: string; color: string }[] = [
		{ status: 'saved', label: 'Saved', color: '#6366f1' },
		{ status: 'applied', label: 'Applied', color: '#3b82f6' },
		{ status: 'screening', label: 'Screening', color: '#f59e0b' },
		{ status: 'interview', label: 'Interview', color: '#8b5cf6' },
		{ status: 'offer', label: 'Offer', color: '#10b981' },
		{ status: 'rejected', label: 'Closed', color: '#ef4444' }
	];

	const grouped = $derived(
		Object.fromEntries(
			columns.map((col) => [
				col.status,
				applications.filter((a) => {
					if (col.status === 'rejected') return a.status === 'rejected' || a.status === 'accepted';
					return a.status === col.status;
				})
			])
		) as Record<ApplicationStatus, Application[]>
	);

	let selectedApp = $state<Application | null>(null);
</script>

<svelte:head>
	<title>Applications — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
				Applications
			</h1>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				{applications.length} total · {applications.filter((a) => a.status !== 'saved' && a.status !== 'rejected').length} active
			</p>
		</div>

		<!-- View toggle -->
		<div
			class="flex rounded-lg p-1"
			style="background: var(--color-bg-card); border: 1px solid var(--color-border)"
		>
			{#each [
				{ mode: 'kanban', label: 'Kanban', icon: '▦' },
				{ mode: 'table', label: 'Table', icon: '☰' }
			] as v}
				<button
					onclick={() => (viewMode = v.mode as ViewMode)}
					class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
					style={viewMode === v.mode
						? 'background: rgba(57,255,20,0.12); color: var(--color-neon)'
						: 'color: var(--color-text-secondary)'}
				>
					{v.icon} {v.label}
				</button>
			{/each}
		</div>
	</div>

	{#if viewMode === 'kanban'}
		<!-- Kanban board -->
		<div class="flex gap-4 overflow-x-auto pb-4" style="min-height: 60vh">
			{#each columns as col}
				{@const cards = grouped[col.status] ?? []}
				<div class="flex w-72 shrink-0 flex-col gap-3">
					<!-- Column header -->
					<div
						class="flex items-center justify-between rounded-lg px-3 py-2"
						style="background: {col.color}12; border: 1px solid {col.color}25"
					>
						<span class="text-sm font-semibold" style="color: {col.color}">{col.label}</span>
						<span
							class="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
							style="background: {col.color}22; color: {col.color}"
						>
							{cards.length}
						</span>
					</div>

					<!-- Cards -->
					<div class="space-y-3">
						{#each cards as app}
							<button
								onclick={() => (selectedApp = selectedApp?.id === app.id ? null : app)}
								class="card card-hover w-full cursor-pointer p-4 text-left"
								style={selectedApp?.id === app.id ? 'border-color: rgba(57,255,20,0.35); box-shadow: 0 0 0 1px rgba(57,255,20,0.15)' : ''}
							>
								<div class="flex items-start justify-between gap-2">
									<div class="min-w-0">
										<p class="truncate text-sm font-semibold" style="color: var(--color-text-primary)">
											{app.company}
										</p>
										<p class="mt-0.5 truncate text-xs" style="color: var(--color-text-secondary)">
											{app.role}
										</p>
									</div>
									{#if app.remote}
										<span class="shrink-0 text-xs" style="color: var(--color-text-muted)" title="Remote">🌐</span>
									{/if}
								</div>

								<div class="mt-3 flex flex-wrap gap-2">
									<span class="text-xs font-medium" style="color: var(--color-neon)">
										{app.salary.split(' – ')[0]}+
									</span>
								</div>

								{#if app.dateApplied}
									<p class="mt-2 text-xs" style="color: var(--color-text-muted)">
										Applied {app.dateApplied}
									</p>
								{:else}
									<p class="mt-2 text-xs" style="color: var(--color-text-muted)">
										Saved {app.dateSaved}
									</p>
								{/if}

								<!-- Expanded notes -->
								{#if selectedApp?.id === app.id && app.notes}
									<p
										class="mt-3 border-t pt-3 text-xs leading-relaxed"
										style="color: var(--color-text-secondary); border-color: var(--color-border)"
									>
										{app.notes}
									</p>
									{#if app.url && app.url !== '#'}
										<a
											href={app.url}
											target="_blank"
											rel="noopener noreferrer"
											onclick={(e) => e.stopPropagation()}
											class="mt-2 inline-flex items-center gap-1 text-xs transition-colors hover:opacity-80"
											style="color: var(--color-neon)"
										>
											View listing ↗
										</a>
									{/if}
								{/if}
							</button>
						{/each}

						{#if cards.length === 0}
							<div
								class="rounded-lg py-8 text-center text-xs"
								style="border: 1px dashed var(--color-border); color: var(--color-text-muted)"
							>
								Empty
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Table view -->
		<div class="card overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr style="border-bottom: 1px solid var(--color-border); background: rgba(255,255,255,0.02)">
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Company</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Role</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Salary</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Status</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Date</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">Remote</th>
						</tr>
					</thead>
					<tbody>
						{#each applications as app, i}
							<tr
								class="transition-colors hover:bg-white/[0.02]"
								style={i < applications.length - 1 ? 'border-bottom: 1px solid var(--color-border)' : ''}
							>
								<td class="px-4 py-3 font-medium" style="color: var(--color-text-primary)">{app.company}</td>
								<td class="px-4 py-3 max-w-[220px]" style="color: var(--color-text-secondary)">
									<span class="block truncate">{app.role}</span>
								</td>
								<td class="px-4 py-3 whitespace-nowrap text-xs font-medium" style="color: var(--color-neon)">
									{app.salary.split(' – ')[0]}+
								</td>
								<td class="px-4 py-3">
									<StatusBadge status={app.status} />
								</td>
								<td class="px-4 py-3 whitespace-nowrap text-xs" style="color: var(--color-text-muted)">
									{app.dateApplied ?? app.dateSaved}
								</td>
								<td class="px-4 py-3 text-center text-sm">
									{app.remote ? '🌐' : '—'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
