/**
 * Movimento e navegação: a seção ativa no menu e a entrada das seções ao rolar.
 *
 * - Seção ativa: o link da seção que está na tela ganha aria-current="true" (o leitor de tela
 *   anuncia "atual") e um traço visível, porque a cor sozinha não basta (WCAG 1.4.1).
 * - Entrada das seções: um fade curto ao rolar, que só acontece com JavaScript e sem pedido de
 *   menos movimento. O que já está na tela ao carregar não anima, para não atrasar a primeira imagem
 *   da página (o LCP do Lighthouse).
 */
import { test, expect, css } from './fixtures';

// Link do menu marcado como seção atual (deve haver no máximo um)
const current = (page: import('@playwright/test').Page) => page.locator('#site-nav a[aria-current="true"]');

test.describe('seção ativa no menu', () => {
	test('acompanha a rolagem, uma seção por vez', async ({ page }) => {
		await page.goto('/');
		await expect(current(page)).toHaveCount(0); // no topo, o hero não está no menu

		for (const id of ['experience', 'projects', 'skills']) {
			await page.locator(`#${id}-title`).evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
			await expect(current(page)).toHaveAttribute('href', `#${id}`);
			await expect(current(page)).toHaveCount(1);
		}

		// No fim da página vale a última seção, mesmo que ela não chegue à linha de ativação
		await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
		await expect(current(page)).toHaveAttribute('href', '#contact');
	});

	test('clicar num link marca a seção de destino', async ({ page }) => {
		await page.goto('/');
		await page.locator('#site-nav a[href="#education"]').click();
		await expect(current(page)).toHaveAttribute('href', '#education');
		// Marca além da cor: traço sob o link no desktop
		expect(await css(current(page), 'border-bottom-style')).toBe('solid');
	});
});

test.describe('entrada das seções', () => {
	test('o que está fora da tela aparece ao rolar; o topo não anima', async ({ page }) => {
		await page.goto('/');
		const pendingOnScreen = await page.evaluate(() =>
			[...document.querySelectorAll('.reveal-pending')].filter((el) => el.getBoundingClientRect().top < innerHeight).length,
		);
		expect(pendingOnScreen, 'seções visíveis ao carregar não esperam animação').toBe(0);

		const contact = page.locator('#contact > .container');
		await expect(contact).toHaveClass(/reveal-pending/);
		expect(await css(contact, 'opacity')).toBe('0');

		await contact.scrollIntoViewIfNeeded();
		await expect(contact).not.toHaveClass(/reveal-pending/);
		await expect.poll(() => css(contact, 'opacity')).toBe('1');
		await expect.poll(() => css(contact, 'transform')).toBe('none');
	});

	test('chegar por um link com âncora mostra a seção sem esperar', async ({ page }) => {
		await page.goto('/#contact');
		await expect(page.locator('#contact > .container')).not.toHaveClass(/reveal-pending/);
	});

	test.describe('com menos movimento', () => {
		test.use({ reducedMotion: 'reduce' });

		test('nada fica escondido esperando animação', async ({ page }) => {
			await page.goto('/');
			await expect(page.locator('.reveal-pending')).toHaveCount(0);
		});
	});

	test.describe('sem JavaScript', () => {
		test.use({ javaScriptEnabled: false });

		test('todo o conteúdo aparece direto', async ({ page }) => {
			await page.goto('/');
			await expect(page.locator('.reveal-pending')).toHaveCount(0);
			expect(await css(page.locator('#contact > .container'), 'opacity')).toBe('1');
		});
	});
});
