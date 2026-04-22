<script lang="ts">
	let {
		label,
		value,
		icon,
		accent = false,
		trend = null,
		href = null
	}: {
		label: string;
		value: number | string;
		icon: string;
		accent?: boolean;
		trend?: string | null;
		href?: string | null;
	} = $props();
</script>

{#snippet cardContent()}
	{#if accent}
		<div
			class="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			style="background: radial-gradient(circle at 50% 0%, rgba(57,255,20,0.06) 0%, transparent 70%)"
		></div>
	{/if}

	<div class="flex items-start justify-between">
		<div>
			<p class="text-xs font-medium" style="color: var(--color-text-secondary)">{label}</p>
			<p
				class="mt-1 text-3xl font-bold tabular-nums tracking-tight"
				style={accent ? 'color: var(--color-neon)' : 'color: var(--color-text-primary)'}
			>
				{value}
			</p>
			{#if trend}
				<p class="mt-1 text-[10px]" style="color: var(--color-text-muted)">{trend}</p>
			{/if}
		</div>
		<div
			class="flex h-8 w-8 items-center justify-center rounded-lg text-base"
			style={accent
				? 'background: rgba(57,255,20,0.1); color: var(--color-neon)'
				: 'background: rgba(255,255,255,0.05); color: var(--color-text-secondary)'}
		>
			{icon}
		</div>
	</div>

	{#if href}
		<span class="mt-2 block text-[10px] opacity-0 transition-opacity group-hover:opacity-100" style="color: var(--color-neon)">
			View →
		</span>
	{/if}
{/snippet}

{#if href}
	<a {href} class="card card-hover group relative block overflow-hidden p-5 transition-all">
		{@render cardContent()}
	</a>
{:else}
	<div class="card group relative overflow-hidden p-5">
		{@render cardContent()}
	</div>
{/if}
