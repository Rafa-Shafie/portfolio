# Como trocar o currículo

O site serve os PDFs de `public/cv/`, um por idioma:

| Idioma | Arquivo |
|---|---|
| Português (`/`) | `public/cv/rafael-el-shafie-cv-pt.pdf` |
| Inglês (`/en/`) | `public/cv/rafael-el-shafie-cv-en.pdf` |
| Espanhol (`/es/`) | `public/cv/rafael-el-shafie-cv-es.pdf` |

## Passo a passo
1. No Canva, exporte os três currículos em **PDF padrão**, com texto e não como imagem, e **sem telefone**.
2. Substitua os arquivos acima, mantendo exatamente os mesmos nomes.
3. Rode `npm run check:cv`. Se aparecer `Currículos aprovados.`, pode seguir.
4. Faça commit e push. A Vercel publica sozinha, e o tamanho mostrado no site ("PDF · 80 kB") se atualiza no build.

## A guarda automática
`scripts/check-cv.mjs` roda antes de todo `npm run build`, inclusive na Vercel e no CI. Se encontrar um telefone ou um link de WhatsApp em qualquer um dos três PDFs, **o build falha e nada é publicado**. Ela procura em:

- texto das páginas;
- marcadores;
- metadados;
- todas as strings internas do arquivo, inclusive as comprimidas. É aí que fica, por exemplo, a árvore de acessibilidade, onde um telefone já apareceu escondido uma vez.

O build também falha se faltar um dos arquivos ou se o texto do PDF não puder ser lido (por exemplo, quando o PDF foi exportado como imagem), porque nesse caso a busca não seria confiável.

**Os textos do site não mudam sozinhos.** Experiências, habilidades e projetos ficam em `src/content/` e `src/data/`, e precisam ser atualizados à mão quando o conteúdo do CV muda.
