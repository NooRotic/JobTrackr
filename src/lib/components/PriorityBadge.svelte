<script lang="ts">
	import type { Priority } from '$lib/data/types';

	let { priority }: { priority: Priority } = $props();

	const config: Record<Priority, { label: string; class: string }> = {
		P1: { label: 'P1 — Strong Fit', class: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30' },
		P2: { label: 'P2 — Almost', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
		P3: { label: 'P3 — Can Do', class: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
		SKIP: { label: 'Skip', class: 'bg-zinc-700/50 text-zinc-500 border-zinc-600/30' }
	};

	let cfg = $derived(config[priority]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide {cfg.class}"
>
	{cfg.label}
</span>
