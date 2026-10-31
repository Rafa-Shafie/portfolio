/**
 * Habilidades por área (as abas da seção) e por subgrupo dentro de cada área.
 * Os nomes das abas e dos subgrupos vêm do dicionário de cada idioma; aqui ficam só os itens.
 */
import type { Dictionary } from '../i18n/pt';
import type { Localized } from '../i18n/utils';

/**
 * O nome de cada aba e o contexto de uso vêm do dicionário (`skills.groups` e `skills.context`).
 * `keyof` transforma as chaves do dicionário num tipo: GroupId só aceita 'backend', 'ai', 'data'…
 * Um id digitado errado aqui, ou uma área sem texto no dicionário, quebra o `astro check`.
 */
type GroupId = keyof Dictionary['skills']['groups'];
/** O rótulo de cada subgrupo vem do dicionário (`skills.sets`). */
type SetId = keyof Dictionary['skills']['sets'];

export interface Skill {
	/** Nome próprio de ferramenta não se traduz; quando o termo muda por idioma, um valor por idioma. */
	name: string | Localized<string>;
	/** Ainda em formação: aparece com a marcação do dicionário (`skills.learning`). */
	learning?: boolean;
}

export interface SkillSet {
	id: SetId;
	items: Skill[];
}

export interface SkillGroup {
	id: GroupId;
	sets: SkillSet[];
}

// Atalho para listas de nomes próprios: s('Python', 'SQL') vira [{ name: 'Python' }, { name: 'SQL' }]
const s = (...names: string[]): Skill[] => names.map((name) => ({ name }));

// Itens do CV de out/2026 (fonte de verdade), agrupados por tipo dentro de cada área.
export const skillGroups: SkillGroup[] = [
	{
		id: 'backend',
		sets: [
			{ id: 'languages', items: [...s('Python', 'TypeScript', 'JavaScript', 'SQL'), { name: 'Java', learning: true }] },
			{
				id: 'frameworks',
				items: [
					...s('FastAPI', 'Node.js', 'NestJS'),
					// Em formação no bootcamp DIO · Itaú (e na carreira de back-end da Alura)
					{ name: 'Spring Boot · Spring Data', learning: true },
					{ name: 'Spring Security', learning: true },
					{ name: 'Spring Cloud OpenFeign', learning: true },
				],
			},
			{ id: 'persistence', items: s('SQLAlchemy', 'Alembic', 'Prisma') },
			{ id: 'integration', items: [{ name: { pt: 'APIs REST', en: 'REST APIs', es: 'APIs REST' } }, ...s('RabbitMQ')] },
			{
				id: 'design',
				items: [
					{ name: { pt: 'Engenharia de requisitos', en: 'Requirements engineering', es: 'Ingeniería de requisitos' } },
					{ name: { pt: 'Modelagem de dados', en: 'Data modeling', es: 'Modelado de datos' } },
				],
			},
			// Em formação no bootcamp DIO · Itaú
			{
				id: 'practices',
				items: [
					{ name: 'SOLID', learning: true },
					{ name: 'Clean Code', learning: true },
					{ name: 'Design Patterns', learning: true },
				],
			},
		],
	},
	{
		id: 'ai',
		sets: [
			{
				id: 'applications',
				items: [
					...s('LLMs', 'RAG', 'Text-to-SQL'),
					// Em formação: cursos de IA do bootcamp DIO · Itaú
					{ name: { pt: 'Engenharia de prompts', en: 'Prompt engineering', es: 'Ingeniería de prompts' }, learning: true },
					{ name: { pt: 'Agentes de IA', en: 'AI agents', es: 'Agentes de IA' }, learning: true },
				],
			},
			{ id: 'ml', items: s('scikit-learn', 'LightGBM') },
			{ id: 'aws', items: s('Amazon SageMaker', 'Amazon Bedrock') },
		],
	},
	{
		id: 'data',
		sets: [
			{ id: 'databases', items: s('PostgreSQL', 'MySQL', 'Amazon DynamoDB') },
			{ id: 'processing', items: s('Pandas', 'NumPy', 'Apache Spark', 'Databricks') },
			{ id: 'analysis', items: s('Power BI', 'Excel') },
		],
	},
	{
		id: 'frontend',
		sets: [
			{ id: 'web', items: s('TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Astro') },
			{ id: 'react', items: s('React', 'TanStack Query', 'Zustand', 'Vite') },
		],
	},
	{
		id: 'infra',
		sets: [
			{ id: 'containers', items: s('Docker', 'Kubernetes') },
			{ id: 'cloud', items: s('AWS (S3, EC2, RDS, IAM, Secrets Manager, ECR)') },
			{ id: 'delivery', items: s('Azure DevOps', 'Git/GitHub', 'GitHub Actions', 'Vercel', 'Datadog') },
		],
	},
	{
		id: 'quality',
		sets: [
			{ id: 'python', items: s('pytest', 'Hypothesis') },
			{ id: 'javascript', items: s('Vitest', 'Playwright') },
			// Usados neste portfólio: axe confere WCAG nos testes e o Lighthouse barra o CI abaixo da nota mínima
			{ id: 'audits', items: s('WCAG 2.2', 'axe-core', 'Lighthouse') },
		],
	},
];
