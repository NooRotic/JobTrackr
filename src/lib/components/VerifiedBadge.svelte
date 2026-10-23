<script lang="ts">
	/**
	 * Shows whether a listing was confirmed against the EMPLOYER'S own source.
	 *
	 * 'unverifiable' is deliberately styled as a warning, not a failure: a bot-blocked
	 * page or a stored URL that was never a real posting tells you nothing about whether
	 * the job is open. Rendering that as "dead" is how live roles get dropped.
	 */
	let {
		status,
		date,
		note
	}: {
		status?: 'live' | 'dead' | 'unverifiable';
		date?: string;
		note?: string;
	} = $props();

	const CONFIG = {
		live: { label: 'Verified live', dot: '#39ff14', fg: '#39ff14', bg: 'rgba(57,255,20,0.12)', bd: 'rgba(57,255,20,0.3)' },
		dead: { label: 'Listing dead', dot: '#ef4444', fg: '#f87171', bg: 'rgba(239,68,68,0.12)', bd: 'rgba(239,68,68,0.3)' },
		unverifiable: { label: "Can't verify", dot: '#f59e0b', fg: '#fbbf24', bg: 'rgba(245,158,11,0.12)', bd: 'rgba(245,158,11,0.3)' }
	} as const;

	const cfg = $derived(status ? CONFIG[status] : null);
	const short = $derived(date ? date.slice(5).replace('-', '/') : '');
</script>

{#if cfg}
	<span
		class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
		style="background: {cfg.bg}; color: {cfg.fg}; border: 1px solid {cfg.bd}"
		title={note ?? ''}
	>
		<span class="h-1.5 w-1.5 rounded-full" style="background: {cfg.dot}"></span>
		{cfg.label}{short ? ` ${short}` : ''}
	</span>
{/if}
