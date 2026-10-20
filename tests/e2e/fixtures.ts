import { test as base, expect, type Locator, type Page } from '@playwright/test';

/** `page` que reprova o teste se aparecer erro no console ou exceção de script. */
export const test = base.extend({
	page: async ({ page }, use) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error') errors.push(message.text());
		});
		page.on('pageerror', (error) => errors.push(error.message));
		await use(page);
		expect(errors, 'erros no console ou de script').toEqual([]);
	},
});

export { expect };

/** Quantos pixels a página passa da largura da janela (0 = sem rolagem horizontal). */
export const horizontalOverflow = (page: Page) =>
	page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/**
 * Caixa do elemento depois que ele para de se mexer: a seção que entra na tela anima por 600ms
 * (ver Section.astro), e uma leitura no meio do caminho erraria o ponto.
 */
export async function stableBox(locator: Locator) {
	let previous = '';
	for (let i = 0; i < 40; i++) {
		const box = await locator.boundingBox();
		const key = JSON.stringify(box);
		if (box && key === previous) return box;
		previous = key;
		await locator.page().waitForTimeout(50);
	}
	throw new Error('elemento não parou de se mexer');
}

/**
 * Clique real do mouse num ponto do elemento (por padrão, o centro). Usado nos cartões com área de
 * clique esticada: quem recebe o clique é o botão, não o elemento clicado.
 */
export async function clickAt(page: Page, locator: Locator, dx?: number, dy?: number) {
	await locator.scrollIntoViewIfNeeded();
	const box = await stableBox(locator);
	await page.mouse.click(box.x + (dx ?? box.width / 2), box.y + (dy ?? box.height / 2));
}

/**
 * Clica num ponto "neutro" da tela: fora de `outside` e longe de links, botões e campos. Um ponto
 * fixo pode cair num link (o "Ver currículo" do hero, por exemplo) e abrir outra aba.
 */
export async function clickOutside(page: Page, outside: Locator) {
	const exclude = await outside.elementHandle();
	const point = await page.evaluate((excluded) => {
		const { innerWidth: width, innerHeight: height } = window;
		for (let y = height - 20; y > 0; y -= 40) {
			for (let x = 20; x < width; x += 40) {
				const el = document.elementFromPoint(x, y);
				if (el && !excluded?.contains(el) && !el.closest('a, button, summary, input, [tabindex], header')) return { x, y };
			}
		}
		return null;
	}, exclude);
	if (!point) throw new Error('nenhum ponto neutro na tela');
	await page.mouse.click(point.x, point.y);
}

/** Elementos focáveis dentro de `root`, ignorando os que estão dentro de modais. */
export const focusableCount = (root: Locator) =>
	root.evaluate((el) => [...el.querySelectorAll('a, button, [tabindex]')].filter((e) => !e.closest('dialog')).length);

/** Valor calculado de uma propriedade CSS. */
export const css = (locator: Locator, property: string) =>
	locator.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property);

/** Texto literal dentro de uma RegExp. */
export const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Nome acessível "Rótulo: complemento" (o complemento vem num span só para leitores de tela). */
export const labelled = (label: string, rest: string) => `${label}: ${rest}`;
