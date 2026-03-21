<script lang="ts">
	import type { FitRating } from '$lib/data/types';

	let { fit }: { fit: FitRating } = $props();

	const config: Record<FitRating, { label: string; class: string }> = {
		HIGH: { label: 'High Fit', class: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30' },
		MEDIUM: { label: 'Medium Fit', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
		LOW: { label: 'Not a Fit', class: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30' },
		NEEDS_REVIEW: {
			label: 'Needs Review',
			class: 'bg-violet-500/15 text-violet-400 border-violet-500/30'
		}
	};

	let cfg = $derived(config[fit]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.class}"
>
	{cfg.label}
</span>
