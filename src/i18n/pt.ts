/**
 * Textos fixos da interface em português.
 * O tipo `Dictionary` nasce daqui: os dicionários dos outros idiomas precisam
 * ter exatamente as mesmas chaves, ou o build quebra.
 */
export const pt = {
	meta: {
		title: 'Rafael El Shafie | Engenharia de Software, IA Generativa e Backend',
		description:
			'Portfólio de Rafael El Shafie, estudante de Engenharia de Software com experiência em backend e IA generativa: RAG, Text-to-SQL, Python e FastAPI.',
	},
	a11y: {
		skipToContent: 'Pular para o conteúdo',
		openMenu: 'Abrir menu',
		closeMenu: 'Fechar menu',
		mainNav: 'Navegação principal',
		language: 'Idioma',
		backToTop: 'voltar ao início',
		newTab: '(abre em nova aba)',
	},
	nav: {
		about: 'Sobre',
		experience: 'Experiências',
		education: 'Formação',
		skills: 'Habilidades',
		projects: 'Projetos',
		contact: 'Contato',
	},
	hero: {
		status: 'Aberto a oportunidades de estágio',
		headline: 'Engenharia de Software · IA Generativa · Backend',
		intro:
			'Estudante de Engenharia de Software. Construo sistemas backend e aplicações com IA generativa, do levantamento de requisitos até a produção.',
		ctaContact: 'Entrar em contato',
		ctaCv: 'Ver currículo',
		photoAlt: 'Foto de Rafael El Shafie',
		location: 'Rio de Janeiro, Brasil',
		portraitLabel: 'Pessoas antes do código',
		portraitCaption: 'Curioso por natureza.\nDesenvolvedor em evolução.',
		portraitTag: 'Aprendizado contínuo',
	},
	trajectory: {
		label: 'Experiência e formação que fazem parte da minha história',
		captions: {
			btg: 'Tecnologia & IA',
			fluxo: 'Empresa Júnior · UFRJ',
			estacio: 'Engenharia de Software',
			puc: 'IA & Dados na Nuvem',
		},
	},
	about: {
		label: 'Sobre mim',
		heading: 'Engenharia em formação.\nExperiência na prática.',
		paragraphs: [
			'Estudo Engenharia de Software na Estácio e venho me especializando em backend e IA generativa.',
			'No BTG Pactual, desenvolvi do zero um assistente de IA com RAG e Text-to-SQL que entrou em produção e passou a ser usado pela equipe. Antes disso, integrei dados de sistemas diferentes e criei regras de negócio para apoiar decisões de investimento imobiliário.',
			'Estou em busca de estágio em desenvolvimento backend ou IA.',
		],
		contributionsTitle: 'O que levo para uma equipe',
		contributions: [
			{ title: 'Construir com contexto', text: 'Entender a necessidade de negócio antes de transformar requisitos em código.' },
			{ title: 'Conectar tecnologia e pessoas', text: 'Organizar informação, documentar decisões e colaborar com quem usa a solução.' },
			{ title: 'Aprender e colocar em prática', text: 'Explorar ferramentas, testar ideias e evoluir a partir de feedback.' },
		],
		languagesTitle: 'Idiomas',
		languages: [
			{ name: 'Português', level: 'nativo' },
			{ name: 'Inglês', level: 'intermediário' },
			{ name: 'Espanhol', level: 'básico' },
		],
	},
	experience: {
		label: 'Experiências',
		heading: 'Onde o aprendizado\nvirou entrega.',
		stack: 'Stack',
	},
	education: {
		label: 'Formação',
		heading: 'Aprender. Construir.\nRepetir.',
	},
	skills: {
		label: 'Habilidades',
		heading: 'Ferramentas para\nresolver problemas.',
		learning: 'em formação',
		groups: {
			backend: 'Backend',
			ai: 'IA aplicada',
			data: 'Dados',
			frontend: 'Frontend',
			infra: 'Cloud e DevOps',
			quality: 'Qualidade',
		},
	},
	projects: {
		label: 'Projetos',
		heading: 'Ideias, contexto\ne código.',
		repo: 'Código',
		demo: 'Demo',
	},
	contact: {
		label: 'Contato',
		heading: 'Vamos construir\nalgo útil?',
		text: 'Quer conversar sobre uma vaga ou um projeto? O jeito mais rápido de falar comigo é por e-mail ou pelo LinkedIn.',
		email: 'E-mail',
		linkedin: 'LinkedIn',
		github: 'GitHub',
		cv: 'Currículo',
	},
	period: {
		present: 'atual',
		inProgress: 'em andamento',
	},
	footer: {
		builtWith: 'Feito com Astro.',
	},
};

export type Dictionary = typeof pt;
