/**
 * Lighthouse com nota mínima: mede o build (dist/) nas 3 rotas, em mobile e desktop, e falha se
 * alguma categoria ficar abaixo do mínimo. Roda no CI depois dos testes e2e.
 *
 * Usa o Lighthouse 13.5.0, o mesmo da linha de base em docs/lighthouse/, e o Chromium do
 * Playwright, para não depender do Chrome instalado na máquina.
 *
 * Uso: node scripts/check-lighthouse.mjs [--save <nome>]
 *   Sem opção, os relatórios vão para lighthouse-report/ (fora do Git).
 *   Com --save v1, os relatórios da raiz viram docs/lighthouse/v1-{mobile,desktop}.html.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

// Porta diferente da dos testes (4173): dá para rodar os dois ao mesmo tempo sem conflito
const port = 4174;
const base = `http://localhost:${port}`;
const paths = ['/', '/en/', '/es/'];
// Dois perfis de medição. "mobile" (o padrão do Lighthouse, por isso `undefined`) simula um celular
// mediano com rede 4G lenta e CPU 4x mais lenta: é o mais exigente. "desktop" usa tela grande e rede rápida.
const presets = { mobile: undefined, desktop: desktopConfig };

// Mínimos por categoria (0 a 1). Requisito do projeto: ≥ 90 em tudo; acessibilidade, boas práticas
// e SEO não variam entre execuções, então valem 100.
const minimum = { performance: 0.9, accessibility: 1, 'best-practices': 1, seo: 1 };

const saveIndex = process.argv.indexOf('--save');
const saveName = saveIndex > -1 ? process.argv[saveIndex + 1] : null;
const outDir = saveName ? 'docs/lighthouse' : 'lighthouse-report';
mkdirSync(outDir, { recursive: true });

/**
 * Sobe o `astro preview` e espera ele responder. `spawn` inicia outro processo (o servidor) sem
 * esperar ele terminar; o laço tenta acessar a página a cada meio segundo, por até 30 s.
 */
async function startServer() {
	// process.execPath é o caminho do Node que está rodando este script: funciona igual no Windows e no Linux
	const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(port)], {
		stdio: 'ignore',
	});
	for (let i = 0; i < 60; i++) {
		try {
			if ((await fetch(base)).ok) return server;
		} catch {}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	server.kill();
	throw new Error(`astro preview não respondeu em ${base}`);
}

// O Lighthouse não abre o navegador sozinho: o chrome-launcher abre um Chromium com a porta de
// depuração ligada, e o Lighthouse controla esse navegador por ela (é o mesmo protocolo do DevTools).
// No CI, --no-sandbox é necessário porque a máquina do GitHub não permite o sandbox do Chromium.
const server = await startServer();
const chrome = await chromeLauncher.launch({
	chromePath: chromium.executablePath(),
	chromeFlags: ['--headless=new', ...(process.env.CI ? ['--no-sandbox'] : [])],
});

const rows = [];
const failures = [];
// try/finally: aconteça o que acontecer (até um erro no meio), o navegador e o servidor são fechados,
// senão o processo ficaria pendurado no CI
try {
	for (const path of paths) {
		for (const [preset, config] of Object.entries(presets)) {
			const { lhr, report } = await lighthouse(
				base + path,
				{ port: chrome.port, output: 'html', logLevel: 'error', onlyCategories: Object.keys(minimum) },
				config,
			);
			// `lhr` (Lighthouse Result) tem as notas de 0 a 1; o relatório mostra x100 (0,98 = 98).
			// `report` é o HTML completo, o mesmo que o DevTools mostra.
			const scores = Object.fromEntries(Object.keys(minimum).map((key) => [key, lhr.categories[key].score]));
			rows.push({ path, preset, ...Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, Math.round(v * 100)])) });
			for (const [key, score] of Object.entries(scores)) {
				if (score < minimum[key]) failures.push(`${path} (${preset}) ${key}: ${Math.round(score * 100)} < ${minimum[key] * 100}`);
			}

			const slug = path === '/' ? 'pt' : path.replaceAll('/', '');
			if (!saveName) writeFileSync(join(outDir, `${slug}-${preset}.html`), report);
			else if (path === '/') writeFileSync(join(outDir, `${saveName}-${preset}.html`), report);
		}
	}
} finally {
	await chrome.kill();
	server.kill();
}

// A tabela aparece no log do CI. Saída 1 = falha: deixa o passo vermelho e bloqueia o merge.
console.table(rows);
if (failures.length > 0) {
	console.error(`\nLighthouse abaixo do mínimo:\n  ${failures.join('\n  ')}`);
	process.exit(1);
}
console.log(`\nLighthouse: todas as notas no mínimo ou acima. Relatórios em ${outDir}/.`);
