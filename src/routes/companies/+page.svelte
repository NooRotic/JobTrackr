<script lang="ts">
	import { companies, applications } from '$lib/data';
	import type { CompanyResearch } from '$lib/data/types';

	let selected = $state<CompanyResearch | null>(null);
	let filterRemote = $state(false);

	const filtered = $derived(filterRemote ? companies.filter((c) => c.remote) : companies);

	function renderStars(rating: number | null): string {
		if (!rating) return '—';
		const full = Math.floor(rating);
		const half = rating % 1 >= 0.5;
		return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
	}

	function getAppStatus(companyName: string) {
		return applications.find((a) => a.company === companyName);
	}
</script>

<svelte:head>
	<title>Companies — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
				Companies
			</h1>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				{companies.length} researched · click a card to expand
			</p>
		</div>

		<label class="flex cursor-pointer items-center gap-2 text-sm" style="color: var(--color-text-secondary)">
			<input
				type="checkbox"
				bind:checked={filterRemote}
				class="h-4 w-4 rounded accent-[#39FF14]"
			/>
			Remote only
		</label>
	</div>

	<!-- Grid -->
	<div class="stagger-children grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each filtered as company}
			{@const appStatus = getAppStatus(company.name)}
			{@const isSelected = selected?.id === company.id}

			<button
				onclick={() => (selected = isSelected ? null : company)}
				class="card card-hover cursor-pointer p-5 text-left transition-all"
				style={isSelected ? 'border-color: rgba(57,255,20,0.35); box-shadow: 0 0 0 1px rgba(57,255,20,0.1), 0 8px 32px rgba(0,0,0,0.4)' : ''}
			>
				<!-- Top row -->
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<h3 class="truncate font-bold" style="color: var(--color-text-primary)">{company.name}</h3>
						<p class="mt-0.5 text-xs" style="color: var(--color-text-secondary)">{company.industry}</p>
					</div>
					<div class="shrink-0 text-right">
						{#if company.rating}
							<p class="text-xs font-medium" style="color: var(--color-neon)">{company.rating} ★</p>
						{/if}
						{#if company.remote}
							<span class="mt-0.5 inline-block text-xs" style="color: var(--color-text-muted)">Remote</span>
						{:else}
							<span class="mt-0.5 inline-block text-xs" style="color: var(--color-text-muted)">{company.location.split(',')[0]}</span>
						{/if}
					</div>
				</div>

				<!-- Salary -->
				<p class="mt-3 text-sm font-medium" style="color: var(--color-neon)">{company.salaryRange}</p>

				<!-- Culture snippet -->
				<p class="mt-2 text-xs leading-relaxed" style="color: var(--color-text-secondary)">
					{company.culture}
				</p>

				<!-- App status badge -->
				{#if appStatus}
					<div class="mt-3 flex items-center gap-1.5">
						<span
							class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
							style="background: rgba(57,255,20,0.1); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)"
						>
							In pipeline: {appStatus.status}
						</span>
					</div>
				{/if}

				<!-- Tags -->
				<div class="mt-3 flex flex-wrap gap-1.5">
					<span
						class="rounded px-1.5 py-0.5 text-xs"
						style="background: rgba(255,255,255,0.05); color: var(--color-text-muted)"
					>
						{company.size} employees
					</span>
					{#if company.remote}
						<span
							class="rounded px-1.5 py-0.5 text-xs"
							style="background: rgba(57,255,20,0.08); color: var(--color-neon)"
						>
							Remote
						</span>
					{/if}
				</div>

				<!-- Expanded detail -->
				{#if isSelected}
					<div
						class="mt-4 space-y-4 border-t pt-4 text-left"
						style="border-color: var(--color-border)"
					>
						<!-- Pros -->
						<div>
							<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
								Pros
							</p>
							<ul class="space-y-1">
								{#each company.pros as pro}
									<li class="flex items-start gap-2 text-xs" style="color: var(--color-text-secondary)">
										<span class="mt-1 shrink-0" style="color: var(--color-neon)">+</span>
										{pro}
									</li>
								{/each}
							</ul>
						</div>

						<!-- Cons -->
						<div>
							<p class="mb-2 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
								Cons
							</p>
							<ul class="space-y-1">
								{#each company.cons as con}
									<li class="flex items-start gap-2 text-xs" style="color: var(--color-text-secondary)">
										<span class="mt-1 shrink-0 text-red-400">−</span>
										{con}
									</li>
								{/each}
							</ul>
						</div>

						<!-- Notes -->
						{#if company.notes}
							<div>
								<p class="mb-1.5 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">
									Notes
								</p>
								<p class="text-xs leading-relaxed" style="color: var(--color-text-secondary)">
									{company.notes}
								</p>
							</div>
						{/if}

						<p class="text-xs" style="color: var(--color-text-muted)">
							Researched: {company.dateResearched}
						</p>
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>
