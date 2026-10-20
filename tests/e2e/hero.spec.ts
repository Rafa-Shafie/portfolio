/**
 * Hero: a primeira tela, que precisa mostrar logo a entrega mais forte e o próximo passo.
 *
 * - A linha "Último trabalho" é a prova da introdução ("do levantamento de requisitos até a
 *   produção"). O rótulo fica numa linha própria no visual, mas o leitor de tela ouve a frase
 *   inteira, com os dois-pontos escondidos: toHaveText compara o texto como ele é lido.
 * - Hierarquia das ações: "Ver projetos" é o botão principal e o currículo, o secundário. O
 *   contato saiu daqui, mas continua no menu e na seção final.
 */
import { test, expect } from './fixtures';
import { pages } from './content';

for (const { path, t } of pages) {
	test(`${path}: entrega em destaque e ações na ordem certa`, async ({ page }) => {
		await page.goto(path);
		const hero = page.locator('#top');

		await expect(hero.locator('.highlight')).toHaveText(`${t.hero.highlightLabel}: ${t.hero.highlight}`);

		const actions = hero.locator('.actions .button');
		await expect(actions).toHaveCount(2);
		await expect(actions.first()).toHaveClass(/button-primary/);
		await expect(actions.first()).toHaveAttribute('href', '#projects');
		await expect(actions.first()).toHaveText(t.hero.ctaProjects);
		await expect(actions.last()).toHaveClass(/button-secondary/);
		await expect(actions.last()).toContainText(t.hero.ctaCv);

		// Contato fora do hero, mas ainda a um clique pelo menu
		await expect(hero.locator('a[href="#contact"]')).toHaveCount(0);
		await expect(page.locator('#site-nav a[href="#contact"]')).toHaveCount(1);
	});
}
