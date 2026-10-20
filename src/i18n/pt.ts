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
		closeDetails: 'Fechar detalhes',
		draft: 'Rascunho: não aparece em produção',
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
		bioTitle: 'Quem sou',
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
	},
	experience: {
		label: 'Experiências',
		heading: 'Onde o aprendizado\nvirou entrega.',
		intro: 'Duas passagens pelo BTG Pactual e uma base construída na empresa júnior da UFRJ.',
		stack: 'Stack',
		outcome: 'Entrega & aprendizado',
		explore: 'Explorar a experiência',
		details: {
			tech: 'Tecnologias',
			note: 'Relato da minha participação profissional. Código e materiais internos não estão disponíveis neste portfólio.',
		},
	},
	education: {
		label: 'Formação',
		heading: 'Aprender. Construir.\nRepetir.',
		intro: 'O que está recebendo minha atenção neste momento.',
		nowTag: 'Em evolução',
		now: [
			{ title: 'Backend com Java', text: 'Java, orientação a objetos e Spring Boot no bootcamp DIO · Itaú.' },
			{ title: 'Engenharia de IA', text: 'Aplicações com LLMs, recuperação de contexto e avaliação de respostas.' },
			{ title: 'Inglês', text: 'Estudo contínuo no Kumon, hoje no nível M.' },
		],
		listTitle: 'Formação e cursos',
	},
	skills: {
		label: 'Habilidades',
		heading: 'Ferramentas para\nresolver problemas.',
		intro: 'Conhecimentos construídos entre experiências, cursos e prática. Meu foco de aprofundamento é backend e IA.',
		learning: 'em formação',
		groups: {
			backend: 'Backend',
			ai: 'IA aplicada',
			data: 'Dados',
			frontend: 'Frontend',
			infra: 'Cloud e DevOps',
			quality: 'Qualidade',
		},
		context: {
			backend: {
				title: 'Do requisito à API.',
				text: 'APIs e regras de negócio em Python e FastAPI no assistente de IA do BTG, e em Node.js e TypeScript no software de gestão da Fluxo. Hoje, aprofundando Java e Spring Boot.',
			},
			ai: {
				title: 'IA ligada a um problema real.',
				text: 'RAG e Text-to-SQL em produção no assistente de onboarding do BTG. Treinamento e publicação de modelos no Amazon SageMaker e uso do Bedrock no curso da PUC-Rio.',
			},
			data: {
				title: 'Dados que ajudam a decidir.',
				text: 'Integração e cruzamento de bases com Spark e Databricks na análise de imóveis do BTG, e PostgreSQL e MySQL como fonte das consultas em linguagem natural do assistente.',
			},
			frontend: {
				title: 'Interfaces para quem usa.',
				text: 'Frontend em React e TypeScript do assistente de IA do BTG: chat, histórico, feedback e painéis administrativos.',
			},
			infra: {
				title: 'Do código à produção.',
				text: 'Entrega com Docker, Kubernetes e Azure DevOps e observabilidade no Datadog no assistente do BTG; serviços da AWS no projeto de imóveis e no curso da PUC-Rio.',
			},
			quality: {
				title: 'Confiança para mudar.',
				text: 'Testes automatizados e avaliações das respostas de IA para identificar falhas após alterações no assistente do BTG.',
			},
		},
		sets: {
			languages: 'Linguagens',
			frameworks: 'Frameworks',
			persistence: 'Persistência',
			integration: 'Integração',
			applications: 'Aplicações',
			ml: 'Machine learning',
			aws: 'AWS',
			databases: 'Bancos de dados',
			processing: 'Processamento',
			analysis: 'Análise',
			web: 'Base web',
			react: 'Ecossistema React',
			containers: 'Containers',
			cloud: 'Cloud',
			delivery: 'Entrega e operação',
			python: 'Python',
			javascript: 'JavaScript',
		},
	},
	projects: {
		label: 'Projetos',
		heading: 'Ideias, contexto\ne código.',
		intro: 'Do que já entreguei em produção ao que estou construindo agora: projetos profissionais e pessoais em backend, IA e dados.',
		filterLabel: 'Filtrar projetos por área',
		categories: {
			all: 'Todos',
			ai: 'IA',
			backend: 'Backend',
			data: 'Dados',
		},
		kinds: {
			personal: 'Projeto pessoal',
			professional: 'Experiência profissional',
			training: 'Projeto de capacitação',
		},
		status: {
			planned: 'Em planejamento',
			progress: 'Em andamento',
			production: 'Em produção',
			delivered: 'Entregue',
			released: 'Publicado',
		},
		/** Legendas das ilustrações (decorativas). */
		art: {
			assistant: 'Pergunta → contexto → resposta',
			map: 'Manhattan · NYC',
			model: 'Entrevistas → modelo de dados',
			ledger: 'Extratos → visão da casa',
			league: 'Tarefas → pontos → ranking',
			voice: 'Voz → IA → resposta',
		},
		readMore: 'Ver detalhes',
		count: 'projetos exibidos',
		details: {
			techDetails: 'Tecnologias em detalhe',
			tech: 'Tecnologias',
		},
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
		linkedinHint: 'Vamos nos conectar',
		githubHint: 'Meus repositórios',
		copyEmail: 'Copiar e-mail',
		copied: 'E-mail copiado.',
		copyFailed: 'Não foi possível copiar. Use o endereço acima.',
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
