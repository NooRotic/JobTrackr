<script lang="ts">
	import type { LinkStatus } from '$lib/data/linkHealth';

	let { status = 'unchecked' as LinkStatus, reason = '' }: { status?: LinkStatus; reason?: string } = $props();

	const config: Record<LinkStatus, { label: string; icon: string; class: string }> = {
		active: {
			label: 'Active',
			icon: '\u2705',
			class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
		},
		expired: {
			label: 'Expired',
			icon: '\u274C',
			class: 'bg-red-500/15 text-red-400 border-red-500/30'
		},
		unknown: {
			label: 'Unknown',
			icon: '\u2753',
			class: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
		},
		error: {
			label: 'Error',
			icon: '\u26A0\uFE0F',
			class: 'bg-orange-500/15 text-orange-400 border-orange-500/30'
		},
		skip: {
			label: 'Skip',
			icon: '\u23ED',
			class: 'bg-gray-500/15 text-gray-400 border-gray-500/30'
		},
		unchecked: {
			label: 'Not checked',
			icon: '\u2014',
			class: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
		}
	};

	let cfg = $derived(config[status] ?? config.unchecked);
</script>

<span
	class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium {cfg.class}"
	title={reason}
>
	<span class="text-[10px]">{cfg.icon}</span>
	{cfg.label}
</span>
