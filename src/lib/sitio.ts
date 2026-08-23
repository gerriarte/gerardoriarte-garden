/**
 * Datos del sitio en un solo lugar. Los usan el <head>, los datos
 * estructurados, el RSS, el sitemap y llms.txt: si se repiten, se
 * desincronizan.
 */

export const SITIO = {
  url: 'https://www.gerardoriarte.com',
  nombre: 'Gerardo Riarte',
  /** Cómo se llama el sitio cuando lo nombra un tercero. */
  nombreLargo: 'Gerardo Riarte — jardín de conceptos sobre criterio de marketing e IA',
  /**
   * El nombre anterior del sitio. Se declara como `alternateName` en el
   * JSON-LD: si alguien ya lo conoce o lo enlazó como "El Jardín", esa
   * equidad no se tira, se asocia a la misma entidad.
   */
  nombreAlterno: 'El Jardín',
  descripcion:
    'Jardín de conceptos sobre criterio de marketing e IA. Los conceptos publicados son hongos; el valor real es el micelio que los conecta.',
  tesis:
    'La IA volvió gratis la ejecución. Lo único que se cobra es saber qué construir.',
  /**
   * El titular de la portada, un renglón por elemento.
   * Vive acá porque lo usan DOS lugares —el H1 y la imagen OG del sitio— y
   * si se escribe en ambos, tarde o temprano se desincronizan: la vista
   * previa al compartir mostraría un titular distinto al de la página.
   */
  titular: ['Cultivo de Criterio', 'en un campo de IA'],
  /** La palabra del titular que va en ámbar. */
  titularAcento: 'Criterio',
  idioma: 'es',
  /** Rioplatense. Sirve para og:locale y para orientar al motor generativo. */
  locale: 'es_AR',
} as const;

/**
 * Perfiles públicos.
 *
 * Alimentan tres cosas a la vez:
 *  1. `sameAs` en el JSON-LD — la señal de identidad más fuerte que existe.
 *     Sin esto "Gerardo Riarte" es una cadena de texto; con esto es una
 *     entidad que Google y los motores generativos pueden desambiguar de
 *     cualquier otra persona con el mismo nombre.
 *  2. Los enlaces visibles del pie, con `rel="me"`.
 *  3. La verificación cruzada: el motor sigue el enlace y espera encontrar
 *     una referencia de vuelta a este dominio.
 *
 * REGLA: solo URLs reales y verificadas, en formato canónico y absoluto.
 * Una URL equivocada acá es PEOR que ninguna — apunta la entidad a otra
 * persona y contamina el grafo. Dejar en '' lo que no esté confirmado:
 * los vacíos se filtran solos.
 */
export const REDES: { nombre: string; url: string }[] = [
  { nombre: 'LinkedIn', url: 'https://www.linkedin.com/in/gerardoriarte/' },
  { nombre: 'GitHub', url: 'https://github.com/gerriarte' },
  { nombre: 'TikTok', url: 'https://www.tiktok.com/@gerardo.riarte' },
  { nombre: 'Instagram', url: 'https://www.instagram.com/gerardo_riarte/' },
];

/** Solo las que estén completas. */
export const REDES_ACTIVAS = REDES.filter((r) => r.url.trim().length > 0);

export const AUTOR = {
  nombre: 'Gerardo Riarte',
  email: 'ger@abralatam.com',
  cargo: 'Estratega de marketing',
  organizacion: 'a:bra Latam',
  sameAs: REDES_ACTIVAS.map((r) => r.url),
} as const;

/** URL absoluta a partir de una ruta del sitio. */
export const absoluta = (ruta: string) => new URL(ruta, SITIO.url).href;
