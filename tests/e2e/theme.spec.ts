import { test, expect, css } from './fixtures';
import { pages } from './content';

const { t } = pages[0];

// Fundo de cada tema (--color-bg em tokens.css)
const background = { light: 'rgb(248, 250, 252)', dark: 'rgb(11, 17, 23)' } as const;
type Theme = keyof typeof background;

const toggle = (page: import('@playwright/test').Page) => page.locator('[data-theme-toggle]');
const themeColor = (page: import('@playwright/test').Page) =>
	page.locator('meta[name="theme-color"]').getAttribute('content');

for (const theme of ['light', 'dark'] as const) {
	test.describe(`sistema no tema ${theme === 'light' ? 'claro' : 'escuro'}`, () => {
		test.use({ colorScheme: theme });

		test('sem escolha salva, segue o sistema', async ({ page }) => {
			await page.goto('/');
			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
			expect(await css(page.locator('body'), 'background-color')).toBe(background[theme]);
			await expect(toggle(page)).toBeVisible();
			await expect(toggle(page)).toHaveAccessibleName(theme === 'dark' ? t.a11y.themeToLight : t.a11y.themeToDark);
		});
	});
}

test.describe('alternador', () => {
	test.use({ colorScheme: 'dark' });

	test('troca o tema, salva a escolha e ela vale ao recarregar', async ({ page }) => {
		await page.goto('/');
		await toggle(page).click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		expect(await css(page.locator('body'), 'background-color')).toBe(background.light);
		await expect(toggle(page)).toHaveAccessibleName(t.a11y.themeToDark);
		await expect(toggle(page)).toBeFocused();
		expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
		expect(await themeColor(page)).toBe(background.light);

		// A escolha vale mais que o sistema (escuro) e também nas outras rotas
		await page.goto('/en/');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		await expect(toggle(page)).toHaveAccessibleName(pages[1].t.a11y.themeToDark);

		await toggle(page).click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
	});

	test('a escolha salva é aplicada antes de a página aparecer (sem flash)', async ({ page }) => {
		// Antes de qualquer script da página: salva "claro" e anota o tema no instante em que o <body> nasce
		await page.addInitScript(() => {
			localStorage.setItem('theme', 'light');
			new MutationObserver((_, observer) => {
				if (!document.body) return;
				(window as unknown as { themeAtBody?: string }).themeAtBody = document.documentElement.dataset.theme;
				observer.disconnect();
			}).observe(document, { childList: true, subtree: true });
		});
		await page.goto('/');
		expect(await page.evaluate(() => (window as unknown as { themeAtBody?: string }).themeAtBody)).toBe('light');
		expect(await themeColor(page)).toBe('#f8fafc');
	});

	test('sem escolha salva, acompanha a troca do sistema; com escolha, não', async ({ page }) => {
		await page.goto('/');
		await page.emulateMedia({ colorScheme: 'light' });
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		expect(await themeColor(page)).toBe(background.light);

		await toggle(page).click(); // escolhe o escuro
		await page.emulateMedia({ colorScheme: 'light' });
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.emulateMedia({ colorScheme: 'light' });
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	});

	test('com o armazenamento bloqueado, funciona sem salvar', async ({ page }) => {
		await page.addInitScript(() => {
			Object.defineProperty(window, 'localStorage', {
				get() {
					throw new DOMException('bloqueado', 'SecurityError');
				},
			});
		});
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		await toggle(page).click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	});
});

test.describe('sem JavaScript', () => {
	for (const theme of ['light', 'dark'] satisfies Theme[]) {
		test(`segue o sistema (${theme}) e esconde o alternador`, async ({ browser }) => {
			const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: theme });
			const page = await context.newPage();
			await page.goto('/');
			expect(await css(page.locator('body'), 'background-color')).toBe(background[theme]);
			await expect(toggle(page)).toBeHidden();
			await context.close();
		});
	}
});
