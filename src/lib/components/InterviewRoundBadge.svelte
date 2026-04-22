<script lang="ts">
	import type { InterviewRound } from '$lib/data/types';

	let { round }: { round: InterviewRound } = $props();

	const config: Record<InterviewRound, { label: string; class: string }> = {
		'recruiter-screen': { label: 'Recruiter', class: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
		'hiring-manager': { label: 'Hiring Mgr', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
		technical: { label: 'Technical', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
		'system-design': { label: 'Sys Design', class: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
		behavioral: { label: 'Behavioral', class: 'bg-teal-500/15 text-teal-400 border-teal-500/30' },
		panel: { label: 'Panel', class: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
		final: { label: 'Final', class: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30' },
		'offer-call': { label: 'Offer', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
	};

	let cfg = $derived(config[round]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.class}"
>
	{cfg.label}
</span>
