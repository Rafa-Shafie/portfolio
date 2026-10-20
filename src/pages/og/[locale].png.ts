/**
 * Imagem Open Graph (1200×630) gerada no build, uma por idioma: /og/pt.png.
 * O satori desenha o layout com a Poppins e o sharp converte o SVG em PNG.
 *
 * Open Graph é a imagem e o texto que aparecem quando alguém cola o link do site no LinkedIn,
 * WhatsApp ou Slack. O BaseLayout aponta para esta imagem na tag <meta property="og:image">.
 *
 * Como funciona: o satori recebe uma árvore de elementos parecida com HTML (montada com a função
 * `el` abaixo) e estilos no formato do CSS flexbox, e devolve um SVG. Gerar no build, e não à mão
 * num editor de imagem, mantém a imagem sempre igual ao site: trocou o headline no dicionário, a
 * imagem acompanha no próximo build, nos três idiomas.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { locales, useTranslations, type Locale } from '../../i18n/utils';

export const getStaticPaths = (() => locales.map((locale) => ({ params: { locale } }))) satisfies GetStaticPaths;

const colors = { bg: '#0b1117', text: '#e6edf3', muted: '#9aa7b4', accent: '#12efff' };

// O build roda na raiz do projeto
const fontFile = (weight: number) =>
	readFile(resolve(`node_modules/@fontsource/poppins/files/poppins-latin-${weight}-normal.woff`));

// O satori não baixa arquivos: toda imagem entra embutida como "data URL" (o arquivo em base64
// dentro do próprio texto). A foto é recortada em quadrado, pelo topo, para o rosto não ser cortado.
async function photoDataUrl() {
	const jpeg = await sharp(resolve('src/assets/rafael.jpg')).resize(360, 360, { position: 'top' }).jpeg({ quality: 85 }).toBuffer();
	return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

// Marca gerada pelo npm run brand; currentColor vira as cores fixas da imagem
async function brandImages() {
	const read = (file: string) => readFile(resolve('src/assets/brand', file), 'utf-8');
	const toDataUrl = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
	const [mark, wordmark] = await Promise.all([read('mark.svg'), read('wordmark.svg')]);
	const [, , w, h] = (wordmark.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 1 1').split(' ').map(Number);
	return {
		mark: { src: toDataUrl(mark.replaceAll('currentColor', colors.accent)) },
		wordmark: { src: toDataUrl(wordmark.replaceAll('currentColor', colors.text)), width: Math.round((32 * w) / h) },
	};
}

const img = (src: string, width: number, height: number): Node => ({
	type: 'img',
	props: { src, width, height, style: { width, height } },
});

// O satori exige display explícito em elementos com filhos; flex é o padrão aqui
type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
	type,
	props: { style: { display: 'flex', ...style }, children },
});

export const GET: APIRoute = async ({ params }) => {
	const t = useTranslations(params.locale as Locale);
	// Promise.all lê as fontes, a foto e a marca ao mesmo tempo, em vez de uma depois da outra
	const [regular, semibold, bold, photo, brand] = await Promise.all([
		fontFile(400),
		fontFile(600),
		fontFile(700),
		photoDataUrl(),
		brandImages(),
	]);

	const tree = el(
		'div',
		{
			width: 1200,
			height: 630,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '72px 80px',
			backgroundColor: colors.bg,
			color: colors.text,
			fontFamily: 'Poppins',
			borderBottom: `12px solid ${colors.accent}`,
		},
		el(
			'div',
			{ flexDirection: 'column', maxWidth: 700 },
			// Marca em SVG (a mesma do cabeçalho)
			el(
				'div',
				{ alignItems: 'center', gap: 16 },
				img(brand.mark.src, 56, 56),
				img(brand.wordmark.src, brand.wordmark.width, 32),
			),
			// Nome em duas linhas, com "Shafie" centralizado sob "Rafael El", como no hero
			el(
				'div',
				{ marginTop: 52, flexDirection: 'column', alignItems: 'center', alignSelf: 'flex-start' },
				el('div', { fontSize: 84, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }, 'Rafael El'),
				el('div', { fontSize: 84, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }, 'Shafie'),
			),
			el('div', { marginTop: 28, fontSize: 26, fontWeight: 600, color: colors.accent }, t.hero.headline),
		),
		{
			type: 'img',
			props: {
				src: photo,
				width: 340,
				height: 340,
				style: { borderRadius: '50%', border: `8px solid ${colors.accent}` },
			},
		},
	);

	const svg = await satori(tree, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Poppins', data: regular, weight: 400, style: 'normal' },
			{ name: 'Poppins', data: semibold, weight: 600, style: 'normal' },
			{ name: 'Poppins', data: bold, weight: 700, style: 'normal' },
		],
	});
	// As redes sociais não aceitam SVG como imagem de prévia: o sharp converte para PNG
	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
