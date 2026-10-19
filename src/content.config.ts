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
			highlights: localized(z.array(z.string()).min(2).max(3)),
			stack: z.array(z.string()).min(1),
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

// Vazia no v1: a seção e o link do menu só aparecem quando houver ao menos um projeto.
const projects = defineCollection({
	loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
	schema: z.object({
		title: localized(z.string()),
		description: localized(z.string()),
		stack: z.array(z.string()).min(1),
		repo: z.url().optional(),
		demo: z.url().optional(),
		order: z.number().int().default(0),
	}),
});

export const collections = { experiences, education, projects };
