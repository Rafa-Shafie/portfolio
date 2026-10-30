/**
 * Contato e currículo.
 *
 * - E-mail: o cartão abre um menu com quatro caminhos (copiar, app de e-mail, Gmail e Outlook), e a
 *   pessoa escolhe. Para copiar, o teste dá ao navegador permissão de usar a área de transferência
 *   (`permissions`), clica, lê o que foi copiado e confere a confirmação, que também é anunciada ao
 *   leitor de tela por uma região role="status". O menu segue o padrão "disclosure": aria-expanded,
 *   Esc, setas e clique fora.
 * - Foco visível sobre o bloco de destaque: o anel de foco precisa de 3:1 de contraste contra o
 *   fundo (WCAG 1.4.11). Calculamos o contraste em vez de comparar com uma cor fixa, então o teste
 *   vale para os dois temas.
 * - CV: abre numa aba nova, no visualizador de PDF do navegador, sem forçar download.
 */
import AxeBuilder from '@axe-core/playwright';
import { test, expect, css, escape } from './fixtures';
import { pages, profile } from './content';

const { t } = pages[0];

/**
 * Razão de contraste WCAG entre duas cores `rgb(...)`, pela fórmula oficial: a luminância relativa
 * de cada cor (o quanto ela parece clara ao olho, com mais peso para o verde) e depois
 * (mais clara + 0,05) / (mais escura + 0,05). Vai de 1:1 (iguais) a 21:1 (preto no branco).
 */
function contrast(a: string, b: string) {
	const luminance = (color: string) => {
		const [r, g, b] = color.match(/\d+(\.\d+)?/g)!.slice(0, 3).map((v) => {
			const c = Number(v) / 255;
			return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
}

test.describe('contato', () => {
	test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('o cartão de e-mail abre um menu com os quatro caminhos, cada um no destino certo', async ({ page }) => {
		const toggle = page.locator('[data-email-toggle]');
		const menu = page.locator('#email-options');
		await expect(page.locator('[data-email-link]')).toBeHidden();
		await expect(toggle).toHaveAccessibleName(new RegExp(`${escape(t.contact.email)}.*${escape(profile.email)}`));
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(menu).toBeHidden();

		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		await expect(menu).toBeVisible();
		const o = t.contact.emailOptions;
		await expect(menu.locator('.option-title')).toHaveText([o.copy, o.app, o.gmail, o.outlook]);

		// App de e-mail: o mailto: de sempre. Gmail e Outlook: tela de novo e-mail, em nova aba
		const to = encodeURIComponent(profile.email);
		await expect(menu.getByRole('link', { name: new RegExp(escape(o.app)) })).toHaveAttribute('href', `mailto:${profile.email}`);
		for (const [name, href] of [
			[o.gmail, `https://mail.google.com/mail/?view=cm&fs=1&to=${to}`],
			[o.outlook, `https://outlook.live.com/mail/0/deeplink/compose?to=${to}`],
		]) {
			const link = menu.getByRole('link', { name: new RegExp(escape(name)) });
			await expect(link).toHaveAttribute('href', href);
			await expect(link).toHaveAttribute('target', '_blank');
			await expect(link).toHaveAttribute('rel', /noopener/);
		}

		// O menu não fica cortado pela lista de cartões: o centro da última opção é a própria opção
		const last = menu.locator('.option').last();
		const box = (await last.boundingBox())!;
		const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('.option') !== null, {
			x: box.x + box.width / 2,
			y: box.y + box.height / 2,
		});
		expect(hit, 'última opção visível e clicável').toBe(true);

		// Clique fora fecha
		await page.locator('#contact .section-title').click();
		await expect(menu).toBeHidden();
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	});

	test('copiar: copia o endereço, fecha o menu e anuncia a confirmação', async ({ page }) => {
		await page.locator('[data-email-toggle]').click();
		await page.locator('#email-options [data-copy]').click();
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);
		await expect(page.locator('#email-options')).toBeHidden();
		await expect(page.locator('[data-email-toggle]')).toBeFocused();
		await expect(page.locator('[data-copy-hint]')).toHaveText(t.contact.copied);
		await expect(page.locator('[data-copy-status]')).toHaveText(t.contact.copied);
		// Depois de alguns segundos, o cartão volta a mostrar o endereço
		await expect(page.locator('[data-copy-hint]')).toHaveText(profile.email, { timeout: 5000 });
	});

	test('teclado: abre na primeira opção, setas navegam, Esc fecha e devolve o foco', async ({ page }) => {
		const toggle = page.locator('[data-email-toggle]');
		const options = page.locator('#email-options .option');
		await toggle.focus();
		await page.keyboard.press('Enter');
		await expect(options.first()).toBeFocused();
		await page.keyboard.press('ArrowDown');
		await expect(options.nth(1)).toBeFocused();
		await page.keyboard.press('ArrowUp');
		await page.keyboard.press('ArrowUp');
		await expect(options.last()).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(page.locator('#email-options')).toBeHidden();
		await expect(toggle).toBeFocused();
	});

	test.describe('sem a animação de entrada', () => {
		// Com a animação, o clique traz a seção para a tela e o axe pode medir o contraste com ela ainda
		// meio transparente (como em a11y.spec.ts)
		test.use({ reducedMotion: 'reduce' });

		test('menu aberto sem violações do axe', async ({ page }) => {
			await page.locator('[data-email-toggle]').click();
			const { violations } = await new AxeBuilder({ page })
				.include('#contact')
				.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
		});
	});

	test('cartões com a mesma altura e foco visível sobre o fundo de destaque', async ({ page }) => {
		const heights = await page
			.locator('#contact .card-link:visible')
			.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
		expect(heights).toHaveLength(4); // e-mail, LinkedIn, GitHub e CV
		expect(new Set(heights).size).toBe(1);

		const background = await css(page.locator('#contact'), 'background-color');
		const button = page.locator('[data-email-toggle]');
		await button.focus();
		// WCAG 1.4.11: o anel de foco precisa de 3:1 contra o fundo
		expect(contrast(await css(button, 'outline-color'), background)).toBeGreaterThanOrEqual(3);
	});

	test('bloco de contato de borda a borda, com o rodapé no mesmo fundo', async ({ page }) => {
		const contact = page.locator('#contact');
		expect((await contact.boundingBox())!.width).toBe(page.viewportSize()!.width);
		expect(await css(page.locator('.site-footer'), 'background-color')).toBe(await css(contact, 'background-color'));
	});
});

for (const { path, locale, t } of pages) {
	test(`${path}: o CV do idioma abre em nova aba, sem download`, async ({ page, context }) => {
		await page.goto(path);
		const links = page.locator(`a[href="${profile.cv[locale]}"]`);
		await expect(links).toHaveCount(2); // hero e contato
		await expect(page.locator('a[href^="/cv/"][download]')).toHaveCount(0);

		const hero = links.first();
		await expect(hero).toHaveAccessibleName(new RegExp(`^${escape(t.hero.ctaCv)} PDF · .*${escape(t.a11y.newTab)}$`));
		await expect(hero).toHaveAttribute('target', '_blank');
		await expect(hero).toHaveAttribute('rel', 'noopener');

		// O clique abre uma aba nova que pede o PDF (no visualizador do navegador); a página continua onde estava
		let downloaded = false;
		page.on('download', () => (downloaded = true));
		const [popup, request] = await Promise.all([
			context.waitForEvent('page'),
			context.waitForEvent('request', (r) => r.url().endsWith(profile.cv[locale])),
			hero.click(),
		]);
		expect(request.frame().page()).toBe(popup);
		expect(new URL(page.url()).pathname).toBe(path);
		expect(downloaded).toBe(false);
		await popup.close();

		const response = await page.request.get(profile.cv[locale]);
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toContain('application/pdf');
	});
}
