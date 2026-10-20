import type { Dictionary } from '../i18n/pt';
import type { Localized } from '../i18n/utils';

/** O nome de cada aba e o contexto de uso vêm do dicionário (`skills.groups` e `skills.context`). */
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

const s = (...names: string[]): Skill[] => names.map((name) => ({ name }));

// Itens do CV de out/2026 (fonte de verdade), agrupados por tipo dentro de cada área.
export const skillGroups: SkillGroup[] = [
	{
		id: 'backend',
		sets: [
			{ id: 'languages', items: [...s('Python', 'TypeScript', 'JavaScript', 'SQL'), { name: 'Java', learning: true }] },
			{ id: 'frameworks', items: [...s('FastAPI', 'Node.js', 'NestJS'), { name: 'Spring Boot · Spring Data', learning: true }] },
			{ id: 'persistence', items: s('SQLAlchemy', 'Alembic', 'Prisma') },
			{ id: 'integration', items: [{ name: { pt: 'APIs REST', en: 'REST APIs', es: 'APIs REST' } }, ...s('RabbitMQ')] },
			{
				id: 'design',
				items: [
					{ name: { pt: 'Engenharia de requisitos', en: 'Requirements engineering', es: 'Ingeniería de requisitos' } },
					{ name: { pt: 'Modelagem de dados', en: 'Data modeling', es: 'Modelado de datos' } },
				],
			},
		],
	},
	{
		id: 'ai',
		sets: [
			{ id: 'applications', items: s('LLMs', 'RAG', 'Text-to-SQL') },
			{ id: 'ml', items: s('scikit-learn', 'LightGBM') },
			{ id: 'aws', items: s('Amazon SageMaker', 'Amazon Bedrock') },
		],
	},
	{
		id: 'data',
		sets: [
			{ id: 'databases', items: s('PostgreSQL', 'MySQL') },
			{ id: 'processing', items: s('Pandas', 'NumPy', 'Apache Spark', 'Databricks') },
			{ id: 'analysis', items: s('Power BI', 'Excel') },
		],
	},
	{
		id: 'frontend',
		sets: [
			{ id: 'web', items: s('TypeScript', 'JavaScript', 'HTML5', 'CSS3') },
			{ id: 'react', items: s('React', 'TanStack Query', 'Zustand', 'Vite') },
		],
	},
	{
		id: 'infra',
		sets: [
			{ id: 'containers', items: s('Docker', 'Kubernetes') },
			{ id: 'cloud', items: s('AWS (S3, EC2, RDS, Secrets Manager, ECR)') },
			{ id: 'delivery', items: s('Azure DevOps', 'Git/GitHub', 'Datadog') },
		],
	},
	{
		id: 'quality',
		sets: [
			{ id: 'python', items: s('pytest', 'Hypothesis') },
			{ id: 'javascript', items: s('Vitest', 'Playwright') },
		],
	},
];
