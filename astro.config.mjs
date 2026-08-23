import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkWikiLink from 'remark-wiki-link';

const DIR_CONCEPTOS = './src/content/conceptos';

/**
 * Slugs existentes, leídos en build.
 * Sin esta lista remark-wiki-link marca TODO wikilink como inexistente
 * (`newClassName`), y las hifas del texto se pintan como rotas aunque la
 * nota exista. El nombre del archivo es el slug.
 */
const permalinks = fs
  .readdirSync(DIR_CONCEPTOS)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

export default defineConfig({
  site: 'https://www.gerardoriarte.com',
  // Barra final consistente: evita que /especimenes y /especimenes/ se
  // indexen como dos documentos distintos.
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // lastmod importa para el recrawl; la prioridad explícita casi no.
      changefreq: 'weekly',
      lastmod: new Date(),
      // Mismas URLs que las canónicas: sin barra final. Si el sitemap y la
      // canónica discrepan, el motor tiene que resolver el empate solo.
      serialize: (item) => ({
        ...item,
        url: item.url.replace(/(.)\/$/, '$1'),
      }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [
      [
        remarkWikiLink,
        {
          permalinks,
          aliasDivider: '|',
          pageResolver: (name) => [name.trim().replace(/\s+/g, '-').toLowerCase()],
          hrefTemplate: (permalink) => `/conceptos/${permalink}`,
          wikiLinkClassName: 'wikilink',
          newClassName: 'wikilink--nueva',
        },
      ],
    ],
  },
});
