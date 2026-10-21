/**
 * Modais de detalhe: link direto, links entre experiência e projeto e o resumo no topo.
 *
 * - Link direto: o endereço acompanha o modal aberto (…/#project-atlas) com history.replaceState,
 *   que troca o endereço sem criar entrada no histórico. Por isso o teste confere history.length:
 *   abrir e fechar um modal não pode encher o botão Voltar.
 * - Links entre modais: cada projeto aponta para a experiência em que foi feito (campo
 *   `experience` no YAML). O link fecha um modal e abre o outro; ao fechar o segundo, o foco volta ao
 *   botão de onde a pessoa partiu, para ela não perder o lugar na página.
 * - As expectativas vêm dos YAML (ver content.ts): quais projetos têm experiência e resumo.
 */
import { test, expect } from './fixtures';
import { experiences, pages, projects } from './content';

const linked = projects.filter((p) => p.details && p.experience);
const card = (slug: string) => `#projects .card:has(#project-${slug}) .more`;

test('abrir um modal põe o #id no endereço; fechar tira, sem criar histórico', async ({ page }) => {
	await page.goto('/');
	const before = await page.evaluate(() => history.length);
	const [project] = projects.filter((p) => p.details);

	await page.locator(card(project.slug)).click();
	await expect(page.locator(`#project-${project.slug}`)).toHaveAttribute('open');
	await expect(page).toHaveURL(new RegExp(`#project-${project.slug}$`));

	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/\/$/);
	expect(await page.evaluate(() => history.length)).toBe(before);
});

for (const { path } of pages) {
	test(`${path}: entrar por um link com #id abre o modal, e o foco volta ao cartão`, async ({ page }) => {
		const [project] = projects.filter((p) => p.details);
		await page.goto(`${path}#project-${project.slug}`);
		await expect(page.locator(`#project-${project.slug}`)).toHaveAttribute('open');
		await page.keyboard.press('Escape');
		await expect(page.locator(card(project.slug))).toBeFocused();
	});
}

test('do projeto para a experiência, e o foco volta ao cartão de origem', async ({ page }) => {
	await page.goto('/');
	for (const project of linked) {
		await page.locator(card(project.slug)).click();
		await page.locator(`#project-${project.slug} a[data-dialog-link]`).click();

		const experience = page.locator(`#experience-${project.experience}`);
		await expect(experience).toHaveAttribute('open');
		await expect(page.locator(`#project-${project.slug}`)).not.toHaveAttribute('open');
		await expect(page).toHaveURL(new RegExp(`#experience-${project.experience}$`));

		await page.keyboard.press('Escape');
		await expect(page.locator(card(project.slug))).toBeFocused();
		await expect(page).toHaveURL(/\/$/);
	}
});

test('da experiência para cada um dos seus projetos', async ({ page }) => {
	for (const slug of new Set(linked.map((p) => p.experience!))) {
		const own = linked.filter((p) => p.experience === slug);
		await page.goto(`/#experience-${slug}`);
		const links = page.locator(`#experience-${slug} a[data-dialog-link]`);
		await expect(links).toHaveCount(own.length);

		await links.first().click();
		await expect(page.locator(`#experience-${slug}`)).not.toHaveAttribute('open');
		await expect(page.locator('dialog.detail-dialog[open]')).toHaveCount(1);
		await page.keyboard.press('Escape');
	}
});

for (const { path, locale, t } of pages) {
	test(`${path}: links entre modais nos dois sentidos, com o nome do destino`, async ({ page }) => {
		await page.goto(path);
		for (const project of linked) {
			const experience = experiences.find((e) => e.slug === project.experience)!;
			await expect(page.locator(`#project-${project.slug} a[data-dialog-link]`)).toHaveText(
				`${experience.role[locale]} · ${experience.company}`,
			);
			await expect(
				page.locator(`#experience-${project.experience} a[href="#project-${project.slug}"]`),
			).toHaveText(project.title[locale]);
		}
	});

	test(`${path}: resumo no topo dos modais que o têm, com os quatro itens`, async ({ page }) => {
		await page.goto(path);
		for (const project of projects.filter((p) => p.details)) {
			const items = page.locator(`#project-${project.slug} .summary-item dt`);
			if (!project.details!.summary) {
				await expect(items, project.slug).toHaveCount(0);
				continue;
			}
			await expect(items, project.slug).toHaveText([t.dialog.problem, t.dialog.role, t.dialog.delivery, t.dialog.result]);
			await expect(page.locator(`#project-${project.slug} .summary-item dd`).first()).toHaveText(
				project.details!.summary.problem[locale],
			);
		}
	});
}

// Diagramas: o YAML diz em qual seção cada um entra; o dicionário dá os passos de cada idioma
const diagramKey = { 'atlas-flow': 'atlas', 'manhattan-pipeline': 'manhattan', 'modeling-method': 'modeling' } as const;
const withDiagram = projects.flatMap((p) =>
	(p.details?.sections ?? []).flatMap((s) => (s.diagram ? [{ slug: p.slug, name: s.diagram as keyof typeof diagramKey }] : [])),
);

for (const { path, t } of pages) {
	test(`${path}: diagramas nos modais certos, com os passos do idioma`, async ({ page }) => {
		await page.goto(path);
		expect(withDiagram.length, 'há diagramas nos YAML').toBeGreaterThan(0);
		await expect(page.locator('.detail-dialog .diagram')).toHaveCount(withDiagram.length);
		for (const { slug, name } of withDiagram) {
			const diagram = t.diagrams[diagramKey[name]];
			await expect(page.locator(`#project-${slug} .diagram .step-title`), slug).toHaveText(diagram.steps.map((s) => s.title));
			await expect(page.locator(`#project-${slug} .diagram figcaption`), slug).toContainText(t.diagrams.label);
		}
	});
}

test('diagramas cabem no modal em 320px, sem rolagem horizontal', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 800 });
	for (const { slug } of withDiagram) {
		await page.goto(`/#project-${slug}`);
		const dialog = page.locator(`#project-${slug}`);
		await expect(dialog).toHaveAttribute('open');
		const overflow = await dialog.evaluate((el) => el.scrollWidth - el.clientWidth);
		expect(overflow, slug).toBeLessThanOrEqual(0);
	}
});
