<script lang="ts">
	import type { SignalTier } from '$lib/data/types';
	import { SIGNAL_TIER_CONFIG } from '$lib/data/recruiterStates';

	let { tier }: { tier: SignalTier } = $props();

	let cfg = $derived(SIGNAL_TIER_CONFIG[tier]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.badgeClass}"
>
	{cfg.label}
</span>
