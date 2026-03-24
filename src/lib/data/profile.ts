export interface ProfileData {
	name: string;
	github: string;
	title: string;
	headline: string;
	salaryFloor: string;
	preferredLocation: string;
	targetRoles: string[];
	strengths: string[];
	gaps: string[];
	talkingPoints: string[];
}

export const profile: ProfileData = {
	name: 'Your Name',
	github: 'your-github',
	title: 'Senior Software Engineer',
	headline: 'Your specialization here',
	salaryFloor: '$150,000',
	preferredLocation: 'Remote (US)',
	targetRoles: [
		'Senior Software Engineer',
		'Senior Frontend Engineer',
		'Technical Lead'
	],
	strengths: [
		'TypeScript / React / Next.js',
		'Frontend architecture',
		'Performance optimization'
	],
	gaps: ['Add your honest gaps here'],
	talkingPoints: [
		'Add your best interview stories here'
	]
};
