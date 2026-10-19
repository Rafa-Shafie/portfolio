import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { htmlLang, type Locale } from '../i18n/utils';
import { profile } from './profile';

/**
 * Tamanho do CV de cada idioma, lido do arquivo em public/ no build ("80 kB").
 * Trocar o PDF atualiza a etiqueta sozinho.
 */
export function cvFileSize(locale: Locale): string {
	const bytes = statSync(resolve('public', `.${profile.cv[locale]}`)).size;
	return new Intl.NumberFormat(htmlLang[locale], {
		style: 'unit',
		unit: 'kilobyte',
		unitDisplay: 'short',
		maximumFractionDigits: 0,
	}).format(bytes / 1024);
}
