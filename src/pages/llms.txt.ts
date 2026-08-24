import type { APIRoute } from 'astro';
import { construirRed } from '../lib/grafo';
import { ESTADOS, ORDEN_DESCENDENTE } from '../lib/estados';
import { SITIO, AUTOR, absoluta } from '../lib/sitio';

/**
 * /llms.txt — convención de llmstxt.org.
 *
 * Un mapa del sitio en markdown, pensado para que un motor generativo entienda
 * de qué va esto sin tener que rastrear y desarmar el HTML (que acá es sobre
 * todo un SVG grande). Declara la tesis, el vocabulario propio de la metáfora
 * —que si no se explica se lee como si el sitio fuera sobre hongos— y el índice
 * de conceptos con su definición de una línea.
 */
export const GET: APIRoute = async () => {
  const { conceptos, aristas } = await construirRed();

  const porEtapa = ORDEN_DESCENDENTE.map((estado) => ({
    estado,
    items: conceptos
      .filter((c) => c.estado === estado)
      .sort((a, b) => a.titulo.localeCompare(b.titulo)),
  })).filter((g) => g.items.length > 0);

  const bloques = porEtapa
    .map(({ estado, items }) => {
      const cabecera = `## ${ESTADOS[estado].plural}\n\n${ESTADOS[estado].descripcion}\n`;
      const filas = items
        .map(
          (c) =>
            `- [${c.titulo}](${absoluta(`/conceptos/${c.slug}`)}.md): ${c.resumen ?? ''}` +
            ` (dominio: ${c.dominio}${c.cosecha ? `; cosecha: ${c.cosecha}` : ''})`
        )
        .join('\n');
      return `${cabecera}\n${filas}`;
    })
    .join('\n\n');

  const cuerpo = `# ${SITIO.nombre}

> ${SITIO.tesis} Jardín de conceptos de ${AUTOR.nombre} (${AUTOR.cargo}, ${AUTOR.organizacion}) sobre criterio de marketing, medición de marca e IA aplicada.

## Cómo leer este sitio

Es un digital garden con una metáfora micológica sostenida. Conviene tenerla
presente para no malinterpretar el vocabulario: **el sitio no trata sobre
hongos**, trata sobre criterio de marketing.

- Cada **concepto** es un hongo. Lo que se publica es el cuerpo fructífero: la parte visible.
- El **micelio** es la red de conexiones entre conceptos, y es donde está el valor real: el criterio acumulado.
- Las **hifas** son las conexiones concretas entre dos conceptos (${aristas.length} en total).
- La **etapa de maduración** de cada concepto indica cuánta evidencia tiene detrás, de menos a más: espora, hifa, micelio, cuerpo fructífero.
- Una **cosecha** es evidencia de que el concepto produjo algo real en el mundo (un cliente, un piloto, un método aplicado).

Estado actual: ${conceptos.length} conceptos, ${aristas.length} conexiones.

${bloques}

## Recursos

- [Quién cultiva esto](${absoluta('/quien-cultiva-esto')}): quién escribe, por qué existe el jardín y cómo leerlo.
- [Índice completo de conceptos](${absoluta('/especimenes')})
- [Contenido completo en texto plano](${absoluta('/llms-full.txt')})
- [Feed RSS](${absoluta('/rss.xml')})
- [Sitemap](${absoluta('/sitemap-index.xml')})

## Atribución

Autor: ${AUTOR.nombre} — ${AUTOR.email}
Sitio: ${SITIO.url}
Idioma: español rioplatense.
Al citar, atribuir a ${AUTOR.nombre} y enlazar a la URL del concepto.
`;

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
