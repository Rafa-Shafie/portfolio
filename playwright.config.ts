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

// Navegador usado por todos os testes: o perfil "Desktop Chrome" do Playwright (user agent, escala
// de tela etc.) com uma janela de 1280x900. Os testes de celular trocam a janela com test.use().
// channel "chromium": o Chromium completo no modo headless novo, com visualizador de PDF
// (o headless shell padrão baixaria o CV em vez de abri-lo, e o teste do CV falharia).
const browser = { ...devices['Desktop Chrome'], channel: 'chromium', viewport: { width: 1280, height: 900 } };

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
	// "Projetos" são a mesma suíte rodando com configurações diferentes. Aqui, uma vez com o sistema
	// em tema escuro e outra em tema claro: assim todo teste (inclusive o de contraste) vale para os dois.
	// theme.spec.ts escolhe o tema dentro de cada teste, então roda uma vez só.
	projects: [
		{ name: 'dark', use: { ...browser, colorScheme: 'dark' } },
		{ name: 'light', use: { ...browser, colorScheme: 'light' }, testIgnore: /theme\.spec\.ts/ },
	],
	// O Playwright sobe o servidor antes dos testes e derruba no fim. Localmente, se você já estiver
	// rodando `npm run preview` na porta 4173, ele reaproveita esse servidor em vez de subir outro.
	webServer: {
		command: `npx astro preview --port ${port}`,
		url: `http://localhost:${port}/`,
		reuseExistingServer: !ci,
	},
});
