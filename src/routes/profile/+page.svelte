<script lang="ts">
	const profile = {
		name: 'Your Name',
		github: 'your-github',
		title: 'Senior Software Engineer',
		headline: 'Video streaming · Frontend platform · AI-native workflow',
		salaryFloor: '$165,000',
		preferredLocation: 'Remote (US)',
		targetRoles: [
			'Senior Video Engineer',
			'Senior SWE — Streaming',
			'Senior Frontend Engineer',
			'Chromecast / Smart TV Developer'
		],
		strengths: [
			'HLS / DASH streaming protocols',
			'Chromecast Application Framework (CAF)',
			'Video player engineering (custom + Shaka, Video.js)',
			'Real-time debugging tooling at scale',
			'AI-native development workflow',
			'TypeScript / SvelteKit / React',
			'Performance optimization & Core Web Vitals',
			'Frontend platform & design systems'
		],
		gaps: ['Angular', 'Kotlin / Android', 'Formal ML / model training', 'Go backend'],
		talkingPoints: [
			'Built custom HLS player with adaptive bitrate logic from scratch — reduced buffering 40%',
			'Shipped Chromecast CAF receiver for a major media client — millions of daily sessions',
			"AI-native workflow: Claude Code in every stage of the dev loop. I've 10x'd my own throughput",
			'Debugging tooling at scale — built internal dashboards that cut P1 video incident MTTR by 60%',
			'Open source: created and maintain a SvelteKit component library (2,000+ GitHub stars)'
		]
	};

	const sections = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'strengths', label: 'Strengths' },
		{ id: 'targets', label: 'Target Roles' },
		{ id: 'talking', label: 'Talking Points' }
	];

	let activeSection = $state('overview');
</script>

<svelte:head>
	<title>Profile — JobTrackr</title>
</svelte:head>

<div class="animate-fade-in space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight" style="color: var(--color-text-primary)">
			Career Profile
		</h1>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			Your master profile — strengths, targets, talking points
		</p>
	</div>

	<!-- Identity card -->
	<div class="card p-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
			<!-- Avatar placeholder -->
			<div
				class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold"
				style="background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)"
			>
				{profile.name.charAt(0)}
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold" style="color: var(--color-text-primary)">{profile.name}</h2>
				<p class="mt-0.5 font-medium" style="color: var(--color-neon)">{profile.title}</p>
				<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">{profile.headline}</p>
			</div>
			<div class="flex flex-col gap-2 text-right">
				<div>
					<p class="text-xs" style="color: var(--color-text-muted)">Salary floor</p>
					<p class="font-bold" style="color: var(--color-neon)">{profile.salaryFloor}/yr</p>
				</div>
				<div>
					<p class="text-xs" style="color: var(--color-text-muted)">Location</p>
					<p class="text-sm font-medium" style="color: var(--color-text-secondary)">{profile.preferredLocation}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Section tabs -->
	<div class="flex gap-1 overflow-x-auto">
		{#each sections as s}
			<button
				onclick={() => (activeSection = s.id)}
				class="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all"
				style={activeSection === s.id
					? 'background: rgba(57,255,20,0.12); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)'
					: 'background: rgba(255,255,255,0.04); color: var(--color-text-secondary); border: 1px solid var(--color-border)'}
			>
				{s.label}
			</button>
		{/each}
	</div>

	<!-- Section content -->
	{#if activeSection === 'overview'}
		<div class="card p-6">
			<h3 class="mb-4 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-muted)">
				At a Glance
			</h3>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<p class="text-xs font-medium uppercase tracking-wider mb-3" style="color: var(--color-text-muted)">
						Target Roles
					</p>
					<ul class="space-y-2">
						{#each profile.targetRoles as role}
							<li class="flex items-center gap-2 text-sm" style="color: var(--color-text-secondary)">
								<span class="h-1.5 w-1.5 rounded-full shrink-0" style="background: var(--color-neon)"></span>
								{role}
							</li>
						{/each}
					</ul>
				</div>
				<div>
					<p class="text-xs font-medium uppercase tracking-wider mb-3" style="color: var(--color-text-muted)">
						Known Gaps (Honest)
					</p>
					<ul class="space-y-2">
						{#each profile.gaps as gap}
							<li class="flex items-center gap-2 text-sm" style="color: var(--color-text-secondary)">
								<span class="text-red-400 text-xs shrink-0">△</span>
								{gap}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

	{:else if activeSection === 'strengths'}
		<div class="card p-6">
			<h3 class="mb-4 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-muted)">
				Core Strengths
			</h3>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each profile.strengths as strength}
					<div
						class="flex items-center gap-3 rounded-lg p-3"
						style="background: rgba(57,255,20,0.04); border: 1px solid rgba(57,255,20,0.1)"
					>
						<span class="shrink-0 text-sm" style="color: var(--color-neon)">◆</span>
						<span class="text-sm" style="color: var(--color-text-secondary)">{strength}</span>
					</div>
				{/each}
			</div>
		</div>

	{:else if activeSection === 'targets'}
		<div class="card p-6">
			<h3 class="mb-4 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-muted)">
				Target Roles & Criteria
			</h3>
			<div class="space-y-3">
				{#each profile.targetRoles as role}
					<div
						class="flex items-center gap-4 rounded-xl p-4"
						style="background: rgba(255,255,255,0.03); border: 1px solid var(--color-border)"
					>
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
							style="background: rgba(57,255,20,0.1); color: var(--color-neon)"
						>
							◎
						</div>
						<span class="font-medium" style="color: var(--color-text-primary)">{role}</span>
					</div>
				{/each}
			</div>

			<div class="mt-6 rounded-xl p-4" style="background: rgba(57,255,20,0.04); border: 1px solid rgba(57,255,20,0.12)">
				<p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-neon)">
					Hard Requirements
				</p>
				<ul class="space-y-1.5">
					<li class="text-sm" style="color: var(--color-text-secondary)">≥ {profile.salaryFloor}/yr base</li>
					<li class="text-sm" style="color: var(--color-text-secondary)">Remote preferred · Philadelphia area open</li>
					<li class="text-sm" style="color: var(--color-text-secondary)">Video/streaming stack or adjacent (not pure backend)</li>
				</ul>
			</div>
		</div>

	{:else if activeSection === 'talking'}
		<div class="card p-6">
			<h3 class="mb-4 text-sm font-semibold uppercase tracking-widest" style="color: var(--color-text-muted)">
				Interview Talking Points
			</h3>
			<div class="space-y-4">
				{#each profile.talkingPoints as point, i}
					<div class="flex gap-4">
						<div
							class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
							style="background: rgba(57,255,20,0.12); color: var(--color-neon)"
						>
							{i + 1}
						</div>
						<p class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
							{point}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Customize notice -->
	<div
		class="rounded-xl p-4"
		style="background: rgba(255,255,255,0.02); border: 1px dashed var(--color-border)"
	>
		<p class="text-xs" style="color: var(--color-text-muted)">
			To personalize this profile, edit <code class="rounded px-1" style="background: rgba(255,255,255,0.06); color: var(--color-text-secondary)">/src/routes/profile/+page.svelte</code> — update the profile object at the top of the file.
		</p>
	</div>
</div>
