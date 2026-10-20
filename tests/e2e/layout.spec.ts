import { test, expect, horizontalOverflow } from './fixtures';
import { pages } from './content';

// Larguras de celular a desktop, incluindo as duas pontas do breakpoint do menu (60rem = 960px)
const widths = [320, 360, 390, 768, 959, 960, 1024, 1440];

for (const { path } of pages) {
	for (const width of widths) {
		test(`${path}: sem rolagem horizontal em ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 800 });
			await page.goto(path);
			expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
		});
	}

	// WCAG 1.4.4: texto a 200% continua cabendo sem rolagem horizontal
	test(`${path}: texto a 200% sem rolagem horizontal (640px)`, async ({ page }) => {
		await page.setViewportSize({ width: 640, height: 800 });
		await page.goto(path);
		await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
		expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
	});
}
