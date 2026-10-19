/**
 * Gera a marca do site a partir dos contornos da fonte Itim (OFL):
 *   src/assets/brand/mark.svg       monograma RS com contorno (cabeçalho)
 *   src/assets/brand/wordmark.svg   "Rafa" + "Shafie" (cabeçalho e imagem OG)
 *   public/favicon.svg              monograma otimizado para 16–32 px, com fundo
 *   public/apple-touch-icon.png     ícone de 180 px para a tela inicial
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

const COLORS = { bg: '#0b1117', text: '#e6edf3', accent: '#12efff' };
const FONT_FILE = 'node_modules/@fontsource/itim/files/itim-latin-400-normal.woff';

const buf = readFileSync(resolve(FONT_FILE));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const round = (n) => Math.round(n * 100) / 100;

// O toPathData da opentype.js 2.0 gera "NaN" em algumas posições mesmo com coordenadas válidas,
// então a conversão para texto é feita aqui, e qualquer coordenada inválida interrompe o script.
function fmt(n) {
	if (!Number.isFinite(n)) throw new Error(`coordenada inválida: ${n}`);
	return String(round(n));
}
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

const strokeAttrs = (color, width) =>
	width > 0 ? ` stroke="${color}" stroke-width="${width}" stroke-linejoin="round"` : '';

/** Monograma RS centralizado pelo desenho das letras dentro de um quadrado arredondado. */
/**
 * Monograma: o R na cor do texto (classe .mark-r, que o CSS pode sobrescrever) e o S no destaque,
 * como "Rafa" e "Shafie" no wordmark. Contorno na cor de destaque.
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
	// Limita pela altura e pela largura: o RS da Itim é mais largo que alto
	const probe = layout('RS', 0, 0, 100).path.getBoundingBox();
	const fontSize = 100 * Math.min((size * capRatio) / (probe.y2 - probe.y1), (size * widthRatio) / (probe.x2 - probe.x1));
	const box = layout('RS', 0, 0, fontSize).path.getBoundingBox();
	const x = size / 2 - (box.x1 + box.x2) / 2;
	const y = size / 2 - (box.y1 + box.y2) / 2;
	// R e S separados, na mesma posição que teriam juntos (avanço do R + kerning do par)
	const r = layout('R', x, y, fontSize);
	const kern = font.getKerningValue(font.charToGlyph('R'), font.charToGlyph('S'));
	const s = layout('S', r.end + (Number.isFinite(kern) ? kern : 0) * (fontSize / font.unitsPerEm), y, fontSize);
	const inset = frame / 2;
	const bg = background ? ` fill="${background}"` : ' fill="none"';
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect x="${inset}" y="${inset}" width="${size - frame}" height="${size - frame}" rx="${radius}"${bg} stroke="${color}" stroke-width="${frame}"/>
  <path class="mark-r" fill="${first}"${strokeAttrs(first, bold)} d="${pathData(r.path)}"/>
  <path fill="${color}"${strokeAttrs(color, bold)} d="${pathData(s.path)}"/>
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

// Favicon: letras maiores, contorno mais grosso e fundo escuro para ler bem em 16 px
const favicon = monogram({ capRatio: 0.52, widthRatio: 0.68, frame: 3.5, radius: 11, bold: 1.8, color: COLORS.accent, background: COLORS.bg });

mkdirSync(resolve('src/assets/brand'), { recursive: true });
writeFileSync(resolve('src/assets/brand/mark.svg'), monogram({}));
writeFileSync(resolve('src/assets/brand/wordmark.svg'), wordmark({}));
writeFileSync(resolve('public/favicon.svg'), favicon);
await sharp(Buffer.from(favicon), { density: 600 }).resize(180, 180).png().toFile(resolve('public/apple-touch-icon.png'));

console.log('marca gerada: mark.svg, wordmark.svg, favicon.svg, apple-touch-icon.png');
