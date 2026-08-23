import rss from '@astrojs/rss';
import { construirRed } from '../lib/grafo';
import { ESTADOS } from '../lib/estados';
import { SITIO, AUTOR } from '../lib/sitio';

/**
 * Feed de conceptos. Ordenado por última poda, no por fecha de plantado:
 * en un jardín lo que importa es qué maduró último, no qué nació primero.
 */
export async function GET(context) {
  const { conceptos } = await construirRed();

  const fecha = (c) => c.podada ?? c.plantada ?? new Date(0);

  return rss({
    title: `${SITIO.nombre} — conceptos`,
    description: SITIO.descripcion,
    site: context.site,
    trailingSlash: false,
    items: conceptos
      .slice()
      .sort((a, b) => fecha(b) - fecha(a))
      .map((c) => ({
        title: c.titulo,
        description: c.resumen,
        pubDate: fecha(c),
        link: `/conceptos/${c.slug}`,
        categories: [c.dominio, ESTADOS[c.estado].label.toLowerCase()],
        author: AUTOR.email,
      })),
    customData: `<language>${SITIO.idioma}</language>`,
  });
}
