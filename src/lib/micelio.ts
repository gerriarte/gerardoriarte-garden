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
  /** Silueta del tallo, con la base ensanchada. */
  tallo: string;
  /** Fibrillas longitudinales del tallo. */
  fibras: string[];
  /** Anillo: el resto del velo parcial que cubría las laminillas. */
  anillo: string;
  /** Silueta del sombrero, con umbo y margen enrollado. */
  sombrero: string;
  /** Tramado radial que le da volumen al sombrero. */
  trama: string[];
  /** Laminillas, radiando del tallo al margen. */
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
  /**
   * Caja de la ficha, en unidades de lienzo. El contenido (etapa, título,
   * resumen) lo arma el componente dentro de un foreignObject: SVG no hace
   * wrap de texto y una descripción corta no se puede partir a mano sin
   * horneárselo al build por cada ancho de lámina.
   */
  ficha: { x: number; y: number; ancho: number; alto: number };
  /** Plomada del nodo a su ficha. */
  plomada: string;
}

/** Cuánto mide la ficha en cada lámina. La caja es fija; el texto se recorta. */
const FICHAS: Record<Modo, { ancho: number; alto: number }> = {
  ancho: { ancho: 252, alto: 106 },
  alto: { ancho: 300, alto: 112 },
};

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

/* La franja de aire creció con las fichas: el rótulo de un cuerpo fructífero
   pasó de una línea de texto a una caja de ~106u sobre el sombrero. Con la
   superficie donde estaba, esa caja se salía del lienzo por arriba. El
   espesor del subsuelo no cambia —alto y superficie se mueven juntos—, así
   que la proporción del corte se mantiene. */
const LIENZOS: Record<Modo, Lienzo> = {
  ancho: {
    ancho: 1600,
    alto: 880,
    superficie: 300,
    escalaTrazo: 1,
    talloMin: 82,
    talloMax: 118,
    radioSombrero: 30,
  },
  alto: {
    ancho: 440,
    alto: 0, // se calcula: crece con la cantidad de notas
    superficie: 310,
    escalaTrazo: 0.5,
    talloMin: 96,
    talloMax: 112,
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

/**
 * Anatomía de un cuerpo fructífero, dibujada como en una lámina de campo.
 *
 * No es un domo sobre un palo: un hongo con laminillas tiene partes que se
 * reconocen y que son las que lo hacen leer como un dibujo de alguien que los
 * miró. De abajo hacia arriba:
 *   - base bulbosa, de donde sale el micelio;
 *   - fibrillas longitudinales sobre el tallo;
 *   - anillo, el resto del velo que cubría las laminillas antes de abrirse;
 *   - laminillas radiando del tallo al margen;
 *   - sombrero con umbo (el pico no está centrado) y margen enrollado;
 *   - tramado radial, que es como una lámina modela el volumen.
 * Todo determinístico: dos hongos nunca salen iguales, pero el mismo concepto
 * dibuja siempre el suyo.
 */
function anatomiaDe(
  x: number,
  r: () => number,
  L: Lienzo,
  alturaForzada?: number
): AnatomiaFruto {
  const sup = L.superficie;
  const altura = alturaForzada ?? L.talloMin + r() * (L.talloMax - L.talloMin);
  const inclina = (r() - 0.5) * 26;
  const radio = L.radioSombrero + r() * 11;
  const baseY = sup - altura;
  const cx = x + inclina;

  const anchoTallo = 4.4 + r() * 1.3;
  const bulbo = anchoTallo * (1.8 + r() * 0.6);
  const domo = radio * 0.74;
  // El ápice corrido: un sombrero perfectamente simétrico se lee como ícono.
  const umbo = (r() - 0.5) * radio * 0.2;
  const yAnillo = baseY + altura * (0.26 + r() * 0.12);

  /* Cónico en todo su largo, no un palo con pie. Si la conicidad se concentra
     abajo, el bulbo queda enterrado bajo la línea de superficie y el tallo se
     lee como una columna. Los puntos de control reparten el ensanche parejo. */
  const tallo =
    `M ${f(x - bulbo)} ${f(sup + 5)} ` +
    `C ${f(x - bulbo * 0.78)} ${f(sup - altura * 0.42)}, ${f(cx - anchoTallo * 1.18)} ${f(baseY + altura * 0.34)}, ${f(cx - anchoTallo)} ${f(baseY + 3)} ` +
    `L ${f(cx + anchoTallo)} ${f(baseY + 3)} ` +
    `C ${f(cx + anchoTallo * 1.18)} ${f(baseY + altura * 0.34)}, ${f(x + bulbo * 0.78)} ${f(sup - altura * 0.42)}, ${f(x + bulbo)} ${f(sup + 5)} Z`;

  const fibras: string[] = [];
  for (let i = -1; i <= 1; i++) {
    const desvio = i * anchoTallo * 0.5;
    fibras.push(
      `M ${f(cx + desvio * 0.8)} ${f(baseY + 8)} ` +
        `Q ${f(cx + desvio)} ${f(baseY + altura * 0.55)}, ${f(x + desvio * 1.5)} ${f(sup - 4)}`
    );
  }

  /* El velo se rompió y quedó colgando. Cae hacia un lado, no simétrico:
     un anillo perfectamente centrado se lee como una arandela. */
  const anilloAncho = anchoTallo * 1.95;
  const caida = (r() - 0.5) * anchoTallo * 0.5;
  const anillo =
    `M ${f(cx - anilloAncho + caida)} ${f(yAnillo)} ` +
    `Q ${f(cx + caida * 0.5)} ${f(yAnillo + 7)}, ${f(cx + anilloAncho + caida)} ${f(yAnillo - 1)} ` +
    `Q ${f(cx + caida * 0.5)} ${f(yAnillo - 2.5)}, ${f(cx - anilloAncho + caida)} ${f(yAnillo)} Z`;

  const sombrero =
    `M ${f(cx - radio)} ${f(baseY + 1)} ` +
    `C ${f(cx - radio * 0.96)} ${f(baseY - domo * 0.74)}, ${f(cx - radio * 0.4)} ${f(baseY - domo * 1.04)}, ${f(cx + umbo)} ${f(baseY - domo * 1.1)} ` +
    `C ${f(cx + radio * 0.42)} ${f(baseY - domo * 1.0)}, ${f(cx + radio * 0.96)} ${f(baseY - domo * 0.72)}, ${f(cx + radio)} ${f(baseY + 1)} ` +
    `Q ${f(cx)} ${f(baseY + 9)}, ${f(cx - radio)} ${f(baseY + 1)} Z`;

  /* Estriaciones del margen, no radios completos.
     Si todos los trazos convergen en el ápice, el sombrero se lee como un
     paraguas con varillas. En una lámina el volumen del domo se sugiere con
     trazos CORTOS concentrados en la mitad exterior, que además es donde un
     sombrero estriado los tiene de verdad. */
  const trama: string[] = [];
  const nTrama = 9;
  for (let i = -nTrama; i <= nTrama; i++) {
    const t = i / nTrama;
    const at = Math.abs(t);
    if (at < 0.22) continue; // el centro queda limpio
    // Cuanto más cerca del margen, más largo el trazo.
    const desde = 0.46;
    const xa = cx + t * radio * 0.72;
    const ya = baseY - domo * desde;
    const xm = cx + t * radio * 0.92;
    const ym = baseY - domo * 0.06 * (1 - at * at);
    const xc = cx + t * radio * 0.85;
    const yc = baseY - domo * 0.24;
    trama.push(`M ${f(xa)} ${f(ya)} Q ${f(xc)} ${f(yc)}, ${f(xm)} ${f(ym)}`);
  }

  // Laminillas: del tallo al margen, siguiendo la curva del reverso.
  const laminillas: string[] = [];
  const nLam = 5;
  for (let i = -nLam; i <= nLam; i++) {
    const t = i / nLam;
    const at = Math.abs(t);
    const xi = cx + t * anchoTallo * 0.9;
    const xf = cx + t * radio * 0.9;
    const yf = baseY + 8 * (1 - at * at) * 0.85;
    laminillas.push(`M ${f(xi)} ${f(baseY + 2.5)} L ${f(xf)} ${f(yf)}`);
  }

  return { tallo, fibras, anillo, sombrero, trama, laminillas, cx, baseY, radio };
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
  const F = FICHAS.ancho;
  /* La columna de la izquierda la ocupa la escala de profundidad. Una ficha
     empujada hasta el borde la taparía entera, así que ese margen es zona
     vedada y el lado se elige, no se recorta. */
  const BORDE_IZQ = 132;
  const BORDE_DER = L.ancho - 12;
  const clampX = (v: number) => f(Math.min(Math.max(v, 12), BORDE_DER - F.ancho));

  /**
   * De qué lado del nodo va la ficha. La preferencia es hacia afuera —lejos
   * del centro poblado—, pero si de ese lado no entra, se va al otro: una
   * caja recortada contra el borde es peor que una caja del lado "equivocado".
   */
  const ladoFicha = (x: number, prefiereIzq: boolean) => {
    const aIzq = x - 26 - F.ancho;
    const aDer = x + 26;
    if (prefiereIzq) return aIzq < BORDE_IZQ ? aDer : aIzq;
    return aDer + F.ancho > BORDE_DER ? aIzq : aDer;
  };

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
     Los nodos de una misma etapa comparten profundidad, así que sus fichas
     caen en la misma línea y la de uno termina encima del glifo del vecino.
     El escalonado alterna arriba/abajo por posición horizontal.

     El salto es de 128u —no de 52 como cuando esto era una línea de texto—
     porque lo que no se puede pisar ahora es una caja de 106u de alto. El
     jitter baja a ±5 por lo mismo: con ±8 la holgura entre dos fichas
     vecinas se comía la mitad del margen. */
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
            : base + (i % 2 === 0 ? -64 : 64) + (u.r() - 0.5) * 10
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
    const ficha = anatomia
      ? {
          x: clampX(anatomia.cx - F.ancho / 2),
          y: f(anatomia.baseY - anatomia.radio * 0.68 - 20 - F.alto),
          ...F,
        }
      : {
          x: clampX(ladoFicha(x, izq)),
          y: f(y - F.alto / 2),
          ...F,
        };

    // La plomada une el espécimen con su ficha, como el hilo de un pliego.
    // Cuál de los dos bordes de la caja toca depende de dónde terminó.
    const quedoIzq = ficha.x + F.ancho <= x;
    const plomada = anatomia
      ? `M ${f(anatomia.cx)} ${f(anatomia.baseY - anatomia.radio * 0.68 - 6)} L ${f(anatomia.cx)} ${f(ficha.y + F.alto)}`
      : `M ${f(x + (quedoIzq ? -15 : 15))} ${f(y)} L ${f(quedoIzq ? ficha.x + F.ancho : ficha.x)} ${f(y)}`;

    return { ...c, x: f(x), y: f(y), rootlets, anatomia, ficha, plomada };
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
  const COL_FICHA = 116;
  // La fila la marca la ficha, no el glifo: 112 de caja + 34 de aire.
  const ALTO_FILA = 146;
  const MARGEN_FONDO = 74;
  const F = FICHAS.alto;

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
      ficha: {
        x: f(Math.min(Math.max(anatomia.cx - F.ancho / 2, 12), L.ancho - F.ancho - 12)),
        y: f(anatomia.baseY - anatomia.radio * 0.68 - 14 - F.alto),
        ...F,
      },
      plomada: `M ${f(anatomia.cx)} ${f(anatomia.baseY - anatomia.radio * 0.68 - 4)} L ${f(anatomia.cx)} ${f(anatomia.baseY - anatomia.radio * 0.68 - 14)}`,
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
  let cursor = L.superficie + 116;
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
        ficha: { x: COL_FICHA, y: f(y - F.alto / 2), ...F },
        plomada: `M ${f(x + 16)} ${f(y)} L ${f(COL_FICHA)} ${f(y)}`,
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
