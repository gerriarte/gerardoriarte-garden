import { getCollection, type CollectionEntry } from 'astro:content';
import type { Estado } from './estados';

/**
 * Lógica de red, sin geometría. Quién se conecta con quién y quién referencia
 * a quién. El dibujo del corte de tierra vive en ./micelio.
 */

export interface Concepto {
  slug: string;
  titulo: string;
  estado: Estado;
  dominio: string;
  cosecha?: string;
  resumen?: string;
  plantada?: Date;
  podada?: Date;
}

export interface Arista {
  desde: string;
  hasta: string;
}

/** Extrae wikilinks [[slug]] del cuerpo para enriquecer las conexiones. */
function extraerWikilinks(cuerpo: string): string[] {
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const out: string[] = [];
  let m;
  while ((m = re.exec(cuerpo)) !== null) {
    out.push(m[1].trim().replace(/\s+/g, '-').toLowerCase());
  }
  return out;
}

function aConcepto(e: CollectionEntry<'conceptos'>): Concepto {
  return {
    slug: e.id,
    titulo: e.data.titulo,
    estado: e.data.estado,
    dominio: e.data.dominio,
    cosecha: e.data.cosecha,
    resumen: e.data.resumen,
    plantada: e.data.plantada,
    podada: e.data.podada,
  };
}

/**
 * Conceptos + aristas deduplicadas. Una arista existe si el frontmatter la
 * declara en `conecta` o si el cuerpo la nombra con [[wikilink]]. La red no
 * distingue entre ambas: una conexión es una conexión.
 */
export async function construirRed() {
  const entradas = await getCollection('conceptos');
  const existe = new Set(entradas.map((e) => e.id));

  const vistas = new Set<string>();
  const aristas: Arista[] = [];
  const empujar = (a: string, b: string) => {
    if (a === b || !existe.has(a) || !existe.has(b)) return;
    const clave = [a, b].sort().join('::');
    if (vistas.has(clave)) return;
    vistas.add(clave);
    aristas.push({ desde: a, hasta: b });
  };

  for (const e of entradas) {
    for (const destino of e.data.conecta) empujar(e.id, destino);
    for (const destino of extraerWikilinks(e.body ?? '')) empujar(e.id, destino);
  }

  const conceptos = entradas.map(aConcepto);
  const dominios = [...new Set(conceptos.map((c) => c.dominio))].sort();

  return { conceptos, aristas, dominios };
}

/** Quién referencia a este concepto, por `conecta` o por wikilink. */
export async function backlinksDe(slug: string) {
  const entradas = await getCollection('conceptos');
  const out: { slug: string; titulo: string }[] = [];
  for (const e of entradas) {
    if (e.id === slug) continue;
    const refs = new Set([...e.data.conecta, ...extraerWikilinks(e.body ?? '')]);
    if (refs.has(slug)) out.push({ slug: e.id, titulo: e.data.titulo });
  }
  return out;
}
