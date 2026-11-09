/**
 * Ferramentas compartilhadas pelos testes. Todo arquivo .spec.ts importa `test` e `expect` daqui,
 * e não direto do '@playwright/test', para ganhar a checagem de erros abaixo.
 *
 * Conceitos do Playwright que aparecem nos testes:
 *   - `page`: uma aba do navegador. page.goto('/') abre a página; page.keyboard.press('Tab') aperta Tab.
 *   - "locator": uma forma de encontrar elementos, como page.locator('.menu-toggle'). Ele não guarda
 *     o elemento; procura de novo a cada uso, então continua válido se a página mudar.
 *   - `expect(locator).toBeVisible()` e parecidos esperam sozinhos (até 5 s) a condição ficar
 *     verdadeira. Por isso quase não há "espere 1 segundo" nos testes: o expect já espera.
 *   - `await`: quase tudo no Playwright é assíncrono (conversa com o navegador), então cada passo
 *     precisa de await para acontecer na ordem certa.
 */
import { test as base, expect, type Locator, type Page } from '@playwright/test';

/**
 * `page` que reprova o teste se aparecer erro no console ou exceção de script.
 * "Fixture" é algo que o Playwright prepara antes do teste e entrega pronto (como `page`). Aqui,
 * estendemos a `page` padrão: antes do teste, começamos a anotar os erros; `use(page)` roda o teste;
 * depois dele, conferimos que a lista ficou vazia. Assim, nenhum teste precisa lembrar de checar isso.
 */
export const test = base.extend({
	page: async ({ page }, use) => {
		const errors: { text: string; url: string }[] = [];
		// Documentos (páginas) que responderam 404: a página 404 responde assim de propósito
		const notFound = new Set<string>();
		page.on('response', (response) => {
			if (response.request().isNavigationRequest() && response.status() === 404) notFound.add(response.url());
		});
		page.on('console', (message) => {
			if (message.type() === 'error') errors.push({ text: message.text(), url: message.location().url });
		});
		page.on('pageerror', (error) => errors.push({ text: error.message, url: '' }));
		await use(page);
		// O navegador anota o 404 do próprio documento como erro. Só esse caso é ignorado; um recurso
		// faltando (imagem, script) reprova. A conferência fica para o fim porque o WebKit anota o erro
		// antes de a navegação terminar.
		const real = errors.filter(({ text, url }) => !(text.includes('status of 404') && notFound.has(url))).map(({ text }) => text);
		expect(real, 'erros no console ou de script').toEqual([]);
	},
});

export { expect };

/**
 * No Safari, por padrão, o Tab passa só por botões e campos e pula os links (no Mac, quem navega pelo
 * teclado liga "Pressionar Tab para realçar cada item" nos ajustes ou usa Option+Tab). O WebKit do
 * Playwright faz o mesmo, e lá o Option+Tab não existe. Os testes que andam por links com Tab rodam
 * no Chromium e no Firefox: a ordem do Tab vem do HTML, que é o mesmo nos três.
 * Uso: test.skip(tabSkipsLinks(browserName), 'Safari: o Tab pula links').
 */
export const tabSkipsLinks = (browserName: string) => browserName === 'webkit';

/** No Safari, clicar num botão não o foca (só o teclado foca). */
export const clickFocusesButtons = (browserName: string) => browserName !== 'webkit';

/**
 * Celular nos testes de layout: tela de 390x844 com toque, num test.use(phone). isMobile (que faz o
 * navegador tratar a página como no celular) não existe no Firefox, que recusa a opção; lá fica só a
 * tela e o toque. A função recebe o navegador do projeto e devolve o valor da opção.
 */
export const phone = {
	viewport: { width: 390, height: 844 },
	hasTouch: true,
	isMobile: async ({ browserName }: { browserName: string }, use: (value: boolean) => Promise<void>) =>
		use(browserName !== 'firefox'),
};

/**
 * Permissão para os testes lerem a área de transferência de volta. Só o Chromium tem essa
 * permissão; no Firefox e no WebKit, o teste confere a confirmação na tela.
 */
export const clipboard = {
	permissions: async ({ browserName }: { browserName: string }, use: (value: string[]) => Promise<void>) =>
		use(browserName === 'chromium' ? ['clipboard-read', 'clipboard-write'] : []),
};

/**
 * Quantos pixels a página passa da largura da janela (0 = sem rolagem horizontal).
 * page.evaluate roda a função dentro do navegador e devolve o resultado para o teste: é a ponte
 * entre o código do teste (no Node) e o `document` da página.
 */
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
	const point = await neutralPoint(page, outside);
	await page.mouse.click(point.x, point.y);
}

/** Como clickOutside, mas tocando na tela, como no celular. */
export async function tapOutside(page: Page, outside: Locator) {
	const point = await neutralPoint(page, outside);
	await page.touchscreen.tap(point.x, point.y);
}

async function neutralPoint(page: Page, outside: Locator) {
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
	return point;
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
