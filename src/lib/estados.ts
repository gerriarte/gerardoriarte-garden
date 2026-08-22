export type Estado = 'semilla' | 'brote' | 'flor' | 'fruto';

interface ConfigEstado {
  /** Cómo se llama la etapa en la metáfora micológica. */
  label: string;
  /** El plural, para encabezados de agrupación. */
  plural: string;
  /**
   * Qué tan hondo vive el nodo, como fracción del espesor del subsuelo.
   * 0 = la línea de superficie; 1 = el fondo de la lámina.
   * El cuerpo fructífero es lo único que asoma.
   */
  profundidad: number;
  descripcion: string;
  /** Del más crudo al más maduro. */
  orden: number;
}

export const ESTADOS: Record<Estado, ConfigEstado> = {
  fruto: {
    label: 'Cuerpo fructífero',
    plural: 'Cuerpos fructíferos',
    profundidad: 0.03,
    descripcion:
      'Asomó sobre la tierra. Produjo algo tangible: un método aplicado, un cliente, plata.',
    orden: 3,
  },
  flor: {
    label: 'Micelio',
    plural: 'Micelio',
    profundidad: 0.3,
    descripcion: 'Red madura y extendida. Se defiende sola en público.',
    orden: 2,
  },
  brote: {
    label: 'Hifa',
    plural: 'Hifas',
    profundidad: 0.56,
    descripcion: 'Un filamento con dirección. Tiene forma, le falta sustancia.',
    orden: 1,
  },
  semilla: {
    label: 'Espora',
    plural: 'Esporas',
    profundidad: 0.84,
    descripcion: 'Lo más hondo. Idea cruda, todavía sin germinar.',
    orden: 0,
  },
};

/** Del más crudo (hondo) al más maduro (superficie). */
export const ORDEN_ESTADOS: Estado[] = ['semilla', 'brote', 'flor', 'fruto'];

/** De la superficie hacia abajo — el orden en que se lee el corte de tierra. */
export const ORDEN_DESCENDENTE: Estado[] = ['fruto', 'flor', 'brote', 'semilla'];
