<script lang="ts">
	import { scoreColor, scoreLabel } from '$lib/data/scoring';

	let { score }: { score: number | undefined } = $props();
</script>

{#if score != null}
	<span
		class="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums"
		style="color: {scoreColor(score)}; border-color: {scoreColor(score)}40; background: {scoreColor(score)}15"
		title="{scoreLabel(score)} fit ({score}/5)"
	>
		{score.toFixed(1)}
	</span>
{/if}
