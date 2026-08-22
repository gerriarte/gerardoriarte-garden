/**
 * Datos del sitio en un solo lugar. Los usan el <head>, los datos
 * estructurados, el RSS, el sitemap y llms.txt: si se repiten, se
 * desincronizan.
 */

export const SITIO = {
  url: 'https://gerardoriarte.com',
  nombre: 'El Jardín',
  /** Cómo se llama el sitio cuando lo nombra un tercero. */
  nombreLargo: 'El Jardín — jardín de conceptos de Gerardo Riarte',
  descripcion:
    'Jardín de conceptos sobre criterio de marketing e IA. Los conceptos publicados son hongos; el valor real es el micelio que los conecta.',
  tesis:
    'La IA volvió gratis la ejecución. Lo único que se cobra es saber qué construir.',
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
  { nombre: 'LinkedIn', url: '' },
  { nombre: 'GitHub', url: 'https://github.com/gerriarte' },
  { nombre: 'TikTok', url: '' },
  { nombre: 'Instagram', url: '' },
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
