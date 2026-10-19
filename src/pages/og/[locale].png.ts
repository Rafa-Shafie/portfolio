/**
 * Imagem Open Graph (1200×630) gerada no build, uma por idioma: /og/pt.png.
 * O satori desenha o layout com a Poppins e o sharp converte o SVG em PNG.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { profile } from '../../data/profile';
import { locales, useTranslations, type Locale } from '../../i18n/utils';

export const getStaticPaths = (() => locales.map((locale) => ({ params: { locale } }))) satisfies GetStaticPaths;

const colors = { bg: '#0b1117', text: '#e6edf3', muted: '#9aa7b4', accent: '#12efff' };

// O build roda na raiz do projeto
const fontFile = (weight: number) =>
	readFile(resolve(`node_modules/@fontsource/poppins/files/poppins-latin-${weight}-normal.woff`));

async function photoDataUrl() {
	const jpeg = await sharp(resolve('src/assets/rafael.jpg')).resize(360, 360).jpeg({ quality: 85 }).toBuffer();
	return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

// O satori exige display explícito em elementos com filhos; flex é o padrão aqui
type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
	type,
	props: { style: { display: 'flex', ...style }, children },
});

export const GET: APIRoute = async ({ params }) => {
	const t = useTranslations(params.locale as Locale);
	const [regular, semibold, bold, photo] = await Promise.all([
		fontFile(400),
		fontFile(600),
		fontFile(700),
		photoDataUrl(),
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
			el('div', { fontSize: 34, fontWeight: 700 }, 'Rafa', el('span', { color: colors.accent }, 'Shafie')),
			el('div', { marginTop: 56, fontSize: 72, fontWeight: 700, lineHeight: 1.1 }, profile.name),
			el('div', { marginTop: 20, fontSize: 26, fontWeight: 600, color: colors.accent }, t.hero.headline),
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
	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
