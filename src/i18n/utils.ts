import { pt, type Dictionary } from './pt';
import { en } from './en';
import { es } from './es';

export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

const dictionaries: Record<Locale, Dictionary> = { pt, en, es };

/** Tag BCP 47 usada no `lang` do HTML, no `hreflang` e no Intl. */
export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', en: 'en', es: 'es' };

/** Formato do `og:locale`. */
export const ogLocale: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US', es: 'es_LA' };

/** Nome de cada idioma escrito nele mesmo, para o seletor. */
export const languageName: Record<Locale, string> = { pt: 'Português', en: 'English', es: 'Español' };

export function useTranslations(locale: Locale): Dictionary {
	return dictionaries[locale];
}

/** Campo de conteúdo com uma versão por idioma. */
export type Localized<T> = Record<Locale, T>;

/** Etiqueta que pode ser um nome próprio (igual em todos os idiomas) ou ter uma versão por idioma. */
export function localizeTerm(term: string | Localized<string>, locale: Locale): string {
	return typeof term === 'string' ? term : term[locale];
}

export function localize<T>(value: Localized<T>, locale: Locale): T {
	return value[locale];
}

/** "2026-06" → "jun 2026" (ou "Jun 2026" em inglês), no idioma da página. */
function formatMonth(yearMonth: string, locale: Locale): string {
	const [year, month] = yearMonth.split('-').map(Number);
	// Mês em JavaScript começa em 0 (janeiro = 0), por isso o "- 1". UTC nas duas pontas (aqui e no
	// timeZone abaixo): no fuso do Brasil, "1º de junho à meia-noite" poderia virar 31 de maio.
	const date = new Date(Date.UTC(year, month - 1, 1));
	// Intl.DateTimeFormat é a API do JavaScript que formata datas no idioma pedido: "jun", "Jun", "jun"
	// saem prontos, sem tabela de meses escrita à mão. formatToParts devolve as partes separadas,
	// para pegar só o nome do mês (sem o ponto que algumas línguas colocam, como "jun.").
	const parts = new Intl.DateTimeFormat(htmlLang[locale], {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	}).formatToParts(date);
	const monthName = parts.find((p) => p.type === 'month')?.value.replace('.', '') ?? '';
	return `${monthName} ${year}`;
}

/** Período "jun 2026 – out 2026"; sem fim, usa "atual". */
export function formatPeriod(start: string, end: string | undefined, locale: Locale): string {
	const t = useTranslations(locale);
	const from = formatMonth(start, locale);
	const to = end ? formatMonth(end, locale) : t.period.present;
	return `${from} – ${to}`;
}
