import type { Locale } from '../i18n/utils';

/** Dados pessoais e links usados em várias seções. Sem telefone, por decisão de privacidade. */
export const profile = {
	name: 'Rafael El Shafie',
	email: 'rafael.shafie@gmail.com',
	linkedin: 'https://www.linkedin.com/in/rafael-shafie/',
	github: 'https://github.com/Rafa-Shafie',
	// Um CV por idioma, exportado do Canva sem telefone e conferido antes de publicar
	cv: {
		pt: '/cv/rafael-el-shafie-cv-pt.pdf',
		en: '/cv/rafael-el-shafie-cv-en.pdf',
		es: '/cv/rafael-el-shafie-cv-es.pdf',
	} satisfies Record<Locale, string>,
};
