import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const conceptos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conceptos' }),
  schema: z.object({
    titulo: z.string(),
    // etapa de maduración -> define el anillo en el mapa
    estado: z.enum(['semilla', 'brote', 'flor', 'fruto']),
    // territorio de pensamiento -> define el sector angular
    dominio: z.string(),
    plantada: z.date().optional(),
    podada: z.date().optional(),
    // conexiones explícitas -> aristas del mapa
    conecta: z.array(z.string()).default([]),
    // lo que la idea produjo en el mundo real -> marcador de cosecha
    cosecha: z.string().optional(),
    resumen: z.string().optional(),
  }),
});

export const collections = { conceptos };
