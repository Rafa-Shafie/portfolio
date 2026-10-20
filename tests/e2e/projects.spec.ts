/**
 * Projetos: os filtros por área, os cartões e os modais de detalhe.
 *
 * - Filtros: botões com aria-pressed (o leitor de tela anuncia "pressionado"). A contagem fica
 *   numa região role="status", que é lida em voz alta sozinha quando o texto muda.
 * - Cartões: o mesmo padrão do painel das experiências, um botão só, com a área de clique no cartão
 *   inteiro. Envolver o cartão num <button> faria o leitor de tela ler o cartão todo como nome do botão.
 * - As expectativas vêm dos YAML (ver content.ts): quais projetos existem e em quais áreas.
 */
import { test, expect, clickAt, css, focusableCount, labelled } from './fixtures';
import { pages, projects, projectsIn, term } from './content';

const { t } = pages[0];
// Áreas que têm pelo menos um projeto (principal ou alsoIn): cada uma vira um botão de filtro
const areas = [...new Set(projects.flatMap((p) => [p.category, ...(p.alsoIn ?? [])]))];
const sorted = (list: string[]) => [...list].sort((a, b) => a.localeCompare(b));

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('todos os projetos publicados aparecem, com a seção no menu', async ({ page }) => {
	await expect(page.locator('#site-nav a[href="#projects"]')).toHaveCount(1);
	await expect(page.locator('#projects .card')).toHaveCount(projects.length);
	await expect(page.locator('#projects .draft')).toHaveCount(0);
});

test('filtros: um por área, marcados com aria-pressed e com a contagem anunciada', async ({ page }) => {
	const filters = page.locator('[data-project-filters]');
	await expect(filters).toBeVisible();
	await expect(filters.locator('[data-filter]')).toHaveCount(areas.length + 1);

	for (const area of areas) {
		await filters.locator(`[data-filter="${area}"]`).click();
		const expected = projectsIn(area);
		const titles = await page.locator('#projects .card:visible .card-title').allTextContents();
		expect(sorted(titles.map((s) => s.trim())), `filtro ${area}`).toEqual(sorted(expected.map((p) => p.title.pt)));
		await expect(filters.locator('[aria-pressed="true"]')).toHaveCount(1);
		await expect(filters.locator(`[data-filter="${area}"]`)).toHaveAttribute('aria-pressed', 'true');
		await expect(page.locator('[data-project-count]')).toHaveText(`${expected.length} ${t.projects.count}`);
	}

	await filters.locator('[data-filter="all"]').click();
	await expect(page.locator('#projects .card:visible')).toHaveCount(projects.length);
});

test('cada cartão: um só botão, clicável por inteiro, e o foco volta ao fechar', async ({ page }) => {
	for (const project of projects.filter((p) => p.details && !p.details.draft)) {
		const card = page.locator('#projects .card').filter({ has: page.getByRole('heading', { name: project.title.pt, exact: true }) });
		const button = card.locator('.more');
		const dialog = page.locator(`#project-${project.slug}`);

		expect(await focusableCount(card), `${project.slug}: uma parada de Tab`).toBe(1);
		await expect(button).toHaveAccessibleName(labelled(t.projects.readMore, project.title.pt));

		await clickAt(page, card.locator('.card-title'));
		await expect(dialog).toHaveAttribute('open');
		await page.keyboard.press('Escape');
		await expect(button).toBeFocused();

		await clickAt(page, card.locator('.art'), 30, 60);
		await expect(dialog).toHaveAttribute('open');
		await page.keyboard.press('Escape');
		await expect(button).toBeFocused();
	}
});

test('repositórios abrem em nova aba, com rel seguro', async ({ page }) => {
	for (const project of projects.filter((p) => p.repo)) {
		const link = page.locator(`#project-${project.slug} a[href="${project.repo}"]`);
		await expect(link).toHaveCount(1);
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', /noopener/);
	}
});

test('teclado: o anel de foco envolve o cartão', async ({ page }) => {
	await page.locator('#projects .filter').last().focus();
	await page.keyboard.press('Tab');
	await expect(page.locator('#projects .card').first().locator('.more')).toBeFocused();
	expect(await css(page.locator('#projects .card').first(), 'outline-style')).toBe('solid');
});

test('hover levanta o cartão; a animação da ilustração fica parada fora do hover', async ({ page }) => {
	const card = page.locator('#projects .card').nth(1);
	await card.hover();
	await expect.poll(() => css(card, 'transform')).not.toBe('none');
	expect(await css(page.locator('#projects .card .flow').first(), 'opacity')).toBe('0');
});

for (const { path, locale } of pages) {
	test(`${path}: etiquetas de tecnologia no idioma da página`, async ({ page }) => {
		await page.goto(path);
		for (const project of projects) {
			const card = page.locator('#projects .card').filter({ has: page.getByRole('heading', { name: project.title[locale], exact: true }) });
			const tags = (await card.locator('.stack li').allTextContents()).map((s) => s.trim());
			expect(tags, project.slug).toEqual(project.stack.map((value) => term(value, locale)));
		}
	});

	// O cartão mostra só as 5 principais; no modal, a lista completa fica nas tecnologias em detalhe,
	// sem o bloco de etiquetas soltas (seria a repetição das 5 do cartão)
	test(`${path}: modal com as tecnologias em detalhe, sem repetir as etiquetas do cartão`, async ({ page }) => {
		await page.goto(path);
		for (const project of projects.filter((p) => p.details && p.techDetails?.length)) {
			const dialog = page.locator(`#project-${project.slug}`);
			await expect(dialog.locator('.groups'), project.slug).toHaveCount(1);
			await expect(dialog.locator('.tags'), project.slug).toHaveCount(0);
		}
	});

	// O schema exige `stage` em projetos não concluídos; aqui conferimos que ele chega ao cartão e
	// ao modal, para que ninguém leia o objetivo do produto como funcionalidade pronta
	test(`${path}: estágio atual no cartão e no modal dos projetos em andamento`, async ({ page }) => {
		await page.goto(path);
		for (const project of projects) {
			const card = page.locator('#projects .card').filter({ has: page.getByRole('heading', { name: project.title[locale], exact: true }) });
			if (!project.stage) {
				await expect(card.locator('.stage'), project.slug).toHaveCount(0);
				continue;
			}
			await expect(card.locator('.stage'), project.slug).toHaveText(project.stage[locale]);
			await expect(page.locator(`#project-${project.slug} .meta`), project.slug).toHaveText(project.stage[locale]);
		}
	});
}
