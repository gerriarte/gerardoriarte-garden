/**
 * Limpieza del markdown para consumo por máquina (llms.txt, endpoints .md).
 *
 * Las notas largas traen figuras SVG inline: en la nota de Net Build Rate son
 * ~20KB de datos de `path` que para un motor generativo son ruido puro y le
 * comen la ventana de contexto. Pero el `figcaption` de esas mismas figuras
 * lleva el argumento —"38% a los 6 meses", "el techo real es 8%"— así que se
 * conserva. Se tira el dibujo, se queda la conclusión.
 */

export function aTextoLimpio(markdown: string): string {
  let t = markdown;

  // El título de la figura y su epígrafe son contenido; el dibujo no.
  t = t.replace(/<p class="fig-titulo"[^>]*>([\s\S]*?)<\/p>/g, '\n**$1**\n');
  t = t.replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/g, '\n_$1_\n');

  // Fuera los dibujos.
  t = t.replace(/<svg[\s\S]*?<\/svg>/g, '');

  // Las tablas se aplanan a filas legibles en vez de perderse.
  t = t.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/g, (_, fila) => {
    const celdas = [...fila.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(
      (m: RegExpMatchArray) => m[1].replace(/<[^>]+>/g, '').trim()
    );
    return celdas.length ? `\n| ${celdas.join(' | ')} |` : '';
  });

  // Lo que queda de HTML se descarta, conservando el texto.
  t = t.replace(/<\/(p|div|figure|table|h[1-6])>/g, '\n');
  t = t.replace(/<[^>]+>/g, '');

  // Los wikilinks se resuelven a su texto visible.
  t = t.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  t = t.replace(/\[\[([^\]]+)\]\]/g, '$1');

  // Entidades y espaciado.
  t = t
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  return t.trim();
}
