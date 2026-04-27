<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let { children } = $props();

	let isDemo = $state(false);

	$effect(() => {
		if (!browser) return;
		isDemo = localStorage.getItem('jobtrackr-demo') === 'true';
	});

	function toggleDataMode() {
		if (!browser) return;
		const newMode = !isDemo;
		localStorage.setItem('jobtrackr-demo', newMode ? 'true' : 'false');
		window.location.href = window.location.pathname;
	}

	let sidebarOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: '◈' },
		{ href: '/pipeline', label: 'Pipeline', icon: '⚡' },
		{ href: '/searches', label: 'Searches', icon: '⌕' },
		{ href: '/targets', label: 'Targets', icon: '◎' },
		{ href: '/applications', label: 'Applications', icon: '▣' },
		{ href: '/companies', label: 'Companies', icon: '⬡' },
		{ href: '/research', label: 'Research', icon: '⊞' },
		{ href: '/analyze', label: 'Analyze', icon: '⊘' },
		{ href: '/analytics', label: 'Analytics', icon: '◆' },
		{ href: '/prep', label: 'Prep', icon: '◧' },
		{ href: '/profile', label: 'Profile', icon: '◉' }
	];

	function isActive(href: string, currentPath: string): boolean {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}
</script>

<div class="flex min-h-screen" style="background: var(--color-bg-base)">
	<!-- Mobile overlay -->
	{#if sidebarOpen}
		<div
			class="fixed inset-0 z-20 bg-black/60 lg:hidden"
			onclick={() => (sidebarOpen = false)}
			role="button"
			tabindex="-1"
			onkeydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
		></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 z-30 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
		style="background: var(--color-bg-surface); border-right: 1px solid var(--color-border); transform: {sidebarOpen
			? 'translateX(0)'
			: 'translateX(-100%)'}"
		class:translate-x-0={sidebarOpen}
	>
		<!-- Logo / Brand -->
		<div class="flex items-center gap-3 px-6 py-6" style="border-bottom: 1px solid var(--color-border)">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
				style="background: var(--color-neon); color: #0a0a0f"
			>
				J
			</div>
			<div>
				<h1 class="text-sm font-bold tracking-tight" style="color: var(--color-text-primary)">
					JobTrackr
				</h1>
				<p class="text-xs" style="color: var(--color-text-muted)">Job Search Dashboard</p>
			</div>
		</div>

		<!-- Nav -->
		<nav class="flex-1 space-y-1 p-3">
			{#each navItems as item}
				{@const active = isActive(item.href, $page.url.pathname)}
				<a
					href={item.href}
					onclick={() => (sidebarOpen = false)}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
					style={active
						? 'background: rgba(57,255,20,0.1); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)'
						: 'color: var(--color-text-secondary); border: 1px solid transparent'}
					aria-current={active ? 'page' : undefined}
				>
					<span
						class="text-base leading-none"
						style={active ? 'color: var(--color-neon)' : 'color: var(--color-text-muted)'}
					>
						{item.icon}
					</span>
					{item.label}

					{#if active}
						<span
							class="ml-auto h-1.5 w-1.5 rounded-full"
							style="background: var(--color-neon)"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Footer -->
		<div class="space-y-3 p-4" style="border-top: 1px solid var(--color-border)">
			<!-- Data mode toggle -->
			<button
				onclick={toggleDataMode}
				class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all"
				style={isDemo
					? 'background: rgba(139,92,246,0.1); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25)'
					: 'background: rgba(57,255,20,0.08); color: var(--color-neon); border: 1px solid rgba(57,255,20,0.2)'}
			>
				<span class="h-2 w-2 rounded-full" style={isDemo ? 'background: #a78bfa' : 'background: var(--color-neon)'}></span>
				{isDemo ? 'Demo Data' : 'Live Data'}
				<span class="ml-auto text-[10px] opacity-60">click to swap</span>
			</button>

			<div>
				<p class="text-xs" style="color: var(--color-text-muted)">
					Open source — MIT License
				</p>
				<a
					href="https://github.com/NooRotic/JobTrackr"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-1 inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
					style="color: var(--color-text-muted)"
				>
					GitHub ↗
				</a>
			</div>
		</div>
	</aside>

	<!-- Main content area -->
	<div class="flex min-w-0 flex-1 flex-col lg:ml-0">
		<!-- Mobile top bar -->
		<header
			class="sticky top-0 z-10 flex items-center gap-4 px-4 py-3 lg:hidden"
			style="background: var(--color-bg-surface); border-bottom: 1px solid var(--color-border)"
		>
			<button
				onclick={() => (sidebarOpen = !sidebarOpen)}
				class="rounded-lg p-2 transition-colors"
				style="color: var(--color-text-secondary); background: var(--color-bg-card)"
				aria-label="Toggle sidebar"
			>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
					<rect x="0" y="3" width="18" height="2" rx="1" />
					<rect x="0" y="8" width="18" height="2" rx="1" />
					<rect x="0" y="13" width="18" height="2" rx="1" />
				</svg>
			</button>
			<div class="flex items-center gap-2">
				<div
					class="flex h-6 w-6 items-center justify-center rounded text-xs font-bold"
					style="background: var(--color-neon); color: #0a0a0f"
				>
					J
				</div>
				<span class="text-sm font-bold" style="color: var(--color-text-primary)">JobTrackr</span>
			</div>
		</header>

		<!-- Page content -->
		<main class="flex-1 overflow-auto p-6 lg:p-8">
			{@render children()}
		</main>
	</div>
</div>

<style>
	@media (min-width: 1024px) {
		aside {
			position: sticky;
			transform: translateX(0) !important;
			min-height: 100vh;
		}
	}
</style>
