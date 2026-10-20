import { test, expect } from './fixtures';
import { pages, skillGroups } from './content';

const { t } = pages[0];

// Padrão de abas do W3C/APG: setas, Home/End, ativação automática e roving tabindex
test('abas pelo mouse e pelo teclado', async ({ page }) => {
	await page.goto('/');
	const tabs = page.getByRole('tab');
	const last = skillGroups.length - 1;
	const selected = (i: number) => expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');

	await expect(page.getByRole('tablist')).toBeVisible();
	await expect(tabs).toHaveText(skillGroups.map((g) => t.skills.groups[g.id]));
	await expect(page.locator('.panel:not([hidden])')).toHaveCount(1);
	await selected(0);
	await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);

	await tabs.nth(2).click();
	await selected(2);
	await expect(page.locator(`#skill-panel-${skillGroups[2].id}`)).toBeVisible();

	await page.keyboard.press('ArrowRight');
	await selected(3);
	await expect(tabs.nth(3)).toBeFocused();
	await page.keyboard.press('End');
	await selected(last);
	await page.keyboard.press('ArrowRight');
	await selected(0);
	await page.keyboard.press('ArrowLeft');
	await selected(last);
	await page.keyboard.press('Home');
	await selected(0);
	await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);

	// Tab sai da lista e entra no painel ativo, rotulado pela aba
	await page.keyboard.press('Tab');
	const panel = page.locator(`#skill-panel-${skillGroups[0].id}`);
	await expect(panel).toBeFocused();
	await expect(panel).toHaveRole('tabpanel');
	await expect(panel).toHaveAttribute('aria-labelledby', `skill-tab-${skillGroups[0].id}`);
});
