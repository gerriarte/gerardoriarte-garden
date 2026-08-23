import type { Estado } from './estados';

/**
 * Vocabulario de glifos, un shape por etapa micológica.
 *
 * Devuelve solo datos de path: cada consumidor (mapa, ficha, leyenda) pinta
 * sus propios <path> con sus propias clases. Así el dibujo es uno solo pero
 * la interacción no queda atrapada en un string de HTML.
 *
 * Cada glifo dibuja el rasgo que de verdad IDENTIFICA a esa etapa, no una
 * abstracción decorativa. Es la diferencia entre un ícono y un dibujo de
 * alguien que miró por el microscopio:
 *   - la espora tiene apículo (el pico por donde estuvo prendida) y gútula;
 *   - la hifa tiene septos, que es lo que la define como hifa septada;
 *   - el micelio tiene anastomosis: dos ramas que se fusionan y cierran un
 *     circuito. Una red que solo irradia no es micelio, es una estrella.
 *
 * Todos se dibujan alrededor de (0,0) en un radio nominal de 10, para poder
 * escalarlos con transform.
 */

export interface Glifo {
  /** Trazos de tinta. */
  trazos: string[];
  /** Forma cerrada que admite relleno (si el estado tiene una). */
  cuerpo?: string;
  /** Puntos sueltos (gútula, nudo). */
  puntos?: { cx: number; cy: number; r: number }[];
}

export const GLIFOS: Record<Estado, Glifo> = {
  // ESPORA — elipsoide con apículo y una gútula adentro. Lo más hondo.
  semilla: {
    cuerpo:
      'M -7.6 1.2 C -7.8 -3.4, -4 -6.4, 0.4 -6.4 ' +
      'C 4.8 -6.4, 7.8 -3.6, 7.8 0.2 ' +
      'C 7.8 4, 4.6 6.4, 0.4 6.4 ' +
      'C -3.6 6.4, -7.4 4.6, -7.6 1.2 Z',
    trazos: [
      // apículo: un pico CORTO en la base. Largo, se lee como mango de lupa.
      'M -4.4 5.6 C -5 6.6, -5.4 7.2, -5.8 7.8',
    ],
    puntos: [{ cx: 1.6, cy: -0.6, r: 2.1 }],
  },

  // HIFA — un tubo septado con el ápice de crecimiento a la derecha.
  brote: {
    trazos: [
      // pared superior
      'M -9.6 -2.8 C -5 -3.9, 0 -3.5, 4.4 -2.4 C 6.9 -1.8, 8.6 -0.8, 9.5 0.5',
      // pared inferior
      'M -9.6 1.4 C -5 0.3, 0 0.7, 4.4 1.8 C 6.4 2.3, 7.8 3, 8.7 3.9',
      // ápice redondeado: por acá crece
      'M 9.5 0.5 C 10.5 1.6, 10 3.2, 8.7 3.9',
      // septos: las paredes transversales que la hacen una hifa septada
      'M -5.4 -3.5 L -5.4 0.7',
      'M -0.8 -3.4 L -0.8 0.9',
      'M 3.6 -2.6 L 3.6 1.6',
    ],
  },

  // MICELIO — DOS nudos unidos por dos caminos: ese circuito cerrado es una
  // anastomosis, y es lo que separa una red de una estrella. Con un solo
  // centro del que salen radios, el glifo se lee como una araña.
  flor: {
    trazos: [
      // entra al primer nudo
      'M -9.8 -6.2 C -7.2 -4.8, -5.2 -3.2, -3.3 -1.3',
      // los dos caminos entre nudo y nudo: el circuito
      'M -3.3 -1.3 C -1.2 -0.5, 0.9 0.5, 3.2 2',
      'M -3.3 -1.3 C -1.5 -3, 1 -2.7, 3.2 2',
      // sale del segundo
      'M 3.2 2 C 5.3 3.6, 7.1 5.7, 8.7 8.5',
      'M 3.2 2 C 5.5 1, 7.5 -0.7, 9.3 -2.9',
      // ramas que mueren en la tierra
      'M -3.3 -1.3 C -4.6 1.2, -5.6 3.8, -6.3 6.5',
      'M -6.3 6.5 C -7.3 7.8, -8.3 8.6, -9.3 9.2',
      'M -0.1 -1.9 C 0.6 -4.3, 1.4 -6.3, 2.3 -8.6',
    ],
    puntos: [
      { cx: -3.3, cy: -1.3, r: 1.9 },
      { cx: 3.2, cy: 2, r: 1.9 },
    ],
  },

  // CUERPO FRUCTÍFERO — la silueta que asoma, con laminillas y pie cónico.
  fruto: {
    cuerpo:
      'M -9.2 0.6 C -9 -6, -4.4 -9.4, 0.8 -9.4 ' +
      'C 5.6 -9.4, 9.2 -6, 9.2 0.6 ' +
      'Q 0 3.9, -9.2 0.6 Z',
    trazos: [
      // laminillas asomando bajo el margen
      'M -6.2 1.4 L -6.6 2.6',
      'M -3.4 2.2 L -3.6 3.5',
      'M -0.4 2.6 L -0.4 3.9',
      'M 2.6 2.4 L 2.8 3.7',
      'M 5.4 1.7 L 5.8 2.9',
      // pie, que se ensancha hacia abajo
      'M -2.2 2.6 C -2.6 5.2, -3 7.4, -3.6 10',
      'M 2.2 2.6 C 2.6 5.2, 3 7.4, 3.6 10',
      'M -3.6 10 Q 0 11.6, 3.6 10',
    ],
  },
};
