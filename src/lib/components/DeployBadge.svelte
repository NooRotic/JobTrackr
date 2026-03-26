<script lang="ts">
	import type { DeployStatus } from '$lib/data/types';

	let { status }: { status: DeployStatus | undefined } = $props();

	const config: Record<string, { label: string; class: string }> = {
		'deploy-ready': { label: 'Ready to Submit', class: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30' },
		research: { label: 'Research', class: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
		none: { label: '', class: '' }
	};

	let cfg = $derived(config[status ?? 'none']);
</script>

{#if status && status !== 'none'}
	<span
		class="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide {cfg.class}"
	>
		{cfg.label}
	</span>
{/if}
