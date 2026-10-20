import { test, expect, clickAt, css, focusableCount, labelled } from './fixtures';
import { exploredExperiences, pages } from './content';

const { t } = pages[0];

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('"Explorar" em cada experiência com detalhes, com nome que diz qual é', async ({ page }) => {
	// A mais recente começa aberta, com o painel "Entrega & aprendizado" à vista
	await expect(page.locator('#experience details').first()).toHaveAttribute('open', '');
	await expect(page.locator('#experience .outcome').first()).toBeVisible();

	// Conteúdo de acordeão fechado não tem nome acessível: abre todos antes de conferir
	for (const item of await page.locator('#experience details').all()) {
		if (!(await item.evaluate((d: HTMLDetailsElement) => d.open))) await item.locator('summary').click();
	}
	await expect(page.locator('#experience [data-dialog-open]')).toHaveCount(exploredExperiences.length);
	for (const { slug, company, role } of exploredExperiences) {
		await expect(page.locator(`[data-dialog-open="experience-${slug}"]`)).toHaveAccessibleName(
			labelled(t.experience.explore, `${company}, ${role.pt}`),
		);
	}
});

test('modal: abre, prende o foco, trava a rolagem e fecha por Esc, fundo e botão', async ({ page }) => {
	const button = page.locator('#experience [data-dialog-open]').first();
	const dialog = page.locator(`#${await button.getAttribute('data-dialog-open')}`);

	await button.click();
	expect(await dialog.evaluate((d: HTMLDialogElement) => d.open && d.matches(':modal'))).toBe(true);
	const labelledBy = await dialog.getAttribute('aria-labelledby');
	await expect(page.locator(`#${labelledBy}`)).toHaveCount(1);
	expect(await css(page.locator('body'), 'overflow')).toBe('hidden');

	for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
	expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);

	await page.keyboard.press('Escape');
	await expect(dialog).not.toHaveAttribute('open');
	await expect(button).toBeFocused();

	await button.click();
	await page.mouse.click(15, 450);
	await expect(dialog).not.toHaveAttribute('open');

	await button.click();
	await dialog.locator('[data-dialog-close]').click();
	await expect(dialog).not.toHaveAttribute('open');
	expect(await css(page.locator('body'), 'overflow')).not.toBe('hidden');
});

test('painel "Entrega & aprendizado" clicável por inteiro; destaques e tecnologias não', async ({ page }) => {
	const items = page.locator('#experience details');
	const anyOpen = page.locator('dialog[open]');

	for (let i = 0; i < (await items.count()); i++) {
		const item = items.nth(i);
		if (!(await item.evaluate((d: HTMLDetailsElement) => d.open))) await item.locator('summary').click();
		const button = item.locator('.explore');
		const dialog = page.locator(`#${await button.getAttribute('data-dialog-open')}`);

		expect(await focusableCount(item.locator('.outcome')), 'uma parada de Tab no painel').toBe(1);

		await clickAt(page, item.locator('.outcome-text'));
		await expect(dialog).toHaveAttribute('open');
		await page.keyboard.press('Escape');
		await expect(button).toBeFocused();

		await clickAt(page, item.locator('.outcome'), 12, 12);
		await expect(dialog).toHaveAttribute('open');
		await page.keyboard.press('Escape');
		await expect(button).toBeFocused();

		await clickAt(page, item.locator('.highlights li').first());
		await expect(anyOpen).toHaveCount(0);
		await clickAt(page, item.locator('.stack li').first());
		await expect(anyOpen).toHaveCount(0);
	}
});

test('o cabeçalho continua sendo o acordeão, sem abrir modal', async ({ page }) => {
	const first = page.locator('#experience details').first();
	await first.locator('summary .company').click();
	await expect(first).not.toHaveAttribute('open');
	await expect(page.locator('dialog[open]')).toHaveCount(0);
});

test('teclado: Tab chega ao "Explorar", o anel envolve o painel e Enter abre', async ({ page }) => {
	const first = page.locator('#experience details').first();
	await first.locator('summary').focus();
	await page.keyboard.press('Tab');
	await expect(first.locator('.explore')).toBeFocused();
	expect(await css(first.locator('.outcome'), 'outline-style')).toBe('solid');
	await page.keyboard.press('Enter');
	await expect(page.locator('dialog[open]')).toHaveCount(1);
});

test('hover levanta só o painel, não os destaques', async ({ page }) => {
	const first = page.locator('#experience details').first();
	const outcome = first.locator('.outcome');
	await first.locator('.highlights').scrollIntoViewIfNeeded();

	const highlights = (await first.locator('.highlights').boundingBox())!;
	await page.mouse.move(highlights.x + 40, highlights.y + 10);
	await page.waitForTimeout(400);
	expect(await css(outcome, 'transform')).toBe('none');

	const box = (await outcome.boundingBox())!;
	await page.mouse.move(box.x + 30, box.y + 30);
	await expect.poll(() => css(outcome, 'transform')).not.toBe('none');
});

test('desktop: painel à direita do texto', async ({ page }) => {
	const first = page.locator('#experience details').first();
	const outcome = (await first.locator('.outcome').boundingBox())!;
	const content = (await first.locator('.content').boundingBox())!;
	expect(outcome.x).toBeGreaterThan(content.x + content.width - 1);
});

test.describe('celular', () => {
	test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

	test('painel abaixo do texto, e tocar nele abre o modal', async ({ page }) => {
		const first = page.locator('#experience details').first();
		const outcome = first.locator('.outcome');
		await outcome.scrollIntoViewIfNeeded();
		const box = (await outcome.boundingBox())!;
		const content = (await first.locator('.content').boundingBox())!;
		expect(box.y).toBeGreaterThanOrEqual(content.y + content.height - 1);

		await page.touchscreen.tap(box.x + box.width / 2, box.y + 20);
		await expect(page.locator('dialog[open]')).toHaveCount(1);
	});
});
