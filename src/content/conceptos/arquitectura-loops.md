---
titulo: Arquitectura de loops
estado: fruto
dominio: ingeniería
plantada: 2026-01-20
podada: 2026-08-22
conecta: [rubrica-skills, criteria]
cosecha: Aplicada a Nougram y a proyectos de medios
resumen: El código que sale de un agente casi nunca falla, y ese es el problema. Sistema de challenger, maker y checker para que la ambigüedad tenga dueño antes de convertirse en deuda.
---

<p class="entrada">El código que sale de un agente casi nunca falla. Ese es el problema.</p>

Falla es fácil: rompe, ves el stack trace, corregís. Lo caro es lo otro — la función que corre verde, pasa los tests, se mergea, y tres semanas después descubrís que solo servía para el caso feliz. Nadie mintió. El maker construyó lo que estaba escrito y el checker validó lo que estaba escrito.

Lo que no está escrito no lo agarra nadie.

Ese hueco es el objeto de todo este método. No es un framework de productividad ni una forma de codear más rápido con IA. Es un sistema para que la ambigüedad tenga dueño antes de convertirse en deuda.

## El principio rector

El loop siempre es el mismo: **atacar → construir/validar → mutar → cerrar**.

Lo único que cambia entre proyectos es el **oráculo**: qué cosa debe ser siempre verdad. Y el oráculo no lo dicta la arquitectura ni el stack. Lo dicta dónde puede sangrar el proyecto.

| tipo de proyecto | sangra por |
|---|---|
| Sitio informativo | Performance, SEO, accesibilidad |
| Ecommerce | Plata y estado |
| SaaS | Aislamiento, autorización, billing |
| Integración | El mundo exterior — APIs, eventos, timeouts |

Un invariante de ecommerce ("el total nunca se recalcula después del pago") es irrelevante en un sitio informativo. Copiar checklists genéricos es lo que hace que la gente abandone los checklists. El menú de invariantes se elige, no se hereda.

## Los tres roles

No son tres personalidades del mismo agente. Son tres momentos con contextos distintos, y esa separación es el punto entero.

| rol | cuándo corre | qué ataca |
|---|---|---|
| **Challenger** | Antes de construir, una vez por spec | El spec. Busca dónde no dice nada |
| **Maker** | Por slice | Construye contra el spec |
| **Checker** | Por slice, contexto fresco | El código, contra los invariantes |

La regla que sostiene todo: **el que escribe no valida**. Si el checker hereda el contexto del maker, hereda también sus supuestos, y valida la interpretación en vez de la especificación. Contexto fresco no es una optimización de tokens, es una condición de independencia.

El Challenger es el rol que casi nadie tiene y el que más devuelve. Devuelve huecos clasificados en BLOQUEANTE / DEUDA / OPCIONAL. Pero la clasificación no sirve si no cierra el ciclo:

- **BLOQUEANTE resuelto** → fila nueva en la tabla de invariantes.
- **DEUDA aceptada** → sección "Lo que esto NO resuelve", firmada con fecha.
- **OPCIONAL** → parking, fuera del spec.

Un hallazgo que se lee y no se escribe en ningún lado no existió.

## Las ocho dimensiones

El Challenger no improvisa: recorre siempre las mismas ocho preguntas. No las desarrollo acá — el valor está en recorrerlas, no en leerlas.

1. **Repetición** — ¿qué pasa si esto ocurre dos veces?
2. **Concurrencia** — ¿qué pasa si dos lo hacen al mismo tiempo?
3. **Frontera de confianza** — ¿qué se está creyendo sin verificar?
4. **Pertenencia** — ¿quién puede ver o tocar lo que no es suyo?
5. **Falla** — cuando esto se rompa, ¿grita o miente en silencio?
6. **Estado y orden** — ¿puede llegar a un estado imposible? ¿puede lo viejo pisar lo nuevo?
7. **Escala y límite** — ¿qué se rompe cuando esto crece diez veces?
8. **Oráculo difuso** — ¿hay algo acá que no es verdadero o falso, sino mejor o peor?

Las siete primeras se responden con un test. La octava no: cuando la respuesta es sí, el invariante booleano no alcanza y hace falta un **golden set** antes de escribir una línea de código. Es la dimensión que más se saltea y la que más entregas retrasa.

Ocho es el techo, y es duro. Para agregar una novena hay que fusionar dos antes. Una lista de quince no se recorre — se saltea, y una heurística salteada es peor que una que no existe.

## El challenger genérico encuentra la mitad

Las dimensiones son universales. El dominio no. Un challenger que sabe que esto es un ecommerce de insumos industriales, con 8.000 SKUs, cuyos clientes preguntan por aplicación de uso y no por nombre de producto, ataca en otra liga.

Por eso el challenger **se genera, no se copia**. Y antes de generarlo hay cinco preguntas:

1. ¿Qué es este producto, en una línea?
2. ¿Quién lo usa y cómo habla? (el registro real, no el que asume el spec)
3. ¿Qué escala tiene hoy y cuál esperás?
4. ¿Dónde ya sangró antes este proyecto, o el anterior parecido?
5. ¿Qué le importa al negocio que nadie escribió en el spec?

Si no podés responder la 2 o la 4, dejalo asentado. El challenger va a pedir esa evidencia y es correcto que la pida.

## Las cuatro reglas de oro

**1. Nada va al maker sin pasar por el Challenger.** El spec sin atacar produce código que funciona y está limitado.

**2. Un slice se cierra solo cuando sus tests (a) pasan con el código actual, Y (b) fallan al inyectar el bug a propósito.** Esto es mutation testing y es la regla más incómoda de todas. Un test que queda verde con el bug inyectado no vale nada: te está dando confianza sin darte cobertura. El checker nunca cierra un invariante sin mutation, y siempre exige evidencia — output, score, log. Nunca un "lo revisé y está ok".

**3. El estado se cierra por hilo, no por sesión.** Cuatro campos, y solo cuatro: dónde quedó, decisión pendiente, por qué frené, descartado y por qué. Lo que se hizo no se documenta — está en el git log y reconstruirlo es barato. Lo caro es la cabeza. Al retomar: se responde la decisión pendiente *antes* de abrir código. Si arrancás por el código, reconstruís contexto veinte minutos y decidís igual de mal.

**4. Todo escape se registra.** Cuando aparece un "funciona pero limitado" que el challenger no anticipó, va a un postmortem. El conteo es el valor: uno es anécdota, dos es patrón.

## Cuándo NO montar nada de esto

¿Más de 3 slices, o tocás más de 4 archivos? → spec + invariantes + loop completo. ¿Menos? → plan mode y a codear.

Montar el aparato para un script es el error de simetría opuesta, y es igual de caro. Dos excepciones:

- **El Challenger corre siempre que haya spec.** Es una pasada de lectura, cuesta nada, y es exactamente donde después se pierde el tiempo.
- **El checkpoint se instala siempre que el trabajo cruce más de una sesión**, aunque el proyecto sea chico.

## La parte evolutiva

Esto no salió armado. Cada pieza es una cicatriz.

Empecé con el spec solo. Escribir antes de codear ya mejoraba todo, pero el código seguía saliendo correcto y limitado. El spec era honesto sobre lo que decía; el problema era su silencio. → nace el **Challenger**.

Después llegaron los tests verdes que no valían. Cobertura alta, invariantes "cubiertos", y bugs que pasaban igual. El test estaba escrito para pasar, no para fallar. → nace la regla de **mutation**.

Después el problema dejó de ser el código y pasé a ser yo. Volvía a un proyecto y quemaba media hora reconstruyendo dónde había quedado. Probé documentar la sesión: no sirve, porque una sesión toca tres temas y ninguno queda legible. → la unidad de estado pasa a ser el **hilo**, no la sesión.

Y falta la cuarta, que es la que le da vida al sistema. Un método que no aprende de sus propias fallas se momifica en la versión 1. Pero acá hay una trampa fina:

**El Challenger no puede reescribirse a sí mismo.** Sus fallas son lo que no encontró, y ningún agente puede medir su propio silencio. Si le pedís que se auto-optimice, se optimiza hacia *parecer* útil. Es la misma regla de siempre: el que escribe no valida.

Entonces el aprendizaje se cosecha desde abajo y asciende con aprobación humana:

| capa | qué vive ahí | cuándo cambia |
|---|---|---|
| **Skill** (global) | Las 8 dimensiones. Estable | Solo con 2+ ocurrencias en proyectos distintos |
| **Proyecto** | El challenger con contexto de dominio | Libre |
| **Escapes** | Los "funciona pero limitado" que pasaron | Cada vez que aparece uno |

Lo que queda dibujado son dos loops a distinta velocidad: uno rápido que produce software, otro lento que produce criterio. El segundo tiene una compuerta que el primero no tiene.

<figure>
<p class="fig-titulo">Los dos loops y la compuerta que los separa</p>
<pre class="diagrama" tabindex="0" role="img" aria-label="El loop rápido, por slice y en horas, va del spec al challenger de ocho dimensiones, de ahí a los invariantes y al maker, y de ahí al checker con contexto fresco. Si el checker da rojo vuelve al maker; si da verde pasa por mutation antes de cerrar el slice. Cuando aparece un escape que nadie anticipó entra al loop lento, por patrón y en meses: postmortem, registro en escapes y, ante una segunda ocurrencia en otro proyecto, una compuerta de aprobación humana que puede sumar una dimensión nueva hasta el techo de ocho.">
   LOOP RÁPIDO · por slice · horas
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   SPEC ──> CHALLENGER ──> INVARIANTES ──> MAKER          │
  │  borrador   8 dimensiones   con "cómo se viola"   │      │
  │                                                   ▼      │
  │                                              ┌─────────┐ │
  │                     rojo → vuelve al maker   │ CHECKER │ │
  │                  ┌───────────────────────────│ ctx     │ │
  │                  │                           │ fresco  │ │
  │                  │                           └────┬────┘ │
  │                  │                                │      │
  │                  └──────── MUTATION <─────────────┘      │
  │                       inyectá el bug: ¿el test cae?      │
  │                                │                         │
  └────────────────────────────────┼─────────────────────────┘
                                   │ verde con mutation
                                   ▼
                            SLICE CERRADO
                                   │
                    ¿apareció un "funciona pero limitado"
                     que nadie anticipó?
                                   │ sí
                                   ▼
  ┌────────────────────────────────────────────────────────┐
  │                                                        │
  │   ESCAPE ──> /postmortem ──> docs/escapes.md           │
  │                                     │                  │
  │                                     ▼                  │
  │                          ¿2ª ocurrencia, en otro       │
  │                            proyecto?                   │
  │                                     │ sí               │
  │                                     ▼                  │
  │                          ╔══════════════════════╗      │
  │                          ║  APROBACIÓN HUMANA   ║      │
  │                          ║  el agente no puede  ║      │
  │                          ║  medir su silencio   ║      │
  │                          ╚══════════╤═══════════╝      │
  │                                     ▼                  │
  │                        DIMENSIÓN NUEVA (techo: 8)      │
  │                                                        │
  └────────────────────────────────────────────────────────┘
     LOOP LENTO · por patrón · meses
</pre>
<figcaption>El loop rápido corre solo. El lento no puede, y esa es la característica del diseño, no su límite: ningún agente puede medir su propio silencio, así que la compuerta humana es estructural.</figcaption>
</figure>

## Lo que esto no resuelve

**No reemplaza saber qué construir.** Un spec bien atacado sobre un producto equivocado da un producto equivocado con excelente cobertura de tests.

**No sirve para comportamiento difuso sin golden set.** Búsqueda, ranking, clasificación, matching, generación: hacen falta 30-50 casos reales con resultado esperado, y hay que correr primero la solución naive contra ese set. A veces alcanza — y siempre te dice el alcance real antes de comprometer la entrega.

**No compensa un dominio que no conocés.** Si no podés contestar dónde sangró antes, el challenger ataca con la mitad de la munición.

La tesis debajo de todo esto: la ejecución se volvió gratis. El agente escribe el código. Lo que no es gratis es saber qué debe ser siempre verdad y quién tiene que atacarlo antes de construirlo. Eso no es un prompt. Es un oráculo, y el oráculo lo pone un humano.

→ [[vibe-coding-con-rigor]] · [[la-tesis]] · [[protocolo-de-foco]]
