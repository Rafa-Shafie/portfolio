// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, htmlLang, locales } from './src/i18n/utils.ts';

const poppins = '@fontsource/poppins/files/poppins-latin';

// https://astro.build/config
export default defineConfig({
	// Trocar pelo domínio próprio quando ele estiver apontado (canonical, Open Graph e sitemap usam este valor)
	site: 'https://portfolio-chi-pink-45.vercel.app',
	// Português na raiz; inglês e espanhol em /en/ e /es/
	i18n: {
		locales: [...locales],
		defaultLocale,
		routing: { prefixDefaultLocale: false },
	},
	// O sitemap lista cada página com as versões nos outros idiomas (xhtml:link hreflang)
	integrations: [sitemap({ i18n: { defaultLocale, locales: htmlLang } })],
	fonts: [
		{
			// Arquivos do pacote @fontsource/poppins (versão travada no lockfile, sem rede no build).
			// Só o subset latin: cobre todos os acentos de português e espanhol.
			provider: fontProviders.local(),
			name: 'Poppins',
			cssVariable: '--font-poppins',
			fallbacks: ['system-ui', 'sans-serif'],
			options: {
				variants: [
					{ weight: 400, style: 'normal', src: [`${poppins}-400-normal.woff2`] },
					{ weight: 600, style: 'normal', src: [`${poppins}-600-normal.woff2`] },
					{ weight: 700, style: 'normal', src: [`${poppins}-700-normal.woff2`] },
				],
			},
		},
	],
});
