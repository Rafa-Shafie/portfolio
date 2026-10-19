// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

const poppins = '@fontsource/poppins/files/poppins-latin';

// https://astro.build/config
export default defineConfig({
	// Trocar pelo domínio próprio quando ele estiver apontado (canonical, Open Graph e sitemap usam este valor)
	site: 'https://portfolio-chi-pink-45.vercel.app',
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
