<script lang="ts">
	import type { InterviewPlatform } from '$lib/data/types';

	let { platform }: { platform: InterviewPlatform } = $props();

	const config: Record<InterviewPlatform, { label: string; class: string }> = {
		Teams: { label: 'Teams', class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
		Zoom: { label: 'Zoom', class: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
		'Google Meet': { label: 'Meet', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
		Phone: { label: 'Phone', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
		'In-person': { label: 'In-person', class: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
		Other: { label: 'Other', class: 'bg-gray-500/15 text-gray-400 border-gray-500/30' }
	};

	let cfg = $derived(config[platform]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.class}"
>
	{cfg.label}
</span>
