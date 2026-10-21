// @ts-check
/**
 * Configuração do Astro, o framework que gera o site.
 *
 * O Astro roda no build (na sua máquina, no CI e na Vercel), lê os componentes .astro e o conteúdo,
 * e escreve HTML estático em dist/: um arquivo por idioma, sem servidor rodando em produção. O
 * navegador recebe HTML e CSS prontos, e só os scripts pequenos dos componentes interativos.
 *
 * O `// @ts-check` na primeira linha faz o editor checar os tipos deste arquivo .mjs como se fosse
 * TypeScript: um nome de opção errado aparece sublinhado.
 */
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, htmlLang, locales } from './src/i18n/utils.ts';

// Pasta dos arquivos da Poppins dentro do pacote @fontsource/poppins (node_modules)
const poppins = '@fontsource/poppins/files/poppins-latin';
// Inter, a fonte do texto corrido: menos geométrica que a Poppins, mais confortável em parágrafos longos
const inter = '@fontsource/inter/files/inter-latin';

// https://astro.build/config
export default defineConfig({
	// Endereço público do site (domínio próprio; o endereço sem www e o antigo da Vercel redirecionam
	// para cá). O Astro usa este valor para montar URLs absolutas: canonical, Open Graph (a imagem do
	// link compartilhado), hreflang, sitemap, robots.txt e JSON-LD.
	site: 'https://www.rafashafie.site',
	// i18n por rota: português na raiz (/), inglês e espanhol em /en/ e /es/.
	// prefixDefaultLocale: false é o que deixa o português sem /pt/ na frente.
	i18n: {
		locales: [...locales],
		defaultLocale,
		routing: { prefixDefaultLocale: false },
	},
	// Integrações são plugins do Astro. O sitemap gera sitemap-index.xml para o Google, listando cada
	// página com as versões nos outros idiomas (xhtml:link hreflang).
	integrations: [sitemap({ i18n: { defaultLocale, locales: htmlLang } })],
	// Fontes self-hosted: o Astro copia os arquivos para o dist/ e gera o @font-face. Nada é baixado de
	// um CDN (como o Google Fonts) quando a página abre: mais rápido e sem enviar o IP do visitante a terceiros.
	fonts: [
		{
			// Arquivos do pacote @fontsource/poppins (versão travada no lockfile, sem rede no build).
			// Só o subset latin: cobre todos os acentos de português e espanhol.
			provider: fontProviders.local(),
			name: 'Poppins',
			// O CSS usa a fonte por esta variável (ver --font-sans em src/styles/tokens.css)
			cssVariable: '--font-poppins',
			// Enquanto a Poppins carrega, o texto aparece na fonte do sistema
			fallbacks: ['system-ui', 'sans-serif'],
			options: {
				// Só os três pesos usados no site: regular (texto), semibold (rótulos) e bold (títulos)
				variants: [
					{ weight: 400, style: 'normal', src: [`${poppins}-400-normal.woff2`] },
					{ weight: 600, style: 'normal', src: [`${poppins}-600-normal.woff2`] },
					{ weight: 700, style: 'normal', src: [`${poppins}-700-normal.woff2`] },
				],
			},
		},
		{
			// Texto corrido (parágrafos, listas, modais). A Poppins segue nos títulos, botões e header.
			provider: fontProviders.local(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['system-ui', 'sans-serif'],
			options: {
				// Regular para o texto e semibold para os destaques dentro dele
				variants: [
					{ weight: 400, style: 'normal', src: [`${inter}-400-normal.woff2`] },
					{ weight: 600, style: 'normal', src: [`${inter}-600-normal.woff2`] },
				],
			},
		},
	],
});
