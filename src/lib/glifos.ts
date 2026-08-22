import type { Estado } from './estados';

/**
 * Vocabulario de glifos, un shape por etapa micológica.
 * Devuelve solo datos de path: cada consumidor (mapa, ficha, leyenda) pinta
 * sus propios <path> con sus propias clases. Así el dibujo es uno solo pero
 * la interacción no queda atrapada en un string de HTML.
 *
 * Todos los glifos se dibujan alrededor de (0,0) en un radio nominal de 10,
 * para poder escalarlos con transform.
 */

export interface Glifo {
  /** Trazos de tinta. */
  trazos: string[];
  /** Forma cerrada que admite relleno (si el estado tiene una). */
  cuerpo?: string;
  /** Puntos sueltos (esporas). */
  puntos?: { cx: number; cy: number; r: number }[];
}

export const GLIFOS: Record<Estado, Glifo> = {
  // Espora: un punto denso con un halo punteado alrededor. Lo más hondo.
  semilla: {
    trazos: ['M -9 0 A 9 9 0 1 1 9 0 A 9 9 0 1 1 -9 0'],
    puntos: [{ cx: 0, cy: 0, r: 2.6 }],
  },

  // Hifa: un filamento con dirección, todavía sin red.
  brote: {
    trazos: [
      'M -9 6 C -5 2, -2 4, 0 0 C 2 -4, 5 -2, 9 -6',
      'M 0 0 C 1.5 2.5, 4 3, 6 5.5',
    ],
    puntos: [{ cx: 0, cy: 0, r: 2.2 }],
  },

  // Micelio: un nudo del que salen filamentos en varias direcciones.
  flor: {
    trazos: [
      'M 0 0 C -3 -3, -6 -4, -9.5 -5',
      'M 0 0 C -3.5 2, -6 4.5, -8 8',
      'M 0 0 C 3 -3.5, 6 -5, 9.5 -6.5',
      'M 0 0 C 4 1.5, 6.5 4, 8.5 7.5',
      'M 0 0 C 0.5 3.5, 0 6, -1 9.5',
    ],
    puntos: [{ cx: 0, cy: 0, r: 2.8 }],
  },

  // Cuerpo fructífero: la silueta que asoma. Lo único que se ve desde arriba.
  fruto: {
    cuerpo: 'M -9.5 1 C -9.5 -7.5, 9.5 -7.5, 9.5 1 Q 0 4.5, -9.5 1 Z',
    trazos: [
      'M -3 1.5 C -3 6, -3.5 8, -3 10',
      'M 3 1.5 C 3 6, 3.5 8, 3 10',
      'M -3 10 Q 0 11.5, 3 10',
    ],
  },
};
