import type { Dictionary } from './pt';

export const en: Dictionary = {
	meta: {
		title: 'Rafael El Shafie | Software Engineering, Generative AI and Backend',
		description:
			'Portfolio of Rafael El Shafie, a Software Engineering student with experience in backend and generative AI: RAG, Text-to-SQL, Python and FastAPI.',
	},
	a11y: {
		skipToContent: 'Skip to content',
		openMenu: 'Open menu',
		closeMenu: 'Close menu',
		mainNav: 'Main navigation',
		language: 'Language',
		backToTop: 'back to top',
		newTab: '(opens in a new tab)',
	},
	nav: {
		about: 'About',
		experience: 'Experience',
		education: 'Education',
		skills: 'Skills',
		projects: 'Projects',
		contact: 'Contact',
	},
	hero: {
		status: 'Open to internship opportunities',
		headline: 'Software Engineering · Generative AI · Backend',
		intro:
			'Software Engineering student. I build backend systems and generative AI applications, from requirements gathering to production.',
		ctaContact: 'Get in touch',
		ctaCv: 'View CV',
		photoAlt: 'Photo of Rafael El Shafie',
		location: 'Rio de Janeiro, Brazil',
		portraitLabel: 'People before code',
		portraitCaption: 'Curious by nature.\nAlways growing as a developer.',
		portraitTag: 'Always learning',
	},
	about: {
		label: 'About me',
		heading: 'Studying engineering.\nBuilding real experience.',
		paragraphs: [
			"I study Software Engineering at Estácio and I'm specializing in backend and generative AI.",
			'At BTG Pactual, I built from scratch an AI assistant with RAG and Text-to-SQL that went into production and is now used by the team. Before that, I integrated data from different systems and created business rules to support real estate investment decisions.',
			"I'm looking for an internship in backend development or AI.",
		],
		languagesTitle: 'Languages',
		languages: [
			{ name: 'Portuguese', level: 'native' },
			{ name: 'English', level: 'intermediate' },
			{ name: 'Spanish', level: 'basic' },
		],
	},
	experience: {
		label: 'Experience',
		heading: 'Where learning\nturned into delivery.',
		stack: 'Stack',
	},
	education: {
		label: 'Education',
		heading: 'Learn. Build.\nRepeat.',
	},
	skills: {
		label: 'Skills',
		heading: 'Tools for\nsolving problems.',
		learning: 'learning',
		groups: {
			backend: 'Backend',
			ai: 'Applied AI',
			data: 'Data',
			frontend: 'Frontend',
			infra: 'Cloud & DevOps',
			quality: 'Quality',
		},
	},
	projects: {
		label: 'Projects',
		heading: 'Ideas, context\nand code.',
		repo: 'Code',
		demo: 'Demo',
	},
	contact: {
		label: 'Contact',
		heading: "Let's build\nsomething useful.",
		text: 'Want to talk about an opportunity or a project? The fastest way to reach me is by email or LinkedIn.',
		email: 'Email',
		linkedin: 'LinkedIn',
		github: 'GitHub',
		cv: 'CV',
	},
	period: {
		present: 'present',
		inProgress: 'in progress',
	},
	footer: {
		builtWith: 'Built with Astro.',
	},
};
