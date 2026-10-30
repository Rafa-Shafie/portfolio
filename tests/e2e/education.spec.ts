/**
 * "Ver detalhes" das formações (hoje, PUC-Rio e o bootcamp DIO · Itaú).
 *
 * O botão abre o mesmo modal das experiências e projetos, no mesmo formato: abertura, seções,
 * tecnologias por frente e, quando há, os comprovantes. Os PDFs e a página de autenticação abrem em nova aba; o código de autenticação tem
 * um botão de copiar. Como no cartão de e-mail, o teste dá permissão à área de transferência, clica,
 * lê o que foi copiado e confere o anúncio da região role="status".
 */
import { test, expect, escape } from './fixtures';
import { pages } from './content';

const { t } = pages[0];

test.describe('detalhes da formação', () => {
	test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

	test('o modal mostra o que estudei e os comprovantes, com o código para copiar', async ({ page }) => {
		await page.goto('/');
		const button = page.locator('#education [data-dialog-open="education-puc-rio"]');
		const dialog = page.locator('#education-puc-rio');

		await expect(button).toHaveAccessibleName(new RegExp(`^${escape(t.education.more)}: `));
		await button.click();
		await expect(dialog).toHaveAttribute('open');
		await expect(page).toHaveURL(/#education-puc-rio$/);
		await expect(dialog.getByRole('heading', { name: t.education.tech })).toBeVisible();
		await expect(dialog.getByRole('heading', { name: t.education.proofs })).toBeVisible();

		const links = dialog.getByRole('link');
		await expect(links).toHaveCount(3);
		for (const link of await links.all()) {
			await expect(link).toHaveAttribute('target', '_blank');
			await expect(link).toHaveAccessibleName(new RegExp(escape(t.a11y.newTab)));
		}
		await expect(links.nth(0)).toHaveAttribute('href', '/education/puc-rio-certificate.pdf');
		await expect(links.nth(2)).toHaveAccessibleName(new RegExp(`^${escape(t.education.verify)}`));

		const copy = dialog.getByRole('button', { name: t.education.copyCode });
		const code = (await dialog.locator('.verify-code code').textContent())!;
		await copy.click();
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(code);
		await expect(dialog.getByRole('status')).toHaveText(t.education.codeCopied);
		await expect(copy).toHaveAttribute('data-copied', '');

		// Fechar devolve o foco ao botão de origem
		await page.keyboard.press('Escape');
		await expect(dialog).not.toHaveAttribute('open');
		await expect(button).toBeFocused();
	});

	test('formação com detalhes e sem comprovantes: o modal abre sem o bloco de comprovantes', async ({ page }) => {
		await page.goto('/');
		await page.locator('#education [data-dialog-open="education-dio-itau"]').click();
		const dialog = page.locator('#education-dio-itau');
		await expect(dialog).toHaveAttribute('open');
		await expect(dialog.getByRole('heading', { name: t.education.tech })).toBeVisible();
		await expect(dialog.getByRole('heading', { name: t.education.proofs })).toHaveCount(0);
	});

	test('formações sem detalhes nem comprovantes não ganham botão', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#education li.item', { hasText: 'Estácio' }).locator('[data-dialog-open]')).toHaveCount(0);
	});
});
