# Lighthouse — medições

Linha de base do site legado (tag `v0-legado`) e o site novo (v1), medidos com a mesma versão do Lighthouse.

## Resultados

| Relatório | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| [v0-legado-mobile.html](v0-legado-mobile.html) | 75 | 70 | 92 | 91 |
| [v0-legado-desktop.html](v0-legado-desktop.html) | 99 | 70 | 96 | 91 |
| [v1-mobile.html](v1-mobile.html) | **100** | **100** | **100** | **100** |
| [v1-desktop.html](v1-desktop.html) | **100** | **100** | **100** | **100** |

- **v0-legado:** medido em 19/10/2026 com Lighthouse 13.5.0 e Chrome 155 headless, no Windows 11, servindo os arquivos localmente (o site legado nunca foi publicado). A categoria "Agentic Browsing" (nova no Lighthouse 13) também aparece nesses relatórios, mas fica fora da comparação.
- **v1:** medido em 20/10/2026 com Lighthouse 13.5.0 e o Chromium 156 do Playwright (headless), no Windows 11, sobre o build de produção servido pelo `astro preview`. Os relatórios são da raiz (português). Inglês e espanhol também deram 100 nas quatro categorias, em mobile e desktop.

Cada relatório é uma execução única.

## No CI

`npm run lighthouse` ([scripts/check-lighthouse.mjs](../../scripts/check-lighthouse.mjs)) mede as 3 rotas em mobile e desktop a cada push e PR, e falha abaixo do mínimo: 90 em Performance e 100 nas outras três categorias, que não variam entre execuções.

## Como repetir

Requisitos: Node (versão do `.nvmrc`) e Google Chrome instalados. Comandos em PowerShell, a partir da raiz do repositório.

### 1. Separar os arquivos a medir

Site legado, num worktree fora do repositório:

```powershell
git worktree add --detach <pasta-temporaria>\legado v0-legado
$alvo = "<pasta-temporaria>\legado"
```

Site novo: o script do CI já faz tudo (sobe o servidor, mede e salva `docs/lighthouse/<nome>-{mobile,desktop}.html`), então os passos 2 a 4 não são necessários:

```powershell
npm run build
npm run lighthouse -- --save v1
```

### 2. Servir na porta 4173 (deixar rodando em outro terminal)

```powershell
npx --yes serve@14.2.6 $alvo -l 4173 --no-clipboard
```

### 3. Medir mobile e desktop

Para o legado:

```powershell
npx --yes lighthouse@13.5.0 http://localhost:4173 --output=html --output-path=docs/lighthouse/v0-legado-mobile.html --chrome-flags="--headless=new" --quiet
npx --yes lighthouse@13.5.0 http://localhost:4173 --preset=desktop --output=html --output-path=docs/lighthouse/v0-legado-desktop.html --chrome-flags="--headless=new" --quiet
```

### 4. Limpar (só para o legado)

```powershell
git worktree remove <pasta-temporaria>\legado
```

Só os `.html` dos relatórios entram no repositório. As notas ficam dentro de cada relatório e são copiadas para a tabela acima.
