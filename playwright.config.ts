import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const ci = !!process.env.CI;

// channel "chromium": o Chromium completo no modo headless novo, com visualizador de PDF
// (o headless shell padrão baixaria o CV em vez de abri-lo)
const browser = { ...devices['Desktop Chrome'], channel: 'chromium', viewport: { width: 1280, height: 900 } };

/**
 * Testes de ponta a ponta sobre o build de produção (dist/), servido pelo `astro preview`.
 * O build vem antes: `npm run test:e2e` faz os dois; no CI, o passo de build já gerou o dist/.
 */
export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: ci,
	retries: ci ? 1 : 0,
	reporter: ci ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: `http://localhost:${port}`,
		trace: 'retain-on-failure',
	},
	// A suíte inteira roda nos dois temas, pela preferência do sistema. theme.spec.ts escolhe o tema
	// em cada teste, então roda uma vez só.
	projects: [
		{ name: 'dark', use: { ...browser, colorScheme: 'dark' } },
		{ name: 'light', use: { ...browser, colorScheme: 'light' }, testIgnore: /theme\.spec\.ts/ },
	],
	webServer: {
		command: `npx astro preview --port ${port}`,
		url: `http://localhost:${port}/`,
		reuseExistingServer: !ci,
	},
});
