import { ESTADOS, ORDEN_DESCENDENTE, type Estado } from './estados';
import type { Arista, Concepto } from './grafo';

/**
 * Corte de tierra. Traduce la red a geometría.
 *
 * Hay DOS composiciones, no una responsive:
 *
 *  - PANORÁMICA (escritorio): corte ancho. x = dominio, y = profundidad.
 *  - VERTICAL (teléfono): testigo de suelo. Los estratos se apilan y se baja
 *    por ellos scrolleando. El dominio deja de ser posición y pasa a ser una
 *    etiqueta impresa, porque en 375px no entran cinco columnas más sus
 *    rótulos sin volverse ilegible.
 *
 * Son dos porque las posiciones quedan horneadas en los `d` de los paths: no
 * hay media query que reacomode una curva bezier. El costo es que el HTML
 * lleva las dos láminas (~6.4KB gzip -> ~9KB). Se paga.
 *
 * FASE 1: todo se calcula UNA vez en build. No hay física ni crecimiento en
 * tiempo real; el movimiento ambiental lo pone CSS. Ver README, fase 2.
 */

export type Modo = 'ancho' | 'alto';

interface Lienzo {
  ancho: number;
  alto: number;
  superficie: number;
  /** Escala de los trazos orgánicos (rootlets, rayado) para el tamaño del lienzo. */
  escalaTrazo: number;
  /** Alto del tallo de los cuerpos fructíferos. */
  talloMin: number;
  talloMax: number;
  radioSombrero: number;
}

/** Redondeo a un decimal: el path no necesita más y el HTML pesa la mitad. */
const f = (n: number) => Math.round(n * 10) / 10;

/* ---------------------------------------------------------------
   Azar determinístico. La misma nota dibuja siempre la misma hifa,
   así el build es reproducible y los diffs no son ruido.
   FNV-1a para la semilla, xorshift32 para la secuencia.
   --------------------------------------------------------------- */
function semillaDe(txt: string): number {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) || 1;
}

function rng(semilla: number): () => number {
  let x = semilla;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;  x >>>= 0;
    return x / 4294967296;
  };
}

/* --------------------------------------------------------------- */

export interface AnatomiaFruto {
  tallo: string;
  sombrero: string;
  laminillas: string[];
  cx: number;
  baseY: number;
  radio: number;
}

export interface NodoMicelio extends Concepto {
  x: number;
  y: number;
  rootlets: string[];
  anatomia?: AnatomiaFruto;
  /** Rótulo ya resuelto: posición, anclaje y hasta dos renglones. */
  rotulo: {
    x: number;
    y: number;
    ancla: 'start' | 'middle' | 'end';
    lineas: string[];
    /** Solo en vertical: el dominio impreso, porque ya no es posición. */
    tag?: string;
  };
  /** Plomada del nodo a su rótulo. */
  plomada: string;
}

export interface Hifa {
  /** Orientada: siempre del extremo menos maduro al más maduro. */
  desde: string;
  hasta: string;
  d: string;
  rama: string;
  /** Segundos que tarda el destello en recorrerla. */
  duracion: number;
  /** Desfase para que la red no lata al unísono. */
  demora: number;
}

/** Rótulo de eje: estrato en vertical, escala de profundidad en panorámica. */
export interface Guia {
  texto: string;
  x: number;
  y: number;
  ancla: 'start' | 'middle' | 'end';
  /** 'superficie' se destaca sobre el resto. */
  hito?: boolean;
  /** Regla horizontal que separa estratos (solo vertical). */
  regla?: string;
}

export interface Lamina {
  modo: Modo;
  lienzo: Lienzo;
  nodos: NodoMicelio[];
  hifas: Hifa[];
  superficie: string;
  rayado: string[];
  guias: Guia[];
  /** Rótulos de dominio a pie de lámina (solo panorámica). */
  pie: { texto: string; x: number; y: number }[];
}

const LIENZOS: Record<Modo, Lienzo> = {
  ancho: {
    ancho: 1600,
    alto: 830,
    superficie: 250,
    escalaTrazo: 1,
    talloMin: 82,
    talloMax: 118,
    radioSombrero: 30,
  },
  alto: {
    ancho: 440,
    alto: 0, // se calcula: crece con la cantidad de notas
    superficie: 210,
    escalaTrazo: 0.5,
    talloMin: 92,
    talloMax: 132,
    radioSombrero: 30,
  },
};

/* --------------------------------------------------------------- */

/** Filamentos cortos que salen del nodo y se pierden en la tierra. */
function rootletsDe(
  x: number,
  y: number,
  r: () => number,
  cantidad: number,
  L: Lienzo
) {
  const out: string[] = [];
  for (let i = 0; i < cantidad; i++) {
    const ang = r() * Math.PI * 2;
    const largo = (32 + r() * 76) * L.escalaTrazo;
    const ex = x + Math.cos(ang) * largo;
    // ningún rootlet cruza hacia el aire: el micelio es subterráneo
    const ey = Math.max(L.superficie + 10, y + Math.sin(ang) * largo);
    const mx = (x + ex) / 2 + (r() - 0.5) * largo * 0.6;
    const my = (y + ey) / 2 + (r() - 0.5) * largo * 0.6;
    out.push(`M ${f(x)} ${f(y)} Q ${f(mx)} ${f(my)}, ${f(ex)} ${f(ey)}`);
  }
  return out;
}

/** Tallo + sombrero + laminillas de un cuerpo fructífero. */
function anatomiaDe(
  x: number,
  r: () => number,
  L: Lienzo,
  alturaForzada?: number
): AnatomiaFruto {
  const sup = L.superficie;
  const altura = alturaForzada ?? L.talloMin + r() * (L.talloMax - L.talloMin);
  const inclina = (r() - 0.5) * 30;
  const radio = L.radioSombrero + r() * 11;
  const baseY = sup - altura;
  const cx = x + inclina;
  const ancho = 5.2;

  const tallo =
    `M ${f(x - ancho)} ${f(sup + 4)} ` +
    `C ${f(x - ancho + 1)} ${f(sup - altura * 0.45)}, ${f(cx - 4.6)} ${f(baseY + 14)}, ${f(cx - 4.2)} ${f(baseY + 2)} ` +
    `L ${f(cx + 4.2)} ${f(baseY + 2)} ` +
    `C ${f(cx + 4.6)} ${f(baseY + 14)}, ${f(x + ancho - 1)} ${f(sup - altura * 0.45)}, ${f(x + ancho)} ${f(sup + 4)} Z`;

  const alturaSombrero = radio * 0.68;
  const sombrero =
    `M ${f(cx - radio)} ${f(baseY)} ` +
    `C ${f(cx - radio * 0.98)} ${f(baseY - alturaSombrero * 1.55)}, ` +
    `${f(cx + radio * 0.98)} ${f(baseY - alturaSombrero * 1.55)}, ` +
    `${f(cx + radio)} ${f(baseY)} ` +
    `Q ${f(cx)} ${f(baseY + 8)}, ${f(cx - radio)} ${f(baseY)} Z`;

  const laminillas: string[] = [];
  for (let i = -3; i <= 3; i++) {
    const lx = cx + (i / 3.5) * radio * 0.82;
    const prof = 4.6 - Math.abs(i) * 0.55;
    laminillas.push(`M ${f(lx)} ${f(baseY + 1.5)} L ${f(lx)} ${f(baseY + 1.5 + prof)}`);
  }

  return { tallo, sombrero, laminillas, cx, baseY, radio };
}

/**
 * Parte un título largo en dos renglones por el espacio más cercano al medio.
 * SVG no hace wrap solo, y en vertical el ancho es escaso.
 */
function partirRotulo(titulo: string, maxChars: number): string[] {
  if (titulo.length <= maxChars) return [titulo];
  const medio = titulo.length / 2;
  let corte = -1;
  for (let i = 0; i < titulo.length; i++) {
    if (titulo[i] !== ' ') continue;
    if (corte === -1 || Math.abs(i - medio) < Math.abs(corte - medio)) corte = i;
  }
  if (corte === -1) return [titulo];
  return [titulo.slice(0, corte), titulo.slice(corte + 1)];
}

/** Hifas entre nodos ya posicionados. Comparte fórmula entre las dos láminas. */
function tejerHifas(
  aristas: Arista[],
  porSlug: Map<string, NodoMicelio>,
  L: Lienzo
): Hifa[] {
  const hifas: Hifa[] = [];
  for (const a of aristas) {
    let A = porSlug.get(a.desde);
    let B = porSlug.get(a.hasta);
    if (!A || !B) continue;

    /* El filamento se dibuja SIEMPRE de lo menos maduro a lo más maduro.
       Una arista no tiene dirección propia —conectar es simétrico—, pero el
       destello que la recorre sí: el nutriente sube hacia el cuerpo
       fructífero. Si el `d` arrancara en el extremo arbitrario que quedó
       primero al deduplicar, la mitad de los destellos bajarían. */
    const maduro = (n: NodoMicelio) => ESTADOS[n.estado].orden;
    if (maduro(A) > maduro(B) || (maduro(A) === maduro(B) && A.y < B.y)) {
      [A, B] = [B, A];
    }

    const r = rng(semillaDe([a.desde, a.hasta].sort().join('::')));
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = -dy / dist;
    const ny = dx / dist;
    const amp = dist * (0.1 + r() * 0.16) * (r() < 0.5 ? -1 : 1);

    const c1x = A.x + dx * 0.28 + nx * amp;
    const c1y = A.y + dy * 0.28 + ny * amp;
    const c2x = A.x + dx * 0.7 + nx * amp * 0.5;
    const c2y = A.y + dy * 0.7 + ny * amp * 0.5;

    const rx = A.x + dx * 0.52 + nx * amp * 0.8;
    const ry = A.y + dy * 0.52 + ny * amp * 0.8;
    const largoRama = (26 + r() * 46) * L.escalaTrazo;
    const angRama = Math.atan2(dy, dx) + (r() < 0.5 ? -1 : 1) * (0.7 + r() * 0.7);
    const rex = rx + Math.cos(angRama) * largoRama;
    const rey = Math.max(L.superficie + 10, ry + Math.sin(angRama) * largoRama);

    hifas.push({
      // desde/hasta quedan orientados como el trazo: el rastreo del hover
      // es simétrico, así que no lo afecta, pero deja de contradecir al `d`.
      desde: A.slug,
      hasta: B.slug,
      // El destello viaja a velocidad pareja, no en tiempo fijo: si todas las
      // hifas tardaran lo mismo, las cortas se verían disparadas y las largas
      // arrastradas. La demora las desfasa para que no latan en bloque.
      duracion: Math.min(13, Math.max(4.5, dist / 52)),
      demora: r() * 9,
      d:
        `M ${f(A.x)} ${f(A.y)} ` +
        `C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(B.x)} ${f(B.y)}`,
      rama:
        `M ${f(rx)} ${f(ry)} ` +
        `Q ${f((rx + rex) / 2 + (r() - 0.5) * 22)} ${f((ry + rey) / 2 + (r() - 0.5) * 22)}, ` +
        `${f(rex)} ${f(rey)}`,
    });
  }
  return hifas;
}

/** La línea de superficie no es recta: es tierra. */
function lineaSuperficie(L: Lienzo): string {
  const r = rng(semillaDe('linea-de-superficie'));
  const pasos = Math.max(8, Math.round(L.ancho / 53));
  const paso = L.ancho / pasos;
  let d = `M 0 ${f(L.superficie + (r() - 0.5) * 3)}`;
  for (let i = 1; i <= pasos; i++) {
    const x = i * paso;
    d += ` Q ${f(x - paso / 2)} ${f(L.superficie + (r() - 0.5) * 6)}, ${f(x)} ${f(
      L.superficie + (r() - 0.5) * 3
    )}`;
  }
  return d;
}

/** Rayado corto bajo la superficie: la convención de "tierra" en una lámina. */
function rayadoSuperficie(L: Lienzo): string[] {
  const r = rng(semillaDe('rayado'));
  const out: string[] = [];
  const salto = 13 * Math.max(L.escalaTrazo, 0.75);
  for (let x = 8; x < L.ancho; x += salto + r() * 12 * L.escalaTrazo) {
    const y0 = L.superficie + 3 + r() * 3;
    const largo = (5 + r() * 11) * Math.max(L.escalaTrazo, 0.7);
    const sesgo = (r() - 0.5) * 7;
    out.push(`M ${f(x)} ${f(y0)} L ${f(x + sesgo)} ${f(y0 + largo)}`);
  }
  return out;
}

/* ===============================================================
   LÁMINA PANORÁMICA — escritorio
   x = dominio (columnas), y = profundidad (madurez)
   =============================================================== */
function tenderPanoramico(
  conceptos: Concepto[],
  aristas: Arista[],
  dominios: string[]
): Lamina {
  const L = { ...LIENZOS.ancho };
  const MARGEN_LATERAL = 210;
  const MARGEN_FONDO = 60;
  const espesor = L.alto - L.superficie - MARGEN_FONDO;

  const usable = L.ancho - MARGEN_LATERAL * 2;
  const paso = usable / Math.max(dominios.length, 1);
  const columna = new Map<string, number>();
  dominios.forEach((d, i) => columna.set(d, MARGEN_LATERAL + (i + 0.5) * paso));

  const porDominio = new Map<string, Concepto[]>();
  for (const c of conceptos) {
    const arr = porDominio.get(c.dominio) ?? [];
    arr.push(c);
    porDominio.set(c.dominio, arr);
  }

  const centro = L.ancho / 2;

  // --- Pasada 1: la x la da el dominio ---
  const ubicados = conceptos.map((c) => {
    const lista = porDominio.get(c.dominio)!;
    const idx = lista.indexOf(c);
    const r = rng(semillaDe(c.slug));
    return {
      c,
      r,
      x: columna.get(c.dominio)! + (idx - (lista.length - 1) / 2) * 96 + (r() - 0.5) * 40,
    };
  });

  /* --- Pasada 2: la y la da la madurez, pero escalonada dentro del estrato ---
     Los nodos de una misma etapa comparten profundidad, así que sus rótulos
     laterales caen en la misma línea y el de uno termina encima del glifo del
     vecino. El escalonado alterna arriba/abajo por posición horizontal: deja
     52u entre vecinos, suficiente para que dos rótulos nunca compartan renglón.
     Se hace acá y no con jitter al azar porque tiene que estar garantizado. */
  const alturas = new Map<string, number>();
  const porEstado = new Map<Estado, typeof ubicados>();
  for (const u of ubicados) {
    const arr = porEstado.get(u.c.estado) ?? [];
    arr.push(u);
    porEstado.set(u.c.estado, arr);
  }
  for (const [estado, grupo] of porEstado) {
    const base = L.superficie + ESTADOS[estado].profundidad * espesor;
    [...grupo]
      .sort((a, b) => a.x - b.x)
      .forEach((u, i) => {
        alturas.set(
          u.c.slug,
          estado === 'fruto'
            ? L.superficie + 6
            : base + (i % 2 === 0 ? -26 : 26) + (u.r() - 0.5) * 16
        );
      });
  }

  // --- Pasada 3: anatomía, rótulos y filamentos ---
  const nodos: NodoMicelio[] = ubicados.map(({ c, r, x }) => {
    const y = alturas.get(c.slug)!;
    const esFruto = c.estado === 'fruto';

    const rootlets = rootletsDe(x, y, r, 4 + Math.floor(r() * 3), L);
    const anatomia = esFruto ? anatomiaDe(x, r, L) : undefined;
    const izq = x < centro;

    // Los frutos rotulan arriba del sombrero; el resto, al costado y hacia
    // afuera, lejos del centro poblado.
    const rotulo = anatomia
      ? {
          x: anatomia.cx,
          y: anatomia.baseY - anatomia.radio * 0.68 - 22,
          ancla: 'middle' as const,
          lineas: [c.titulo],
        }
      : {
          x: x + (izq ? -22 : 22),
          y: y + 5,
          ancla: (izq ? 'end' : 'start') as 'end' | 'start',
          lineas: [c.titulo],
        };

    const plomada = anatomia
      ? `M ${f(anatomia.cx)} ${f(anatomia.baseY - anatomia.radio * 0.68 - 6)} L ${f(anatomia.cx)} ${f(rotulo.y + 6)}`
      : `M ${f(x + (izq ? -15 : 15))} ${f(y)} L ${f(x + (izq ? -19 : 19))} ${f(y)}`;

    return { ...c, x: f(x), y: f(y), rootlets, anatomia, rotulo, plomada };
  });

  const porSlug = new Map(nodos.map((n) => [n.slug, n]));

  // Escala de profundidad al margen. El cuerpo fructífero se rotula en el
  // AIRE: es lo único que vive sobre la línea.
  const guias: Guia[] = [
    { texto: 'superficie', x: 20, y: L.superficie - 10, ancla: 'start', hito: true },
    { texto: 'cuerpo fructífero', x: 20, y: L.superficie - 116, ancla: 'start' },
    ...(['flor', 'brote', 'semilla'] as Estado[]).map((e) => ({
      texto: ESTADOS[e].label.toLowerCase(),
      x: 20,
      y: L.superficie + ESTADOS[e].profundidad * espesor + 4,
      ancla: 'start' as const,
    })),
  ];

  return {
    modo: 'ancho',
    lienzo: L,
    nodos,
    hifas: tejerHifas(aristas, porSlug, L),
    superficie: lineaSuperficie(L),
    rayado: rayadoSuperficie(L),
    guias,
    pie: dominios.map((d, i) => ({
      texto: d,
      x: MARGEN_LATERAL + (i + 0.5) * paso,
      y: L.alto - 22,
    })),
  };
}

/* ===============================================================
   LÁMINA VERTICAL — teléfono
   Testigo de suelo: los estratos se apilan y se baja scrolleando.
   El dominio pasa de ser posición a ser etiqueta impresa.
   =============================================================== */
function tenderVertical(conceptos: Concepto[], aristas: Arista[]): Lamina {
  const L = { ...LIENZOS.alto };
  const COL_GLIFO = 76;
  const COL_ROTULO = 108;
  const ALTO_FILA = 132;
  const MARGEN_FONDO = 74;
  // 440 - 108 de sangría - 12 de margen, a ~9.9u por carácter
  const MAX_CHARS = 30;

  const frutos = conceptos.filter((c) => c.estado === 'fruto');
  const hondos = conceptos.filter((c) => c.estado !== 'fruto');

  const nodos: NodoMicelio[] = [];
  const guias: Guia[] = [
    { texto: 'superficie', x: 12, y: L.superficie - 12, ancla: 'start', hito: true },
  ];

  /* --- los que asoman: en fila sobre la línea, escalonados en altura para
         que sus rótulos no se pisen --- */
  const anchoFruto = L.ancho / (frutos.length + 1);
  frutos.forEach((c, i) => {
    const r = rng(semillaDe(c.slug));
    const x = anchoFruto * (i + 1);
    // escalonado determinístico, no al azar: es lo que evita la colisión
    const altura = i % 2 === 0 ? L.talloMax : L.talloMin;
    const anatomia = anatomiaDe(x, r, L, altura);
    const y = L.superficie + 6;

    nodos.push({
      ...c,
      x: f(x),
      y: f(y),
      rootlets: rootletsDe(x, y, r, 3 + Math.floor(r() * 2), L),
      anatomia,
      rotulo: {
        x: anatomia.cx,
        y: anatomia.baseY - anatomia.radio * 0.68 - 16,
        ancla: 'middle',
        lineas: partirRotulo(c.titulo, 22),
      },
      plomada: `M ${f(anatomia.cx)} ${f(anatomia.baseY - anatomia.radio * 0.68 - 4)} L ${f(anatomia.cx)} ${f(anatomia.baseY - anatomia.radio * 0.68 - 12)}`,
    });
  });

  if (frutos.length) {
    // Al margen DERECHO: los rótulos de los hongos van centrados sobre sus
    // sombreros y a la izquierda se pisaban con este.
    guias.push({
      texto: 'cuerpo fructífero',
      x: L.ancho - 12,
      y: 22,
      ancla: 'end',
    });
  }

  /* --- los subterráneos: una fila por nota, agrupados por estrato ---
     La profundidad acá es ORDINAL, no proporcional: en un teléfono un
     estrato rotulado se lee mejor que una distancia exacta, y así escala
     a cualquier cantidad de notas sin que se encimen. */
  let cursor = L.superficie + 96;
  for (const estado of ORDEN_DESCENDENTE) {
    if (estado === 'fruto') continue;
    const enEstrato = hondos.filter((c) => c.estado === estado);
    if (!enEstrato.length) continue;

    guias.push({
      texto: ESTADOS[estado].label.toLowerCase(),
      x: 12,
      y: cursor - 26,
      ancla: 'start',
      regla: `M 0 ${f(cursor - 44)} L ${L.ancho} ${f(cursor - 44)}`,
    });

    enEstrato.forEach((c) => {
      const r = rng(semillaDe(c.slug));
      const x = COL_GLIFO + (r() - 0.5) * 18;
      const y = cursor + (r() - 0.5) * 12;

      nodos.push({
        ...c,
        x: f(x),
        y: f(y),
        rootlets: rootletsDe(x, y, r, 3 + Math.floor(r() * 3), L),
        rotulo: {
          x: COL_ROTULO,
          y: y - 4,
          ancla: 'start',
          lineas: partirRotulo(c.titulo, MAX_CHARS),
          tag: c.dominio,
        },
        plomada: `M ${f(x + 16)} ${f(y)} L ${f(COL_ROTULO - 8)} ${f(y)}`,
      });

      cursor += ALTO_FILA;
    });
    cursor += 26; // aire entre estratos
  }

  L.alto = Math.round(cursor + MARGEN_FONDO);

  const porSlug = new Map(nodos.map((n) => [n.slug, n]));

  return {
    modo: 'alto',
    lienzo: L,
    nodos,
    hifas: tejerHifas(aristas, porSlug, L),
    superficie: lineaSuperficie(L),
    rayado: rayadoSuperficie(L),
    guias,
    pie: [],
  };
}

/** Las dos láminas de la misma red. */
export function tenderMicelio(
  conceptos: Concepto[],
  aristas: Arista[],
  dominios: string[]
): Lamina[] {
  return [
    tenderPanoramico(conceptos, aristas, dominios),
    tenderVertical(conceptos, aristas),
  ];
}
