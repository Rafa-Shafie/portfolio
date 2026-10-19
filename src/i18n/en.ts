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
	trajectory: {
		label: 'Experience and education that shaped my journey',
		captions: {
			btg: 'Technology & AI',
			fluxo: 'UFRJ Junior Enterprise',
			estacio: 'Software Engineering',
			puc: 'AI & Cloud Data',
		},
	},
	about: {
		label: 'About me',
		heading: 'Studying engineering.\nBuilding real experience.',
		bioTitle: 'Who I am',
		paragraphs: [
			"I study Software Engineering at Estácio and I'm specializing in backend and generative AI.",
			'At BTG Pactual, I built from scratch an AI assistant with RAG and Text-to-SQL that went into production and is now used by the team. Before that, I integrated data from different systems and created business rules to support real estate investment decisions.',
			"I'm looking for an internship in backend development or AI.",
		],
		contributionsTitle: 'What I bring to a team',
		contributions: [
			{ title: 'Build with context', text: 'Understand the business need before turning requirements into code.' },
			{ title: 'Connect technology and people', text: 'Organize information, document decisions and collaborate with the people using the solution.' },
			{ title: 'Learn and put it into practice', text: 'Explore tools, test ideas and improve through feedback.' },
		],
	},
	experience: {
		label: 'Experience',
		heading: 'Where learning\nturned into delivery.',
		intro: "Two internships at BTG Pactual and a foundation built at UFRJ's junior enterprise.",
		stack: 'Stack',
	},
	education: {
		label: 'Education',
		heading: 'Learn. Build.\nRepeat.',
		intro: 'What I am focusing on at the moment.',
		nowTag: 'Growing',
		now: [
			{ title: 'Backend with Java', text: 'Java, object-oriented programming and Spring Boot in the DIO · Itaú bootcamp.' },
			{ title: 'AI engineering', text: 'LLM applications, context retrieval and response evaluation.' },
			{ title: 'English', text: 'Ongoing study at Kumon, currently at level M.' },
		],
		listTitle: 'Education and courses',
	},
	skills: {
		label: 'Skills',
		heading: 'Tools for\nsolving problems.',
		intro: 'Knowledge built through work, courses and practice. My main focus is backend and AI.',
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
		linkedinHint: "Let's connect",
		githubHint: 'My repositories',
		copyEmail: 'Copy email',
		copied: 'Email copied.',
		copyFailed: "Couldn't copy. Please use the address above.",
	},
	period: {
		present: 'present',
		inProgress: 'in progress',
	},
	footer: {
		builtWith: 'Built with Astro.',
	},
};
