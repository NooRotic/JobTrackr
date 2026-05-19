import { browser } from '$app/environment';

export interface LinkHealthResult {
	id: string;
	company: string;
	role: string;
	url: string;
	appStatus: string;
	status: 'active' | 'expired' | 'unknown' | 'error' | 'skip';
	reason: string;
	httpStatus: number | null;
	checkedAt: string;
}

export interface LinkHealthData {
	checkedAt: string;
	summary: {
		active: number;
		expired: number;
		unknown: number;
		error: number;
		skip: number;
	};
	results: LinkHealthResult[];
}

let _data: LinkHealthData | null = null;

// Vite's import.meta.glob resolves to {} at build time when no files match,
// so this works even when src/lib/data/generated/ is gitignored / empty in CI.
const generated = import.meta.glob<{ default: LinkHealthData }>(
	'./generated/link-health.json'
);

export async function loadLinkHealth(): Promise<LinkHealthData | null> {
	if (_data) return _data;
	if (!browser) return null;

	const loader = generated['./generated/link-health.json'];
	if (!loader) return null;

	try {
		const mod = await loader();
		_data = mod.default;
		return _data;
	} catch {
		return null;
	}
}

export type LinkStatus = 'active' | 'expired' | 'unknown' | 'error' | 'skip' | 'unchecked';

export function getLinkStatus(
	appId: string,
	data: LinkHealthData | null
): { status: LinkStatus; reason: string } {
	if (!data) return { status: 'unchecked', reason: '' };
	const result = data.results.find((r) => r.id === appId);
	if (!result) return { status: 'unchecked', reason: '' };
	return { status: result.status, reason: result.reason };
}
