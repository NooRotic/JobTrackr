<script lang="ts">
	import type { LegitimacyTier, LegitimacySignal } from '$lib/data/legitimacy';
	import { TIER_CONFIG } from '$lib/data/legitimacy';

	let {
		tier,
		score,
		signals = []
	}: { tier: LegitimacyTier; score: number; signals?: LegitimacySignal[] } = $props();

	let showDetails = $state(false);
	let cfg = $derived(TIER_CONFIG[tier]);
</script>

<div class="inline-block">
	<button
		onclick={() => (showDetails = !showDetails)}
		class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors"
		style="color: {cfg.color}; border-color: {cfg.color}40; background: {cfg.color}15"
		title="{cfg.label} ({score}/100)"
	>
		<span class="text-[10px]">{cfg.icon}</span>
		{cfg.label}
	</button>

	{#if showDetails && signals.length > 0}
		<div
			class="mt-2 rounded-lg border p-3"
			style="background: var(--color-bg-card); border-color: var(--color-border)"
		>
			<p class="mb-2 text-xs font-medium tabular-nums" style="color: var(--color-text-muted)">
				Legitimacy: {score}/100
			</p>
			<ul class="space-y-1">
				{#each signals as signal}
					{@const color =
						signal.type === 'positive'
							? '#10b981'
							: signal.type === 'negative'
								? '#ef4444'
								: 'var(--color-text-muted)'}
					{@const icon = signal.type === 'positive' ? '+' : signal.type === 'negative' ? '\u2212' : '\u00B7'}
					<li class="flex items-start gap-1.5 text-xs" style="color: var(--color-text-secondary)">
						<span class="mt-0.5 shrink-0 font-bold" style="color: {color}">{icon}</span>
						{signal.label}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
