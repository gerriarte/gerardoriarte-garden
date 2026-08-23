import { SITIO, AUTOR, absoluta } from './sitio';
import { ESTADOS } from './estados';
import type { Concepto } from './grafo';

/**
 * Datos estructurados (JSON-LD).
 *
 * Para SEO clásico esto habilita resultados enriquecidos. Para motores
 * generativos hace algo más importante: convierte "Gerardo Riarte" y cada
 * concepto en ENTIDADES con `@id` estable, en vez de cadenas de texto sueltas.
 * Un motor que quiere citar necesita saber quién lo dijo, cuándo, y qué es
 * exactamente la cosa de la que habla.
 *
 * Se usa `@graph` con `@id` en lugar de objetos anidados: así la misma
 * persona y el mismo sitio se referencian desde todas las páginas en vez de
 * duplicarse, que es lo que permite consolidar la entidad.
 */

const ID_AUTOR = `${SITIO.url}/#autor`;
const ID_SITIO = `${SITIO.url}/#sitio`;
const ID_GLOSARIO = `${SITIO.url}/#glosario`;
const ID_ORG = `${SITIO.url}/#organizacion`;

export function organizacion() {
  return {
    '@type': 'Organization',
    '@id': ID_ORG,
    name: AUTOR.organizacion,
    description: 'Consultora de marketing y growth en Latinoamérica.',
  };
}

export function persona() {
  return {
    '@type': 'Person',
    '@id': ID_AUTOR,
    name: AUTOR.nombre,
    jobTitle: AUTOR.cargo,
    description: `${AUTOR.cargo} en ${AUTOR.organizacion}. Escribe sobre criterio de marketing, medición de marca e inteligencia artificial aplicada.`,
    email: `mailto:${AUTOR.email}`,
    url: SITIO.url,
    // El sitio es la página principal de la entidad: eso ancla la persona
    // a este dominio y no a cualquier otro donde aparezca el nombre.
    mainEntityOfPage: { '@id': ID_SITIO },
    worksFor: { '@id': ID_ORG },
    knowsAbout: [
      'Estrategia de marca',
      'Medición de marketing',
      'Brand equity',
      'Inteligencia artificial aplicada a marketing',
      'Growth',
    ],
    knowsLanguage: ['es', 'en'],
    /**
     * Perfiles públicos. Se omite si está vacío: un `sameAs: []` no aporta
     * nada y ensucia el grafo. Ver REDES en lib/sitio.
     */
    ...(AUTOR.sameAs.length ? { sameAs: [...AUTOR.sameAs] } : {}),
  };
}

export function sitioWeb() {
  return {
    '@type': 'WebSite',
    '@id': ID_SITIO,
    url: SITIO.url,
    name: SITIO.nombre,
    alternateName: [SITIO.nombreAlterno, SITIO.nombreLargo],
    description: SITIO.descripcion,
    inLanguage: SITIO.idioma,
    author: { '@id': ID_AUTOR },
    publisher: { '@id': ID_AUTOR },
  };
}

/** El conjunto de conceptos, como glosario. */
export function glosario(conceptos: Concepto[]) {
  return {
    '@type': 'DefinedTermSet',
    '@id': ID_GLOSARIO,
    name: `Conceptos de ${SITIO.nombre}`,
    description:
      'Conceptos de marketing, medición e ingeniería con IA, en distintas etapas de maduración.',
    inLanguage: SITIO.idioma,
    hasDefinedTerm: conceptos.map((c) => ({
      '@type': 'DefinedTerm',
      '@id': `${absoluta(`/conceptos/${c.slug}`)}#concepto`,
      name: c.titulo,
      description: c.resumen,
      inDefinedTermSet: { '@id': ID_GLOSARIO },
      url: absoluta(`/conceptos/${c.slug}`),
    })),
  };
}

/**
 * Nodo mínimo del glosario, para las páginas que lo REFERENCIAN sin definirlo.
 * Sin esto, `inDefinedTermSet` apunta a un `@id` que no existe en ese grafo y
 * la referencia queda colgada. Solo la home publica la lista completa de
 * términos; acá alcanza con anclar la identidad y dónde vive.
 */
function glosarioRef() {
  return {
    '@type': 'DefinedTermSet',
    '@id': ID_GLOSARIO,
    name: `Conceptos de ${SITIO.nombre}`,
    url: SITIO.url,
  };
}

function migas(tramos: { nombre: string; ruta: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: tramos.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.nombre,
      item: absoluta(t.ruta),
    })),
  };
}

export function paginaInicio(conceptos: Concepto[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      persona(),
      organizacion(),
      sitioWeb(),
      glosario(conceptos),
      {
        '@type': 'WebPage',
        '@id': `${SITIO.url}/#pagina`,
        url: SITIO.url,
        name: SITIO.nombre,
        description: SITIO.descripcion,
        isPartOf: { '@id': ID_SITIO },
        about: { '@id': ID_GLOSARIO },
        inLanguage: SITIO.idioma,
      },
    ],
  };
}

export function paginaEspecimenes(conceptos: Concepto[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      persona(),
      organizacion(),
      sitioWeb(),
      {
        '@type': 'CollectionPage',
        '@id': `${absoluta('/especimenes')}#pagina`,
        url: absoluta('/especimenes'),
        name: `Especímenes — ${SITIO.nombre}`,
        description:
          'Índice de conceptos agrupados por etapa de maduración: cuerpos fructíferos, micelio, hifas y esporas.',
        isPartOf: { '@id': ID_SITIO },
        inLanguage: SITIO.idioma,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: conceptos.length,
          itemListElement: conceptos.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluta(`/conceptos/${c.slug}`),
            name: c.titulo,
          })),
        },
      },
      migas([
        { nombre: SITIO.nombre, ruta: '/' },
        { nombre: 'Especímenes', ruta: '/especimenes' },
      ]),
    ],
  };
}

interface DatosNota {
  concepto: Concepto;
  /** Slugs y títulos con los que conecta, para declarar la red. */
  conexiones: { slug: string; titulo: string }[];
  palabras: number;
}

export function paginaConcepto({ concepto: c, conexiones, palabras }: DatosNota) {
  const url = absoluta(`/conceptos/${c.slug}`);
  const etapa = ESTADOS[c.estado];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      persona(),
      organizacion(),
      sitioWeb(),
      glosarioRef(),
      {
        '@type': 'Article',
        '@id': `${url}#articulo`,
        url,
        headline: c.titulo,
        description: c.resumen,
        inLanguage: SITIO.idioma,
        author: { '@id': ID_AUTOR },
        publisher: { '@id': ID_AUTOR },
        isPartOf: { '@id': ID_SITIO },
        ...(c.plantada ? { datePublished: c.plantada.toISOString() } : {}),
        ...(c.podada ? { dateModified: c.podada.toISOString() } : {}),
        articleSection: c.dominio,
        keywords: [c.dominio, etapa.label.toLowerCase(), 'marketing', 'criterio'],
        wordCount: palabras,
        // El concepto que la nota define, como término del glosario.
        about: {
          '@type': 'DefinedTerm',
          '@id': `${url}#concepto`,
          name: c.titulo,
          description: c.resumen,
          inDefinedTermSet: { '@id': ID_GLOSARIO },
        },
        // La red hecha explícita: qué otros conceptos toca esta nota.
        ...(conexiones.length
          ? {
              mentions: conexiones.map((x) => ({
                '@type': 'DefinedTerm',
                '@id': `${absoluta(`/conceptos/${x.slug}`)}#concepto`,
                name: x.titulo,
              })),
            }
          : {}),
      },
      migas([
        { nombre: SITIO.nombre, ruta: '/' },
        { nombre: 'Especímenes', ruta: '/especimenes' },
        { nombre: c.titulo, ruta: `/conceptos/${c.slug}` },
      ]),
    ],
  };
}
