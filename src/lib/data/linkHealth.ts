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

export async function loadLinkHealth(): Promise<LinkHealthData | null> {
	if (_data) return _data;
	if (!browser) return null;

	try {
		const mod = await import('./generated/link-health.json');
		_data = mod.default as LinkHealthData;
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
