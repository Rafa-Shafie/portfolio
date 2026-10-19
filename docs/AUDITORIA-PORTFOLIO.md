# Auditoria do Portfólio — Rafael El Shafie

> Data da análise: 18/10/2026. Método: leitura completa de `index.html` (213 linhas) e `style.css` (510 linhas), inspeção dos binários em `images/` e checagem (via `curl`, só leitura) de que os CDNs externos ainda respondem. **O site não foi aberto em navegador**: o comportamento visual descrito aqui foi deduzido da leitura do código. Quando algo não pôde ser confirmado, aparece como **(incerto)**.

## Resumo

1. É um site estático de uma página só: HTML + CSS + ~20 linhas de JS inline, sem framework, sem build, sem `package.json` e **sem repositório Git**.
2. Ainda roda (os três CDNs responderam 200 hoje), mas tem bugs visíveis: o texto solto `li>` aparece no menu desktop, o menu desktop não some no celular, e o link "Experiences" aponta para uma seção que está comentada.
3. Todo o conteúdo está escrito direto no HTML, em inglês (embora `lang="pt-br"`), e os rótulos do menu aparecem duplicados. Não há nenhum dado separado do código.
4. O CSS não usa variáveis: o preto, o branco e o ciano `#12efff` se repetem em ~40 declarações escritas em três notações diferentes. Não há tratamento de `prefers-reduced-motion`, e os tamanhos em `vh` atrapalham acessibilidade e celular.
5. Vale aproveitar o conteúdo, a identidade (preto + ciano), as fotos e a escolha de ícones; o código sai mais barato reescrever. Astro e reescrita do zero custam parecido (médio), e Astro resolve de fábrica idiomas, dados e Vercel.

---

## 1. Stack e execução

| Item | O que há | Fonte |
|---|---|---|
| Linguagens | HTML5, CSS3, JavaScript puro (inline, sem módulos) | `index.html:189-209` |
| Framework / build | **Nenhum.** Não existe `package.json`, `node_modules`, bundler nem config | listagem da raiz |
| Fontes | Google Fonts: **Poppins** (todos os 18 pesos/itálicos) + **Itim** | `index.html:10-12` |
| Ícones | **Bootstrap Icons 1.10.5** (cdnjs) e **Devicon v2.14.0** (jsDelivr, via GitHub) | `index.html:15-16` |
| Bibliotecas JS | Nenhuma | — |

**Como roda localmente:** basta abrir `index.html` no navegador (duplo clique) ou servir a pasta com qualquer servidor estático, como a extensão Live Server do VS Code. Não precisa instalar nada. É preciso internet para carregar fontes e ícones.

**Ainda roda?** Provavelmente sim. Em 18/10/2026 os três recursos externos responderam HTTP 200 (Bootstrap Icons, 81 KB de CSS; Devicon, 44 KB; Google Fonts). As 12 classes de ícone usadas existem nas versões carregadas: conferi `bi-list`, `bi-x-lg`, `bi-github`, `bi-linkedin` e as 8 `devicon-*` no CSS servido. As versões estão desatualizadas, mas não descontinuadas: há versões mais novas das duas bibliotecas de ícones; a última exata de cada uma não foi verificada **(incerto)**. Como não há dependências npm, não existe risco de "npm install quebrado".

**Estado do Git:** a pasta **não é um repositório Git** (`git status` → "not a git repository", nem nela nem nas pastas acima). Portanto não há último commit nem remoto configurado. Pode existir uma cópia no GitHub em `github.com/Rafa-Shafie` (link em `index.html:97`), mas isso não foi verificado **(incerto)**.

**Datas de modificação dos arquivos** (indício fraco, porque a pasta está num backup e cópias podem alterar datas): `index.html` e `style.css` em 30/04/2025; `myPhoto.jpeg` em 18/03/2024; `fluxoConsultoria.png` em 05/11/2024. O rodapé diz "© 2024" (`index.html:185`).

## 2. Estrutura

```
Portifólio/
├── index.html              8.264 B  — a página inteira: head, header/menus, 4 seções, rodapé e o JS do menu mobile
├── style.css               9.427 B  — todo o estilo (sem divisão em arquivos)
└── images/
    ├── myPhoto.jpeg       11.231 B  — foto de perfil (Home, About e placeholder dos 3 projetos)
    └── fluxoConsultoria.png 2.118 B — logo da Fluxo Consultoria (só usado na seção comentada)
```

Não há README, LICENSE, favicon, `.gitignore`, config de deploy nem pasta de scripts.

`style.css` segue a ordem: reset/estilo geral (1-108) → cabeçalho (110-198) → Home (200-242) → Sobre (244-322) → Skills (325-393) → Projetos (395-416) → "Responsividade"/menu mobile (418-510). Na prática, as regras de celular estão espalhadas em vários pontos (ver item 6).

## 3. Seções e conteúdo

Todo o conteúdo é **texto fixo dentro do `index.html`**. Não há JSON, arquivo de dados nem template.

| Seção | Onde | Como é montada | Conteúdo |
|---|---|---|---|
| Header / logo | `index.html:20-58` | `<h1>Rafa<span>Shafie</span></h1>` dentro de `<a href="#">`, menu desktop, botão hambúrguer, menu mobile e overlay | Logo + 5 links |
| **Home** | `index.html:62-79` | Flex com texto à esquerda e foto à direita | "Hi, I'm Rafael El Shafie," / "A Software Engineer" / botão "Say hello" → WhatsApp |
| **About** | `index.html:81-103` | Flex com foto + lista | Título "About Me", frase "Creating the future, one code at a time." (um `<h3>` dentro de `<ul>`), 3 itens ("Software Engineer Student.", "B1 Intermediate English level.", "Studying English and Back-end development."), botões GitHub e LinkedIn |
| **Experiences** | `index.html:105-122` (**comentada**) | Seria uma timeline com logo + caixa de texto | Um item: "Trainee – Fluxo Consultoria", "02/01/2024 – 09/01/2024", stack "Javascript, Typescript, Nodejs, SQLite, Git, GitHub Scrum, Kanban" |
| **Skills** | `index.html:124-169` | Grid de 8 caixas repetidas à mão (ícone Devicon + `<h3>`) | C#, .Net, .Net Core, SQL Server, HTML5, CSS3, Git, GitHub |
| **Projects** | `index.html:171-180` | 3 `<div class="img-proj">` com `style="background-image: url(images/myPhoto.jpeg)"` | **Placeholders**: a própria foto repetida, sem título, descrição nem link |
| Footer | `index.html:183-187` | Parágrafo simples | "Copyright © 2024. All rights reserved" |
| Contact | só no CSS (`style.css:46-48`) | Não existe no HTML | — |

**Experiences existe só como link no menu** (`index.html:32` e `:50`). A seção está dentro de um comentário HTML, então o link `#experience` não leva a lugar nenhum. Mesmo se fosse descomentada, ficaria sem estilo: as classes `.main-text`, `.timeline`, `.container` e `.text-box` não existem no CSS, e o CSS tem `.experiences` (`style.css:34`), que não bate com a classe `experience` do HTML.

Sobre a data "02/01/2024 – 09/01/2024": não dá para saber se está no formato americano (fev–set) ou brasileiro (2 a 9 de janeiro) **(incerto)**. A stack está sem vírgula entre "GitHub" e "Scrum".

**Para tradução:** os textos visíveis estão **espalhados pelo HTML**, misturados com a marcação, em ~30 trechos. Os 5 rótulos do menu aparecem **duas vezes** (desktop, `:30-34`, e mobile, `:48-52`). Os `alt` misturam português ("Para colocar uma foto de corpo inteiro", `:75`) e inglês ("My photo", `:86`). O documento declara `lang="pt-br"` (`:2`), mas o conteúdo está todo em inglês.

## 4. Navegação

- **Como leva às seções:** âncoras simples (`href="#home"`, `#about`, `#experience`, `#skills`, `#projects`), em `index.html:30-34` e `:48-52`. O logo usa `href="#"` e volta ao topo.
- **Scroll suave:** só CSS, `html { scroll-behavior: smooth; }` (`style.css:10-12`). Não há JS de rolagem.
- **"Animação" do menu:** só hover. Os links ficam cinza `rgb(105,105,105)` e, no hover, viram branco com `scale(1.3)` em 0,6 s (`style.css:127-137`). Como o logo também é um `header a`, ele **também aumenta 1,3×** no hover, somado ao `scale(1.01)` do `h1` (`style.css:139-150`).
- **Seção ativa:** **não há indicação**. Não existe scrollspy, IntersectionObserver, `:target` nem `aria-current`.
- **Header:** `position: fixed` com fundo preto (`style.css:111-119`). As seções não têm `scroll-margin-top`, mas os paddings grandes das seções (20-26vh) provavelmente evitam que o título fique escondido sob o header **(incerto, não testado)**.
- **Menu para celular:** existe. Em telas ≤768px aparece o ícone hambúrguer (`bi-list`, `index.html:38-40`). O clique, via JS inline (`index.html:189-209`), adiciona a classe `open-menu` a uma gaveta fixa à direita com 70% da largura (`style.css:426-439`) e mostra um overlay escuro (`style.css:461-470`). O menu fecha pelo "X" ou clicando no overlay.

**Bugs de navegação encontrados:**
1. `index.html:32` diz `li><a href="#experience">` (falta o `<`). O navegador mostra o texto **"li>" literalmente** no menu desktop, ao lado de "Experiences".
2. **O menu desktop não some no celular.** A regra `.menu-desktop { display: flex }` em `style.css:507` fica fora de media query e vem *depois* das regras `display: none` (`:174` e `:497`). Com a mesma especificidade, a última vence, então no celular aparecem o menu desktop *e* o hambúrguer. O comentário em `:506` mostra que a intenção era outra. A leitura da cascata é inequívoca, mas não foi conferida no navegador.
3. Clicar num link do menu mobile **não fecha a gaveta**: só há listeners no "X" e no overlay. O usuário rola até a seção com o menu ainda aberto por cima.
4. O link "Experiences" aponta para uma seção inexistente (item 3).
5. O hambúrguer e o "X" são `<div>`, não `<button>`, então não recebem foco por teclado (item 9).

## 5. Animações

Todas são feitas em CSS puro, sem biblioteca. O único JS da página só troca uma classe e um `display`.

| # | Onde | O que faz | Implementação | Gatilho |
|---|---|---|---|---|
| 1 | `html` (`style.css:10-12`) | Rolagem suave até a âncora | `scroll-behavior: smooth` | Clique no menu |
| 2 | Foto da Home (`style.css:230-242`) | "Flutua" 7vh para baixo e volta, sem parar | `@keyframes flutuar`, 4 s, `infinite alternate`, animando `top` (propriedade de layout, menos eficiente que `transform`) | Carregamento (contínua) |
| 3 | Todos os `button` (`style.css:104-108`, `:69-78`) | Aumenta 1,16× e ganha brilho ciano `#12efffda` | `transition` + `transform: scale` + `box-shadow` | Hover |
| 4 | Botões sociais (`style.css:305-322`) | Aumenta 1,2× (sobrepõe o 1,16× do item 3, por especificidade) e também herda o brilho | `transition 0.3s` | Hover |
| 5 | Links do header e logo (`style.css:127-150`) | Cinza → branco e escala 1,3× | `transition 0.6s / 0.8s` | Hover |
| 6 | Caixas de Skills (`style.css:339-357`) | Sobe 10px e ganha brilho ciano | `transition 0.5s` + `translate` + `box-shadow` | Hover |
| 7 | Cards de Projetos (`style.css:404-416`) | Desliza o `background-position` de cima para baixo (efeito pensado para prints longos de sites) | `transition .8s` declarada **só no `:hover`**, então a volta é instantânea | Hover |
| 8 | Gaveta do menu mobile (`style.css:426-439`, `:472-474`) | Abre e fecha | Tem `transition: 0.3s`, mas a troca é por `display`, que não anima: **na prática abre seco** | Clique (JS) |

- **Efeito de digitação:** não existe.
- **Animação disparada por scroll:** não existe.
- No item 7, com a imagem quadrada atual (200×200) em `background-size: cover` numa caixa mais alta que larga, a imagem só sobra na horizontal. A mudança de posição vertical deve **não produzir efeito visível** **(incerto, não testado)**.
- **`prefers-reduced-motion`: nenhuma regra respeita.** A palavra não aparece no CSS, e a flutuação da foto roda infinitamente para todo mundo.

## 6. Estilo e tema

**Organização:** um único `style.css`, organizado por comentários de seção, sem metodologia (BEM etc.), sem variáveis CSS e sem pré-processador. Há estilos inline no HTML: `border-radius: 50%` nas imagens (`index.html:75`, `:86`, `:114`), que anula o `border-radius: 12px` de `style.css:273`, e o `background-image` dos projetos (`:175-177`).

Há quatro blocos `@media (max-width: 768px)` separados (`:55`, `:173`, `:476`, `:496`), mais um no meio das Skills (`:369`) e um de 480px (`:375`). Duas definições de `.menu-mobile` se misturam: `:182-191`, dentro da media query, com `position: absolute` e sombra; e `:426-439`, fora dela, com `position: fixed` e tela cheia. A segunda vence na posição, mas a sombra ciano e o `border-radius` da primeira continuam aplicados no celular.

**Cores usadas** (não há nenhuma variável `--*`):

| Cor | Notações usadas | Onde | Ocorrências |
|---|---|---|---|
| Preto `#000000` | `rgb(0, 0, 0)`, `black`, `#000000` | fundo do body (`:15`), de `section` (`:22`), de cada seção (`:27-51`), do header (`:117`), do menu mobile (`:187`, `:428`) e do about (`:246`) | ~12 |
| Ciano `#12efff` | `#12efff`, `#12efffda` (com ~85% de alfa) | botão Say hello (`:73`), spans de título (`:88`, `:221`), brilho dos botões (`:105`), logo (`:153`), sombra do menu (`:190`), botões sociais (`:310`, `:320`), skills (`:355`, `:361`), ícones do menu (`:422`, `:457`) | ~13 |
| Branco `#ffffff` | `rgb(255,255,255)`, `white`, `#ffffff` | títulos, textos, links do menu mobile, ícones sociais (`:81`, `:93`, `:135`, `:140`, `:148`, `:170`, `:196`, `:215`, `:279`, `:286`, `:311`, `:340`, `:449`) | ~13 |
| Cinza claro `rgb(197,197,197)` | — | todos os `<p>` (`:99`) | 1 |
| Cinza médio `rgb(105,105,105)` | — | links do header (`:128`) | 1 |
| Roxo `#7d06df` | — | sombra da foto do About (`:274`), única ocorrência | 1 |
| Overlay `rgba(0,0,0,0.7)` | — | fundo do overlay do menu (`:468`) | 1 |

Os comentários de cor contradizem os valores: "Azul claro para destaque", "Rosa claro…", "Verde claro…" estão ao lado de `black` (`:27-51`), e "fundo transparente" está ao lado de `black` (`:117`).

**Fontes:**
- **Poppins** (Google Fonts, `index.html:12`) é aplicada a tudo pelo seletor `*` (`style.css:7`, escrita `'poppins'` em minúsculas; funciona, porque nomes de fonte não diferenciam maiúsculas). A URL pede **18 variantes** (100-900, normal e itálico), mas o CSS usa só ~4 pesos (400, 600, 700 dos títulos, 800). É peso desnecessário.
- **Itim** é carregada e **nunca usada**.
- **Logo:** `"Comic Sans MS", sans-serif` (`style.css:144`, `:154`). É fonte de sistema, **não é carregada**: existe em Windows e macOS, mas em geral não em Android, iOS e Linux, onde o logo cai para uma sans-serif genérica **(incerto quanto a cada plataforma)**.
- `font-family: 'Segoe UI'` em `section.about` (`:248`) é **inócua**: o seletor `*` reaplica Poppins em cada elemento filho.

**Breakpoints e celular:** 768px e 480px. No celular, as Skills passam de 4 para 2 colunas (≤768) e depois para 1 (≤480); o About empilha (≤768 e ≤480); aparece o hambúrguer. **Não há regras de celular para Home, Projetos nem para o menu desktop** (que continua visível por causa do bug do item 4). Pela leitura do código, a Home fica lado a lado com `gap: 15vh` e os 3 cards de projeto (largura `38vh`, sem `flex-wrap`) devem se espremer em tiras estreitas **(incerto, não testado)**. Quase todo tamanho de fonte e espaçamento está em `vh`, ou seja, depende da *altura* da tela: textos ficam minúsculos com o celular deitado e enormes em monitores altos.

**Dificuldade de adicionar tema claro/escuro hoje: média, na prática uma reescrita do CSS.** Seria preciso criar variáveis, trocar ~40 declarações de cor escritas em três notações, tirar os estilos inline, decidir o que fazer com a sombra roxa, criar o botão de alternância e salvar a preferência. O arquivo é pequeno (510 linhas), então o volume não assusta. O problema é que quase toda linha de cor teria de ser tocada.

## 7. Assets

| Arquivo | Formato | Dimensões | Tamanho | Uso | Observação |
|---|---|---|---|---|---|
| `images/myPhoto.jpeg` | JPEG progressivo (JFIF) | 200×200 | 11,2 KB | Home (`:75`), About (`:86`) e os 3 projetos (`:175-177`) | No About é exibida com `width: 300px` (`style.css:271`), ou seja, **ampliada e provavelmente borrada**. Resolução baixa para um site novo |
| `images/fluxoConsultoria.png` | PNG com paleta, 8 bits | 225×225 | 2,1 KB | Só na seção Experiences comentada (`:114`) | Logo de terceiro (Fluxo Consultoria) |

- **Ícones:** todos vêm de bibliotecas de fonte de ícones via CDN, sem nenhum SVG local. São **Bootstrap Icons 1.10.5** (`bi-list`, `bi-x-lg`, `bi-github`, `bi-linkedin`) e **Devicon v2.14.0** (8 logos de tecnologia).
- **Fontes:** nenhuma local; tudo via Google Fonts (item 6).
- **Favicon:** não existe. O navegador vai pedir `/favicon.ico` e receber 404.

## 8. Origem e terceiros

**Sinais de template ou de outro portfólio.** Não há créditos, README, LICENSE, comentários citando autor nem histórico Git para consultar. Os indícios são indiretos:
- O padrão de nomes de classe em português (`interface`, `flex`, `txt-home`, `img-home`, `meu-contato`, `btn-social`, `titulo`, `skills-box`, `img-proj`, `btn-abrir-menu`, `btn-fechar`, `overlay-menu`, keyframe `flutuar`) e o efeito de hover com `background-position` nos projetos lembram os tutoriais brasileiros de "portfólio em HTML e CSS" em vídeo. **Não consegui identificar o autor original (incerto).**
- A seção Experiences comentada usa outro vocabulário, em inglês (`main-text`, `timeline`, `container`, `text-box`), e não tem CSS. Sugere um trecho vindo de uma segunda fonte e não integrado **(incerto)**.
- Os comentários do CSS contradizem os valores ("Azul claro" sobre `black`; "troque para #000 se quiser escuro", `:246`), o que sugere código colado de outro lugar e depois ajustado **(incerto)**.
- `style.css:6` mantém comentada uma linha de `font-family: "Comic Sans MS"` no `*`.

**Terceiros:**

| Recurso | Origem | Licença |
|---|---|---|
| Bootstrap Icons 1.10.5 | `cdnjs.cloudflare.com` | **MIT**, confirmado no cabeçalho do CSS servido ("Licensed under MIT") |
| Devicon v2.14.0 | `cdn.jsdelivr.net/gh/devicons/devicon` | MIT pelo repositório oficial; o CSS servido não traz cabeçalho de licença **(incerto pelo arquivo, conhecido pelo projeto)**. Os logos representam marcas registradas de terceiros (Microsoft, GitHub etc.) |
| Poppins e Itim | Google Fonts | SIL Open Font License 1.1 (licença padrão dessas famílias no Google Fonts; não aparece em arquivo do repositório) |
| WhatsApp, GitHub, LinkedIn | links externos (`index.html:69`, `:97`, `:98`) | — |

**Arquivo de licença no repositório:** nenhum.

**Atenção de privacidade:** o número de telefone pessoal aparece em texto puro no link do WhatsApp (`index.html:69`). Num site público, fica exposto a coleta automática. Vale decidir isso conscientemente na reformulação.

## 9. Qualidade

**HTML inválido ou quebrado**
- `index.html:5`: `http-equive` (erro de digitação) faz a meta tag não ter efeito, que de qualquer forma é obsoleta.
- `index.html:6`: `content="width=device-width , initial-scale=1.0"` tem espaço antes da vírgula. Os navegadores toleram.
- `index.html:32`: `li>` sem `<` (texto visível no menu).
- `index.html:91`: `<h3>` como filho direto de `<ul>` (só `<li>` é permitido).
- `index.html:69-71`, `:97-98`: `<button>` dentro de `<a>`, elemento interativo dentro de outro (inválido, e gera dois pontos de foco).
- `index.html:211`: `</script>` sobrando.

**Código morto ou sem uso**
- Seção Experiences inteira comentada (`index.html:105-122`) e a imagem `fluxoConsultoria.png`, usada só ali.
- Seletores sem elemento correspondente: `.experiences` (`style.css:34`), `.contact` (`:46`), `h3.subtitulo` (`:91`), `.menu-mobile-icon` (`:166-179`).
- `font-family: 'Segoe UI'` sem efeito (`:248`); `section.about .interface { max-width: 1200px }` repete quase o `.interface` geral.
- Fonte Itim carregada sem uso; 14 variantes de Poppins sem uso.
- `body { height: 100vh }` (`:16`) não faz nada útil.
- `transition` no menu mobile que não anima (`:438`).

**Duplicação**
- Rótulos do menu repetidos (desktop e mobile).
- 8 blocos de skill copiados à mão; 3 cards de projeto iguais.
- Media queries de 768px em 5 lugares; duas definições conflitantes de `.menu-mobile`; `.menu-desktop` definido 3 vezes.
- Fundo preto declarado em ~12 regras; cada seção redefine `background-color: black` já herdado de `section`.

**Acessibilidade**
- *Alt das imagens:* `:75` tem alt de placeholder ("Para colocar uma foto de corpo inteiro"); `:86` "My photo" é genérico; os projetos são `<div>` com imagem de fundo, sem nenhum texto alternativo.
- *Hierarquia de títulos:* **dois `<h1>`** (logo `:24` e Home `:66`); `h2` nas seções; `h3` usado para nomes de skill e para a frase do About.
- *Nome acessível:* os botões do GitHub e do LinkedIn (`:97-98`) só têm ícone, sem `aria-label` nem texto, e um leitor de tela anuncia "botão" sem dizer de quê. Os ícones de fonte não têm `aria-hidden`.
- *Contraste* (calculado pelas cores do CSS):
  - links do header `rgb(105,105,105)` sobre preto ≈ **3,8:1**, **reprova** no WCAG AA (4,5:1) para texto normal;
  - ícones brancos sobre `#12efff` nos botões sociais ≈ **1,4:1**, **reprova** com folga;
  - ciano sobre preto ≈ 14,8:1 e `rgb(197,197,197)` sobre preto ≈ 12:1, ambos OK.
- *Teclado:* o hambúrguer e o "X" são `<div>` sem `tabindex`, então **o menu mobile não abre pelo teclado**. Não há estilos de `:focus-visible` (resta o contorno padrão do navegador). Os efeitos existem só em `:hover`. O menu aberto não prende o foco e não fecha com Esc.
- *Zoom e tamanho de texto:* fontes em `vh` não aumentam com o zoom do navegador nem com a configuração de tamanho de texto do sistema (problema conhecido de WCAG 1.4.4).
- *Movimento:* nenhuma regra `prefers-reduced-motion` (item 5).
- *Idioma:* `lang="pt-br"` com conteúdo em inglês faz o leitor de tela pronunciar o texto com regras de português.

**SEO básico**
- `<title>`: "Portifólio Rafael El Shafie" (com o erro "Portifólio" em vez de "Portfólio"; o nome da pasta repete a grafia).
- Meta description: **ausente**.
- Open Graph / Twitter Card: **ausentes** (o link compartilhado em LinkedIn ou WhatsApp sai sem imagem nem descrição).
- Favicon: **ausente**.
- Também faltam URL canônica, `robots.txt` e `sitemap.xml`.

## 10. Avaliação

**Vale reaproveitar**
- **Conteúdo:** nome e tagline, bullets do About, links do GitHub e do LinkedIn, lista de skills e o item de experiência da Fluxo Consultoria. Provavelmente estão desatualizados: "Student", "B1", "© 2024" e o tamanho da lista de skills merecem revisão.
- **Identidade visual:** a dupla preto + ciano `#12efff`, que pode virar o token de cor de destaque do tema escuro, e a ideia do logo "Rafa**Shafie**" com destaque na segunda parte.
- **Escolha de ícones:** Devicon para tecnologias e Bootstrap Icons para interface (as duas MIT). Vale atualizar versões ou trocar por SVG local.
- **Logo da Fluxo.** A foto serve como provisória, mas o ideal é uma versão de resolução maior que 200×200.

**Sai mais barato reescrever**
- **Todo o CSS:** sem variáveis, com cascata conflitante, unidades `vh` e bugs de celular.
- **Menu e navegação:** bugs de HTML, gaveta que não fecha, falta de teclado e de seção ativa.
- **Projetos:** hoje são só placeholders, e não há nada de "alimentado por dados" para aproveitar.
- **Experiences:** marcação comentada e sem CSS.
- **`<head>`:** SEO, favicon, OG e fontes.

**Três caminhos**

| Caminho | Esforço | O que pesa |
|---|---|---|
| **(a) Manter a base e ajustar** | **Médio** | A base é pequena (≈720 linhas no total), mas cada requisito novo atinge quase todas as linhas. O tema exige refazer todas as cores. Idiomas exigem tirar todo texto do HTML e criar JS de tradução no cliente, que é pior para SEO, ou duplicar o HTML por idioma, que é duplicação manual. Projetos via dados exigem JS próprio de renderização e ocultação. Ainda é preciso corrigir os bugs existentes. No fim sobra pouco do original, mas com as amarras dele (nomes de classe, estrutura `.interface`/`.flex`). Deploy na Vercel: trivial (site estático). |
| **(b) Migrar para Astro** | **Médio** | Exige Node, `package.json` e aprender o básico de componentes `.astro`, o que inclui uma curva de aprendizado. Em troca, resolve de fábrica o que vem pela frente: **i18n por rota** (`/pt/`, `/en/`) com HTML estático por idioma, que é bom para SEO; **content collections** com schema para Projetos e Experiências (seção some com um `if` quando a coleção está vazia); componentes para eliminar a duplicação do menu, das skills e dos cards; deploy na **Vercel sem configuração** (saída estática). O conteúdo atual entra como dados; quase nenhum código atual é reaproveitado. |
| **(c) Reescrever do zero (HTML/CSS/JS puro)** | **Médio** | O visual novo e o tema claro/escuro são simples com variáveis CSS desde o início. O que pesa: **i18n** (ou páginas duplicadas por idioma, ou tradução em JS no cliente) e **dados** (fetch de JSON + renderização + ocultação escritos à mão). Fica sem build, o que é bom para manutenção, mas a infraestrutura é toda própria. Deploy na Vercel: trivial. |

**Leitura geral:** o código atual não é um ativo; o que vale está no conteúdo e na identidade. Entre (b) e (c) o esforço inicial é parecido. A diferença é que, para "vários idiomas + seções alimentadas por dados + Vercel", o Astro já resolve essas três coisas, enquanto em (c) cada uma precisa ser construída à mão. O caminho (a) não economiza trabalho de verdade, porque os requisitos novos obrigam a mexer em praticamente tudo. A decisão fica para o planejamento.

**O que eu rodaria (e não rodei)**
- Nada é necessário para auditar ou rodar o site atual: não há dependências.
- Para conferir os itens marcados como "não testado" (menu desktop no celular, Home e Projetos em tela estreita, efeito de hover dos projetos), basta abrir `index.html` no navegador com o DevTools em modo celular. Isso não altera arquivos.
- Para auditoria automática de acessibilidade e SEO, rodaria o Lighthouse do Chrome na página aberta, que também não altera arquivos.
