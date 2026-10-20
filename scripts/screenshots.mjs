/**
 * Prints do README: o topo da página em desktop e celular, nos dois temas, a partir do build.
 * Rodar de novo quando o visual mudar (ex.: a foto profissional).
 *
 * Uso: npm run build && npm run screenshots
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

// Porta própria, para não colidir com os testes (4173) nem com o Lighthouse (4174)
const port = 4175;
const base = `http://localhost:${port}`;
const outDir = 'docs/screenshots';
// Tamanhos de tela. No celular, deviceScaleFactor 2 imita uma tela "retina": a imagem sai com o
// dobro de pixels e fica nítida no README. isMobile e hasTouch fazem o site se comportar como num celular.
const views = {
	desktop: { viewport: { width: 1280, height: 800 } },
	mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(port)], {
	stdio: 'ignore',
});
const browser = await chromium.launch();
mkdirSync(outDir, { recursive: true });

try {
	for (let i = 0; ; i++) {
		try {
			if ((await fetch(base)).ok) break;
		} catch {}
		if (i === 60) throw new Error(`astro preview não respondeu em ${base}`);
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	for (const theme of ['dark', 'light']) {
		for (const [name, options] of Object.entries(views)) {
			// Um "contexto" é como uma janela anônima nova. colorScheme escolhe o tema pela preferência do
			// sistema; reducedMotion evita capturar uma seção no meio da animação de entrada.
			const context = await browser.newContext({ ...options, colorScheme: theme, reducedMotion: 'reduce' });
			const page = await context.newPage();
			await page.goto(base + '/');
			// Espera a Poppins carregar, senão o print sairia com a fonte do sistema
			await page.evaluate(() => document.fonts.ready);
			const path = `${outDir}/${name}-${theme}.jpg`;
			await page.screenshot({ path, type: 'jpeg', quality: 85 });
			console.log(path);
			await context.close();
		}
	}
} finally {
	await browser.close();
	server.kill();
}
