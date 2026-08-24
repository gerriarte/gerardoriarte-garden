---
titulo: Criteria
estado: brote
dominio: conocimiento
plantada: 2025-12-05
podada: 2026-08-23
conecta: [rubrica-skills, arquitectura-loops]
resumen: La IA automatizó las tareas donde se formaba el juicio. Método para extraer el criterio tácito de un experto — vía Critical Decision Method — y volverlo un skill operable. El problema abierto es validar que ese criterio sea bueno y no sesgo cristalizado.
---

El activo de un experto no es lo que sabe, es cómo **decide** cuando el manual
no alcanza. Ese juicio tácito casi nunca se documenta porque el experto ni
siquiera sabe que lo tiene. Criteria es el método para extraerlo.

La urgencia no es filosófica, es de calendario: el mecanismo que formaba
criterio por accidente se está cerrando, y no hay reemplazo.

## El principio rector

Tres curvas se movieron al mismo tiempo:

| | hacia dónde va | por qué |
|---|---|---|
| **Ejecución** | tiende a cero | la IA la hace y la hace rápido |
| **Conocimiento** | abundante | se sintetiza a demanda |
| **Criterio** | escaso | requiere haber decidido y haber pagado el error |

Quien solo sabe ejecutar compite contra una máquina más rápida y barata. Quien
sabe decidir la dirige. El criterio no se abarata porque no se produce en serie
— se produce decidiendo bajo consecuencia.

Contra la intuición, la IA no reduce el valor del juicio: lo amplifica. Un
modelo devuelve veinte respuestas plausibles en segundos y ninguna señal de
cuál sirve en este contexto. Cuanto más potente la herramienta de ejecución,
más determinante el criterio de quien la apunta.

## La escuela que se cierra

Acá está el problema, y no es una proyección: ya se mide.

| dato | fuente |
|---|---|
| 25% del empleo mundial expuesto a IA generativa (34% en países de altos ingresos); transformación más probable que sustitución | OIT & NASK, 2025 |
| ~80% de los empleos en EE. UU. tiene al menos 10% de sus tareas expuestas a modelos de lenguaje | Eloundou et al. |
| Salarios iniciales: **−6,3% junior**, −5,9% mando intermedio en empresas expuestas. Senior estable o al alza | Azar, Giné & Sanz-Espín, 2025 (138M trabajadores) |
| Los requisitos educativos de puestos de entrada e intermedios bajan de forma sostenida; los de senior se mantienen | ídem |

Las tareas más expuestas son las cognitivas de procesamiento: investigar,
resumir, redactar, comparar, analizar. Y esas eran, durante generaciones, el
trabajo de los que entraban. No las más complejas — las que servían para
aprender el oficio.

Al automatizarlas no se elimina solo trabajo: **se cierra la escuela**. La
señal salarial lo confirma con precisión incómoda. El mercado no castiga la
ejecución en general: castiga la ejecución *de entrada*, que era el único lugar
donde se formaba el juicio. Y paga el criterio que ya existe sin financiar la
producción del próximo.

## La ironía de la automatización

No es un fenómeno nuevo. En los ochenta, la investigación sobre sistemas
automatizados lo nombró: al mecanizar lo rutinario y dejar en manos humanas
solo las excepciones difíciles, se priva a las personas de las oportunidades
cotidianas de ejercer el juicio (Bainbridge).

El resultado es paradójico. Cuando aparece el caso complejo —el que exige
criterio—, quien debe resolverlo nunca tuvo el entrenamiento gradual para
hacerlo. La máquina se ocupó de lo fácil, que era justamente donde se aprendía.

Trasladado a hoy: una generación con más capacidad de ejecución que ninguna
otra en la historia, y menos oportunidades de desarrollar el juicio que
convierte esa ejecución en buenas decisiones. **Producto avanzado, criterio
inmaduro.**

## Qué es criterio, con precisión

Criterio es la capacidad de decidir bien bajo incertidumbre y con información
incompleta: **qué priorizar, qué ignorar, cuándo una respuesta correcta no es
la adecuada, y por qué.** No es conocimiento —eso se consigue gratis—; es
juicio aplicado bajo consecuencia.

La distinción operativa: el conocimiento se verifica contra una fuente. El
criterio se verifica contra un resultado.

## Dónde vive el criterio

El protocolo se apoya en el **Critical Decision Method**: en vez de preguntar
"¿cómo hacés esto?" —que devuelve la teoría que el experto cree tener—, se
reconstruye una decisión real difícil y se cava en los puntos donde eligió un
camino y descartó otros.

La regla que ordena todo el método:

> Lo que el experto declara es una racionalización posterior. Los descartes no.

| lo que se pregunta | lo que devuelve |
|---|---|
| "¿Cómo lo hacés?" | Un manual que el experto no sigue |
| "¿Qué mirabas en ese momento?" | Las señales que usa sin nombrarlas |
| "¿Qué otra opción tenías?" | El espacio de decisión real |
| **"¿Por qué descartaste esa?"** | **El criterio** |

La cuarta es la única que importa. Las tres primeras existen para llegar a ella
sin que el experto se ponga a teorizar.

CDM viene de la investigación en toma de decisiones naturalista, diseñada para
bomberos y pilotos. El aporte acá no es el método: es sostener que el juicio de
un profesional del conocimiento es igual de extraíble, y que el output no
debería ser un informe sino un **skill operable**.

## De juicio a skill

Capturar no alcanza. El output tiene que ser operable: un skill que aplica ese
criterio de forma consistente, no un documento que alguien lee una vez.

Por eso Criteria no vive solo. Depende de dos piezas:

- [[rubrica-skills]] — qué hace bueno a un skill, y cómo evitar que veinte
  skills con criterios distintos se pisen entre sí.
- [[arquitectura-loops]] — cómo se valida que el skill decide como el experto y
  no alucina con seguridad.

Sin las dos, Criteria produce artesanía documentada.

## El problema del oráculo

Acá está el hueco, y es el que decide si el método sirve o es teatro.

Capturar criterio es la parte fácil. La difícil es responder **cómo sabés que
el criterio capturado es bueno.**

Un experto con veinte años puede tener juicio perfectamente calibrado a un
mercado que ya no existe. Sus descartes fueron correctos en 2015 y hoy son
supersticiones con currículum. Sin algo que deba ser siempre verdad, no estás
codificando criterio: estás **cristalizando el sesgo de una persona y dándole
autoridad de sistema** — peor que no tener método, porque ahora el sesgo escala
y firma.

Es la misma distinción que separa los dos loops de [[arquitectura-loops]]:

| | oráculo | qué pasa sin él |
|---|---|---|
| Loop de validación | sí — invariantes | el código no compila, se nota |
| Loop de negocio | no | deriva hacia lo cómodo, no se nota |
| **Criteria hoy** | **no** | el criterio malo se propaga con confianza |

## El criterio codificado caduca y no puede saberlo

Hay un segundo problema, y es estructural: no está en la calidad de la captura
sino en la naturaleza del artefacto.

> Un criterio codificado no puede declararse obsoleto. Un skill **es** su
> criterio — no tiene desde dónde dispararle.

Un experto vivo puede llegar a la conclusión de que su propio juicio dejó de
aplicar. Es una operación que exige pararse afuera del criterio propio. Un
artefacto que *consiste* en ese criterio no tiene afuera.

Eso parte el problema en dos, y solo una mitad se resuelve con ingeniería:

| operación | ¿codificable? | por qué |
|---|---|---|
| **Detectar** que el criterio falla | **Sí** | es monitoreo de deriva: outcomes contra predicción |
| **Decidir con qué reemplazarlo** | **No** | el dominio nuevo todavía no tiene casos acumulados |

Consecuencia para el método: **todo skill de criterio necesita fecha de
extracción y una condición de revisión.** Sin eso, Criteria no produce criterio
operable — produce criterio embalsamado que se sigue ejecutando con la
autoridad del día que se capturó.

## La arena

El único candidato honesto a oráculo es exponer el criterio codificado a
**problemas reales con consecuencia**, y dejar que el resultado —no un
checklist, no la aprobación del experto— decida si acertó.

Es un oráculo lento, ruidoso y caro. Es un oráculo igual. Y es también el único
mecanismo que puede disparar la revisión de la sección anterior: sin señal de
resultado, no hay forma de saber que el criterio caducó.

La implicancia hay que sostenerla aunque incomode:

> Mientras no exista esa arena, Criteria no puede afirmar que **forma** criterio.
> Solo puede afirmar que lo **transmite**. No es lo mismo.

La diferencia no es semántica. Estudiar decisiones ajenas es consumir
contenido, y el criterio no se forma consumiendo —se forma decidiendo—. Un
método que captura juicio y lo entrega como material de estudio reproduce
exactamente el problema que dice combatir, con mejor packaging. La arena es lo
único que separa una cosa de la otra.

## Cuándo NO usar esto

- **Dominio inestable.** Si las reglas cambian más rápido de lo que se codifica
  el criterio, estás embalsamando. Ahí conviene el experto vivo.
- **Casos que no se repiten.** Sin repetición no hay patrón que extraer, solo
  anécdotas bien contadas.
- **Experto sin errores documentados.** Si no puede reconstruir una decisión que
  salió mal, no vas a poder distinguir su criterio de su relato.
- **Cuando el objetivo real es documentar procesos.** Eso es otra cosa, es más
  barata, y no necesita nada de esto.

## Lo que esto NO resuelve

*(deuda firmada — 2026-08-23)*

- **El oráculo.** Sin arena corrida, el método está sin validar. Es la deuda
  principal, no un detalle de implementación.
- **La caducidad.** Está identificado el problema y el corte
  detectar/reemplazar, pero no hay mecanismo de revisión implementado.
- **La recursión.** Si el criterio se codifica, ¿qué queda del experto? El
  método produce su propia pregunta y todavía no la responde acá.
- **La escala.** Sirve para un experto. No está probado para el criterio
  distribuido de un equipo, donde nadie tiene la decisión completa.

## Estado

Brote. Está el método, está el diagnóstico y están los datos. **No está la
aplicación.**

Sube a flor cuando haya: un experto extraído, un skill que decida como él, y al
menos una divergencia entre los dos resuelta por la realidad —no por mí—.
