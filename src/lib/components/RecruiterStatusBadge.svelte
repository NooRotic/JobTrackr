<script lang="ts">
	import type { RecruiterStatus } from '$lib/data/types';
	import { RECRUITER_STATUS_MAP } from '$lib/data/recruiterStates';

	let { status }: { status: RecruiterStatus } = $props();

	let cfg = $derived(RECRUITER_STATUS_MAP[status]);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.badgeClass}"
>
	{cfg.label}
</span>
