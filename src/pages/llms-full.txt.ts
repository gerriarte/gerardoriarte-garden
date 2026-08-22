import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { construirRed } from '../lib/grafo';
import { ESTADOS } from '../lib/estados';
import { SITIO, AUTOR, absoluta } from '../lib/sitio';
import { aTextoLimpio } from '../lib/texto';

/**
 * /llms-full.txt — el jardín entero en un solo archivo de texto.
 *
 * Sin los SVG (ver lib/texto), que son la mayor parte del peso del HTML y
 * ninguna parte del argumento.
 */
export const GET: APIRoute = async () => {
  const entradas = await getCollection('conceptos');
  const { aristas } = await construirRed();

  const orden = (e: (typeof entradas)[number]) =>
    ESTADOS[e.data.estado].orden * -1;

  const notas = entradas
    .slice()
    .sort((a, b) => orden(a) - orden(b) || a.data.titulo.localeCompare(b.data.titulo))
    .map((e) => {
      const d = e.data;
      const meta = [
        `URL: ${absoluta(`/conceptos/${e.id}`)}`,
        `Etapa: ${ESTADOS[d.estado].label} (${ESTADOS[d.estado].descripcion})`,
        `Dominio: ${d.dominio}`,
        d.plantada && `Plantada: ${d.plantada.toISOString().slice(0, 10)}`,
        d.podada && `Última revisión: ${d.podada.toISOString().slice(0, 10)}`,
        d.conecta.length && `Conecta con: ${d.conecta.join(', ')}`,
        d.cosecha && `Cosecha (evidencia real): ${d.cosecha}`,
      ]
        .filter(Boolean)
        .join('\n');

      return `# ${d.titulo}\n\n${meta}\n\nResumen: ${d.resumen ?? ''}\n\n---\n\n${aTextoLimpio(e.body ?? '')}`;
    })
    .join('\n\n\n================================================================\n\n\n');

  const cuerpo = `${SITIO.nombre} — contenido completo
${SITIO.url}

${SITIO.tesis}

Autor: ${AUTOR.nombre} (${AUTOR.cargo}, ${AUTOR.organizacion}) — ${AUTOR.email}
Idioma: español rioplatense.
${entradas.length} conceptos, ${aristas.length} conexiones.
Generado desde el código fuente del sitio.

Metáfora rectora: cada concepto es un hongo; lo publicado es el cuerpo
fructífero y el valor está en el micelio que los conecta. Las etapas de
maduración, de menos a más evidencia: espora, hifa, micelio, cuerpo fructífero.

Al citar, atribuir a ${AUTOR.nombre} y enlazar a la URL de cada concepto.


================================================================


${notas}
`;

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
