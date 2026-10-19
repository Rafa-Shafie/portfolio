# Briefing de Handoff — Portfólio v1

> Origem: conversa de maturação no Projetos Pessoais (18/10/2026), com base na auditoria `AUDITORIA-PORTFOLIO.md` do site antigo e no currículo de out/2026.
> Este arquivo pode virar o `CLAUDE.md` na raiz do repositório.

## 1. Nome e pitch
**Portfólio v1 — Rafael El Shafie.** Site pessoal estático, em português, inglês e espanhol, com tema claro/escuro, que apresenta a experiência, a formação e as habilidades de um estudante de Engenharia de Software focado em back-end e IA generativa.

## 2. Problema e motivação
- O site atual (HTML/CSS puro, parado desde 2024–2025) está desatualizado no conteúdo: skills em C#/.NET, "B1", experiências ausentes. Também tem bugs visíveis: o texto `li>` aparece no menu, o menu desktop aparece no celular e o link "Experiences" leva a uma seção comentada.
- A auditoria mostrou que o código não é um ativo. Não há variáveis CSS, os textos estão fixos no HTML, os tamanhos são em `vh`, o contraste reprova e não existe Git. Os requisitos novos (tema, 3 idiomas, seções alimentadas por dados) tocariam quase todas as linhas.
- **Decisão: reescrever**, aproveitando o conteúdo e a identidade (preto + ciano).
- O v1 é a vitrine da busca de estágio e tem pressa. O primeiro objetivo é um site correto, atualizado e no ar.

## 3. Objetivos de aprendizado
- **Astro:** geração estática, componentes `.astro`, content collections com schema, i18n por rota.
- **Tema claro/escuro feito direito:** design tokens, preferência do sistema, persistência e nenhum flash ao carregar.
- **Acessibilidade e performance como requisito medido:** WCAG AA e Lighthouse.
- **Deploy contínuo:** preview por PR na Vercel e CI mínimo.

## 4. Stack
| Peça | Escolha | Por quê |
|---|---|---|
| Framework | **Astro**, saída estática | Site de conteúdo: zero JS por padrão, HTML estático por idioma (bom pra SEO), content collections e i18n nativos. Next.js traria runtime React sem necessidade. HTML puro exigiria construir i18n e dados à mão. |
| Linguagem | TypeScript | Conteúdo e dicionários tipados: o build quebra se faltar campo ou tradução. |
| Estilo | CSS puro com custom properties (tokens), `<style>` escopado por componente | O tema vira troca de tokens. Sem framework CSS, pra não esconder o aprendizado. |
| Interatividade | Scripts pequenos em TS (tema, menu mobile) | Nada no v1 justifica React. Ilhas React ficam para o v2 (demos). |
| Fontes | Poppins self-hosted, 3–4 pesos | Hoje carrega 18 variantes e usa ~4; self-host tira a dependência do Google Fonts. |
| Ícones | SVG local (Devicon ou Simple Icons) via componente | Remove os 2 CDNs de fonte de ícones; ícone decorativo leva `aria-hidden`. |
| Imagens | `astro:assets` | Gera WebP/AVIF no tamanho certo; a foto atual é 200×200 ampliada para 300. |
| Deploy | Vercel integrada ao GitHub | Deploy a cada push e preview por PR, grátis. Domínio próprio apontado por DNS. |

## 5. Arquitetura (alto nível)

```
src/
├── content/
│   ├── experiences/   1 arquivo por experiência; campos traduzíveis com pt/en/es
│   ├── education/
│   └── projects/      vazia no v1 → seção E link do menu ficam ocultos
├── i18n/
│   ├── pt.ts  en.ts  es.ts   textos fixos da interface, todos com o mesmo tipo
│   └── utils.ts              idioma atual, troca de idioma, rotas
├── components/   Header, MobileMenu, ThemeToggle, LanguageSwitcher, ExperienceCard, SkillGroup…
├── layouts/      BaseLayout: <head>, SEO, hreflang, script anti-flash do tema
├── pages/        página única por idioma
└── styles/       tokens.css (cores, tipografia, espaçamento), global.css
public/           cv/ (PT e EN), favicon, imagem Open Graph
```

- **Rotas:** `/` em português, `/en/` e `/es/`.
- **Fluxo do conteúdo:** collection → schema valida no build → componente renderiza. Seção sem itens não renderiza, e o menu é gerado a partir das seções existentes. Isso evita o bug antigo do link apontando pro nada.
- **Experiências:** cada arquivo guarda uma vez só o que não se traduz (empresa, datas, stack) e guarda em pt/en/es o que se traduz (cargo, frase de impacto, destaques).

## 6. Roadmap

### Fase 0 — Fundação (curta)
- `git init` na pasta antiga, commit do site legado e tag `v0-legado`. A história do repositório passa a mostrar o antes e o depois.
- Rodar o Lighthouse no site antigo e salvar o resultado como linha de base.
- Projeto Astro no mesmo repositório, conectado à Vercel, com uma página mínima no ar em `*.vercel.app`.
- CI: `astro check` + build em cada PR.
- **Entregável:** pipeline funcionando (push → deploy, PR → preview).
- **Aprendizado:** estrutura do Astro, deploy contínuo.

### Fase 1 — MVP em português, tema escuro (já pode ir pro currículo)
- Tokens de cor e tipografia do tema escuro; layout responsivo em `rem`.
- Header acessível. O menu mobile usa `<button>`, fecha ao clicar num link e com Esc, e tem foco visível.
- Seções: Home, Sobre (inclui idiomas), Experiências, Formação, Skills, Contato e rodapé. Projetos: collection vazia, seção oculta.
- Toda string da interface já passa pelo dicionário, mesmo só com o PT preenchido.
- SEO básico: title, description, Open Graph e favicon. Foto nova otimizada.
- Domínio próprio comprado e apontado **antes** de divulgar o link.
- **Entregável:** site completo em PT no ar.
- **Aprendizado:** componentes, collections, tokens, acessibilidade básica.

### Fase 2 — Inglês e espanhol
- Rotas `/en/` e `/es/`, seletor de idioma, `hreflang`, Open Graph por idioma e `lang` correto em cada página.
- Conteúdo traduzido; o espanhol é revisado pelo Rafael antes de publicar.
- CV: um por idioma, PT em `/`, EN em `/en/` e ES em `/es/` (os três exportados do Canva sem telefone).
- **Entregável:** site nos 3 idiomas.
- **Aprendizado:** i18n estático e SEO multilíngue.

### Fase 3 — Tema claro e alternador
- Paleta clara em tokens.
- O alternador começa pela preferência do sistema, salva a escolha, e um script inline no `<head>` aplica o tema antes de a página aparecer.
- **Entregável:** tema claro/escuro.
- **Aprendizado:** theming robusto.

### Fase 4 — Qualidade e acabamento
- Testes e2e com Playwright: o tema persiste, a troca de idioma funciona, o menu mobile abre pelo teclado e as seções vazias ficam ocultas.
- Checagem automática de acessibilidade (axe) e Lighthouse no CI com nota mínima.
- Animações discretas que respeitam `prefers-reduced-motion`; indicação da seção ativa no menu.
- README final com decisões e desafios e o antes/depois do Lighthouse.
- **Entregável:** v1 pronto pela Definição de Pronto.

### Fora do v1 (fica para o v2)
- Seção Projetos visível, com projetos concluídos.
- Demos ao vivo consumindo APIs próprias, como ilhas React.
- Encurtador de links num subdomínio.

## 7. Decisões técnicas e trade-offs (pontos de entrevista)
1. **Reescrever em vez de refatorar.** A auditoria mostrou que cada requisito novo tocava quase todo o código; o valor estava no conteúdo e na identidade. A prova é o Lighthouse antes/depois.
2. **Astro em vez de Next.js ou HTML puro.** Conteúdo estático não precisa de runtime React, e HTML puro obrigaria a construir i18n e dados à mão.
3. **i18n por rota, gerado no build.** Cada idioma é um HTML próprio: indexável e sem texto trocando depois de carregar. A alternativa descartada foi traduzir no navegador com JS, que é pior pra SEO e pisca.
4. **Conteúdo como dados validados.** Adicionar um projeto é adicionar um arquivo. Campo ou tradução faltando quebra o build, não o site em produção.
5. **Destaque diferente por tema.** O ciano `#12efff` tem contraste de sobra no escuro, mas fica em ~1,4:1 sobre branco. No claro, o destaque é um ciano escuro. Texto sobre botão ciano é escuro, o que corrige o 1,4:1 dos botões sociais antigos.
6. **Acessibilidade e performance como requisito.** `rem` no lugar de `vh` para o zoom funcionar, WCAG AA, teclado e reduced-motion, com meta de Lighthouse.
7. **Privacidade.** O telefone sai do site público (hoje está exposto no link do WhatsApp); o contato passa a ser por e-mail e LinkedIn.

### Tokens de partida (contraste AA conferido; ajustar no build)
| Token | Escuro | Claro |
|---|---|---|
| Fundo | `#0B1117` (quase preto, no lugar de `#000`) | `#F8FAFC` |
| Texto | `#E6EDF3` | `#0F172A` |
| Texto secundário | `#9AA7B4` | `#475569` |
| Destaque | `#12EFFF` (identidade atual) | `#0E7490` |

## 8. Requisitos não funcionais
- **Performance:** Lighthouse ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO (o piso; um site estático em Astro costuma passar disso).
- **Acessibilidade:** WCAG 2.2 AA: contraste, teclado, foco visível, `alt` real, um `h1` por página e `lang` correto.
- **SEO:** title e description por idioma, Open Graph, `hreflang`, sitemap e canonical.
- **Privacidade:** sem telefone no site; sem analytics com cookies no v1.
- **Confidencialidade:** experiências do BTG descritas no nível do currículo, sem nomes de sistemas internos, dados ou números não divulgados.
- **Consistência:** headline e experiências iguais no site, no CV, no LinkedIn e no README do GitHub. O CV é a fonte de verdade.
- **Custo:** zero, exceto o domínio.

## 9. Riscos e mitigação
| Risco | Mitigação |
|---|---|
| Polimento (animação, visual perfeito) atrasar a vitrine | A Fase 1 fecha o site em PT; animação só na Fase 4 |
| Os três idiomas desatualizarem | Schema e dicionários tipados quebram o build; regra: mudança de conteúdo entra nos 3 idiomas no mesmo commit |
| Espanhol com erro | Revisão do Rafael antes de publicar `/es/` |
| Link divulgado antes do domínio | Domínio apontado antes de o link ir pro CV e pro LinkedIn |
| Curva do Astro | Pequena (componente é HTML + frontmatter); não introduzir React no v1 |
| Divergência entre canais | Alinhar LinkedIn e README do GitHub junto com o lançamento |

## 10. Conteúdo do v1 (fonte: currículo de out/2026)
- **Headline:** Engenharia de Software · IA Generativa · Back-end.
- **Experiências**, da mais recente para a mais antiga. Cada card mostra empresa, cargo, período, frase de impacto, 2–3 destaques e stack.
  - **BTG Pactual** — Estagiário (Short Job), IT Onboarding & IA — jun–out/2026. Assistente de IA construído do zero (RAG + Text-to-SQL), em produção e usado pela equipe.
  - **BTG Pactual** — Estagiário (Summer Job), IT Asset Management & Funds — jan–fev/2026. Integração de dados de dois sistemas e sistema de pontuação para sinalizar oportunidades de investimento imobiliário.
  - **Fluxo Consultoria** (Empresa Júnior, UFRJ) — Consultor de Projetos — jan–ago/2024. Software de gestão em Node.js/TypeScript, do levantamento de requisitos à entrega.
- **Formação:**
  - Estácio, Engenharia de Software, 2025–2028.
  - PUC-Rio, IA e Ciência de Dados na Nuvem, 2026.
  - Santander Open Academy + AWS, 2026 até hoje.
- **Skills (recorte do CV):**
  - Back-end: Python, FastAPI, PostgreSQL, APIs REST, Java/Spring (em formação).
  - IA: LLMs, RAG, Text-to-SQL.
  - Dados: Pandas, Spark, Databricks.
  - Front-end: TypeScript, React.
  - Infra: Docker, Kubernetes, AWS, Azure DevOps.
  - Qualidade: pytest, Playwright.
- **Idiomas:** português nativo, inglês intermediário, espanhol no mesmo nível declarado no CV.
- **Contato:** e-mail, LinkedIn, perfil do GitHub e botão de CV por idioma.
- **Identidade:** fundo quase preto, destaque ciano e logo "Rafa**Shafie**" em Poppins (sai o Comic Sans). Foto nova em resolução maior.

## 11. Definição de Pronto aplicada a este projeto
| Item | Como fica aqui |
|---|---|
| README que vende | Pitch, motivação, decisões, diagrama da arquitetura e antes/depois do Lighthouse |
| Documentação de uso | O próprio site no ar, mais prints no README |
| Execução simples | `npm install && npm run dev`; Docker não se aplica a site estático |
| Demo | O site em produção no domínio próprio |
| Decisões e desafios | Reescrita guiada por auditoria, i18n tipado, tema sem flash, acessibilidade medida |

## 12. Decisões em aberto
- **Domínio:** nome e extensão (ex.: `rafaelshafie.dev` ou `.com.br`).
- **Idioma da raiz:** recomendação é PT, porque o mercado-alvo é o Brasil.
- **WhatsApp:** recomendação é remover. O link `wa.me` expõe o número de qualquer forma.