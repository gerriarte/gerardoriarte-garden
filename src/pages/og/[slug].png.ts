import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { construirRed } from '../../lib/grafo';
import { ESTADOS } from '../../lib/estados';
import { SITIO, AUTOR } from '../../lib/sitio';

/**
 * Imágenes para compartir, generadas en build.
 *
 * sharp ya viene con Astro, así que esto no suma dependencias. Se rasteriza
 * un SVG con la misma lámina del sitio: pergamino, tinta sepia y el sombrero
 * ámbar.
 *
 * OJO CON LAS TIPOGRAFÍAS: el SVG se rasteriza con las fuentes instaladas en
 * la MÁQUINA DE BUILD, no con las que carga el navegador. Fraunces y Newsreader
 * no van a estar en el contenedor de Vercel, así que se pide una pila que
 * degrade a un serif decente en Linux. La imagen no va a usar la tipografía
 * exacta del sitio; el resto de la identidad (papel, tinta, ámbar) sí.
 */

const ANCHO = 1200;
const ALTO = 630;
const SERIF = "Georgia, 'DejaVu Serif', 'Liberation Serif', serif";
const MONO = "'Courier New', 'DejaVu Sans Mono', monospace";

const escapar = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Corta un texto en renglones que entren en `max` caracteres. */
function renglones(texto: string, max: number, tope = 3): string[] {
  const palabras = texto.split(/\s+/);
  const out: string[] = [];
  let linea = '';
  for (const p of palabras) {
    if ((linea + ' ' + p).trim().length > max && linea) {
      out.push(linea);
      linea = p;
    } else {
      linea = (linea + ' ' + p).trim();
    }
  }
  if (linea) out.push(linea);
  return out.slice(0, tope);
}

export async function getStaticPaths() {
  const { conceptos } = await construirRed();
  return [
    { params: { slug: 'sitio' }, props: { concepto: null } },
    ...conceptos.map((c) => ({ params: { slug: c.slug }, props: { concepto: c } })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const c = (props as any).concepto;

  const kicker = c
    ? `${ESTADOS[c.estado].label} · ${c.dominio}`
    : 'jardín de conceptos';
  const bajada = c ? (c.resumen ?? '') : SITIO.tesis;

  // El titular del sitio ya viene cortado en renglones desde lib/sitio;
  // el de un concepto se corta acá según su largo.
  const lineasTitulo = c ? renglones(c.titulo, 24, 3) : [...SITIO.titular];
  const tamTitulo = lineasTitulo.length > 2 ? 68 : 84;
  const yTitulo = 258;

  const lineasBajada = renglones(bajada, 62, 3);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}" viewBox="0 0 ${ANCHO} ${ALTO}">
  <rect width="${ANCHO}" height="${ALTO}" fill="#e8dcc4"/>
  <rect x="0" y="430" width="${ANCHO}" height="200" fill="#d3c199" opacity="0.55"/>
  <path d="M0 430 L${ANCHO} 430" stroke="#2a2018" stroke-width="2.5" fill="none"/>
  ${Array.from({ length: 60 }, (_, i) => {
    const x = 12 + i * 20;
    return `<path d="M${x} 436 L${x + 3} 452" stroke="#2a2018" stroke-width="1.4" opacity="0.3"/>`;
  }).join('')}

  <!-- cuerpo fructífero -->
  <g transform="translate(1010 430)">
    <path d="M-7 0 C-7 -46, -6 -78, -5 -92 L5 -92 C6 -78, 7 -46, 7 0 Z" fill="#f0e7d3" stroke="#2a2018" stroke-width="2.4"/>
    <path d="M-52 -92 C-52 -158, 52 -158, 52 -92 Q0 -78, -52 -92 Z" fill="#c4871a" stroke="#2a2018" stroke-width="2.8"/>
  </g>
  <!-- hifas que lo alimentan -->
  <path d="M1010 434 C900 470, 800 500, 690 540" stroke="#2a2018" stroke-width="1.8" fill="none" opacity="0.4"/>
  <path d="M1010 434 C1060 480, 1100 520, 1150 556" stroke="#2a2018" stroke-width="1.8" fill="none" opacity="0.4"/>
  <path d="M1010 434 C960 490, 940 540, 930 590" stroke="#2a2018" stroke-width="1.8" fill="none" opacity="0.4"/>

  <rect x="28" y="28" width="${ANCHO - 56}" height="${ALTO - 56}" fill="none" stroke="#2a2018" stroke-width="1.5" opacity="0.35"/>

  <text x="72" y="120" font-family="${MONO}" font-size="22" letter-spacing="5" fill="#6b5b45">${escapar(
    kicker.toUpperCase()
  )}</text>

  ${lineasTitulo
    .map(
      (l, i) =>
        `<text x="72" y="${yTitulo + i * (tamTitulo + 12) - (lineasTitulo.length - 1) * (tamTitulo + 12) * 0.5}" font-family="${SERIF}" font-size="${tamTitulo}" font-weight="700" fill="#2a2018">${escapar(
          l
        )}</text>`
    )
    .join('')}

  ${lineasBajada
    .map(
      (l, i) =>
        `<text x="72" y="${492 + i * 34}" font-family="${SERIF}" font-size="25" fill="#4a3f30">${escapar(
          l
        )}</text>`
    )
    .join('')}

  <text x="72" y="${ALTO - 62}" font-family="${MONO}" font-size="21" fill="#6b5b45">${escapar(
    AUTOR.nombre
  )} · gerardoriarte.com</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
