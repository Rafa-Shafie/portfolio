import type { Locale } from '../i18n/utils';

/** Dados pessoais e links usados em várias seções. Sem telefone, por decisão de privacidade. */
export const profile = {
	name: 'Rafael El Shafie',
	email: 'rafael.shafie@gmail.com',
	linkedin: 'https://www.linkedin.com/in/rafael-shafie/',
	github: 'https://github.com/Rafa-Shafie',
	// PENDENTE antes do merge da Fase 2: trocar en/es pelos PDFs próprios, exportados do Canva sem telefone
	cv: {
		pt: '/cv/rafael-el-shafie-cv-pt.pdf',
		en: '/cv/rafael-el-shafie-cv-pt.pdf',
		es: '/cv/rafael-el-shafie-cv-pt.pdf',
	} satisfies Record<Locale, string>,
};
