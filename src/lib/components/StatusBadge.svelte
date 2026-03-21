<script lang="ts">
	import type { ApplicationStatus } from '$lib/data/types';

	let { status }: { status: ApplicationStatus } = $props();

	const config: Record<ApplicationStatus, { label: string; class: string }> = {
		saved: { label: 'Saved', class: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
		applied: { label: 'Applied', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
		screening: {
			label: 'Screening',
			class: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
		},
		interview: {
			label: 'Interview',
			class: 'bg-violet-500/15 text-violet-400 border-violet-500/30'
		},
		offer: { label: 'Offer', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
		accepted: {
			label: 'Accepted',
			class: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30'
		},
		rejected: { label: 'Rejected', class: 'bg-red-500/15 text-red-400 border-red-500/30' }
	};

	let cfg = $derived(config[status]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.class}"
>
	{cfg.label}
</span>
