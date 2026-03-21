<script lang="ts">
	let {
		label,
		value,
		icon,
		accent = false,
		trend = null
	}: {
		label: string;
		value: number | string;
		icon: string;
		accent?: boolean;
		trend?: string | null;
	} = $props();
</script>

<div class="card card-hover group relative overflow-hidden p-6">
	<!-- Background glow for accent cards -->
	{#if accent}
		<div
			class="pointer-events-none absolute inset-0 rounded-[12px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			style="background: radial-gradient(circle at 50% 0%, rgba(57,255,20,0.06) 0%, transparent 70%)"
		></div>
	{/if}

	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm font-medium" style="color: var(--color-text-secondary)">{label}</p>
			<p
				class="mt-2 text-4xl font-bold tabular-nums tracking-tight"
				style={accent ? 'color: var(--color-neon)' : 'color: var(--color-text-primary)'}
			>
				{value}
			</p>
			{#if trend}
				<p class="mt-1 text-xs" style="color: var(--color-text-muted)">{trend}</p>
			{/if}
		</div>
		<div
			class="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
			style={accent
				? 'background: rgba(57,255,20,0.1); color: var(--color-neon)'
				: 'background: rgba(255,255,255,0.05); color: var(--color-text-secondary)'}
		>
			{icon}
		</div>
	</div>
</div>
