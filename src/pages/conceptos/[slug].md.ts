import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ESTADOS } from '../../lib/estados';
import { AUTOR, absoluta } from '../../lib/sitio';
import { aTextoLimpio } from '../../lib/texto';

/**
 * /conceptos/<slug>.md — cada nota en markdown limpio.
 *
 * La versión HTML de una nota larga es en su mayoría SVG. Un motor que quiera
 * citarla tiene que desarmar todo eso para llegar al texto. Esto le da la
 * fuente directa, con el frontmatter traducido a un encabezado legible.
 */
export async function getStaticPaths() {
  const conceptos = await getCollection('conceptos');
  return conceptos.map((c) => ({ params: { slug: c.id }, props: { entrada: c } }));
}

export const GET: APIRoute = async ({ props }) => {
  const e = (props as any).entrada;
  const d = e.data;

  const meta = [
    `> ${d.resumen ?? ''}`,
    '',
    `- URL: ${absoluta(`/conceptos/${e.id}`)}`,
    `- Autor: ${AUTOR.nombre}`,
    `- Etapa de maduración: ${ESTADOS[d.estado].label} — ${ESTADOS[d.estado].descripcion}`,
    `- Dominio: ${d.dominio}`,
    d.plantada && `- Plantada: ${d.plantada.toISOString().slice(0, 10)}`,
    d.podada && `- Última revisión: ${d.podada.toISOString().slice(0, 10)}`,
    d.conecta.length && `- Conecta con: ${d.conecta.join(', ')}`,
    d.cosecha && `- Cosecha (evidencia real): ${d.cosecha}`,
  ]
    .filter(Boolean)
    .join('\n');

  const cuerpo = `# ${d.titulo}\n\n${meta}\n\n---\n\n${aTextoLimpio(e.body ?? '')}\n`;

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
