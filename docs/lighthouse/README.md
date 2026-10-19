# Lighthouse — medições

Linha de base do site legado (tag `v0-legado`), para comparar com o site novo usando os mesmos comandos.

## Resultados

| Relatório | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| [v0-legado-mobile.html](v0-legado-mobile.html) | 75 | 70 | 92 | 91 |
| [v0-legado-desktop.html](v0-legado-desktop.html) | 99 | 70 | 96 | 91 |

Medido em 19/10/2026 com Lighthouse 13.5.0 e Chrome 155 headless, no Windows 11, servindo os arquivos localmente (o site legado nunca foi publicado). Cada relatório é uma execução única. A categoria "Agentic Browsing" (nova no Lighthouse 13) também aparece nos relatórios, mas fica fora da comparação.

## Como repetir

Requisitos: Node (versão do `.nvmrc`) e Google Chrome instalados. Comandos em PowerShell, a partir da raiz do repositório.

### 1. Separar os arquivos a medir

Site legado, num worktree fora do repositório:

```powershell
git worktree add --detach <pasta-temporaria>\legado v0-legado
$alvo = "<pasta-temporaria>\legado"
```

Site novo, a partir do build:

```powershell
npm run build
$alvo = "dist"
```

### 2. Servir na porta 4173 (deixar rodando em outro terminal)

```powershell
npx --yes serve@14.2.6 $alvo -l 4173 --no-clipboard
```

### 3. Medir mobile e desktop

Trocar `<nome>` por `v0-legado` ou pela versão medida (ex.: `v1`):

```powershell
npx --yes lighthouse@13.5.0 http://localhost:4173 --output=html --output-path=docs/lighthouse/<nome>-mobile.html --chrome-flags="--headless=new" --quiet
npx --yes lighthouse@13.5.0 http://localhost:4173 --preset=desktop --output=html --output-path=docs/lighthouse/<nome>-desktop.html --chrome-flags="--headless=new" --quiet
```

### 4. Limpar (só para o legado)

```powershell
git worktree remove <pasta-temporaria>\legado
```

Só os `.html` dos relatórios entram no repositório. As notas ficam dentro de cada relatório e são copiadas para a tabela acima.
