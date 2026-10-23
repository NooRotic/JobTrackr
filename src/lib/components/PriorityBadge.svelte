<script lang="ts">
	import type { Priority } from '$lib/data/types';

	let { priority }: { priority: Priority } = $props();

	// Two parallel ladders: P = the tech career, N = the non-tech ("normie") search.
	// Rung wording is deliberately identical across both, so the LETTER carries which
	// ladder you are on and the WORDS carry how strong the fit is. N is violet so the
	// two ladders are never confused at a glance.
	const config: Record<Priority, { label: string; class: string }> = {
		P1: { label: 'P1 — Strong Fit', class: 'bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30' },
		P2: { label: 'P2 — Almost', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
		P3: { label: 'P3 — Can Do', class: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
		N1: { label: 'N1 — Strong Fit', class: 'bg-violet-500/20 text-violet-200 border-violet-400/40' },
		N2: { label: 'N2 — Almost', class: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
		N3: { label: 'N3 — Can Do', class: 'bg-violet-500/10 text-violet-400 border-violet-500/25' },
		HELD: { label: 'Held — Needs Info', class: 'border-dashed bg-slate-500/10 text-slate-300 border-slate-400/40' },
		SKIP: { label: 'Skip', class: 'bg-zinc-700/50 text-zinc-500 border-zinc-600/30' }
	};

	// Defensive fallback, deliberately kept even though `Record<Priority, …>` looks
	// exhaustive. That annotation is only enforced by svelte-check, which the dev
	// server never runs — so on 2026-09-11 adding N1/N2/N3/HELD to types.ts left this
	// map short, `cfg.class` read off undefined, and the THROW ABORTED THE WHOLE PAGE
	// RENDER. SvelteKit had already pushed the URL, so the Dashboard nav link changed
	// the address bar while the previous view stayed frozen on screen — a crash that
	// presented as a routing bug. An unknown value must degrade, never take down the app.
	let cfg = $derived(
		config[priority] ?? {
			label: String(priority ?? '—'),
			class: 'bg-zinc-700/50 text-zinc-500 border-zinc-600/30'
		}
	);
</script>

<span
	class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide {cfg.class}"
>
	{cfg.label}
</span>
