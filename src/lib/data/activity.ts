import type { ActivityItem } from './types';

// Only real activity goes here.
export const activity: ActivityItem[] = [
	{
		id: 'act-001',
		type: 'search',
		message: '4 Indeed searches completed',
		date: '2026-03-21',
		meta: 'Video Engineer, Streaming SWE, Chromecast, Frontend Philly'
	},
	{
		id: 'act-002',
		type: 'search',
		message: 'Indeed saved jobs imported (11 listings)',
		date: '2026-03-21',
		meta: 'TikTok, Tubi, OpusClip, Burst Inc, and more'
	},
	{
		id: 'act-003',
		type: 'search',
		message: 'YouTube/Google company target search',
		date: '2026-03-21',
		meta: 'Found Sr Staff SWE Video Playback role at YouTube'
	},
	{
		id: 'act-004',
		type: 'search',
		message: 'Twitch company target search',
		date: '2026-03-21',
		meta: '6 roles found under Amazon.com — no video-specific Sr roles yet'
	}
];
