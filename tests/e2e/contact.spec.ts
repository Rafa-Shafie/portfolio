import { test, expect, css, escape } from './fixtures';
import { pages, profile } from './content';

const { t } = pages[0];

/** Razão de contraste WCAG entre duas cores `rgb(...)`. */
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

	test('o cartão de e-mail copia o endereço e anuncia a confirmação', async ({ page }) => {
		const button = page.locator('button[data-copy]');
		await expect(button).toBeVisible();
		await expect(page.locator('[data-email-link]')).toBeHidden();
		const [action, address] = [escape(t.contact.copyEmail), escape(profile.email)];
		await expect(button).toHaveAccessibleName(new RegExp(`${action}.*${address}|${address}.*${action}`));

		await button.click();
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);
		await expect(page.locator('[data-copy-hint]')).toHaveText(t.contact.copied);
		await expect(page.locator('[data-copy-status]')).toHaveText(t.contact.copied);
		// Depois de alguns segundos, o cartão volta a mostrar o endereço
		await expect(page.locator('[data-copy-hint]')).toHaveText(profile.email, { timeout: 5000 });
	});

	test('cartões com a mesma altura e foco visível sobre o fundo de destaque', async ({ page }) => {
		const heights = await page
			.locator('#contact .card-link:visible')
			.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
		expect(heights).toHaveLength(4); // e-mail, LinkedIn, GitHub e CV
		expect(new Set(heights).size).toBe(1);

		const background = await css(page.locator('#contact'), 'background-color');
		const button = page.locator('button[data-copy]');
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
