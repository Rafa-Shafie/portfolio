import { pt, type Dictionary } from './pt';

export const locales = ['pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

const dictionaries: Record<Locale, Dictionary> = { pt };

/** Tag BCP 47 usada no `lang` do HTML e no Intl. */
export const htmlLang: Record<Locale, string> = { pt: 'pt-BR' };

/** Formato do `og:locale`. */
export const ogLocale: Record<Locale, string> = { pt: 'pt_BR' };

export function useTranslations(locale: Locale): Dictionary {
	return dictionaries[locale];
}

/** Campo de conteúdo com uma versão por idioma. */
export type Localized<T> = Record<Locale, T>;

export function localize<T>(value: Localized<T>, locale: Locale): T {
	return value[locale];
}

/** "2026-06" → "jun 2026" (ou "Jun 2026" em inglês), no idioma da página. */
function formatMonth(yearMonth: string, locale: Locale): string {
	const [year, month] = yearMonth.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, 1));
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
