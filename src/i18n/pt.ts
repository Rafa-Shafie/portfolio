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
		/** Cargo no JSON-LD (dados estruturados para o Google). */
		jobTitle: 'Estudante de Engenharia de Software',
	},
	/** Página 404: uma só para os três idiomas, então cada um tem o seu bloco. */
	notFound: {
		title: 'Página não encontrada · Rafael El Shafie',
		heading: 'Página não encontrada',
		text: 'O endereço pode ter mudado ou não existir mais.',
		home: 'Ir para o início',
	},
	/** Diagramas ilustrativos dos modais (Diagram.astro): só o que o texto público já diz. */
	diagrams: {
		label: 'Diagrama ilustrativo',
		atlas: {
			caption: 'o caminho de uma pergunta no Atlas',
			steps: [
				{ title: 'Pergunta', text: 'em linguagem natural' },
				{ title: 'Classificação', text: 'conceitual ou sobre um caso específico' },
				{ title: 'Recuperação', text: 'busca textual nos documentos' },
				{ title: 'Seleção', text: 'o modelo escolhe as fontes relevantes' },
				{ title: 'Resposta', text: 'gerada com esse contexto, aos poucos na tela' },
			],
			note: 'Caso específico: templates SQL consultam os dados em modo somente leitura, e o resultado também entra no contexto. Sem o identificador, o assistente pede antes de prosseguir.',
			examplesTitle: 'Exemplos com perguntas inventadas',
			examples: [
				{
					question: 'Como funciona a atualização cadastral de um cliente?',
					route: ['Conceitual', 'Documentos', 'Resposta'],
				},
				{
					question: 'Qual é a situação do cadastro deste cliente?',
					route: ['Caso específico', 'Pede o identificador', 'Consulta SQL', 'Resposta'],
				},
			],
		},
		manhattan: {
			caption: 'do anúncio ao dashboard, na arquitetura Medallion',
			steps: [
				{ title: 'Fontes', text: 'Zillow e StreetEasy' },
				{ title: 'Bronze', text: 'ingestão dos anúncios', tag: 'já existia' },
				{ title: 'Prata', text: 'tratamento e conciliação das fontes' },
				{ title: 'Ouro', text: 'camada analítica' },
				{ title: 'Saídas', text: 'pontuação, avisos no Teams e dashboard' },
			],
		},
		modeling: {
			caption: 'do levantamento ao modelo de dados',
			steps: [
				{ title: 'Visitas e entrevistas', text: 'com quem usa o sistema' },
				{ title: 'Processos', text: 'mapeamento da rotina de trabalho' },
				{ title: 'Requisitos', text: 'necessidades e histórias de usuário' },
				{ title: 'Modelo conceitual', text: 'elementos e relações do negócio' },
				{ title: 'Modelo lógico', text: 'entidades, atributos e chaves' },
			],
			areasTitle: 'Áreas cobertas',
			areas: ['Estoque', 'Produção', 'Vendas', 'Faturamento', 'Pessoas', 'Finanças'],
		},
	},
	/** Modais de detalhe: resumo no topo e links entre experiência e projeto. */
	dialog: {
		summary: 'Resumo',
		problem: 'Problema',
		role: 'Minha participação',
		delivery: 'Entrega',
		result: 'Resultado',
		relatedExperience: 'Experiência relacionada',
		relatedExperienceText: 'Responsabilidades, decisões e aprendizados estão no relato da experiência.',
		relatedProjects: 'Projetos desta experiência',
		relatedProjectsText: 'A visão técnica, com arquitetura e tecnologias, está nos detalhes de cada projeto.',
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
		status: 'Aberto a oportunidades',
		headline: 'Engenharia de Software · IA Generativa · Backend',
		intro:
			'Estudante de Engenharia de Software. Desenvolvo sistemas backend e aplicações com IA generativa, do levantamento de requisitos até a produção.',
		highlightLabel: 'Último trabalho',
		highlight: 'Atlas, assistente de IA que construí do zero no BTG Pactual e que está em produção.',
		ctaProjects: 'Ver projetos',
		ctaCv: 'Ver currículo',
		photoAlt: 'Foto de Rafael El Shafie',
		location: 'Rio de Janeiro, Brasil',
		// Vazios de propósito: nos três idiomas, a moldura da foto mostra só a legenda
		portraitLabel: '',
		portraitCaption: 'Curioso por sistemas.\nPensando em quem usa.',
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
			'Sou estudante de Engenharia de Software na Estácio, com foco em desenvolvimento backend e IA aplicada.',
			'Minha primeira experiência desenvolvendo software em equipe foi na Fluxo Consultoria, empresa júnior da UFRJ. Lá, também participei de um projeto de levantamento de requisitos e modelagem de dados.',
			'Na primeira passagem pelo BTG Pactual, participei do Manhattan Real Estate, trabalhando no tratamento de dados e na construção de um dashboard para análise de imóveis. Na segunda, desenvolvi do zero o Atlas, um assistente de IA para o onboarding bancário que entrou em produção e passou a ser usado pela equipe.',
			'Busco uma oportunidade de estágio em desenvolvimento backend ou IA e estou aberto a projetos freelance.',
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
			{ title: 'Engenharia de IA', text: 'Estudando machine learning, deep learning, LLMs e agentes. Próximo passo: uma trilha de carreira com RAG, LangChain e LangGraph, protocolos como MCP e observabilidade de LLMs.' },
			{ title: 'Inglês', text: 'Estudo contínuo no Kumon, com foco em leitura, gramática e ampliação de vocabulário.' },
		],
		listTitle: 'Formação e cursos',
		grade: 'Nota',
		classAverage: 'média da turma',
		documents: { certificate: 'Declaração de conclusão', transcript: 'Histórico' },
		verify: 'Conferir autenticidade',
		code: 'código',
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
				text: 'Frontend em React e TypeScript do assistente de IA do BTG: chat, histórico, feedback e painéis administrativos. Também construí este portfólio em Astro, com três idiomas, tema claro e escuro e acessibilidade testada a cada mudança.',
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
			frameworks: 'Frameworks e runtimes',
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
			audits: 'Acessibilidade e desempenho',
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
			frontend: 'Frontend',
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
			site: 'Conteúdo → 3 idiomas → 2 temas',
		},
		readMore: 'Ver detalhes',
		/** Anúncio do filtro: singular e plural (o script escolhe com Intl.PluralRules). */
		count: { one: 'projeto exibido', other: 'projetos exibidos' },
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
		/** Menu do cartão de e-mail: cada pessoa escolhe como escrever (nada é decidido por ela). */
		emailOptions: {
			label: 'Opções de e-mail',
			copy: 'Copiar endereço',
			copyHint: 'Funciona com qualquer serviço',
			app: 'Abrir no app de e-mail',
			appHint: 'O padrão do seu aparelho',
			gmail: 'Escrever pelo Gmail',
			outlook: 'Escrever pelo Outlook',
			webHint: 'Abre numa nova aba',
		},
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
