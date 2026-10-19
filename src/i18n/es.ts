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
		status: 'Abierto a oportunidades de pasantía',
		headline: 'Ingeniería de Software · IA Generativa · Backend',
		intro:
			'Estudiante de Ingeniería de Software. Desarrollo sistemas backend y aplicaciones con IA generativa, desde el levantamiento de requisitos hasta producción.',
		ctaContact: 'Contactar',
		ctaCv: 'Ver CV',
		photoAlt: 'Foto de Rafael El Shafie',
		location: 'Río de Janeiro, Brasil',
		portraitLabel: 'Las personas antes que el código',
		portraitCaption: 'Curioso por naturaleza.\nDesarrollador en evolución.',
		portraitTag: 'Aprendizaje continuo',
	},
	trajectory: {
		label: 'Experiencia y formación que forman parte de mi historia',
		captions: {
			btg: 'Tecnología e IA',
			fluxo: 'Empresa Júnior · UFRJ',
			estacio: 'Ingeniería de Software',
			puc: 'IA y Datos en la Nube',
		},
	},
	about: {
		label: 'Sobre mí',
		heading: 'Ingeniería en formación.\nExperiencia en la práctica.',
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
		label: 'Experiencia',
		heading: 'Donde el aprendizaje\nse convirtió en resultados.',
		stack: 'Stack',
	},
	education: {
		label: 'Formación',
		heading: 'Aprender. Construir.\nRepetir.',
	},
	skills: {
		label: 'Habilidades',
		heading: 'Herramientas para\nresolver problemas.',
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
		label: 'Proyectos',
		heading: 'Ideas, contexto\ny código.',
		repo: 'Código',
		demo: 'Demo',
	},
	contact: {
		label: 'Contacto',
		heading: '¿Construimos\nalgo útil?',
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
