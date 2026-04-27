<script lang="ts">
	import { applications as initialApps } from '$lib/data';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import LinkHealthBadge from '$lib/components/LinkHealthBadge.svelte';
	import ScoreBadge from '$lib/components/ScoreBadge.svelte';
	import ScoreBreakdown from '$lib/components/ScoreBreakdown.svelte';
	import LegitimacyBadge from '$lib/components/LegitimacyBadge.svelte';
	import { assessLegitimacy } from '$lib/data/legitimacy';
	import type { Application, ApplicationStatus } from '$lib/data/types';
	import { STATUS_CONFIG, ALL_STATUSES } from '$lib/data/states';
	import { loadLinkHealth, getLinkStatus, type LinkHealthData, type LinkStatus } from '$lib/data/linkHealth';

	let linkHealth = $state<LinkHealthData | null>(null);
	loadLinkHealth().then((d) => (linkHealth = d));

	type ViewMode = 'kanban' | 'table';
	let viewMode = $state<ViewMode>('kanban');
	let showAddForm = $state(false);
	let editingStatus = $state<string | null>(null);

	// Mutable local copy so we can add/edit during session
	let apps = $state<Application[]>([...initialApps]);

	// Add form fields
	let newCompany = $state('');
	let newRole = $state('');
	let newSalary = $state('');
	let newLocation = $state('');
	let newRemote = $state(true);
	let newUrl = $state('');
	let newNotes = $state('');
	let newSource = $state<'indeed' | 'linkedin' | 'company-site' | 'other'>('company-site');

	const columns = STATUS_CONFIG.map(({ status, label, color }) => ({ status, label, color }));

	const grouped = $derived(
		Object.fromEntries(
			columns.map((col) => [
				col.status,
				apps.filter((a) => a.status === col.status)
			])
		) as Record<ApplicationStatus, Application[]>
	);

	let selectedApp = $state<Application | null>(null);

	function addApplication() {
		if (!newCompany || !newRole) return;
		const app: Application = {
			id: `app-${Date.now()}`,
			company: newCompany,
			role: newRole,
			salary: newSalary || 'Not listed',
			location: newRemote ? 'Remote' : newLocation,
			remote: newRemote,
			status: 'saved',
			dateApplied: null,
			dateSaved: new Date().toISOString().split('T')[0],
			url: newUrl || '#',
			notes: `Source: ${newSource}${newNotes ? '. ' + newNotes : ''}`,
		};
		apps = [app, ...apps];
		resetForm();
	}

	function resetForm() {
		newCompany = '';
		newRole = '';
		newSalary = '';
		newLocation = '';
		newRemote = true;
		newUrl = '';
		newNotes = '';
		newSource = 'company-site';
		showAddForm = false;
	}

	function updateStatus(appId: string, newStatus: ApplicationStatus) {
		apps = apps.map((a) => {
			if (a.id !== appId) return a;
			return {
				...a,
				status: newStatus,
				dateApplied: newStatus === 'applied' && !a.dateApplied
					? new Date().toISOString().split('T')[0]
					: a.dateApplied
			};
		});
		editingStatus = null;
	}

	function removeApp(appId: string) {
		apps = apps.filter((a) => a.id !== appId);
		selectedApp = null;
	}
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
				{apps.length} total · {apps.filter((a) => a.status !== 'saved' && a.status !== 'rejected').length} active
			</p>
		</div>

		<div class="flex gap-2">
			<!-- Add job button -->
			<button
				onclick={() => (showAddForm = !showAddForm)}
				class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
				style={showAddForm
					? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.25)'
					: 'background: rgba(57,255,20,0.08); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)'}
			>
				{showAddForm ? '✕ Cancel' : '+ Add Job'}
			</button>

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
	</div>

	<!-- Add Job Form -->
	{#if showAddForm}
		<div class="card space-y-4 p-5">
			<p class="text-sm font-semibold" style="color: var(--color-text-primary)">Add a job (any source)</p>

			<div class="grid gap-3 sm:grid-cols-2">
				<div>
					<label class="mb-1 block text-xs font-medium" style="color: var(--color-text-muted)">Company *</label>
					<input bind:value={newCompany} placeholder="e.g. Netflix" class="w-full rounded-lg px-3 py-2 text-sm"
						style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)" />
				</div>
				<div>
					<label class="mb-1 block text-xs font-medium" style="color: var(--color-text-muted)">Role *</label>
					<input bind:value={newRole} placeholder="e.g. Senior Software Engineer" class="w-full rounded-lg px-3 py-2 text-sm"
						style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)" />
				</div>
				<div>
					<label class="mb-1 block text-xs font-medium" style="color: var(--color-text-muted)">Salary</label>
					<input bind:value={newSalary} placeholder="e.g. $180,000 - $240,000/yr" class="w-full rounded-lg px-3 py-2 text-sm"
						style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)" />
				</div>
				<div>
					<label class="mb-1 block text-xs font-medium" style="color: var(--color-text-muted)">URL</label>
					<input bind:value={newUrl} placeholder="Job posting link" class="w-full rounded-lg px-3 py-2 text-sm"
						style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)" />
				</div>
				<div>
					<label class="mb-1 block text-xs font-medium" style="color: var(--color-text-muted)">Source</label>
					<select bind:value={newSource} class="w-full rounded-lg px-3 py-2 text-sm"
						style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)">
						<option value="indeed">Indeed</option>
						<option value="linkedin">LinkedIn</option>
						<option value="company-site">Company Careers Page</option>
						<option value="other">Other</option>
					</select>
				</div>
				<div>
					<label class="mb-1 block text-xs font-medium" style="color: var(--color-text-muted)">Location</label>
					<div class="flex items-center gap-3">
						<label class="flex items-center gap-1.5 text-xs" style="color: var(--color-text-secondary)">
							<input type="checkbox" bind:checked={newRemote} /> Remote
						</label>
						{#if !newRemote}
							<input bind:value={newLocation} placeholder="City, State" class="flex-1 rounded-lg px-3 py-2 text-sm"
								style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)" />
						{/if}
					</div>
				</div>
			</div>

			<div>
				<label class="mb-1 block text-xs font-medium" style="color: var(--color-text-muted)">Notes</label>
				<textarea bind:value={newNotes} rows="2" placeholder="Why this role? Initial thoughts..." class="w-full rounded-lg px-3 py-2 text-sm"
					style="background: rgba(255,255,255,0.05); color: var(--color-text-primary); border: 1px solid var(--color-border)"></textarea>
			</div>

			<button
				onclick={addApplication}
				disabled={!newCompany || !newRole}
				class="rounded-lg px-5 py-2 text-sm font-medium transition-all"
				style={newCompany && newRole
					? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.25)'
					: 'background: rgba(255,255,255,0.03); color: var(--color-text-muted); border: 1px solid var(--color-border); cursor: not-allowed'}
			>
				Save to Pipeline
			</button>
		</div>
	{/if}

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
							<div
								class="card w-full p-4 text-left"
								style={selectedApp?.id === app.id ? 'border-color: rgba(57,255,20,0.35); box-shadow: 0 0 0 1px rgba(57,255,20,0.15)' : ''}
							>
								<button
									onclick={() => (selectedApp = selectedApp?.id === app.id ? null : app)}
									class="w-full text-left"
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

									<div class="mt-3 flex flex-wrap items-center gap-2">
										<span class="text-xs font-medium" style="color: var(--color-neon)">
											{app.salary !== 'Not listed' ? app.salary.split(' – ')[0] + '+' : 'Salary TBD'}
										</span>
										<ScoreBadge score={app.score} />
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

									{#if linkHealth}
										{@const lh = getLinkStatus(app.id, linkHealth)}
										{#if lh.status !== 'unchecked' && lh.status !== 'active'}
											<div class="mt-2">
												<LinkHealthBadge status={lh.status} reason={lh.reason} />
											</div>
										{/if}
									{/if}
								</button>

								<!-- Expanded details -->
								{#if selectedApp?.id === app.id}
									<div class="mt-3 space-y-3 border-t pt-3" style="border-color: var(--color-border)">
										{#if app.scoreDimensions}
											<div>
												<p class="mb-2 text-xs font-medium" style="color: var(--color-text-muted)">Fit Breakdown</p>
												<ScoreBreakdown dimensions={app.scoreDimensions} />
											</div>
										{/if}

										{#if true}
											{@const legit = assessLegitimacy(
												app,
												linkHealth ? getLinkStatus(app.id, linkHealth).status : undefined
											)}
											<div>
												<p class="mb-2 text-xs font-medium" style="color: var(--color-text-muted)">Legitimacy</p>
												<LegitimacyBadge tier={legit.tier} score={legit.score} signals={legit.signals} />
											</div>
										{/if}

										{#if app.notes}
											<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">
												{app.notes}
											</p>
										{/if}

										<!-- Status changer -->
										<div>
											<p class="mb-1.5 text-xs font-medium" style="color: var(--color-text-muted)">Move to:</p>
											<div class="flex flex-wrap gap-1.5">
												{#each ALL_STATUSES.filter((s) => s !== app.status) as status}
													<button
														onclick={() => updateStatus(app.id, status)}
														class="rounded px-2 py-1 text-xs font-medium transition-all hover:opacity-80"
														style="background: rgba(255,255,255,0.06); color: var(--color-text-secondary); border: 1px solid var(--color-border)"
													>
														{status}
													</button>
												{/each}
											</div>
										</div>

										<div class="flex gap-2">
											{#if app.url && app.url !== '#'}
												<a
													href={app.url}
													target="_blank"
													rel="noopener noreferrer"
													class="text-xs transition-colors hover:opacity-80"
													style="color: var(--color-neon)"
												>
													View listing ↗
												</a>
											{/if}
											<button
												onclick={() => removeApp(app.id)}
												class="text-xs transition-colors hover:opacity-80"
												style="color: #ef4444"
											>
												Remove
											</button>
										</div>
									</div>
								{/if}
							</div>
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
						{#each apps as app, i}
							<tr
								class="cursor-pointer transition-colors hover:bg-white/[0.02]"
								style={i < apps.length - 1 ? 'border-bottom: 1px solid var(--color-border)' : ''}
								onclick={() => (selectedApp = selectedApp?.id === app.id ? null : app)}
							>
								<td class="px-4 py-3 font-medium" style="color: var(--color-text-primary)">{app.company}</td>
								<td class="px-4 py-3 max-w-[220px]" style="color: var(--color-text-secondary)">
									<span class="block truncate">{app.role}</span>
								</td>
								<td class="px-4 py-3 whitespace-nowrap text-xs font-medium" style="color: var(--color-neon)">
									{app.salary !== 'Not listed' ? app.salary.split(' – ')[0] + '+' : 'TBD'}
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
							{#if selectedApp?.id === app.id}
								<tr style="border-bottom: 1px solid var(--color-border)">
									<td colspan="6" class="px-4 py-3" style="background: rgba(255,255,255,0.015)">
										<div class="space-y-3">
											{#if app.notes}
												<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">{app.notes}</p>
											{/if}
											<div class="flex flex-wrap items-center gap-2">
												<span class="text-xs font-medium" style="color: var(--color-text-muted)">Move to:</span>
												{#each ALL_STATUSES.filter((s) => s !== app.status) as status}
													<button
														onclick={(e) => { e.stopPropagation(); updateStatus(app.id, status); }}
														class="rounded px-2 py-1 text-xs font-medium transition-all hover:opacity-80"
														style="background: rgba(255,255,255,0.06); color: var(--color-text-secondary); border: 1px solid var(--color-border)"
													>
														{status}
													</button>
												{/each}
												{#if app.url && app.url !== '#'}
													<a href={app.url} target="_blank" rel="noopener noreferrer"
														onclick={(e) => e.stopPropagation()}
														class="text-xs" style="color: var(--color-neon)">View listing ↗</a>
												{/if}
												<button onclick={(e) => { e.stopPropagation(); removeApp(app.id); }}
													class="text-xs" style="color: #ef4444">Remove</button>
											</div>
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Note about persistence -->
	<div class="rounded-xl p-4" style="background: rgba(255,255,255,0.02); border: 1px dashed var(--color-border)">
		<p class="text-xs" style="color: var(--color-text-muted)">
			Changes made here persist during this browser session. To save permanently, update <code style="color: var(--color-neon)">src/lib/data/personal/applications.ts</code> or ask Claude to add entries.
		</p>
	</div>
</div>
