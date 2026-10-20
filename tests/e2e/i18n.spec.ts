import { test, expect, clickOutside } from './fixtures';
import { locales, pages } from './content';

for (const { path, lang, locale, t } of pages) {
	test(`${path}: idioma, título, textos e estrutura`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('html')).toHaveAttribute('lang', lang);
		await expect(page).toHaveTitle(t.meta.title);
		await expect(page.locator('h1')).toHaveCount(1);
		await expect(page.locator('#experience .section-label')).toContainText(t.experience.label, { ignoreCase: true });
		await expect(page.locator('body')).toContainText(`– ${t.period.present}`, { ignoreCase: true });

		// SEO: canonical da própria página e uma versão alternativa por idioma, mais o x-default
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
		for (const other of pages) {
			await expect(page.locator(`link[rel="alternate"][hreflang="${other.lang}"]`)).toHaveAttribute('href', new RegExp(`${other.path}$`));
		}
		await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);

		// Seletor: botão mostra o código do idioma e a lista marca o atual
		await expect(page.locator('.lang-toggle')).toHaveAccessibleName(new RegExp(`^${locale.toUpperCase()}`));
		await expect(page.locator('.lang-list a[aria-current="page"]')).toHaveAttribute('lang', lang);

		const anchorsWithoutTarget = await page.evaluate(() =>
			[...document.querySelectorAll('a[href^="#"]')]
				.map((a) => a.getAttribute('href')!.slice(1))
				.filter((id) => !document.getElementById(id)),
		);
		expect(anchorsWithoutTarget, 'âncoras sem destino').toEqual([]);

		const ids = await page.evaluate(() => [...document.querySelectorAll('[id]')].map((el) => el.id));
		expect(ids.filter((id, i) => ids.indexOf(id) !== i), 'ids repetidos').toEqual([]);
	});
}

test.describe('seletor de idioma', () => {
	test('abre, fecha com Esc, clique fora e foco saindo, e troca de página', async ({ page }) => {
		await page.goto('/');
		const toggle = page.locator('.lang-toggle');
		const list = page.locator('.lang-list');
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(list).toBeHidden();

		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		await expect(list).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(list).toBeHidden();
		await expect(toggle).toBeFocused();

		await toggle.click();
		await clickOutside(page, page.locator('[data-language-switcher]'));
		await expect(list).toBeHidden();

		await toggle.focus();
		await page.keyboard.press('Enter');
		await page.keyboard.press('Tab');
		await expect(list.locator('a').first()).toBeFocused();
		for (let i = 0; i < locales.length; i++) await page.keyboard.press('Tab');
		await expect(list).toBeHidden();

		await toggle.click();
		await list.locator('a[hreflang="es"]').click();
		await expect(page).toHaveURL(/\/es\/$/);
	});

	test.describe('celular', () => {
		test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

		test('fica visível sem abrir o menu e vem depois dos links no Tab', async ({ page }) => {
			const en = pages.find((p) => p.locale === 'en')!;
			await page.goto(en.path);
			await expect(page.locator('.lang-toggle')).toBeVisible();

			const menu = page.locator('.menu-toggle');
			await menu.click();
			await expect(menu).toHaveAccessibleName(en.t.a11y.closeMenu);
			await menu.focus();

			const linkCount = await page.locator('#site-nav a').count();
			const order: string[] = [];
			for (let i = 0; i <= linkCount; i++) {
				await page.keyboard.press('Tab');
				order.push(
					await page.evaluate(() =>
						document.activeElement?.closest('#site-nav') ? 'nav' : (document.activeElement?.className ?? '?'),
					),
				);
			}
			expect(order.slice(0, linkCount)).toEqual(Array(linkCount).fill('nav'));
			expect(order[linkCount]).toContain('lang-toggle');
		});
	});
});
