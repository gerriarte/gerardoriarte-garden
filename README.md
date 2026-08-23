# Gerardo Riarte

Digital garden con metáfora micológica. Los conceptos publicados son **hongos**
—cuerpos fructíferos, lo visible—; el valor real es el **micelio** subterráneo
que los conecta, o sea el criterio acumulado.

> La IA volvió gratis la ejecución. Lo único que se cobra es saber qué construir.
> Todos ven los hongos; nadie ve el micelio.

Astro 5 + Content Collections + Tailwind v4. Salida estática, sin backend, sin
base de datos, sin embeddings. Todo el grafo se calcula en build.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ para revisar el build
```

## Las dos vistas

| ruta | qué es | para quién |
|------|--------|-----------|
| `/` | **Mapa de micelio.** Corte de tierra: los frutos asoman sobre la línea de superficie, el resto vive abajo a distinta profundidad. Al apuntar un espécimen se iluminan sus hifas y el resto se atenúa. | el que viene a explorar |
| `/especimenes` | **Pliegos de herbario.** Índice agrupado por etapa de maduración, calmo, sin mapa. | el que viene a leer |

### El mapa tiene dos composiciones, no una responsive

Las posiciones quedan horneadas en los `d` de los paths: no hay media query que
reacomode una curva bezier. Así que `micelio.ts` emite **dos láminas** y CSS
muestra una u otra en 900px. El HTML lleva las dos (+2.4KB gzip). Se paga.

| | **panorámica** (>900px) | **vertical** (teléfono) |
|---|---|---|
| composición | corte ancho | testigo de suelo |
| profundidad | proporcional | ordinal, por estratos rotulados |
| dominio | posición en el eje x | etiqueta impresa bajo el nombre |
| se recorre | de un vistazo | bajando por los estratos |

**El dominio deja de ser posición en el teléfono.** En 375px no entran cinco
columnas más sus rótulos sin volverse ilegibles, así que se imprime. Es la única
concesión de la metáfora, y a cambio la profundidad —que es el eje que importa—
queda intacta y además se recorre scrolleando, que es lo que un teléfono sabe
hacer.

**Sin hover no hay recompensa**, así que en táctil el primer toque traza la red
y el segundo entra a la nota. El foco de teclado hace lo mismo que el hover.

### Por qué `/especimenes` agrupa por madurez

Con pocos conceptos repartidos en cinco dominios, agrupar por dominio daba
paneles de una ficha cada uno y tres cuartos del ancho vacíos. Por madurez
empaqueta mejor y deja a la vista la métrica de salud del jardín. El dominio
sigue impreso en la etiqueta de cada pliego.

## La escalera de maduración

La etapa define la **profundidad** en el corte de tierra. Solo el cuerpo
fructífero asoma.

| micológico | `estado` | dónde vive |
|------------|----------|-----------|
| Espora | `semilla` | lo más hondo |
| Hifa | `brote` | media-honda |
| Micelio | `flor` | media |
| Cuerpo fructífero | `fruto` | rompe la superficie |

## Plantar una nota nueva

Creá un `.md` en `src/content/conceptos/`. **El nombre del archivo es el slug.**

```yaml
---
titulo: Nombre del concepto
estado: semilla        # semilla | brote | flor | fruto
dominio: growth        # columna en la lámina panorámica; etiqueta en la vertical
plantada: 2026-08-22
podada: 2026-08-22     # opcional
conecta: [otro-slug]   # hifas explícitas (opcional)
cosecha: "Cliente X"   # solo si fructificó -> marcador ámbar
resumen: Una línea para el pliego de herbario.
---

Cuerpo en markdown. Podés enlazar con [[otro-slug]]: cuenta como hifa igual
que `conecta`, y genera backlinks solos.
```

Las **aristas** del mapa son `conecta` + los `[[wikilinks]]` del cuerpo,
deduplicadas. Los **backlinks** (quién te referencia) se computan en build.

## Las dos reglas del jardín

1. **Ninguna nota nace huérfana.** Toda nota nueva `conecta` con al menos otra.
   Si no conecta con nada, todavía no es un concepto tuyo — es un apunte.
2. **Una sola métrica de salud:** ¿cuántos conceptos pasaron a `fruto` este mes?
   No visitas, no likes. Maduración. Por eso `/especimenes` agrupa por etapa: la
   métrica tiene que verse sin buscarla.

## Estructura

```
src/
├─ content/conceptos/          # las notas (una por concepto)
├─ content.config.ts           # schema del frontmatter
├─ lib/
│  ├─ estados.ts               # escalera micológica -> profundidad
│  ├─ grafo.ts                 # red pura: aristas y backlinks, sin geometría
│  ├─ micelio.ts               # las dos láminas: posiciones, hifas, anatomía
│  └─ glifos.ts                # un glifo por etapa, compartido entre vistas
├─ components/
│  ├─ MapaMicelio.astro        # la firma del sitio
│  ├─ FichaEspecimen.astro     # pliego de herbario
│  └─ GlifoEstado.astro
├─ pages/
│  ├─ index.astro              # vista mapa
│  ├─ especimenes.astro        # vista índice
│  └─ conceptos/[slug].astro
└─ styles/global.css           # tokens: papel / tinta / ámbar
```

## Notas de diseño

- **Tokens por rol, no por color** (`--papel`, `--tinta`, `--ambar`). La paleta
  de este sitio ya se dio vuelta más de una vez; nombrarla por rol hace que
  cambiarla sea tocar seis líneas y no cinco archivos.
- **El ámbar viene en dos tonos.** `--ambar` (#C4871A) da 2.26:1 sobre papel:
  sirve como relleno gráfico —siempre con contorno de tinta, que es quien carga
  el contraste— pero es ilegible como texto. Para texto va `--ambar-hondo`
  (#7E5209, 5.0:1). No unificarlos sin cambiar antes el fondo.
- **La red se dibuja con azar determinístico** (FNV-1a + xorshift32 sembrados
  por slug). La misma nota dibuja siempre la misma hifa: el build es
  reproducible y los diffs no son ruido.
- **`grafo.ts` no sabe de geometría** y `micelio.ts` no sabe de contenido. Si
  algún día el mapa deja de ser un corte de tierra, se reemplaza `micelio.ts`
  y la red queda intacta.
- **Movimiento ambiental** = solo drift/opacidad por CSS, apagado entero bajo
  `prefers-reduced-motion`.
- **El SVG del mapa usa `role="group"`, no `role="img"`.** Con `img` el lector
  de pantalla trata todo el subárbol como una imagen y los seis nodos —que son
  navegación— desaparecen. La lámina oculta va con `display:none`, que la saca
  del árbol de accesibilidad y del orden de tabulación: los nodos nunca se
  anuncian dos veces.

## Fase 2 (no implementado)

Anotado a propósito, para después y solo si el contenido lo justifica:

- **Hifas generativas** que se ramifiquen con space-colonization en vez de
  beziers pre-calculadas.
- **Animación de crecimiento** al pasar de una etapa a la siguiente.
- Filtro por dominio en el mapa.

La fase 1 dibuja la red **una sola vez en build** y solo reacciona al hover. No
hay física ni crecimiento en tiempo real, y es deliberado: entre simple y
espectacular, acá se eligió simple.

## SEO y GEO

SEO clásico y GEO (*Generative Engine Optimization*: que los motores
generativos entiendan y citen el sitio) comparten base, pero no piden lo mismo.

### Lo que se emite

| archivo / etiqueta | para qué |
|---|---|
| `<link rel=canonical>` | una URL por documento, **sin barra final** |
| Open Graph + Twitter Card | vista previa al compartir |
| `/og/<slug>.png` | imagen por concepto, generada en build con `sharp` |
| JSON-LD (`@graph`) | entidades: Person, WebSite, Article, DefinedTerm |
| `/sitemap-index.xml` | descubrimiento y recrawl (`lastmod`) |
| `/rss.xml` | conceptos ordenados por última poda |
| `/robots.txt` | permiso explícito a los rastreadores generativos |
| `/llms.txt` | mapa del sitio en markdown para LLMs |
| `/llms-full.txt` | contenido completo, sin los SVG |
| `/conceptos/<slug>.md` | cada nota en markdown limpio |

### Las tres decisiones que importan

**1. Entidades, no cadenas de texto.** El JSON-LD usa `@graph` con `@id`
estables (`#autor`, `#sitio`, `#glosario`) en vez de objetos anidados. Así la
misma persona se referencia desde todas las páginas y se consolida como una
entidad, en vez de repetirse siete veces como texto suelto. Cada concepto es un
`DefinedTerm` dentro de un `DefinedTermSet`: le dice al motor "esto es un
concepto con definición", no "esto es una página".

**2. Se tira el dibujo, se queda la conclusión.** La nota de Net Build Rate es
23KB de markdown y buena parte son datos de `path` SVG: ruido puro para un
motor, y le come la ventana de contexto. Pero los `figcaption` de esas figuras
llevan el argumento ("el techo real es 8%"). `lib/texto.ts` descarta los SVG y
conserva los epígrafes: 36% menos peso sin perder un solo dato.

**3. La metáfora se explica.** `llms.txt` aclara de entrada que **el sitio no
trata sobre hongos**. Sin eso, un motor que lea "micelio", "hifas" y "cuerpo
fructífero" puede clasificar el sitio como micología y citarlo mal, o no
citarlo.

### Perfiles: el único campo que falta completar

En `lib/sitio.ts` hay una constante `REDES` con LinkedIn, GitHub, TikTok e
Instagram, todas con la URL vacía. Al pegar la URL real, cada perfil alimenta
tres cosas **de una sola vez**:

1. `sameAs` en el JSON-LD de todas las páginas.
2. Un enlace visible en el pie con `rel="me"`.
3. La verificación cruzada: el motor sigue el enlace y espera encontrar una
   referencia de vuelta a este dominio (conviene poner www.gerardoriarte.com en la
   bio de cada perfil).

```ts
export const REDES = [
  { nombre: 'LinkedIn',  url: 'https://www.linkedin.com/in/<usuario>' },
  { nombre: 'GitHub',    url: 'https://github.com/<usuario>' },
  { nombre: 'TikTok',    url: 'https://www.tiktok.com/@<usuario>' },
  { nombre: 'Instagram', url: 'https://www.instagram.com/<usuario>' },
];
```

Lo que quede en `''` se filtra solo: no aparece en el pie ni en `sameAs`, y si
están las cuatro vacías la propiedad `sameAs` se omite entera en vez de emitir
un array vacío.

**Solo URLs reales y verificadas.** Una URL equivocada acá es peor que ninguna:
apunta la entidad a otra persona, que es exactamente lo que `sameAs` existe
para evitar.
- Las imágenes OG se rasterizan con **las tipografías de la máquina de build**,
  no con las que carga el navegador. En Vercel (Linux) no hay Georgia, así que
  degradan a un serif genérico. El papel, la tinta y el ámbar sí se mantienen.

## Deploy

Vercel autodetecta Astro. Salida estática, no necesita adapter. Conectá el repo
o corré `vercel`.

`site` en `astro.config.mjs` está en `https://www.gerardoriarte.com` — cambialo si
el dominio final es otro, porque de ahí salen las URLs canónicas.
