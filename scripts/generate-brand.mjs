/**
 * Gera a marca do site a partir dos contornos da fonte Itim (OFL):
 *   src/assets/brand/mark.svg       monograma RS com contorno (cabeçalho)
 *   src/assets/brand/wordmark.svg   "Rafa" + "Shafie" (cabeçalho e imagem OG)
 *   public/favicon.svg              só as letras RS, ocupando o quadrado, com cores que seguem o tema
 *                                   do sistema (a barra de abas pode ser clara ou escura)
 *   public/apple-touch-icon.png     ícone de 180 px para a tela inicial, com fundo escuro
 *
 * Uso: npm run brand. Os arquivos gerados ficam versionados; o build não roda este script.
 *
 * A Itim tem um peso só; o "reforço" engrossa o traço das letras com um contorno da mesma cor.
 * As letras viram desenho para o RS ficar centralizado pelo desenho real (e não pela caixa da
 * fonte) e para a marca não depender de baixar a fonte no navegador.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';

// Cores do tema escuro (as mesmas de tokens.css). No site, o CSS troca as cores do mark e do
// wordmark pelos tokens; estas valem para o favicon e o ícone, que não passam pelo CSS.
const COLORS = { bg: '#0b1117', text: '#e6edf3', accent: '#12efff' };
// Tema claro (tokens.css): texto quase preto e ciano escuro. O ciano claro teria ~1,4:1 sobre a
// barra de abas branca, e um R branco sumiria nela
const LIGHT = { text: '#0f172a', accent: '#0e7490' };
const FONT_FILE = 'node_modules/@fontsource/itim/files/itim-latin-400-normal.woff';

// A opentype.js lê o arquivo da fonte e dá acesso ao desenho (contorno) de cada letra
const buf = readFileSync(resolve(FONT_FILE));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

// Duas casas decimais bastam para o SVG e deixam o arquivo bem menor
const round = (n) => Math.round(n * 100) / 100;

// O toPathData da opentype.js 2.0 gera "NaN" em algumas posições mesmo com coordenadas válidas,
// então a conversão para texto é feita aqui, e qualquer coordenada inválida interrompe o script.
function fmt(n) {
	if (!Number.isFinite(n)) throw new Error(`coordenada inválida: ${n}`);
	return String(round(n));
}
// Converte os comandos de desenho da letra para o atributo `d` de um <path> SVG:
// M = mover a caneta, L = linha reta, Q e C = curvas (quadrática e cúbica), Z = fechar a forma.
function pathData(path) {
	return path.commands
		.map((c) => {
			switch (c.type) {
				case 'M':
				case 'L':
					return `${c.type}${fmt(c.x)} ${fmt(c.y)}`;
				case 'Q':
					return `Q${fmt(c.x1)} ${fmt(c.y1)} ${fmt(c.x)} ${fmt(c.y)}`;
				case 'C':
					return `C${fmt(c.x1)} ${fmt(c.y1)} ${fmt(c.x2)} ${fmt(c.y2)} ${fmt(c.x)} ${fmt(c.y)}`;
				case 'Z':
					return 'Z';
				default:
					throw new Error(`comando desconhecido: ${c.type}`);
			}
		})
		.join('');
}

// Posiciona letra por letra: largura de cada glifo + kerning do par quando for um número válido
// (o getPath da biblioteca também produz NaN no posicionamento desta fonte).
function layout(text, x0, y, size) {
	const scale = size / font.unitsPerEm;
	const path = new opentype.Path();
	const glyphs = [...text].map((ch) => font.charToGlyph(ch));
	let x = x0;
	glyphs.forEach((glyph, i) => {
		path.extend(glyph.getPath(x, y, size));
		const next = glyphs[i + 1];
		const kern = next ? font.getKerningValue(glyph, next) : 0;
		x += (glyph.advanceWidth + (Number.isFinite(kern) ? kern : 0)) * scale;
	});
	return { path, end: x };
}

// O "reforço" do traço: um contorno da mesma cor da letra, com cantos arredondados
const strokeAttrs = (color, width) =>
	width > 0 ? ` stroke="${color}" stroke-width="${width}" stroke-linejoin="round"` : '';

/**
 * O R e o S centralizados pelo desenho real das letras num quadrado de lado `size`. A altura ocupa no
 * máximo `capRatio` do lado e a largura, `widthRatio` (o RS da Itim é mais largo que alto). Devolve o
 * desenho de cada letra separado, para cada uma ter a sua cor.
 */
function placeRS(size, capRatio, widthRatio) {
	const probe = layout('RS', 0, 0, 100).path.getBoundingBox();
	const fontSize = 100 * Math.min((size * capRatio) / (probe.y2 - probe.y1), (size * widthRatio) / (probe.x2 - probe.x1));
	const box = layout('RS', 0, 0, fontSize).path.getBoundingBox();
	const x = size / 2 - (box.x1 + box.x2) / 2;
	const y = size / 2 - (box.y1 + box.y2) / 2;
	// R e S separados, na mesma posição que teriam juntos (avanço do R + kerning do par)
	const r = layout('R', x, y, fontSize);
	const kern = font.getKerningValue(font.charToGlyph('R'), font.charToGlyph('S'));
	const s = layout('S', r.end + (Number.isFinite(kern) ? kern : 0) * (fontSize / font.unitsPerEm), y, fontSize);
	return { r: pathData(r.path), s: pathData(s.path) };
}

/**
 * Monograma RS centralizado pelo desenho das letras dentro de um quadrado arredondado.
 * O R vai na cor do texto (classe .mark-r, que o CSS pode sobrescrever) e o S no destaque, como
 * "Rafa" e "Shafie" no wordmark. Contorno na cor de destaque.
 */
function monogram({
	size = 48,
	frame = 2.5,
	radius = 10,
	capRatio = 0.44,
	widthRatio = 0.6,
	bold = 1.4,
	color = 'currentColor',
	first = COLORS.text,
	background,
}) {
	const { r, s } = placeRS(size, capRatio, widthRatio);
	const inset = frame / 2;
	const bg = background ? ` fill="${background}"` : ' fill="none"';
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect x="${inset}" y="${inset}" width="${size - frame}" height="${size - frame}" rx="${radius}"${bg} stroke="${color}" stroke-width="${frame}"/>
  <path class="mark-r" fill="${first}"${strokeAttrs(first, bold)} d="${r}"/>
  <path fill="${color}"${strokeAttrs(color, bold)} d="${s}"/>
</svg>
`;
}

/**
 * Favicon só com as letras, ocupando quase todo o quadrado (em 16 px, cada pixel conta). As cores vêm
 * de um <style> dentro do SVG: escuro por padrão (R claro, S ciano) e, com o sistema no tema claro,
 * R quase preto e S ciano escuro. Chrome, Edge e Firefox aplicam essa media query no ícone da aba.
 */
function letters({ size = 48, capRatio = 0.8, widthRatio = 0.9, bold = 2.4 }) {
	const { r, s } = placeRS(size, capRatio, widthRatio);
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <style>
    .r { fill: ${COLORS.text}; stroke: ${COLORS.text} }
    .s { fill: ${COLORS.accent}; stroke: ${COLORS.accent} }
    @media (prefers-color-scheme: light) {
      .r { fill: ${LIGHT.text}; stroke: ${LIGHT.text} }
      .s { fill: ${LIGHT.accent}; stroke: ${LIGHT.accent} }
    }
  </style>
  <path class="r" stroke-width="${bold}" stroke-linejoin="round" d="${r}"/>
  <path class="s" stroke-width="${bold}" stroke-linejoin="round" d="${s}"/>
</svg>
`;
}

/**
 * Ícone da tela inicial (iOS): o iOS preenche transparência com preto e arredonda os cantos sozinho,
 * então vai com fundo escuro de borda a borda, sem moldura, e as letras com margem.
 */
function homeIcon({ size = 48, capRatio = 0.5, widthRatio = 0.66, bold = 1.8 }) {
	const { r, s } = placeRS(size, capRatio, widthRatio);
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${COLORS.bg}"/>
  <path fill="${COLORS.text}"${strokeAttrs(COLORS.text, bold)} d="${r}"/>
  <path fill="${COLORS.accent}"${strokeAttrs(COLORS.accent, bold)} d="${s}"/>
</svg>
`;
}

/** "Rafa" na cor do texto + "Shafie" no destaque (classe .accent, que o CSS pode sobrescrever). */
function wordmark({ fontSize = 40, bold = 1.4, first = 'currentColor', second = COLORS.accent }) {
	const { path: p1, end } = layout('Rafa', 0, 0, fontSize);
	const p2 = layout('Shafie', end, 0, fontSize).path;
	const a = p1.getBoundingBox();
	const b = p2.getBoundingBox();
	const pad = bold / 2;
	const x1 = Math.min(a.x1, b.x1) - pad;
	const y1 = Math.min(a.y1, b.y1) - pad;
	const w = Math.max(a.x2, b.x2) + pad - x1;
	const h = Math.max(a.y2, b.y2) + pad - y1;
	const t = `translate(${round(-x1)} ${round(-y1)})`;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(w)} ${round(h)}">
  <path fill="${first}"${strokeAttrs(first, bold)} transform="${t}" d="${pathData(p1)}"/>
  <path class="accent" fill="${second}"${strokeAttrs(second, bold)} transform="${t}" d="${pathData(p2)}"/>
</svg>
`;
}

// Escreve os arquivos. O PNG da tela inicial (iOS) é rasterizado pelo sharp: density 600 desenha em
// alta resolução antes de reduzir para 180 px, para as bordas ficarem lisas.
mkdirSync(resolve('src/assets/brand'), { recursive: true });
writeFileSync(resolve('src/assets/brand/mark.svg'), monogram({}));
writeFileSync(resolve('src/assets/brand/wordmark.svg'), wordmark({}));
writeFileSync(resolve('public/favicon.svg'), letters({}));
await sharp(Buffer.from(homeIcon({})), { density: 600 }).resize(180, 180).png().toFile(resolve('public/apple-touch-icon.png'));

console.log('marca gerada: mark.svg, wordmark.svg, favicon.svg, apple-touch-icon.png');
