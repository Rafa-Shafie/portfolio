/**
 * Toque: cada controle do site usado como no celular e no tablet, tocando (tap) em vez de clicar.
 *
 * Roda nos projetos iphone, android e ipad (playwright.config.ts): o iPhone e o iPad usam o WebKit,
 * o mesmo motor de todos os navegadores do iOS, e o Android usa o Chromium. É aqui que aparecem as
 * diferenças que o desktop não mostra. Exemplo real: no Safari, tocar num botão não o foca, e o menu
 * de e-mail fechava antes de o toque chegar à opção; no Chrome, o mesmo código funcionava.
 */
import { test, expect, clipboard, horizontalOverflow, tapOutside } from './fixtures';
import { pages, profile } from './content';

const { t } = pages[0];

test.describe('toque', () => {
	test.use(clipboard);

	test('nenhuma página rola para os lados', async ({ page }) => {
		for (const { path } of pages) {
			await page.goto(path);
			expect(await horizontalOverflow(page), path).toBe(0);
		}
	});

	test('header: o botão do menu fica na ponta direita; tocar abre, navega e fecha', async ({ page }) => {
		await page.goto('/');
		const toggle = page.locator('.menu-toggle');
		const nav = page.locator('#site-nav');

		// O ☰ é o último controle do header, à direita do idioma e do tema
		const right = async (selector: string) => {
			const box = (await page.locator(selector).boundingBox())!;
			return box.x + box.width;
		};
		expect(await right('.menu-toggle')).toBeGreaterThan(await right('.theme-toggle'));
		expect(await right('.theme-toggle')).toBeGreaterThan(await right('.lang-toggle'));

		await toggle.tap();
		await expect(nav).toBeVisible();
		await nav.locator('a[href="#skills"]').tap();
		await expect(nav).toBeHidden();
		await expect(page).toHaveURL(/#skills$/);

		// Tocar fora também fecha
		await toggle.tap();
		await expect(nav).toBeVisible();
		await tapOutside(page, nav);
		await expect(nav).toBeHidden();
	});

	test('idioma e tema', async ({ page }) => {
		await page.goto('/');
		const before = await page.evaluate(() => document.documentElement.dataset.theme);
		await page.locator('.theme-toggle').tap();
		expect(await page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(before);

		await page.locator('.lang-toggle').tap();
		await page.locator('.lang-list a[hreflang="en"]').tap();
		await expect(page).toHaveURL(/\/en\/$/);
	});

	test('habilidades: o esmaecido avisa que há mais abas, e a aba tocada fica inteira à vista', async ({ page }) => {
		await page.goto('/');
		const tablist = page.locator('#skills [role="tablist"]');
		const tabs = tablist.getByRole('tab');
		await tablist.scrollIntoViewIfNeeded();

		const overflows = await tablist.evaluate((el) => el.scrollWidth > el.clientWidth);
		// Com abas escondidas à direita, só a borda direita esmaece; sem elas, nenhuma
		if (!overflows) {
			await expect(tablist).not.toHaveAttribute('data-fade-end');
			return;
		}
		await expect(tablist).toHaveAttribute('data-fade-end', '');
		await expect(tablist).not.toHaveAttribute('data-fade-start');

		const fullyVisible = (index: number) =>
			tabs.nth(index).evaluate((tab) => {
				const list = tab.parentElement!.getBoundingClientRect();
				const box = tab.getBoundingClientRect();
				return box.left >= list.left - 1 && box.right <= list.right + 1;
			});

		for (let i = 1; i < (await tabs.count()); i++) {
			await tabs.nth(i).tap();
			await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');
			await expect.poll(() => fullyVisible(i)).toBe(true);
		}
		// Na última aba, o esmaecido passa para a esquerda
		await expect(tablist).toHaveAttribute('data-fade-start', '');
		await expect(tablist).not.toHaveAttribute('data-fade-end');
	});

	test('projetos: filtro', async ({ page }) => {
		await page.goto('/');
		const filter = page.locator('[data-filter]').nth(1);
		await filter.scrollIntoViewIfNeeded();
		await filter.tap();
		await expect(filter).toHaveAttribute('aria-pressed', 'true');
	});

	for (const section of ['projects', 'experience', 'education']) {
		test(`modal (${section}): abre e fecha pelo toque, sem deixar o cartão levantado`, async ({ page }) => {
			await page.goto('/');
			const opener = page.locator(`#${section} [data-dialog-open]:visible`).first();
			await opener.scrollIntoViewIfNeeded();
			await opener.tap();
			const dialog = page.locator('dialog[open]');
			await expect(dialog).toBeVisible();

			// A caixa cabe na largura da tela
			const box = (await dialog.boundingBox())!;
			expect(box.x).toBeGreaterThanOrEqual(0);
			expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);

			await dialog.locator('[data-dialog-close]').first().tap();
			await expect(dialog).toHaveCount(0);
			// O efeito de passar o mouse não gruda no cartão depois do toque
			const card = opener.locator('xpath=ancestor::*[contains(@class, "card") or contains(@class, "outcome")][1]');
			if (await card.count()) await expect.poll(() => card.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
		});
	}

	test.describe('e-mail', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.locator('[data-email-toggle]').scrollIntoViewIfNeeded();
		});

		test('copiar: o toque chega à opção e o endereço é copiado', async ({ page, browserName }) => {
			await page.locator('[data-email-toggle]').tap();
			await page.locator('#email-options [data-copy]').tap();
			await expect(page.locator('[data-copy-hint]')).toHaveText(t.contact.copied);
			await expect(page.locator('#email-options')).toBeHidden();
			if (browserName === 'chromium') expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);
		});

		// O teste anota o link que recebeu o toque e cancela a navegação (o app de e-mail ou uma aba nova)
		for (const [name, selector] of [
			['app de e-mail', 'a[href^="mailto:"]'],
			['Gmail', 'a[href*="mail.google.com"]'],
			['Outlook', 'a[href*="outlook.live.com"]'],
		]) {
			test(`${name}: o toque chega ao link`, async ({ page }) => {
				await page.evaluate(() => {
					document.addEventListener(
						'click',
						(event) => {
							const link = (event.target as Element).closest<HTMLAnchorElement>('#email-options a');
							if (!link) return;
							event.preventDefault();
							document.documentElement.dataset.tapped = link.href;
						},
						true,
					);
				});
				await page.locator('[data-email-toggle]').tap();
				const link = page.locator(`#email-options ${selector}`);
				const href = (await link.getAttribute('href'))!;
				await link.tap();
				await expect(page.locator('html')).toHaveAttribute('data-tapped', href);
				await expect(page.locator('#email-options')).toBeHidden();
			});
		}

		test('tocar fora fecha o menu', async ({ page }) => {
			await page.locator('[data-email-toggle]').tap();
			await expect(page.locator('#email-options')).toBeVisible();
			// No rodapé, longe dos cartões: no WebKit do Playwright, um toque perto deles às vezes gera o
			// clique num cartão, o que não acontece no iPhone de verdade
			await page.locator('.site-footer p').tap();
			await expect(page.locator('#email-options')).toBeHidden();
		});
	});
});
