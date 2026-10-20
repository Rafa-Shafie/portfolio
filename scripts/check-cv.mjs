/**
 * Guarda do currículo: roda antes de todo build (`prebuild`), inclusive no deploy da Vercel.
 * Se algum PDF em public/cv/ tiver telefone ou link de WhatsApp, o build falha e nada é publicado.
 *
 * Procura em quatro lugares, porque o telefone já apareceu escondido fora do texto visível:
 * texto das páginas, marcadores (outline), metadados e todas as strings do arquivo, inclusive
 * dentro de streams comprimidos (onde fica, por exemplo, a árvore de acessibilidade).
 *
 * Uso: node scripts/check-cv.mjs [pasta]   (padrão: public/cv)
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { inflateSync } from 'node:zlib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const dir = resolve(process.argv[2] ?? 'public/cv');
const files = ['pt', 'en', 'es'].map((locale) => `rafael-el-shafie-cv-${locale}.pdf`);

// Celular brasileiro: +55 opcional, DDD, 9 e oito dígitos, com ou sem separadores
const PHONE = /(?:\+?\s*55[\s.-]*)?\(?\b[1-9]{2}\)?[\s.-]*9[\s.-]?\d{4}[\s.-]?\d{4}\b/;
const PHONE_LINK = /\btel:|wa\.me|api\.whatsapp\.com/i;

/** Mostra só os dois últimos dígitos: o log do build não deve repetir o número. */
const mask = (match) => match.replace(/\d(?=(?:\D*\d){2})/g, '•');

/** Texto de uma string PDF: UTF-16 com BOM ou bytes simples. */
function decodePdfString(bytes) {
	if (bytes[0] === 0xfe && bytes[1] === 0xff) {
		let text = '';
		for (let i = 2; i + 1 < bytes.length; i += 2) text += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
		return text;
	}
	return Buffer.from(bytes).toString('latin1');
}

/** Bytes de uma string literal "(...)", resolvendo os escapes do PDF. */
function literalBytes(body) {
	const out = [];
	for (let i = 0; i < body.length; i++) {
		const c = body[i];
		if (c !== '\\') {
			out.push(c.charCodeAt(0) & 0xff);
			continue;
		}
		const next = body[++i];
		const simple = { n: 10, r: 13, t: 9, b: 8, f: 12, '(': 40, ')': 41, '\\': 92 };
		if (next in simple) out.push(simple[next]);
		else if (/[0-7]/.test(next)) {
			let octal = next;
			while (octal.length < 3 && /[0-7]/.test(body[i + 1])) octal += body[++i];
			out.push(parseInt(octal, 8) & 0xff);
		}
	}
	return out;
}

/** Todas as strings do arquivo, inclusive as de streams comprimidos com Flate. */
function rawStrings(buffer) {
	const chunks = [buffer.toString('latin1')];
	const raw = chunks[0];
	// "endstream" também termina em "stream": sem o lookbehind, a leitura começaria no lugar errado
	const streamStart = /(?<!end)stream\r?\n/g;
	let match;
	while ((match = streamStart.exec(raw))) {
		const start = match.index + match[0].length;
		const end = raw.indexOf('endstream', start);
		if (end < 0) break;
		try {
			chunks.push(inflateSync(buffer.subarray(start, end)).toString('latin1'));
		} catch {
			// Stream sem compressão Flate (imagem, fonte em outro filtro): já está em `raw`
		}
		streamStart.lastIndex = end + 'endstream'.length;
	}

	const strings = [];
	for (const chunk of chunks) {
		strings.push(chunk);
		for (const [, body] of chunk.matchAll(/\(((?:\\.|[^\\()])*)\)/gs)) strings.push(decodePdfString(literalBytes(body)));
		for (const [, hex] of chunk.matchAll(/<([0-9A-Fa-f\s]{4,})>/g)) {
			const clean = hex.replace(/\s/g, '');
			const bytes = clean.match(/../g)?.map((pair) => parseInt(pair, 16)) ?? [];
			strings.push(decodePdfString(bytes));
		}
	}
	return strings;
}

/** Texto visível, marcadores e metadados, lidos pelo pdf.js. */
async function readablePlaces(buffer) {
	const doc = await getDocument({ data: new Uint8Array(buffer), isEvalSupported: false, verbosity: 0 }).promise;
	const places = [];
	for (let n = 1; n <= doc.numPages; n++) {
		const page = await doc.getPage(n);
		const content = await page.getTextContent();
		places.push({ where: `no texto da página ${n}`, text: content.items.map((item) => item.str ?? '').join(' ') });
	}
	const titles = [];
	const walk = (items = []) => items.forEach((item) => (titles.push(item.title), walk(item.items)));
	walk((await doc.getOutline()) ?? []);
	places.push({ where: 'nos marcadores', text: titles.join(' | ') });
	const { info, metadata } = await doc.getMetadata();
	places.push({ where: 'nos metadados', text: JSON.stringify(info) + JSON.stringify(metadata?.getAll() ?? {}) });
	await doc.destroy();
	return places;
}

let failures = 0;
const fail = (message) => {
	failures++;
	console.error(`  ✗ ${message}`);
};

console.log(`Checando os currículos em ${dir}`);
for (const file of files) {
	const path = join(dir, file);
	console.log(`- ${file}`);
	const before = failures;
	if (!existsSync(path)) {
		fail('arquivo não encontrado (o site aponta para este nome)');
		continue;
	}
	const buffer = readFileSync(path);
	if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
		fail('não é um PDF');
		continue;
	}

	let places;
	try {
		places = await readablePlaces(buffer);
	} catch (error) {
		fail(`não foi possível ler o PDF (${error.message})`);
		continue;
	}

	// Sem texto legível, a busca no texto seria vazia: melhor falhar do que aprovar às cegas
	const pageText = places.filter((p) => p.where.startsWith('no texto')).map((p) => p.text).join(' ');
	if (!/Rafael/i.test(pageText) || !/Shafie/i.test(pageText)) {
		fail('o texto das páginas não pôde ser lido (o nome não foi encontrado); exporte o PDF com texto, não como imagem');
	}

	for (const { where, text } of places) {
		const phone = text.match(PHONE);
		if (phone) fail(`telefone ${where}: ${mask(phone[0])}`);
		if (PHONE_LINK.test(text)) fail(`link de telefone ou WhatsApp ${where}`);
	}

	const hidden = rawStrings(buffer);
	const phone = hidden.map((s) => s.match(PHONE)).find(Boolean);
	if (phone) fail(`telefone escondido no arquivo (fora do texto visível): ${mask(phone[0])}`);
	if (hidden.some((s) => PHONE_LINK.test(s))) fail('link de telefone ou WhatsApp escondido no arquivo');

	if (failures === before) console.log('  ✓ sem telefone');
}

if (failures > 0) {
	console.error('\nCurrículo bloqueado: corrija os itens acima (telefone: remova no Canva, exporte de novo e substitua o PDF).');
	process.exit(1);
}
console.log('Currículos aprovados.');
