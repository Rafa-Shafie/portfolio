import type { Dictionary } from './pt';

export const es: Dictionary = {
	meta: {
		title: 'Rafael El Shafie | Ingeniería de Software, IA Generativa y Backend',
		description:
			'Portafolio de Rafael El Shafie, estudiante de Ingeniería de Software con experiencia en backend e IA generativa: RAG, Text-to-SQL, Python y FastAPI.',
	},
	a11y: {
		skipToContent: 'Saltar al contenido',
		openMenu: 'Abrir menú',
		closeMenu: 'Cerrar menú',
		mainNav: 'Navegación principal',
		language: 'Idioma',
		backToTop: 'volver al inicio',
		newTab: '(se abre en una pestaña nueva)',
	},
	nav: {
		about: 'Sobre mí',
		experience: 'Experiencia',
		education: 'Formación',
		skills: 'Habilidades',
		projects: 'Proyectos',
		contact: 'Contacto',
	},
	hero: {
		greeting: 'Hola, soy',
		headline: 'Ingeniería de Software · IA Generativa · Backend',
		intro:
			'Estudiante de Ingeniería de Software. Desarrollo sistemas backend y aplicaciones con IA generativa, desde el levantamiento de requisitos hasta producción.',
		ctaContact: 'Contactar',
		ctaCv: 'Ver CV',
		photoAlt: 'Foto de Rafael El Shafie',
	},
	about: {
		title: 'Sobre mí',
		paragraphs: [
			'Estudio Ingeniería de Software en Estácio y me estoy especializando en backend e IA generativa.',
			'En BTG Pactual, desarrollé desde cero un asistente de IA con RAG y Text-to-SQL que llegó a producción y empezó a ser utilizado por el equipo. Antes, integré datos de distintos sistemas y creé reglas de negocio para apoyar decisiones de inversión inmobiliaria.',
			'Busco una pasantía en desarrollo backend o IA.',
		],
		languagesTitle: 'Idiomas',
		languages: [
			{ name: 'Portugués', level: 'nativo' },
			{ name: 'Inglés', level: 'intermedio' },
			{ name: 'Español', level: 'básico' },
		],
	},
	experience: {
		title: 'Experiencia',
		stack: 'Stack',
	},
	education: {
		title: 'Formación',
	},
	skills: {
		title: 'Habilidades',
		learning: 'en formación',
		groups: {
			backend: 'Backend',
			ai: 'IA aplicada',
			data: 'Datos',
			frontend: 'Frontend',
			infra: 'Cloud y DevOps',
			quality: 'Calidad',
		},
	},
	projects: {
		title: 'Proyectos',
		repo: 'Código',
		demo: 'Demo',
	},
	contact: {
		title: 'Contacto',
		text: '¿Quieres hablar sobre una vacante o un proyecto? La forma más rápida de contactarme es por correo electrónico o LinkedIn.',
		email: 'Correo electrónico',
		linkedin: 'LinkedIn',
		github: 'GitHub',
		cv: 'Currículum',
	},
	period: {
		present: 'actualidad',
		inProgress: 'en curso',
	},
	footer: {
		builtWith: 'Hecho con Astro.',
	},
};
