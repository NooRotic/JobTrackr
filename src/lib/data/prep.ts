import type { PrepData } from './types';

/**
 * Demo prep data for public/demo mode.
 * Realistic but anonymized interview prep content.
 */
export const prepData: PrepData = {
	interviews: [
		{
			id: 'int-demo-001',
			company: 'Acme Streaming Co',
			role: 'Senior Video Engineer',
			date: '2026-04-15',
			time: '14:00',
			timezone: 'ET',
			platform: 'Zoom',
			round: 'technical',
			interviewers: ['Jane Smith, Engineering Manager', 'Bob Chen, Staff Engineer'],
			status: 'scheduled',
			prepNotes: 'Review HLS/DASH protocols, prepare video player architecture walkthrough. They use Video.js with custom plugins.'
		},
		{
			id: 'int-demo-002',
			company: 'StreamFlix',
			role: 'Staff Frontend Engineer',
			date: '2026-04-10',
			time: '11:00',
			timezone: 'ET',
			platform: 'Google Meet',
			round: 'hiring-manager',
			interviewers: ['Sarah Park, VP Engineering'],
			status: 'completed',
			prepNotes: 'Discussed team structure, growth plans, and technical direction.',
			postNotes: 'Went well. VP was impressed by debugging tooling background. Moving to technical round.',
			selfRating: 4,
			followUpSent: true
		}
	],
	stories: [
		{
			id: 'story-demo-001',
			title: 'Built Org-Wide Debugging Tooling',
			category: 'leadership',
			content: '**Situation:** Engineers across the org struggled to diagnose playback failures.\n\n**Task:** No one asked me to build tooling, but I saw the gap.\n\n**Action:** Built real-time diagnostic panels showing player state, API responses, and performance metrics.\n\n**Result:** Became the standard tool used daily by engineering, QA, and support teams.',
			landedWellAt: ['Acme Streaming Co'],
			addresses: ['Tell me about a time you took initiative', 'Leadership without authority']
		},
		{
			id: 'story-demo-002',
			title: 'Ad Event Beacon Watcher Class',
			category: 'ad-tech',
			content: '**Situation:** Video ads were firing incorrect event beacons, breaking ad completion tracking.\n\n**Task:** Fix ad event sequencing without waiting for the ad vendor to update their SDK.\n\n**Action:** Built a monitoring class that detected delays and used scrub techniques to resume playback.\n\n**Result:** Ran in production for 7-9 months serving millions of impressions until the vendor fixed their side.',
			landedWellAt: [],
			addresses: ['Creative problem solving', 'Working with vendor constraints']
		}
	],
	studySections: [
		{
			id: 'study-demo-react',
			title: 'React Lifecycle',
			content: '## React Render Cycle\n\n1. **Render Phase** - Component function called, JSX evaluated\n2. **Commit Phase** - DOM updated, useLayoutEffect runs\n3. **Paint** - Browser renders pixels\n4. **Effects** - useEffect runs after paint',
			tags: ['react', 'fundamentals']
		},
		{
			id: 'study-demo-streaming',
			title: 'Streaming Protocols',
			content: '## HLS vs DASH\n\n- **HLS**: Apple, .m3u8 manifests, MPEG-TS or fMP4\n- **DASH**: ISO standard, .mpd manifests, fMP4\n- **CMAF**: Unified container for both',
			tags: ['streaming', 'protocols']
		}
	]
};
