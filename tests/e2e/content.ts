/**
 * Dados que os testes comparam com a página: os mesmos dicionários e YAML que o site usa.
 * Assim, adicionar um projeto ou trocar um texto não exige mexer nos testes.
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

type Term = string | Localized<string>;
type Details = { draft?: boolean };

interface Project {
	slug: string;
	draft?: boolean;
	title: Localized<string>;
	category: string;
	alsoIn?: string[];
	stack: Term[];
	repo?: string;
	details?: Details;
}

interface Experience {
	slug: string;
	company: string;
	role: Localized<string>;
	details?: Details;
}

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

/** Experiências com o modal "Explorar a experiência". */
export const exploredExperiences = experiences.filter((e) => published(e.details));

/** Projetos que aparecem no filtro de uma área (principal ou `alsoIn`). */
export const projectsIn = (area: string) => projects.filter((p) => p.category === area || p.alsoIn?.includes(area));

export const term = (value: Term, locale: Locale) => (typeof value === 'string' ? value : value[locale]);
