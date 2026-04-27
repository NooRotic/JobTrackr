<script lang="ts">
	import type { ApplicationStatus } from '$lib/data/types';
	import { STATUS_MAP } from '$lib/data/states';

	let { status }: { status: ApplicationStatus } = $props();

	let cfg = $derived({ label: STATUS_MAP[status].label, class: STATUS_MAP[status].badgeClass });
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {cfg.class}"
>
	{cfg.label}
</span>
