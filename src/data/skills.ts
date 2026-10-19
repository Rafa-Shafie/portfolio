import type { Dictionary } from '../i18n/pt';

/** O nome de cada grupo vem do dicionário (`skills.groups`), então a chave precisa existir lá. */
type GroupId = keyof Dictionary['skills']['groups'];

export interface Skill {
	name: string;
	/** Ainda em formação: aparece com a marcação do dicionário (`skills.learning`). */
	learning?: boolean;
}

export interface SkillGroup {
	id: GroupId;
	items: Skill[];
}

// Recorte do CV de out/2026 (fonte de verdade): o essencial de cada área.
export const skillGroups: SkillGroup[] = [
	{
		id: 'backend',
		items: [
			{ name: 'Python' },
			{ name: 'FastAPI' },
			{ name: 'Node.js' },
			{ name: 'APIs REST' },
			{ name: 'SQLAlchemy' },
			{ name: 'Java e Spring Boot', learning: true },
		],
	},
	{
		id: 'ai',
		items: [
			{ name: 'LLMs' },
			{ name: 'RAG' },
			{ name: 'Text-to-SQL' },
			{ name: 'scikit-learn' },
			{ name: 'Amazon SageMaker' },
		],
	},
	{
		id: 'data',
		items: [
			{ name: 'PostgreSQL' },
			{ name: 'MySQL' },
			{ name: 'Pandas' },
			{ name: 'Apache Spark' },
			{ name: 'Databricks' },
		],
	},
	{
		id: 'frontend',
		items: [{ name: 'TypeScript' }, { name: 'React' }, { name: 'Vite' }],
	},
	{
		id: 'infra',
		items: [
			{ name: 'AWS' },
			{ name: 'Docker' },
			{ name: 'Kubernetes' },
			{ name: 'Azure DevOps' },
			{ name: 'Git/GitHub' },
			{ name: 'Datadog' },
		],
	},
	{
		id: 'quality',
		items: [{ name: 'pytest' }, { name: 'Vitest' }, { name: 'Playwright' }],
	},
];
