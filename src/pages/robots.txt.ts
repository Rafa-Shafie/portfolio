/**
 * /robots.txt: o arquivo que os buscadores (Google, Bing) leem primeiro para saber o que podem
 * indexar. Aqui libera tudo e aponta para o sitemap.
 *
 * Um arquivo .ts em src/pages/ que exporta GET é um "endpoint": em vez de HTML, ele devolve o que
 * a função retornar. Num site estático, a função roda uma vez no build e o resultado vira o arquivo
 * dist/robots.txt.
 */
import type { APIRoute } from 'astro';

// Gerado no build para usar o mesmo `site` do astro.config (um lugar só para trocar o domínio)
export const GET: APIRoute = ({ site }) => {
	const sitemap = new URL('sitemap-index.xml', site);
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
