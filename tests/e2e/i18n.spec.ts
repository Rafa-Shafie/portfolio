/**
 * Idiomas: as três rotas (/, /en/ e /es/), o seletor de idioma e a troca mantendo o lugar.
 *
 * - O `for` no topo gera um teste por idioma: o mesmo roteiro roda em /, /en/ e /es/, cada um com o
 *   seu dicionário. Se faltar uma tradução ou uma tag, o teste daquele idioma é que falha.
 * - SEO: `lang` certo no <html> (o leitor de tela escolhe a pronúncia por ele), title, canonical e
 *   hreflang (diz ao Google que as três páginas são a mesma em idiomas diferentes).
 * - "toda âncora tem destino" e "ids únicos" pegam links quebrados como o do site antigo, que
 *   levava a uma seção comentada.
 */
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

test.describe('trocar de idioma mantém o lugar', () => {
	/** Seção no topo da tela (logo abaixo do header) e a altura dentro dela, de 0 a 1. */
	const position = (page: import('@playwright/test').Page) =>
		page.evaluate(() => {
			const line = document.querySelector('.site-header')!.getBoundingClientRect().bottom;
			const current = [...document.querySelectorAll<HTMLElement>('main > section[id]:not(#top)')]
				.filter((section) => section.getBoundingClientRect().top <= line + 1)
				.at(-1);
			if (!current) return null;
			const box = current.getBoundingClientRect();
			return { id: current.id, progress: (line - box.top) / box.height };
		});

	test('no meio de uma seção, a página nova abre na mesma seção e na mesma altura', async ({ page }) => {
		await page.goto('/');
		// Com as fontes carregadas, o layout para de mudar (antes disso, a mesma rolagem cai em outro ponto)
		await page.evaluate(() => document.fonts.ready);
		await page.evaluate(() => {
			const projects = document.getElementById('projects')!;
			scrollTo({ top: projects.offsetTop + projects.offsetHeight * 0.4, behavior: 'instant' });
		});
		await page.locator('.lang-toggle').click();
		const before = await position(page);
		expect(before?.id).toBe('projects');

		await page.locator('.lang-list a[hreflang="en"]').click();
		await expect(page).toHaveURL(/\/en\/$/);

		await expect.poll(async () => (await position(page))?.id).toBe('projects');
		const after = await position(page);
		expect(Math.abs(after!.progress - before!.progress)).toBeLessThan(0.02);

		// Nada do que está na tela fica esperando a animação de entrada
		const pendingOnScreen = await page.evaluate(() =>
			[...document.querySelectorAll('.reveal-pending')].filter((el) => {
				const box = el.getBoundingClientRect();
				return box.top < innerHeight && box.bottom > 0;
			}).length,
		);
		expect(pendingOnScreen).toBe(0);
	});

	test('no topo, a página nova abre no topo', async ({ page }) => {
		await page.goto('/');
		await page.locator('.lang-toggle').click();
		await page.locator('.lang-list a[hreflang="es"]').click();
		await expect(page).toHaveURL(/\/es\/$/);
		expect(await page.evaluate(() => scrollY)).toBe(0);
	});
});
