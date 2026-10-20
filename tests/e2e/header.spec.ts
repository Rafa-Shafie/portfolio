import { test, expect, clickOutside } from './fixtures';
import { pages } from './content';

const { t } = pages[0];

test.describe('desktop', () => {
	test('menu em linha, sem o botão do celular', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('.menu-toggle')).toBeHidden();
		await expect(page.locator('#site-nav a').first()).toBeVisible();
	});

	test('o primeiro Tab foca o skip link, que aparece na tela', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const skip = page.locator('.skip-link');
		await expect(skip).toBeFocused();
		await expect(skip).toHaveText(t.a11y.skipToContent);
		await expect(skip).toBeInViewport();
	});
});

test.describe('celular', () => {
	test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

	test('menu pelo teclado: abre, entra nos links, Esc fecha e devolve o foco', async ({ page }) => {
		await page.goto('/');
		const toggle = page.locator('.menu-toggle');
		const nav = page.locator('#site-nav');
		await expect(toggle).toBeVisible();
		await expect(nav).toBeHidden();

		// skip link → marca → botão do menu
		for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
		await expect(toggle).toBeFocused();
		await expect(toggle).toHaveAccessibleName(t.a11y.openMenu);

		await page.keyboard.press('Enter');
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		await expect(nav).toBeVisible();
		await expect(toggle).toHaveAccessibleName(t.a11y.closeMenu);

		await page.keyboard.press('Tab');
		await expect(nav.locator('a').first()).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(nav).toBeHidden();
		await expect(toggle).toBeFocused();
	});

	test('escolher uma seção fecha o menu, e o título não fica sob o header', async ({ page }) => {
		await page.goto('/');
		const toggle = page.locator('.menu-toggle');
		await toggle.click();
		await page.locator('#site-nav a[href="#experience"]').click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');

		// Espera a rolagem terminar (duas leituras iguais seguidas)
		const title = page.locator('#experience-title');
		const top = () => title.evaluate((el) => Math.round(el.getBoundingClientRect().top));
		let previous = Number.NaN;
		await expect
			.poll(async () => {
				const current = await top();
				const settled = current === previous;
				previous = current;
				return settled;
			})
			.toBe(true);
		const header = await page.locator('.site-header').boundingBox();
		expect(await top()).toBeGreaterThanOrEqual(header!.height);
	});

	test('clicar fora fecha o menu', async ({ page }) => {
		await page.goto('/');
		const toggle = page.locator('.menu-toggle');
		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		await clickOutside(page, page.locator('#site-nav'));
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	});
});
