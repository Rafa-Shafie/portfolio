import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
import { pages } from './content';

/**
 * Axe com todas as regras WCAG 2.2 A e AA, em cada idioma. Roda nos dois projetos, então confere o
 * tema escuro e o claro. Com menos movimento, nenhuma seção fica transparente esperando a animação
 * de entrada (o axe pularia o que está com opacity 0).
 */
test.use({ reducedMotion: 'reduce' });

// O axe é pesado: com os testes em paralelo, cada análise leva alguns segundos
test.slow();

const wcag = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function violations(page: import('@playwright/test').Page, include?: string) {
	const builder = new AxeBuilder({ page }).withTags(wcag);
	const { violations } = await (include ? builder.include(include) : builder).analyze();
	return violations.flatMap((v) => v.nodes.map((n) => `[${v.id}] ${n.target.join(' ')}: ${n.failureSummary ?? v.help}`));
}

for (const { path } of pages) {
	test(`${path}: página inteira, com os acordeões abertos`, async ({ page }) => {
		await page.goto(path);
		for (const item of await page.locator('#experience details').all()) {
			if (!(await item.evaluate((d: HTMLDetailsElement) => d.open))) await item.locator('summary').click();
		}
		expect(await violations(page)).toEqual([]);
	});

	test(`${path}: modais e seletor de idioma abertos`, async ({ page }) => {
		await page.goto(path);
		for (const id of [
			await page.locator('#experience [data-dialog-open]').first().getAttribute('data-dialog-open'),
			await page.locator('#projects [data-dialog-open]').first().getAttribute('data-dialog-open'),
		]) {
			await page.locator(`[data-dialog-open="${id}"]`).evaluate((button: HTMLButtonElement) => button.click());
			await expect(page.locator(`#${id}`)).toHaveAttribute('open');
			expect(await violations(page, `#${id}`), id!).toEqual([]);
			await page.keyboard.press('Escape');
		}

		await page.locator('.lang-toggle').click();
		expect(await violations(page, '.site-header')).toEqual([]);
	});

	test.describe('celular', () => {
		test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

		test(`${path}: menu aberto`, async ({ page }) => {
			await page.goto(path);
			await page.locator('.menu-toggle').click();
			await expect(page.locator('#site-nav')).toBeVisible();
			expect(await violations(page, '.site-header')).toEqual([]);
		});
	});
}
