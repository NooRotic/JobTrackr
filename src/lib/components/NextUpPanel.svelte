<script lang="ts">
	import type { NextUpItem, NextUpPriority } from '$lib/data/types';

	let { items, today }: { items: NextUpItem[]; today: string } = $props();

	const BAND: Record<NextUpPriority, { label: string; note: string; fg: string; bg: string; bd: string }> = {
		P0: { label: 'P0', note: 'Deadline / compliance', fg: '#f87171', bg: 'rgba(239,68,68,0.10)', bd: 'rgba(239,68,68,0.35)' },
		P1: { label: 'P1', note: 'Live and going cold',   fg: '#fb923c', bg: 'rgba(249,115,22,0.10)', bd: 'rgba(249,115,22,0.30)' },
		P2: { label: 'P2', note: 'Ready to ship',          fg: '#fbbf24', bg: 'rgba(245,158,11,0.10)', bd: 'rgba(245,158,11,0.28)' },
		P3: { label: 'P3', note: 'Relationship upkeep',    fg: '#4ade80', bg: 'rgba(34,197,94,0.08)',  bd: 'rgba(34,197,94,0.25)' },
		P4: { label: 'P4', note: 'Nothing on fire',        fg: '#94a3b8', bg: 'rgba(148,163,184,0.08)', bd: 'rgba(148,163,184,0.22)' }
	};

	const KIND_ICON: Record<string, string> = {
		deadline: '⚖️',
		email: '✉️',
		submit: '🚀',
		call: '📞',
		admin: '🧹'
	};

	const ORDER: NextUpPriority[] = ['P0', 'P1', 'P2', 'P3', 'P4'];

	// `today` is passed in rather than read from Date() so the panel stays deterministic
	// and testable, and so a stale build can't silently render a wrong countdown.
	function daysBetween(from: string, to: string): number {
		const a = Date.parse(from + 'T00:00:00Z');
		const b = Date.parse(to + 'T00:00:00Z');
		if (Number.isNaN(a) || Number.isNaN(b)) return 0;
		return Math.round((b - a) / 86400000);
	}

	const open = $derived(items.filter((i) => !i.done));
	const doneCount = $derived(items.filter((i) => i.done).length);
	const grouped = $derived(
		ORDER.map((p) => ({ band: p, items: open.filter((i) => i.priority === p) })).filter(
			(g) => g.items.length > 0
		)
	);
	// Only P0/P1 count as "on the clock" — P2 and below have no decay attached.
	const urgent = $derived(open.filter((i) => i.priority === 'P0' || i.priority === 'P1').length);
</script>

<div class="card overflow-hidden" style="border-color: rgba(239,68,68,0.25)">
	<div
		class="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3"
		style="border-bottom: 1px solid var(--color-border)"
	>
		<div>
			<h2 class="text-sm font-bold uppercase tracking-widest" style="color: var(--color-text-primary)">
				Next Up
			</h2>
			<p class="mt-0.5 text-xs" style="color: var(--color-text-muted)">
				Start at the top and work down
			</p>
		</div>
		<div class="text-right">
			<p class="text-xs font-medium" style="color: {urgent > 0 ? '#f87171' : '#4ade80'}">
				{urgent} on the clock
			</p>
			<p class="text-[10px]" style="color: var(--color-text-muted)">
				{open.length} open{doneCount > 0 ? ` · ${doneCount} cleared` : ''}
			</p>
		</div>
	</div>

	<div class="divide-y" style="border-color: var(--color-border)">
		{#each grouped as group}
			{@const cfg = BAND[group.band]}
			<div>
				<div
					class="flex items-center gap-2 px-4 py-1.5"
					style="background: {cfg.bg}; border-top: 1px solid {cfg.bd}"
				>
					<span class="text-[10px] font-bold tracking-widest" style="color: {cfg.fg}">
						{cfg.label}
					</span>
					<span class="text-[10px]" style="color: var(--color-text-muted)">{cfg.note}</span>
				</div>

				{#each group.items as item}
					{@const daysLeft = item.due ? daysBetween(today, item.due) : null}
					{@const daysCold = item.waitingSince ? daysBetween(item.waitingSince, today) : null}
					<div class="px-4 py-3" style="border-top: 1px solid var(--color-border)">
						<div class="flex flex-wrap items-start gap-2">
							<span class="text-sm leading-5">{KIND_ICON[item.kind] ?? '•'}</span>
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-2">
									<span class="text-sm font-semibold" style="color: var(--color-text-primary)">
										{item.title}
									</span>

									{#if daysLeft !== null}
										<span
											class="rounded-full px-2 py-0.5 text-[10px] font-bold"
											style="background: {daysLeft <= 7
												? 'rgba(239,68,68,0.18)'
												: 'rgba(148,163,184,0.15)'}; color: {daysLeft <= 7 ? '#f87171' : '#94a3b8'}"
										>
											{daysLeft < 0
												? `${Math.abs(daysLeft)}d OVERDUE`
												: daysLeft === 0
													? 'DUE TODAY'
													: `${daysLeft}d left`}
										</span>
									{/if}

									{#if daysCold !== null && daysCold > 0}
										<span
											class="rounded-full px-2 py-0.5 text-[10px] font-medium"
											style="background: rgba(148,163,184,0.12); color: #94a3b8"
										>
											waiting {daysCold}d
										</span>
									{/if}
								</div>

								{#if item.detail}
									<p class="mt-1 text-xs" style="color: var(--color-text-secondary)">{item.detail}</p>
								{/if}
								{#if item.why}
									<p class="mt-1 text-xs leading-relaxed" style="color: var(--color-text-muted)">
										{item.why}
									</p>
								{/if}
								{#if item.source}
									<p class="mt-1 text-[10px]" style="color: var(--color-text-muted)">
										📁 {item.source}
									</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/each}

		{#if open.length === 0}
			<div class="px-4 py-8 text-center">
				<p class="text-sm" style="color: #4ade80">Nothing outstanding.</p>
			</div>
		{/if}
	</div>
</div>
