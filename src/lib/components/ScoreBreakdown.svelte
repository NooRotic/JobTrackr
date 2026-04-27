<script lang="ts">
	import type { ScoreDimensions } from '$lib/data/types';
	import { SCORE_DIMENSIONS, SCORE_LABELS, SCORE_COLORS } from '$lib/data/scoring';

	let { dimensions }: { dimensions: ScoreDimensions } = $props();
</script>

<div class="space-y-1.5">
	{#each SCORE_DIMENSIONS as dim}
		{@const value = dimensions[dim]}
		{@const pct = (value / 5) * 100}
		<div class="flex items-center gap-2">
			<span class="w-20 shrink-0 text-xs" style="color: var(--color-text-muted)">
				{SCORE_LABELS[dim]}
			</span>
			<div
				class="h-1.5 flex-1 overflow-hidden rounded-full"
				style="background: rgba(255,255,255,0.05)"
			>
				<div
					class="h-full rounded-full transition-all"
					style="width: {pct}%; background: {SCORE_COLORS[dim]}"
				></div>
			</div>
			<span
				class="w-6 shrink-0 text-right text-xs font-medium tabular-nums"
				style="color: {SCORE_COLORS[dim]}"
			>
				{value}
			</span>
		</div>
	{/each}
</div>
