import type { Locale } from '../i18n/utils';

/** Dados pessoais e links usados em várias seções. Sem telefone, por decisão de privacidade. */
export const profile = {
	name: 'Rafael El Shafie',
	email: 'rafael.shafie@gmail.com',
	linkedin: 'https://www.linkedin.com/in/rafael-shafie/',
	github: 'https://github.com/Rafa-Shafie',
	cv: {
		pt: '/cv/rafael-el-shafie-cv-pt.pdf',
	} satisfies Record<Locale, string>,
};
