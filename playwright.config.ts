/**
 * Configuração do Playwright: o executor dos testes de ponta a ponta (e2e) de tests/e2e/.
 *
 * "Ponta a ponta" quer dizer testar o site como um visitante usa: um navegador de verdade abre a
 * página, clica, aperta Tab e confere o resultado. Não testamos funções isoladas, e sim o HTML, o
 * CSS e o JavaScript juntos, já no build de produção.
 *
 * Os testes rodam sobre o dist/ (o mesmo que vai para a Vercel), servido pelo `astro preview`.
 * O build vem antes: `npm run test:e2e` faz os dois; no CI, o passo de build já gerou o dist/.
 */
import { defineConfig, devices } from '@playwright/test';

const port = 4173;
// O GitHub Actions define CI=true. Algumas opções mudam entre o CI e a sua máquina.
const ci = !!process.env.CI;

/*
 * O site tem que funcionar igual em qualquer aparelho. Todo navegador roda sobre um de três motores,
 * e a suíte testa os três:
 *   - Chromium: Chrome, Edge, Samsung Internet, Opera e quase todo Android;
 *   - WebKit: Safari no Mac e todos os navegadores do iPhone e do iPad (até o Chrome do iPhone);
 *   - Firefox (Gecko).
 *
 * Desktop: a suíte inteira nos três motores, numa janela de 1280x900. Os testes de celular dentro
 * dela trocam a janela com test.use().
 * Toque: touch.spec.ts usa cada controle tocando, como no celular, em iPhone, Android e iPad.
 */
const desktop = { viewport: { width: 1280, height: 900 } };
// channel "chromium": o Chromium completo no modo headless novo, com visualizador de PDF
// (o headless shell padrão baixaria o CV em vez de abri-lo, e o teste do CV falharia).
const chrome = { ...devices['Desktop Chrome'], ...desktop, channel: 'chromium' };
const touch = /touch\.spec\.ts/;

export default defineConfig({
	testDir: 'tests/e2e',
	// Cada teste roda num navegador isolado, em paralelo com os outros: mais rápido, e um teste não
	// depende do estado que outro deixou.
	fullyParallel: true,
	// Um `test.only` esquecido rodaria só aquele teste e esconderia o resto. No CI, isso é erro.
	forbidOnly: ci,
	// No CI, um teste que falhar ganha uma segunda chance. Se passar na segunda, o relatório o marca
	// como "flaky" (instável), para investigar depois sem travar o PR.
	retries: ci ? 1 : 0,
	// Formato do resultado: no CI, anotações nas linhas do PR ('github') e o relatório HTML;
	// localmente, uma linha por teste no terminal ('list') e o mesmo relatório HTML.
	reporter: ci ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
	use: {
		// page.goto('/en/') vira http://localhost:4173/en/
		baseURL: `http://localhost:${port}`,
		// Quando um teste falha, guarda um "trace": um passo a passo com DOM, rede e screenshots, para
		// abrir com `npx playwright show-trace` e ver exatamente o que aconteceu.
		trace: 'retain-on-failure',
	},
	// "Projetos" são a mesma suíte rodando com configurações diferentes.
	// - Chromium duas vezes, com o sistema em tema escuro e em tema claro: assim todo teste (inclusive
	//   o de contraste) vale para os dois. theme.spec.ts escolhe o tema dentro de cada teste, então
	//   roda uma vez só.
	// - Firefox e WebKit (Safari) uma vez cada, um em cada tema.
	// - Celular e tablet: só o teste de toque, nos aparelhos do Playwright (tela, escala, toque e user
	//   agent de cada um).
	projects: [
		{ name: 'dark', use: { ...chrome, colorScheme: 'dark' }, testIgnore: touch },
		{ name: 'light', use: { ...chrome, colorScheme: 'light' }, testIgnore: [/theme\.spec\.ts/, touch] },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'], ...desktop, colorScheme: 'dark' }, testIgnore: touch },
		// O WebKit do Playwright é o mais lento dos três: os testes que abrem modal por modal levam o dobro
		// do tempo e, com a máquina cheia, passavam do limite padrão de 30 s
		{ name: 'webkit', use: { ...devices['Desktop Safari'], ...desktop, colorScheme: 'light' }, testIgnore: touch, timeout: 60_000 },
		{ name: 'iphone', use: devices['iPhone 13'], testMatch: touch },
		{ name: 'android', use: devices['Pixel 7'], testMatch: touch },
		{ name: 'ipad', use: devices['iPad (gen 7)'], testMatch: touch },
	],
	// O Playwright sobe o servidor antes dos testes e derruba no fim. Localmente, se você já estiver
	// rodando `npm run preview` na porta 4173, ele reaproveita esse servidor em vez de subir outro.
	webServer: {
		command: `npx astro preview --port ${port}`,
		url: `http://localhost:${port}/`,
		reuseExistingServer: !ci,
	},
});
