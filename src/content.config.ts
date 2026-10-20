import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales, type Locale } from './i18n/utils';

/** Mês no formato AAAA-MM. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use o formato AAAA-MM');

/**
 * Campo traduzível: exige um valor para cada idioma em `locales`.
 * Quando um idioma novo entra na lista, todo arquivo sem a tradução quebra o build.
 */
function localized<T extends z.ZodType>(schema: T) {
	const shape = Object.fromEntries(locales.map((locale) => [locale, schema])) as {
		[K in Locale]: T;
	};
	return z.object(shape);
}

/**
 * Detalhes exibidos no modal (experiências e projetos): um resumo opcional e seções livres, cada
 * uma com texto e/ou lista. Com draft: true, só aparece no dev e no preview.
 */
const detailSections = z.object({
	draft: z.boolean().default(false),
	intro: localized(z.string()).optional(),
	sections: z
		.array(
			z.object({
				heading: localized(z.string()),
				text: localized(z.string()).optional(),
				items: localized(z.array(z.string()).min(1)).optional(),
			}),
		)
		.min(1),
});

/**
 * Etiqueta de tecnologia ou conhecimento: nome próprio ("FastAPI") fica igual em todos os idiomas;
 * conceito ("Modelagem lógica") vem com uma versão por idioma.
 */
const term = z.union([z.string(), localized(z.string())]);

/** Tecnologias em detalhe, agrupadas por frente (rótulo traduzível). */
const techGroups = z.array(z.object({ label: localized(z.string()), items: z.array(term).min(1) }));

/** Datas do período: o fim, quando existe, não pode vir antes do início. */
const period = {
	start: yearMonth,
	end: yearMonth.optional(),
};
const endAfterStart = (item: { start: string; end?: string }) => !item.end || item.end >= item.start;

const experiences = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/content/experiences' }),
	schema: z
		.object({
			company: z.string(),
			/** Complemento ao nome da empresa, ex.: "Empresa Júnior · UFRJ". */
			companyNote: localized(z.string()).optional(),
			role: localized(z.string()),
			...period,
			/** Frase de impacto, em uma ou duas linhas. */
			summary: localized(z.string()),
			highlights: localized(z.array(z.string()).min(2).max(4)),
			stack: z.array(z.string()).min(1),
			/** Frase de resultado do painel "Entrega & aprendizado", ao lado dos destaques. */
			outcome: localized(z.string()).optional(),
			/**
			 * Detalhes do "Explorar a experiência" (modal). Mais profundo que o CV, mas sem nomes de
			 * sistemas internos, dados de clientes ou números não divulgados.
			 */
			details: detailSections.optional(),
		})
		.refine(endAfterStart, { message: 'end não pode ser anterior a start', path: ['end'] }),
});

const education = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/content/education' }),
	schema: z
		.object({
			institution: z.string(),
			course: localized(z.string()),
			// Sem datas = em andamento, no próprio ritmo (ex.: Kumon)
			start: yearMonth.optional(),
			end: yearMonth.optional(),
		})
		.refine((item) => !item.end || item.start, { message: 'end exige start', path: ['start'] })
		.refine((item) => !item.end || !item.start || item.end >= item.start, {
			message: 'end não pode ser anterior a start',
			path: ['end'],
		}),
});

// Cada projeto aparece na seção (com filtro por área) e abre um modal de detalhes.
// Com draft: true, só aparece no dev e no preview; a seção some quando não há projeto publicado.
const projects = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
	schema: z.object({
		draft: z.boolean().default(false),
		title: localized(z.string()),
		/** Resumo do cartão, em uma ou duas frases. */
		description: localized(z.string()),
		category: z.enum(['ai', 'backend', 'data', 'frontend']),
		/** Outras áreas em que o projeto também aparece no filtro (ex.: Backend que também é IA). */
		alsoIn: z.array(z.enum(['ai', 'backend', 'data', 'frontend'])).optional(),
		/** Projeto pessoal, de experiência profissional ou de capacitação (os dois últimos mostram a organização). */
		kind: z.enum(['personal', 'professional', 'training']).default('personal'),
		organization: z.string().optional(),
		status: z.enum(['planned', 'progress', 'production', 'delivered', 'released']).default('progress'),
		/**
		 * Onde o projeto está agora, em uma linha curta (ex.: "Design concluído · implementação inicial").
		 * Obrigatório em planejamento ou em andamento: o card descreve o objetivo do produto, e esta
		 * linha deixa claro o que já existe, para ninguém ler o objetivo como funcionalidade pronta.
		 */
		stage: localized(z.string()).optional(),
		/** Ilustração própria do projeto; sem ela, usa a ilustração genérica da área. */
		art: z.enum(['assistant', 'map', 'model', 'ledger', 'league', 'voice', 'site']).optional(),
		/**
		 * Etiquetas do cartão: as 5 principais, sem par redundante (ex.: NestJS já diz Node.js). Muita
		 * gente lê só o cartão, então os cartões se complementam; a lista completa fica em techDetails.
		 */
		stack: z.array(term).min(1).max(5, 'no máximo 5 etiquetas no cartão; o resto vai para techDetails'),
		repo: z.url().optional(),
		demo: z.url().optional(),
		order: z.number().int().default(0),
		details: detailSections.optional(),
		techDetails: techGroups.optional(),
	})
	.refine((project) => !['planned', 'progress'].includes(project.status) || project.stage, {
		message: 'projeto em planejamento ou em andamento precisa de stage',
		path: ['stage'],
	}),
});

export const collections = { experiences, education, projects };
