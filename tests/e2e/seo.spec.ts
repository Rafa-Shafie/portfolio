/**
 * Página 404 e dados estruturados (JSON-LD).
 *
 * - 404: qualquer endereço que não existe recebe a mesma página, nos três idiomas, com noindex e sem
 *   canonical (uma página de erro não deve aparecer nas buscas). O axe confere a acessibilidade dela.
 * - JSON-LD: um <script type="application/ld+json"> com schema.org/Person em cada idioma. O teste lê
 *   o JSON da página e confere nome, cargo no idioma e os perfis (LinkedIn e GitHub).
 */
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
import { pages, profile } from './content';

test('endereço inexistente: página 404 nos três idiomas, sem indexação', async ({ page }) => {
	const response = await page.goto('/pagina-que-nao-existe');
	expect(response?.status()).toBe(404);

	const [pt, ...others] = pages;
	await expect(page.locator('h1')).toHaveText(pt.t.notFound.heading);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
	await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
	await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);

	// Um link para a página inicial de cada idioma, com o texto naquele idioma
	await expect(page.locator('main a[href="/"]').filter({ hasText: pt.t.notFound.home })).toHaveCount(1);
	for (const { path, lang, t } of others) {
		await expect(page.locator(`main [lang="${lang}"] a[href="${path}"]`)).toHaveText(t.notFound.home);
	}

	const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
	expect(violations.map((v) => v.id)).toEqual([]);
});

for (const { path, t } of pages) {
	test(`${path}: JSON-LD de pessoa, com cargo no idioma e os perfis`, async ({ page }) => {
		await page.goto(path);
		const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
		expect(json['@type']).toBe('Person');
		expect(json.name).toBe(profile.name);
		expect(json.jobTitle).toBe(t.meta.jobTitle);
		expect(json.url).toMatch(new RegExp(`${path}$`));
		expect(json.sameAs).toEqual([profile.linkedin, profile.github]);
	});
}
