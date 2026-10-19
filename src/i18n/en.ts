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
		greeting: "Hi, I'm",
		headline: 'Software Engineering · Generative AI · Backend',
		intro:
			'Software Engineering student. I build backend systems and generative AI applications, from requirements gathering to production.',
		ctaContact: 'Get in touch',
		ctaCv: 'Download CV',
		photoAlt: 'Photo of Rafael El Shafie',
	},
	about: {
		title: 'About me',
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
		title: 'Experience',
		stack: 'Stack',
	},
	education: {
		title: 'Education',
	},
	skills: {
		title: 'Skills',
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
		title: 'Projects',
		repo: 'Code',
		demo: 'Demo',
	},
	contact: {
		title: 'Contact',
		text: 'Want to talk about an opportunity or a project? The fastest way to reach me is by email or LinkedIn.',
		email: 'Email',
		linkedin: 'LinkedIn',
		github: 'GitHub',
		cv: 'CV (PDF)',
	},
	period: {
		present: 'present',
	},
	footer: {
		builtWith: 'Built with Astro.',
	},
};
