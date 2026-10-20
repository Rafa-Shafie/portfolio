/**
 * Detalhes de um modal (experiência ou projeto) no idioma da página: resumo, abertura e seções.
 * Os dois cartões usam o mesmo formato de detalhes (detailSections em content.config.ts), então a
 * tradução para as props do DetailDialog mora aqui, num lugar só.
 */
import type { CollectionEntry } from 'astro:content';
import { localize, useTranslations, type Locale } from '../i18n/utils';

type Details = NonNullable<CollectionEntry<'projects'>['data']['details']>;

export function localizeDetails(details: Details, locale: Locale) {
	const t = useTranslations(locale);
	const { summary } = details;
	return {
		// Ordem de leitura do resumo: o problema, o que eu fiz, o que foi entregue e o resultado
		summary: summary && [
			{ label: t.dialog.problem, text: localize(summary.problem, locale) },
			{ label: t.dialog.role, text: localize(summary.role, locale) },
			{ label: t.dialog.delivery, text: localize(summary.delivery, locale) },
			{ label: t.dialog.result, text: localize(summary.result, locale) },
		],
		intro: details.intro && localize(details.intro, locale),
		sections: details.sections.map((section) => ({
			heading: localize(section.heading, locale),
			text: section.text && localize(section.text, locale),
			items: section.items && localize(section.items, locale),
		})),
	};
}
