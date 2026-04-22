<script lang="ts">
	import { prepData } from '$lib/data';
	import type { StoryCategory } from '$lib/data/types';
	import { marked } from 'marked';
	import InterviewPlatformBadge from '$lib/components/InterviewPlatformBadge.svelte';
	import InterviewRoundBadge from '$lib/components/InterviewRoundBadge.svelte';

	let activeTab = $state<'upcoming' | 'study' | 'stories' | 'post-interview'>('upcoming');

	// Upcoming interviews
	const upcoming = $derived(
		prepData.interviews
			.filter((i) => i.status === 'scheduled' || i.status === 'rescheduled')
			.sort(
				(a, b) =>
					new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
			)
	);

	// Completed interviews
	const completed = $derived(
		prepData.interviews
			.filter((i) => i.status === 'completed' || i.status === 'cancelled')
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	);

	// Study sections
	let activeStudySection = $state(prepData.studySections[0]?.id ?? '');
	const activeSection = $derived(prepData.studySections.find((s) => s.id === activeStudySection));
	const renderedMarkdown = $derived(
		activeSection ? (marked.parse(activeSection.content) as string) : ''
	);

	// Stories
	let storyCategoryFilter = $state<StoryCategory | 'all'>('all');
	let expandedStoryId = $state<string | null>(null);
	const filteredStories = $derived(
		storyCategoryFilter === 'all'
			? prepData.stories
			: prepData.stories.filter((s) => s.category === storyCategoryFilter)
	);

	const storyCategories: { value: StoryCategory | 'all'; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'ad-tech', label: 'Ad Tech' },
		{ value: 'debugging', label: 'Debugging' },
		{ value: 'leadership', label: 'Leadership' },
		{ value: 'architecture', label: 'Architecture' },
		{ value: 'streaming', label: 'Streaming' },
		{ value: 'chromecast', label: 'Chromecast' },
		{ value: 'impact', label: 'Impact' },
		{ value: 'collaboration', label: 'Collaboration' }
	];

	// Helpers
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T12:00:00');
		return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
	}

	function formatTime(timeStr: string, tz: string): string {
		const [h, m] = timeStr.split(':').map(Number);
		const ampm = h >= 12 ? 'PM' : 'AM';
		const h12 = h % 12 || 12;
		return `${h12}:${m.toString().padStart(2, '0')} ${ampm} ${tz}`;
	}

	function daysUntil(dateStr: string): number {
		const target = new Date(dateStr + 'T12:00:00');
		const now = new Date();
		now.setHours(12, 0, 0, 0);
		return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
	}

	function countdownColor(d: number): string {
		if (d <= 0) return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/40';
		if (d <= 2) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
		if (d <= 7) return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
		return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
	}

	function ratingDots(rating: number): string {
		return Array.from({ length: 5 }, (_, i) => (i < rating ? '●' : '○')).join('');
	}

	function ratingColor(rating: number): string {
		if (rating <= 2) return 'color: #ef4444';
		if (rating <= 3) return 'color: #f59e0b';
		return 'color: #39FF14';
	}

	function categoryColor(cat: StoryCategory): string {
		const map: Record<StoryCategory, string> = {
			'ad-tech': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
			debugging: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
			leadership: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
			architecture: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
			impact: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
			collaboration: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
			streaming: 'bg-red-500/15 text-red-400 border-red-500/30',
			chromecast: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
		};
		return map[cat];
	}

	// Reset expanded story when switching tabs
	$effect(() => {
		if (activeTab) expandedStoryId = null;
	});
</script>

<svelte:head>
	<title>Interview Prep — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Interview Prep
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			{upcoming.length} scheduled · {prepData.stories.length} stories · {prepData.studySections.length}
			study sections
		</p>
	</div>

	<!-- Tab bar -->
	<div class="flex gap-1 overflow-x-auto">
		{#each [
			{ id: 'upcoming', label: 'Upcoming' },
			{ id: 'study', label: 'Study' },
			{ id: 'stories', label: 'Stories' },
			{ id: 'post-interview', label: 'Post' }
		] as tab}
			<button
				class="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
				style={activeTab === tab.id
					? 'background: rgba(57,255,20,0.12); color: #39FF14; border: 1px solid rgba(57,255,20,0.3);'
					: 'background: transparent; color: var(--color-text-muted); border: 1px solid transparent;'}
				onclick={() => (activeTab = tab.id as typeof activeTab)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Tab: Upcoming -->
	{#if activeTab === 'upcoming'}
		{#if upcoming.length === 0}
			<div class="card p-8 text-center">
				<p class="text-lg" style="color: var(--color-text-muted)">No upcoming interviews</p>
				<p class="mt-1 text-sm" style="color: var(--color-text-muted)">Keep applying — they'll come</p>
			</div>
		{:else}
			<div class="stagger-children space-y-4">
				{#each upcoming as interview}
					{@const d = daysUntil(interview.date)}
					<div class="card p-5" style="border-color: rgba(57,255,20,0.12)">
						<!-- Top row -->
						<div class="flex flex-wrap items-start justify-between gap-2">
							<div>
								<h3 class="text-base font-bold" style="color: var(--color-text-primary)">
									{interview.company}
								</h3>
								<p class="text-sm" style="color: var(--color-text-secondary)">{interview.role}</p>
							</div>
							<span
								class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold {countdownColor(d)}"
							>
								{#if d === 0}
									TODAY
								{:else if d === 1}
									Tomorrow
								{:else if d < 0}
									{Math.abs(d)}d ago
								{:else}
									In {d} days
								{/if}
							</span>
						</div>

						<!-- Date / time / platform -->
						<div class="mt-3 flex flex-wrap items-center gap-3 text-sm" style="color: var(--color-text-secondary)">
							<span>{formatDate(interview.date)}</span>
							<span>{formatTime(interview.time, interview.timezone)}</span>
							<InterviewPlatformBadge platform={interview.platform} />
							<InterviewRoundBadge round={interview.round} />
						</div>

						<!-- Interviewers -->
						{#if interview.interviewers.length > 0}
							<div class="mt-3">
								<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">
									Interviewers
								</p>
								<div class="mt-1 flex flex-col gap-0.5">
									{#each interview.interviewers as person}
										<span class="text-sm" style="color: var(--color-text-secondary)">{person}</span>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Prep notes -->
						{#if interview.prepNotes}
							<div class="mt-3 rounded-lg p-3" style="background: rgba(255,255,255,0.03); border: 1px solid var(--color-border)">
								<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-neon)">
									Prep Notes
								</p>
								<p class="mt-1 text-sm leading-relaxed" style="color: var(--color-text-secondary); white-space: pre-wrap;">
									{interview.prepNotes}
								</p>
							</div>
						{/if}

						<!-- Meeting link -->
						{#if interview.meetingUrl}
							<a
								href={interview.meetingUrl}
								target="_blank"
								rel="noopener"
								class="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
								style="background: rgba(57,255,20,0.1); color: #39FF14; border: 1px solid rgba(57,255,20,0.25);"
							>
								Join Meeting
							</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	<!-- Tab: Study Guide -->
	{#if activeTab === 'study'}
		<div class="flex flex-col gap-4 lg:flex-row">
			<!-- Section nav -->
			<div class="flex gap-2 overflow-x-auto lg:w-48 lg:shrink-0 lg:flex-col">
				{#each prepData.studySections as section}
					<button
						class="shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
						style={activeStudySection === section.id
							? 'background: rgba(57,255,20,0.12); color: #39FF14; border: 1px solid rgba(57,255,20,0.3);'
							: 'background: var(--color-bg-card); color: var(--color-text-muted); border: 1px solid var(--color-border);'}
						onclick={() => (activeStudySection = section.id)}
					>
						{section.title}
					</button>
				{/each}
			</div>

			<!-- Markdown content -->
			<div class="card min-w-0 flex-1 p-6">
				{#if activeSection}
					<div class="prose-dark">
						{@html renderedMarkdown}
					</div>
				{:else}
					<p style="color: var(--color-text-muted)">Select a study section</p>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Tab: Stories -->
	{#if activeTab === 'stories'}
		<!-- Category filter pills -->
		<div class="flex flex-wrap gap-2">
			{#each storyCategories as cat}
				<button
					class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
					style={storyCategoryFilter === cat.value
						? 'background: rgba(57,255,20,0.12); color: #39FF14; border: 1px solid rgba(57,255,20,0.3);'
						: 'background: var(--color-bg-card); color: var(--color-text-muted); border: 1px solid var(--color-border);'}
					onclick={() => (storyCategoryFilter = cat.value)}
				>
					{cat.label}
				</button>
			{/each}
		</div>

		<!-- Story accordion -->
		<div class="stagger-children space-y-3">
			{#each filteredStories as story}
				<div class="card overflow-hidden">
					<button
						class="flex w-full items-start justify-between gap-3 p-4 text-left"
						onclick={() => (expandedStoryId = expandedStoryId === story.id ? null : story.id)}
					>
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium {categoryColor(story.category)}"
							>
								{story.category}
							</span>
							<span class="text-sm font-medium" style="color: var(--color-text-primary)">
								{story.title}
							</span>
						</div>
						<span
							class="shrink-0 text-sm transition-transform"
							style="color: var(--color-text-muted); transform: rotate({expandedStoryId === story.id ? 180 : 0}deg)"
						>
							▼
						</span>
					</button>

					{#if expandedStoryId === story.id}
						<div class="px-4 pb-4" style="border-top: 1px solid var(--color-border)">
							<div class="prose-dark mt-3">
								{@html marked.parse(story.content)}
							</div>

							{#if story.addresses.length > 0}
								<div class="mt-3">
									<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">
										Addresses
									</p>
									<div class="mt-1 flex flex-wrap gap-1.5">
										{#each story.addresses as q}
											<span
												class="rounded-full border px-2 py-0.5 text-xs"
												style="color: var(--color-text-secondary); border-color: var(--color-border)"
											>
												{q}
											</span>
										{/each}
									</div>
								</div>
							{/if}

							{#if story.landedWellAt.length > 0}
								<div class="mt-2">
									<p class="text-xs font-medium uppercase tracking-wider" style="color: var(--color-text-muted)">
										Landed well at
									</p>
									<div class="mt-1 flex flex-wrap gap-1.5">
										{#each story.landedWellAt as co}
											<span
												class="rounded-full border px-2 py-0.5 text-xs"
												style="color: #39FF14; border-color: rgba(57,255,20,0.3); background: rgba(57,255,20,0.08)"
											>
												{co}
											</span>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Tab: Post-Interview -->
	{#if activeTab === 'post-interview'}
		{#if completed.length === 0}
			<div class="card p-8 text-center">
				<p class="text-lg" style="color: var(--color-text-muted)">No completed interviews yet</p>
			</div>
		{:else}
			<div class="stagger-children space-y-4">
				{#each completed as interview}
					<div
						class="card p-5"
						style="border-color: {interview.status === 'cancelled' ? 'rgba(239,68,68,0.2)' : 'rgba(57,255,20,0.08)'}"
					>
						<div class="flex flex-wrap items-start justify-between gap-2">
							<div>
								<h3 class="text-base font-bold" style="color: var(--color-text-primary)">
									{interview.company}
								</h3>
								<p class="text-sm" style="color: var(--color-text-secondary)">{interview.role}</p>
							</div>
							<div class="flex items-center gap-2">
								<InterviewRoundBadge round={interview.round} />
								{#if interview.selfRating}
									<span
										class="text-sm font-mono tracking-widest"
										style={ratingColor(interview.selfRating)}
									>
										{ratingDots(interview.selfRating)}
									</span>
								{/if}
							</div>
						</div>

						<p class="mt-1 text-xs" style="color: var(--color-text-muted)">
							{formatDate(interview.date)} · {formatTime(interview.time, interview.timezone)}
							{#if interview.followUpSent}
								<span class="ml-2 rounded-full border px-2 py-0.5 text-xs"
									style="color: #39FF14; border-color: rgba(57,255,20,0.3); background: rgba(57,255,20,0.08)"
								>Follow-up sent</span>
							{/if}
						</p>

						{#if interview.postNotes}
							<div class="mt-3 rounded-lg p-3" style="background: rgba(255,255,255,0.03); border: 1px solid var(--color-border)">
								<p class="text-sm leading-relaxed" style="color: var(--color-text-secondary); white-space: pre-wrap;">
									{interview.postNotes}
								</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
