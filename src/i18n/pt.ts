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
		themeToLight: 'Ativar tema claro',
		themeToDark: 'Ativar tema escuro',
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
		status: 'Aberto a estágios e projetos',
		headline: 'Engenharia de Software · IA Generativa · Backend',
		intro:
			'Estudante de Engenharia de Software com experiência no BTG Pactual, onde desenvolvi um assistente de IA entregue em produção. Meu foco é desenvolvimento backend e IA aplicada.',
		highlightLabel: 'Último trabalho',
		highlight: 'Atlas, assistente de IA que construí do zero no BTG Pactual e que está em produção.',
		ctaProjects: 'Ver projetos',
		ctaCv: 'Ver currículo',
		photoAlt: 'Foto de Rafael El Shafie',
		location: 'Rio de Janeiro, Brasil',
		// Vazios de propósito: em português, a moldura da foto mostra só a legenda
		portraitLabel: '',
		portraitCaption: 'Curioso por sistemas.\nAtento a quem usa.',
		portraitTag: '',
	},
	trajectory: {
		label: 'Experiência e formação',
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
			'Na Fluxo Consultoria, empresa júnior da UFRJ, tive minha primeira experiência desenvolvendo software em equipe. Hoje, curso Engenharia de Software na Estácio, com foco em backend e IA aplicada.',
			'No BTG Pactual, desenvolvi do zero um assistente de IA com RAG e Text-to-SQL que entrou em produção e passou a ser usado pela equipe. Antes disso, integrei dados de sistemas diferentes e criei regras de negócio para apoiar decisões de investimento imobiliário.',
			'Estou em busca de estágio em desenvolvimento backend ou IA.',
		],
		contributionsTitle: 'O que levo para uma equipe',
		contributions: [
			{
				title: 'Entender antes de implementar',
				text: 'Na Fluxo, participei de entrevistas e visitas técnicas para transformar a rotina dos usuários em requisitos e modelos de dados.',
			},
			{
				title: 'Compartilhar conhecimento',
				text: 'Documento decisões e organizo informações para facilitar a colaboração e a continuidade do trabalho. Também tenho experiência orientando colegas e trainees.',
			},
			{
				title: 'Experimentar com critério',
				text: 'No assistente de IA do BTG, comparei abordagens e avaliei a qualidade das respostas e o consumo de IA para decidir quais mudanças manter.',
			},
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
		intro: 'Minha formação, os cursos que concluí e o que estou estudando agora.',
		nowTag: 'Em evolução',
		now: [
			{ title: 'Backend com Java', text: 'Java, orientação a objetos e Spring Boot no bootcamp DIO · Itaú.' },
			{ title: 'Engenharia de IA', text: 'Estudo recuperação de contexto, avaliação de respostas e integração de modelos de linguagem, conectando esses temas à experiência com o assistente do BTG.' },
			{ title: 'Inglês', text: 'Estudo contínuo no Kumon, com foco em leitura, gramática e ampliação de vocabulário.' },
		],
		listTitle: 'Formação e cursos',
	},
	skills: {
		label: 'Habilidades',
		heading: 'Ferramentas para\nresolver problemas.',
		intro: 'Experiência prática em backend, IA e dados, com conhecimentos complementares em interfaces, testes e infraestrutura.',
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
				text: 'Desenvolvi APIs e regras de negócio com Python e FastAPI no BTG Pactual e contribuí para um backend em NestJS na capacitação da Fluxo. Hoje, aprofundo meus conhecimentos em Java e Spring Boot.',
			},
			ai: {
				title: 'IA ligada a um problema real.',
				text: 'RAG e Text-to-SQL em produção no assistente de onboarding do BTG. Treinamento e publicação de modelos no Amazon SageMaker e uso do Bedrock no curso da PUC-Rio.',
			},
			data: {
				title: 'Dados que ajudam a decidir.',
				text: 'No projeto de imóveis do BTG, trabalhei com tratamento e conciliação de dados usando Spark e Databricks. No assistente de IA, integrei consultas a PostgreSQL e MySQL.',
			},
			frontend: {
				title: 'Interfaces para quem usa.',
				text: 'Frontend em React e TypeScript do assistente de IA do BTG: chat, histórico, feedback e painéis administrativos.',
			},
			infra: {
				title: 'Do código à produção.',
				text: 'Preparei a entrega do assistente de IA com Docker, Kubernetes e Azure DevOps, incluindo monitoramento no Datadog. Utilizei serviços da AWS no projeto de imóveis e nas atividades práticas da PUC-Rio.',
			},
			quality: {
				title: 'Confiança para mudar.',
				text: 'Desenvolvi testes automatizados de backend, interface e integração. Para o assistente de IA, usei perguntas de referência para avaliar respostas e acompanhar o efeito das alterações.',
			},
		},
		sets: {
			languages: 'Linguagens',
			frameworks: 'Frameworks e ambientes de execução',
			persistence: 'Persistência',
			design: 'Requisitos e modelagem',
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
		heading: 'Vamos conversar sobre oportunidades?',
		text: 'Estou disponível para conversar sobre estágios em backend ou IA e projetos de desenvolvimento. Você pode entrar em contato por e-mail ou pelo LinkedIn.',
		email: 'E-mail',
		linkedin: 'LinkedIn',
		github: 'GitHub',
		cv: 'Currículo',
		linkedinHint: 'Vamos nos conectar',
		githubHint: 'Meus repositórios',
		copyEmail: 'Copiar e-mail',
		copied: 'E-mail copiado.',
		copyFailed: 'Não foi possível copiar o e-mail. Tente novamente.',
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
