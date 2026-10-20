import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
import { pages } from './content';

/**
 * Contraste WCAG AA (axe, regra color-contrast) em cada idioma. Roda nos dois projetos, então
 * confere o tema escuro e o claro. A Fase 4 amplia para todas as regras do axe.
 */
const contrast = (page: import('@playwright/test').Page, include?: string) => {
	const builder = new AxeBuilder({ page }).withRules(['color-contrast']);
	return (include ? builder.include(include) : builder).analyze();
};

const summary = (violations: Awaited<ReturnType<typeof contrast>>['violations']) =>
	violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(' ')}: ${n.any[0]?.message ?? v.help}`));

// O axe é pesado: com os testes em paralelo, cada análise leva alguns segundos
test.slow();

for (const { path } of pages) {
	test(`${path}: contraste da página`, async ({ page }) => {
		await page.goto(path);
		// Todas as experiências abertas, para conferir o conteúdo dos acordeões
		for (const item of await page.locator('#experience details').all()) {
			if (!(await item.evaluate((d: HTMLDetailsElement) => d.open))) await item.locator('summary').click();
		}
		expect(summary((await contrast(page)).violations)).toEqual([]);
	});

	test(`${path}: contraste dos modais e do seletor de idioma`, async ({ page }) => {
		await page.goto(path);
		for (const id of [
			await page.locator('#experience [data-dialog-open]').first().getAttribute('data-dialog-open'),
			await page.locator('#projects [data-dialog-open]').first().getAttribute('data-dialog-open'),
		]) {
			await page.locator(`[data-dialog-open="${id}"]`).evaluate((button: HTMLButtonElement) => button.click());
			await expect(page.locator(`#${id}`)).toHaveAttribute('open');
			expect(summary((await contrast(page, `#${id}`)).violations), id!).toEqual([]);
			await page.keyboard.press('Escape');
		}

		await page.locator('.lang-toggle').click();
		expect(summary((await contrast(page, '.lang-list')).violations)).toEqual([]);
	});
}
