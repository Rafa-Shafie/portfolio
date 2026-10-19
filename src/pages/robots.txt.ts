import type { APIRoute } from 'astro';

// Gerado no build para usar o mesmo `site` do astro.config (um lugar só para trocar o domínio)
export const GET: APIRoute = ({ site }) => {
	const sitemap = new URL('sitemap-index.xml', site);
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
