/**
 * Dados que os testes comparam com a página: os mesmos dicionários e YAML que o site usa.
 * Assim, adicionar um projeto ou trocar um texto não exige mexer nos testes.
 *
 * Por exemplo: em vez de escrever "7 projetos" no teste (e ele quebrar no dia em que entrar o
 * oitavo), o teste lê os YAML de src/content/projects/ e espera a mesma quantidade na página.
 * O teste continua pegando o que importa: um projeto publicado que não aparece no site.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { defaultLocale, htmlLang, locales, useTranslations, type Locale, type Localized } from '../../src/i18n/utils.ts';
import { profile } from '../../src/data/profile.ts';
import { skillGroups } from '../../src/data/skills.ts';

export { locales, profile, skillGroups, useTranslations, type Locale };

/** Uma entrada por idioma: rota, `lang` do HTML e dicionário. */
export const pages = locales.map((locale) => ({
	locale,
	path: locale === defaultLocale ? '/' : `/${locale}/`,
	lang: htmlLang[locale],
	t: useTranslations(locale),
}));

// Formato dos YAML, só com os campos que os testes usam. O schema completo (e a validação de
// verdade) fica em src/content.config.ts.
type Term = string | Localized<string>;
type Details = { draft?: boolean; summary?: Record<string, Localized<string>>; sections?: { diagram?: string }[] };

interface Project {
	slug: string;
	draft?: boolean;
	title: Localized<string>;
	category: string;
	alsoIn?: string[];
	stage?: Localized<string>;
	featured?: boolean;
	/** Experiência em que o projeto foi feito (nome do arquivo em experiences/). */
	experience?: string;
	stack: Term[];
	repo?: string;
	details?: Details;
	techDetails?: unknown[];
}

interface Experience {
	slug: string;
	company: string;
	role: Localized<string>;
	details?: Details;
}

/**
 * Lê todos os YAML de uma pasta de src/content/. O nome do arquivo (sem .yaml) vira o `slug`, o
 * mesmo identificador que o site usa nos ids (ex.: atlas.yaml → modal #project-atlas).
 */
function readCollection<T>(name: string): T[] {
	const dir = path.join(import.meta.dirname, '../../src/content', name);
	return readdirSync(dir)
		.filter((file) => file.endsWith('.yaml'))
		.map((file) => ({ slug: file.replace(/\.yaml$/, ''), ...parse(readFileSync(path.join(dir, file), 'utf8')) }));
}

// Os testes rodam sobre o build de produção: rascunhos (draft: true) não aparecem
const published = (item?: { draft?: boolean }) => !!item && !item.draft;

export const projects = readCollection<Project>('projects').filter(published);
export const experiences = readCollection<Experience>('experiences');

interface Education {
	slug: string;
	details?: Details;
	documents?: unknown[];
	verification?: unknown;
}

/** Formações com o modal "Ver detalhes": as que têm detalhes publicados ou comprovantes. */
export const detailedEducation = readCollection<Education>('education').filter(
	(e) => published(e.details) || !!e.documents?.length || !!e.verification,
);

/** Experiências com o modal "Explorar a experiência". */
export const exploredExperiences = experiences.filter((e) => published(e.details));

/** Projetos que aparecem no filtro de uma área (principal ou `alsoIn`). */
export const projectsIn = (area: string) => projects.filter((p) => p.category === area || p.alsoIn?.includes(area));

/** Etiqueta no idioma da página: nome próprio ("FastAPI") fica igual; conceito tem uma versão por idioma. */
export const term = (value: Term, locale: Locale) => (typeof value === 'string' ? value : value[locale]);
