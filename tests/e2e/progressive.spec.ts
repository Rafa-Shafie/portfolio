/**
 * Melhoria progressiva: o site funciona primeiro com HTML e CSS, e o JavaScript só melhora.
 *
 * Sem JavaScript (javaScriptEnabled: false), nada quebra e todo o conteúdo fica à vista: as abas
 * viram blocos empilhados, os filtros somem e todos os projetos aparecem. Por isso os botões que
 * dependem de JS nascem com `hidden` no HTML, e o script é quem mostra.
 *
 * Com menos movimento (reducedMotion: 'reduce', a preferência do sistema operacional), nada se
 * mexe no hover e as animações param. É uma necessidade real para quem sente enjoo com movimento.
 */
import { test, expect, css } from './fixtures';
import { projects } from './content';
test.describe('sem JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('habilidades viram blocos empilhados', async ({ page }) => {
		await expect(page.locator('[role="tablist"]')).toBeHidden();
		await expect(page.locator('#skills .panel:visible')).toHaveCount(await page.locator('#skills .panel').count());
		await expect(page.locator('[role="tabpanel"]')).toHaveCount(0);
	});

	test('filtros somem e todos os projetos aparecem', async ({ page }) => {
		await expect(page.locator('[data-project-filters]')).toBeHidden();
		await expect(page.locator('#projects .card:visible')).toHaveCount(projects.length);
	});

	test('botões de modal ficam ocultos, e o painel das experiências continua visível', async ({ page }) => {
		await expect(page.locator('[data-dialog-open]:visible')).toHaveCount(0);
		await expect(page.locator('#experience .outcome').first()).toBeVisible();
	});

	test('o cartão de e-mail é o link mailto (o menu de opções só existe com JS)', async ({ page }) => {
		await expect(page.locator('[data-email-link]')).toBeVisible();
		await expect(page.locator('[data-email-toggle]')).toBeHidden();
		await expect(page.locator('button[data-copy]')).toBeHidden();
	});
});

test.describe('com menos movimento', () => {
	test.use({ reducedMotion: 'reduce' });

	test('cartões e painéis não se movem no hover, e a ilustração não anima', async ({ page }) => {
		await page.goto('/');
		const card = page.locator('#projects .card').first();
		await card.hover();
		await page.waitForTimeout(300);
		expect(await css(card, 'transform')).toBe('none');
		expect(await css(page.locator('#projects .flow').first(), 'animation-name')).toBe('none');

		const outcome = page.locator('#experience .outcome').first();
		await outcome.hover();
		await page.waitForTimeout(300);
		expect(await css(outcome, 'transform')).toBe('none');
	});
});
