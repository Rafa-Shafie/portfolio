# Portfólio v1 — Rafael El Shafie

> Origem: briefing de handoff de 18/10/2026, baseado na auditoria `docs/AUDITORIA-PORTFOLIO.md` do site antigo e no currículo de out/2026.
> **Atualizado em 20/10/2026**, com o estado real do projeto: Fases 0–4, redesign, conteúdo aprofundado e testes no repositório concluídos. Falta só o que depende do Rafael e o lançamento.

## 1. Nome e pitch

**Portfólio v1 — Rafael El Shafie.** Site pessoal estático, em português, inglês e espanhol, com tema claro/escuro, que apresenta a experiência, os projetos, a formação e as habilidades de um estudante de Engenharia de Software focado em back-end e IA generativa.

## 2. Problema e motivação

- **O site antigo** (HTML/CSS puro, tag `v0-legado`) estava desatualizado e cheio de bugs: o texto `li>` no menu, o menu desktop aparecendo no celular e um link que levava a uma seção comentada.
- **O código antigo não era um ativo:** sem variáveis CSS, textos fixos, tamanhos em `vh`, contraste reprovado e sem Git. Os requisitos novos (tema, 3 idiomas, dados) tocariam quase todas as linhas.
- **Decisão: reescrever**, aproveitando o conteúdo e a identidade (preto + ciano).
- **Prioridade:** o v1 é a vitrine da busca de estágio. Primeiro um site correto, atualizado e no ar; o polimento vem depois.

## 3. Objetivos de aprendizado

- **Astro:** geração estática, componentes `.astro`, content collections com schema, i18n por rota.
- **Tema claro/escuro feito direito:** design tokens, preferência do sistema, persistência e nenhum flash ao carregar.
- **Acessibilidade e performance como requisito medido:** WCAG AA e Lighthouse.
- **Deploy contínuo:** preview por PR na Vercel e CI.

## 4. Stack

| Peça | Escolha | Por quê |
|---|---|---|
| Framework | **Astro 7**, saída estática | Site de conteúdo: zero JS por padrão, HTML estático por idioma, content collections e i18n nativos. |
| Linguagem | TypeScript | Conteúdo e dicionários tipados: o build quebra se faltar campo ou tradução. |
| Estilo | CSS puro com tokens (`src/styles/tokens.css`), `<style>` escopado por componente | O tema vira troca de tokens. Sem framework CSS. |
| Interatividade | Scripts pequenos em TS (menu, idioma, tema, abas, filtros, modais, copiar e-mail) | Nada justifica React no v1. |
| Fontes | Poppins self-hosted (fonts API do Astro, só latin); marca em Itim convertida em SVG | A marca (RS + RafaShafie) é gerada por `npm run brand` com opentype.js: centralização exata, sem fonte extra. |
| Ícones | `bootstrap-icons` (SVG importado como componente); logos oficiais em SVG monocromático | Sem CDN; ícone decorativo leva `aria-hidden`. |
| Imagens | `astro:assets` (`<Picture>`); OG gerado no build com satori + sharp | Formatos modernos no tamanho certo; uma imagem Open Graph por idioma. |
| Modais | `<dialog>` nativo com `showModal()` | Foco preso, Esc e inércia do fundo de graça. |
| Currículo | PDFs em `public/cv/` + guarda `scripts/check-cv.mjs` (pdfjs-dist) | Ver seção 8 (privacidade). |
| Testes | Playwright (`@playwright/test`) sobre o build de produção, no CI | Comportamento, teclado, i18n, layout e melhoria progressiva conferidos a cada push. |
| Deploy | Vercel integrada ao GitHub | Deploy a cada push na `main`, preview por PR. |

## 5. Arquitetura

```
src/
├── content/                 collections validadas por src/content.config.ts
│   ├── experiences/         1 YAML por experiência: card (cargo, resumo, 2–4 destaques, stack),
│   │                        frase do painel "Entrega & aprendizado" e detalhes do modal
│   ├── education/           Estácio, PUC-Rio, Santander/AWS, DIO·Itaú, Kumon
│   └── projects/            1 YAML por projeto: card, ilustração, status e detalhes do modal
├── data/
│   ├── profile.ts           contatos e caminho do CV por idioma
│   ├── skills.ts            habilidades por área e subgrupo (nomes podem variar por idioma)
│   ├── cv.ts                tamanho do PDF lido no build ("PDF · 93 kB")
│   └── drafts.ts            regra dos rascunhos (draft: true)
├── i18n/                    pt.ts (tipo Dictionary), en.ts, es.ts, utils.ts (localize, rotas, datas)
├── components/              Header, LanguageSwitcher, ThemeToggle, Section, ExperienceCard, DetailDialog,
│   │                        ProjectArt, CvLink, EducationItem, Footer, HomePage
│   └── sections/            Hero, Trajectory, About, Experience, Projects, Skills, Education, Contact
├── layouts/BaseLayout.astro <head>, SEO, canonical, hreflang, OG por idioma
├── pages/                   index (PT), [locale]/ (EN, ES), og/[locale].png.ts, robots.txt.ts
└── styles/                  tokens.css, global.css
public/cv/                   rafael-el-shafie-cv-{pt,en,es}.pdf (nomes fixos: o site aponta para eles)
scripts/                     generate-brand.mjs (marca), check-cv.mjs (guarda do CV, roda no prebuild)
tests/e2e/                   specs Playwright; content.ts lê os mesmos dicionários e YAML do site
docs/                        auditoria do site antigo, baseline do Lighthouse, curriculo.md (como trocar o CV)
```

- **Rotas:** `/` em português, `/en/` e `/es/`.
- **Fluxo do conteúdo:** collection → schema valida no build → componente renderiza. Seção sem itens não renderiza, e o menu nasce das seções existentes.
- **Campos traduzíveis:** `localized()` exige pt, en e es. Etiquetas de tecnologia aceitam nome próprio ("FastAPI") ou um valor por idioma ("Modelagem lógica").
- **Projetos:**
  - `category` define a área principal, e `alsoIn` faz o projeto aparecer também em outros filtros;
  - `kind` pode ser `personal`, `professional` ou `training`;
  - `status` pode ser `planned`, `progress`, `production`, `delivered` ou `released`;
  - `art` escolhe a ilustração própria (assistant, map, model, ledger, league ou voice); sem ela, entra a genérica da área.
- **Rascunhos:** com `draft: true`, o conteúdo aparece só no `npm run dev` e no preview da Vercel, nunca em produção.
- **Padrão de clique:** cartão de projeto e painel "Entrega & aprendizado" são clicáveis por inteiro, mas com **um só botão de verdade**. A área de clique é esticada com `::after`, e o anel de foco fica no cartão ou painel. Nenhum ancestral do botão pode ter `transform` ou `position`, senão a área encolhe.

## 6. Roadmap

### Concluído

- **Fase 0 — Fundação:** Git com a tag `v0-legado`, baseline do Lighthouse em `docs/lighthouse/`, Astro na Vercel e CI (`astro check` + build).
- **Fase 1 — MVP em português, tema escuro:** tokens, header acessível, seções, dicionário, SEO e foto otimizada.
- **Fase 2 — Inglês e espanhol:** rotas, seletor, `hreflang`, OG por idioma e um CV por idioma.
- **Redesign:** layout editorial, marca RS em Itim/SVG, hero com retrato, trajetória com logos, experiências em acordeão, habilidades em abas e contato em bloco ciano.
- **Conteúdo aprofundado** (PRs #3 e #4):
  - modais "Explorar a experiência" nas 3 experiências;
  - seção Projetos com 7 projetos e filtros;
  - habilidades com contexto de uso;
  - conteúdo alinhado ao CV de out/2026;
  - guarda automática do CV.
- **Testes no repositório:** as verificações Playwright que viviam fora do Git viraram a suíte `tests/e2e/`, que roda no CI depois do build. Contagens e textos vêm dos YAML e dicionários, então adicionar conteúdo não quebra os testes.
- **Fase 3 — Tema claro e alternador:**
  - cores em `light-dark()` nos tokens; sem JS, o site segue o sistema;
  - script inline no `<head>` aplica a escolha salva antes da primeira pintura (sem flash);
  - botão sol/lua no header, ao lado do idioma, com a escolha salva em `localStorage`;
  - a suíte roda nos dois temas (projetos `dark` e `light`), com o axe conferindo contraste AA nos 3 idiomas, nos modais e no seletor.

- **Fase 4 — Qualidade e acabamento:**
  - axe com todas as regras WCAG 2.2 A/AA (`tests/e2e/a11y.spec.ts`), nos dois temas, nos modais e no menu mobile;
  - Lighthouse no CI (`npm run lighthouse`): 3 rotas, mobile e desktop, mínimo de 90 em Performance e 100 no resto;
  - seção ativa no menu (`aria-current`, com traço além da cor);
  - entrada discreta das seções ao rolar, só com JS e sem reduced motion; o hero não anima (LCP);
  - README na raiz, com prints gerados por `npm run screenshots` e o antes e depois do Lighthouse (`docs/lighthouse/v1-*.html`).

### Próximos passos (em ordem)

1. **Revisões do Rafael:** o espanhol do site, antes de divulgar `/es/`; e a foto profissional, quando houver.
   Com a foto nova: `npm run build && npm run screenshots` para atualizar os prints do README.
2. **Lançamento (por último):** comprar o domínio, apontar na Vercel e atualizar `site` em `astro.config.mjs` (hoje `portfolio-chi-pink-45.vercel.app`). Só depois disso o link vai para o CV, o LinkedIn e o README.

### Fora do v1 (fica para o v2)

- Demos ao vivo consumindo APIs próprias, como ilhas React.
- Encurtador de links num subdomínio.

## 7. Decisões técnicas e trade-offs (pontos de entrevista)

1. **Reescrever em vez de refatorar.** A auditoria mostrou que cada requisito novo tocava quase todo o código. A prova é o Lighthouse: o antes está em `docs/lighthouse/`, e o depois tem 100 nas quatro categorias.
2. **Astro em vez de Next.js ou HTML puro.** Conteúdo estático não precisa de runtime React; HTML puro obrigaria a construir i18n e dados à mão.
3. **i18n por rota, gerado no build.** Cada idioma é um HTML próprio: indexável e sem texto trocando depois de carregar.
4. **Conteúdo como dados validados.** Adicionar um projeto é adicionar um YAML. Campo ou tradução faltando quebra o build, não a produção.
5. **Destaque diferente por tema.** O ciano `#12efff` tem contraste de sobra no escuro, mas ~1,4:1 sobre branco. No claro, o destaque é um ciano escuro.
6. **Acessibilidade e performance como requisito.**
   - `rem` no lugar de `vh`;
   - WCAG AA, teclado e reduced motion;
   - padrões do W3C/APG: abas, disclosure, acordeão nativo e `<dialog>`;
   - mínimo de 13px nos rótulos em caixa alta.
7. **Melhoria progressiva.** Sem JavaScript, nada quebra: as abas viram blocos empilhados, os filtros somem e todos os projetos aparecem; os botões que abrem modais só surgem com JS.
8. **Um botão por cartão, com a área de clique esticada.** Envolver o cartão inteiro num botão faria o leitor de tela anunciar o cartão todo como nome do botão.
9. **Rascunhos só em preview.** Dá para revisar conteúdo incompleto num link real sem risco de ele chegar à produção.
10. **A guarda do CV roda no `prebuild`, não só no CI.** A Vercel publica direto do push, sem esperar o CI. Rodando dentro do build, a guarda barra o deploy de verdade.
11. **Tema com `light-dark()` e `color-scheme`.** Cada cor é declarada uma vez. Sem escolha salva, quem decide é o sistema, mesmo sem JavaScript; o script do `<head>` só fixa o `data-theme`, e por ser síncrono não há flash. Navegador sem `light-dark()` fica no escuro.

### Tokens de cor (em `src/styles/tokens.css`; contraste AA conferido pelo axe nos dois temas)

| Token | Escuro | Claro |
|---|---|---|
| Fundo | `#0B1117` | `#F8FAFC` |
| Texto | `#E6EDF3` | `#0F172A` |
| Texto secundário | `#9AA7B4` | `#475569` |
| Destaque | `#12EFFF` | `#0E7490` |
| Texto sobre destaque | `#0B1117` | `#FFFFFF` |

Texto pequeno com `opacity` sobre o destaque não passa de 0,9: abaixo disso, o claro cai de 4,5:1.

## 8. Requisitos não funcionais

- **Performance:** Lighthouse ≥ 90 nas quatro categorias, conferido no CI. Estado atual: **100** em Performance, Acessibilidade, Boas práticas e SEO, nas 3 rotas, em mobile e desktop.
- **Acessibilidade:** WCAG 2.2 AA: contraste, teclado, foco visível, `alt` real, um `h1` por página, `lang` correto e nenhuma rolagem horizontal de 320px até 200% de zoom.
- **SEO:** title e description por idioma, Open Graph, `hreflang`, sitemap e canonical.
- **Privacidade:**
  - nenhum telefone no site nem nos PDFs. A guarda `scripts/check-cv.mjs` procura em texto, marcadores, metadados e strings internas, inclusive comprimidas, e bloqueia o build;
  - sem analytics com cookies;
  - os PDFs saem sem os IDs de design do Canva (campo Keywords) e com o idioma certo em cada arquivo;
  - nunca usar nem publicar links de edição do Canva.
- **Confidencialidade (combinado com o Rafael):**
  - Nomes que podem aparecer: **Atlas** e **Manhattan Real Estate**, ambos divulgados publicamente.
  - **Nenhum número de avaliação interna.** A bateria de 200 casos e os ~185 acertos ficam fora do site e do CV publicado.
  - Autenticação descrita como "corporativa (SSO)"; ferramentas internas do banco ficam genéricas.
  - O cliente da Fluxo aparece como "indústria alimentícia", nunca pelo nome.
  - O dashboard do Summer Job foi **construído** pelo Rafael em Databricks, a partir de uma base existente, e não "desenhado"; um colega o levou depois para a ferramenta do banco.
  - Projetos pessoais sem nomes nem casos reais da família.
- **Consistência:** headline e experiências iguais no site, no CV, no LinkedIn e no README do GitHub. **O CV é a fonte de verdade.** Mudança de conteúdo entra nos 3 idiomas no mesmo commit.
- **Custo:** zero, exceto o domínio.

## 9. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Polimento atrasar a vitrine | O conteúdo já está no ar; tema claro e acabamento vêm por fases |
| Os três idiomas desatualizarem | Schema e dicionários tipados quebram o build; regra de mudar os 3 no mesmo commit |
| Espanhol com erro | Revisão do Rafael antes de divulgar `/es/` |
| Link divulgado antes do domínio | O domínio é o último passo, antes de o link ir para o CV e o LinkedIn |
| Telefone vazar num CV novo | Guarda no `prebuild` bloqueia o deploy |
| Regressão de comportamento ou acessibilidade | Suíte Playwright em `tests/e2e/` roda no CI a cada push e PR |
| Divergência entre canais | Alinhar LinkedIn e README do GitHub junto com cada mudança de CV |

## 10. Conteúdo (fonte: currículo de out/2026)

- **Headline:** Engenharia de Software · IA Generativa · Backend.
- **Experiências**, da mais recente para a mais antiga. Cada card mostra empresa, cargo, período, resumo, 2–4 destaques, stack e o painel "Entrega & aprendizado", que abre o modal.
  - **BTG Pactual** — Estagiário (Short Job), IT Onboarding & IA — jun–out/2026. Atlas, construído do zero (RAG + Text-to-SQL) para tirar dúvidas operacionais e evitar chamados à sustentação; em produção em quatro meses e usado pela equipe.
  - **BTG Pactual** — Estagiário (Summer Job), IT Asset Management & Funds — jan–fev/2026. Manhattan Real Estate, em dupla:
    - tratamento e camada analítica em Databricks;
    - correspondência de imóveis entre portais por endereço e características;
    - pontuação e monitoramento com notificações no Teams;
    - dashboard construído em Databricks;
    - apresentação em inglês.
  - **Fluxo Consultoria** (Empresa Júnior, UFRJ) — Consultor de Projetos — jan–ago/2024:
    - backend de gestão em NestJS/TypeScript, como projeto de capacitação em equipe;
    - requisitos e modelagem conceitual e lógica para uma indústria alimentícia;
    - grupo de melhoria da área de tecnologia;
    - apoio financeiro (contas a pagar, reembolsos e conciliação);
    - recrutamento e orientação de trainees.
- **Projetos (7):**
  - **Profissionais:** Atlas (IA, em produção); Manhattan Real Estate (Dados, entregue); Requisitos e modelagem para um sistema de gestão industrial (Dados, entregue).
  - **De capacitação:** Backend de sistema de gestão (Fluxo, entregue); VoxAssist API (bootcamp DIO · Itaú, em planejamento, nome provisório).
  - **Pessoais:** Cifra (Backend + IA, em andamento); Liga Familiar Gamificada (Backend, em andamento, com repositório público).
- **Formação:**
  - Estácio, Engenharia de Software, 2025–2028.
  - PUC-Rio, IA e Ciência de Dados na Nuvem: AWS na Prática, abr–set/2026.
  - Santander Open Academy · AWS, Jornada Tech AWS, abr/2026 até hoje.
  - DIO · Itaú, Bootcamp Java, Spring Boot & IA, out/2026 até hoje.
  - Kumon, inglês nível M, em andamento.
- **Habilidades** (fonte: `src/data/skills.ts`):
  - **Backend:**
    - linguagens Python, TypeScript, JavaScript, SQL e Java (em formação);
    - FastAPI, Node.js, NestJS e Spring Boot (em formação);
    - SQLAlchemy, Alembic e Prisma;
    - APIs REST e RabbitMQ;
    - engenharia de requisitos e modelagem de dados.
  - **IA:** LLMs, RAG, Text-to-SQL, scikit-learn, LightGBM, SageMaker e Bedrock.
  - **Dados:** PostgreSQL, MySQL, Pandas, NumPy, Spark, Databricks, Power BI e Excel.
  - **Frontend:** React, TanStack Query, Zustand e Vite.
  - **Cloud e DevOps:** Docker, Kubernetes, AWS, Azure DevOps, Git/GitHub e Datadog.
  - **Qualidade:** pytest, Hypothesis, Vitest e Playwright.
- **Idiomas** (no CV): português nativo, inglês intermediário e espanhol básico. A lista de idiomas saiu do site a pedido do Rafael.
- **Contato:** e-mail (o cartão copia o endereço), LinkedIn, GitHub e o CV do idioma da página.
- **Identidade:**
  - fundo quase preto e destaque ciano;
  - monograma "RS" (R branco, S ciano, moldura ciano) + "Rafa**Shafie**" em Itim, como SVG;
  - foto provisória, a ser trocada pela profissional (o original `src/assets/foto_perfil.jpg` fica fora do Git).

## 11. Como trabalhar neste projeto

- **Plano antes:** mostrar o plano e esperar aprovação antes de cada fase ou mudança grande.
- **Commits:** pequenos, no padrão Conventional Commits. Direto na `main` por padrão; branch e PR quando o Rafael quiser revisar antes.
- **Comandos:**
  - `npm run dev`: desenvolvimento;
  - `npm run build`: build, que roda antes a guarda do CV;
  - `npm run check`: `astro check`;
  - `npm run test:e2e`: build + testes Playwright (`npm run test:e2e:ui` abre o modo visual). Na primeira vez, `npx playwright install chromium`;
  - `npm run check:cv`: só a guarda do CV;
  - `npm run brand`: regenera a marca;
  - `npm run lighthouse`: Lighthouse com nota mínima sobre o `dist/` (`-- --save v1` grava os relatórios em `docs/lighthouse/`);
  - `npm run screenshots`: regera os prints do README a partir do `dist/`.
- **Trocar o currículo:** ver [docs/curriculo.md](docs/curriculo.md). Os nomes dos arquivos são fixos, e os IDs do Canva e o idioma do PDF devem ser conferidos.

## 12. Definição de Pronto

| Item | Como fica aqui |
|---|---|
| README que vende | Pitch, motivação, decisões, diagrama da arquitetura e antes/depois do Lighthouse |
| Documentação de uso | O próprio site no ar, mais prints no README |
| Execução simples | `npm install && npm run dev` |
| Demo | O site em produção no domínio próprio |
| Decisões e desafios | Reescrita guiada por auditoria, i18n tipado, tema sem flash, acessibilidade medida, guarda do CV |

## 13. Decisões

- **Tomadas:**
  - idioma da raiz em PT;
  - WhatsApp removido, com contato por e-mail e LinkedIn;
  - projetos visíveis já no v1;
  - um CV por idioma.
- **Em aberto:**
  - domínio: nome e extensão (ex.: `rafaelshafie.dev` ou `.com.br`), feito por último;
  - renomear o time na Vercel, o "shafies" dos links de preview (opcional).
