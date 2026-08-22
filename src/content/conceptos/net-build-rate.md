---
titulo: Net Build Rate
estado: flor
dominio: medición
plantada: 2026-04-15
podada: 2026-08-01
conecta: [a-bra-loop, criteria]
resumen: Métrica de brand equity que mide cuánto construye una marca por unidad de inversión, no cuánto gasta.
---

<p class="entrada">Empecé preguntando por una sucesión numérica sin ninguna utilidad. Cuatro horas después tenía una métrica de brand equity con tres defectos graves, todos corregidos. Este es el registro del desvío.</p>

<figure>
<svg class="arcos-recaman" viewBox="0 0 1200 400" role="img" aria-label="Visualización de la sucesión de Recamán mediante arcos alternados">
<path d="M 20.0 200 A 5.1 5.1 0 0 1 30.2 200" />
    <path d="M 30.2 200 A 10.2 10.2 0 0 0 50.5 200" />
    <path d="M 50.5 200 A 15.3 15.3 0 0 1 81.1 200" />
    <path d="M 81.1 200 A 20.4 20.4 0 0 1 40.4 200" />
    <path d="M 40.4 200 A 25.4 25.4 0 0 1 91.2 200" />
    <path d="M 91.2 200 A 30.5 30.5 0 0 0 152.3 200" />
    <path d="M 152.3 200 A 35.6 35.6 0 0 1 223.5 200" />
    <path d="M 223.5 200 A 40.7 40.7 0 0 1 142.1 200" />
    <path d="M 142.1 200 A 45.8 45.8 0 0 1 233.7 200" />
    <path d="M 233.7 200 A 50.9 50.9 0 0 1 131.9 200" />
    <path d="M 131.9 200 A 56.0 56.0 0 0 1 243.9 200" />
    <path d="M 243.9 200 A 61.1 61.1 0 0 1 121.8 200" />
    <path d="M 121.8 200 A 66.1 66.1 0 0 1 254.0 200" />
    <path d="M 254.0 200 A 71.2 71.2 0 0 1 111.6 200" />
    <path d="M 111.6 200 A 76.3 76.3 0 0 1 264.2 200" />
    <path d="M 264.2 200 A 81.4 81.4 0 0 1 101.4 200" />
    <path d="M 101.4 200 A 86.5 86.5 0 0 1 274.4 200" />
    <path d="M 274.4 200 A 91.6 91.6 0 0 0 457.5 200" />
    <path d="M 457.5 200 A 96.7 96.7 0 0 1 650.9 200" />
    <path d="M 650.9 200 A 101.8 101.8 0 0 1 447.4 200" />
    <path d="M 447.4 200 A 106.8 106.8 0 0 1 661.1 200" />
    <path d="M 661.1 200 A 111.9 111.9 0 0 1 437.2 200" />
    <path d="M 437.2 200 A 117.0 117.0 0 0 0 203.2 200" />
    <path d="M 203.2 200 A 122.1 122.1 0 0 0 447.4 200" />
    <path d="M 447.4 200 A 127.2 127.2 0 0 0 193.0 200" />
    <path d="M 193.0 200 A 132.3 132.3 0 0 0 457.5 200" />
    <path d="M 457.5 200 A 137.4 137.4 0 0 0 182.8 200" />
    <path d="M 182.8 200 A 142.5 142.5 0 0 0 467.7 200" />
    <path d="M 467.7 200 A 147.5 147.5 0 0 0 172.6 200" />
    <path d="M 172.6 200 A 152.6 152.6 0 0 0 477.9 200" />
    <path d="M 477.9 200 A 157.7 157.7 0 0 0 162.5 200" />
    <path d="M 162.5 200 A 162.8 162.8 0 0 0 488.1 200" />
    <path d="M 488.1 200 A 167.9 167.9 0 0 1 823.9 200" />
    <path d="M 823.9 200 A 173.0 173.0 0 0 0 1169.8 200" />
    <path d="M 1169.8 200 A 178.1 178.1 0 0 0 813.7 200" />
    <path d="M 813.7 200 A 183.2 183.2 0 0 0 1180.0 200" />
    <path d="M 1180.0 200 A 188.2 188.2 0 0 0 803.5 200" />
<line x1="20" y1="200" x2="1180" y2="200" stroke="currentColor" stroke-width="1" opacity=".18"/>
</svg>
<figcaption>A005132 · 0 1 3 6 2 7 13 20 12 21 11 22 10 23 9 24 8 25 43 62… Cada salto de la sucesión dibujado como un semicírculo. La regla no sirve para nada; el dibujo la hizo famosa.</figcaption>
</figure>

Sin objetivo. Curiosidad de las tres de la tarde.

Cuatro horas después había una métrica de brand equity, un deck de diecinueve slides y un piloto propuesto para un cliente. No estoy contando esto porque el resultado sea impresionante —todavía no está validado, puede que no funcione— sino porque el proceso me pareció más interesante que el producto.

Aclaro desde el arranque que esto se construyó en conversación con un modelo, porque el reparto de trabajo es parte de lo que quiero registrar. La formalización, el modelo matemático y la métrica salieron de ahí. Los tres errores graves que tuvo el método aparecieron por preguntas mías. Ninguna de las dos mitades hubiera llegado sola.

## El punto de partida: una secuencia inútil

La sucesión de Recamán es una regla de una línea. Arrancás en cero y en cada paso restás si podés —si el resultado es positivo y no apareció antes—; si no podés, sumás.

Dato con gancho local: la creó Bernardo Recamán Santos, matemático colombiano. Se la mandó a Neil Sloane a principios de los noventa y quedó en la enciclopedia de secuencias como A005132.

Su utilidad práctica es cero. Lo que la hizo famosa fue la visualización: si dibujás cada salto como un semicírculo —los arcos que abren esta nota— sale un patrón que parece caótico y ordenado a la vez. Un video de Numberphile la volvió viral.

Ahí ya había algo: **la sucesión no es matemáticamente relevante, pero la forma de representarla la hizo conocida en todo el mundo.** Guardé el pensamiento y seguí.

<svg class="filete-arcos" viewBox="0 0 120 22" aria-hidden="true"><path d="M4 18 A 14 14 0 0 1 32 18 M32 18 A 20 20 0 0 0 72 18 M72 18 A 12 12 0 0 1 96 18 M96 18 A 10 10 0 0 0 116 18"/></svg>

## El primer error: forzar una analogía

Se me ocurrió que la regla se parecía a construir marca. Cada acción suma, cada desvío resta. Lo tiré a ver qué pasaba.

La respuesta que me devolvieron fue incómoda y correcta: **estaba invirtiendo la regla sin darme cuenta.** En Recamán restar es el movimiento preferido y sumar es el fallback forzado. Yo proponía lo opuesto. Ya no era Recamán, era otra cosa.

Y había un error más grande adentro: **el desvío casi nunca resta.**

Una campaña fuera de territorio no destruye equity. Lo que hace es desperdiciar la oportunidad de acumularlo mientras la memoria existente sigue cayendo sola. Es costo de oportunidad, no daño.

La distinción parece de manual pero cambia todo. Si el desvío *resta*, la conversación con el equipo creativo es sobre culpa. Si el desvío *divide el retorno*, la conversación es sobre asignación de presupuesto. La segunda se puede tener sin que nadie se ponga a la defensiva. La primera no.

Acá aprendí algo sobre analogías: son cómodas justamente cuando son malas. «Se ve caótico pero hay estructura» es exactamente lo que dice todo director de marketing que perdió el rumbo. Recamán se ve ordenada solo desde afuera y solo en retrospectiva. Una marca no puede esperar diez años a que el patrón se revele.

**Solté la sucesión. Me quedé con el modelo.**

## Formalizar hasta que se rompa

Lo que quedaba era un modelo de acumulación con decaimiento. La primera pieza es la que casi nadie mide: **el brand equity es un saldo que se devalúa solo.**

<figure>
<p class="fig-titulo">Qué queda de la memoria de marca si la inversión se detiene</p>
<svg viewBox="0 0 640 300" role="img" aria-label="Curva de decaimiento de la memoria de marca a lo largo de doce meses">
  <g class="grilla">
    <line x1="52" y1="40" x2="620" y2="40"/><line x1="52" y1="100" x2="620" y2="100"/>
    <line x1="52" y1="160" x2="620" y2="160"/><line x1="52" y1="220" x2="620" y2="220"/>
  </g>
  <line class="eje" x1="52" y1="250" x2="620" y2="250"/>
  <g class="rotulo-eje" text-anchor="end">
    <text x="44" y="44">100</text><text x="44" y="104">75</text>
    <text x="44" y="164">50</text><text x="44" y="224">25</text><text x="44" y="254">0</text>
  </g>
  <path class="curva-area" d="M52 40 L99 65.2 L146 89.6 L193 110.1 L240 127.6 L287 142.4 L334 155.1 L381 165.7 L428 175.0 L475 182.6 L522 189.2 L569 194.9 L616 199.8 L616 250 L52 250 Z"/>
  <path class="curva" d="M52 40 L99 65.2 L146 89.6 L193 110.1 L240 127.6 L287 142.4 L334 155.1 L381 165.7 L428 175.0 L475 182.6 L522 189.2 L569 194.9 L616 199.8"/>
  <circle class="hito" cx="52" cy="40" r="3.5"/>
  <circle class="hito" cx="334" cy="155.1" r="3.5"/>
  <line class="hito-linea" x1="334" y1="155.1" x2="334" y2="250"/>
  <text class="anotacion" x="342" y="148">38% a los 6 meses</text>
  <g class="rotulo-eje" text-anchor="middle">
    <text x="52" y="268">Mes 0</text><text x="240" y="268">4</text>
    <text x="428" y="268">8</text><text x="616" y="268">12</text>
    <text x="336" y="290">Meses sin inversión de marca</text>
  </g>
</svg>
<figcaption>Con una retención del 85% mensual, en medio año queda menos del 40% del stock. Esa tasa es propia de cada marca y se mide con datos propios — pero casi nadie la calcula, y por eso casi nadie sabe cuánto cuesta simplemente no retroceder.</figcaption>
</figure>

Con el decaimiento adentro, simulamos cuatro formas de gastar el mismo dinero durante tres años. Y ahí pasó lo mejor de todo el proceso: **el modelo me contradijo.**

En la versión lineal, gastar de a ráfagas trimestrales daba el mismo promedio que gastar continuo. Eso es falso en la práctica, y lo era también en mi intuición. Pero el modelo, como estaba escrito, no lo capturaba. La corrección era meter rendimientos decrecientes: concentrar el gasto quema plata en frecuencia excesiva.

<figure>
<p class="fig-titulo">Mismo presupuesto total, tres años, cuatro repartos</p>
<svg viewBox="0 0 640 250" role="img" aria-label="Comparación de cuatro estrategias de reparto de presupuesto">
  <g font-size="11" fill="currentColor">
    <text x="0" y="26">Continuo y coherente</text>
    <text x="0" y="82">Ráfagas trimestrales</text>
    <text x="0" y="138">Continuo pero disperso</text>
    <text x="0" y="194">Cuatro campañas grandes</text>
  </g>
  <rect class="barra--construye" x="0" y="36" width="500" height="20"/>
  <rect class="barra" x="0" y="92" width="290" height="20" opacity=".55"/>
  <rect class="barra" x="0" y="148" width="194" height="20" opacity=".38"/>
  <rect class="barra" x="0" y="204" width="149" height="20" opacity=".26"/>
  <g class="cifra">
    <text x="510" y="51">100%</text>
    <text x="300" y="107">58%</text>
    <text x="204" y="163">39%</text>
    <text x="159" y="219">30%</text>
  </g>
</svg>
<figcaption>Dos sorpresas. Concentrar el gasto es peor que dispersar el mensaje. Y «continuo pero disperso» rinde más que «coherente pero a los saltos»: la continuidad pesa más que la coherencia cuando el gasto está mal distribuido. No lo hubiera adivinado — ese es el punto de formalizar.</figcaption>
</figure>

## Buscar el hueco real

Con el modelo funcionando, la pregunta era si aportaba algo que no existiera ya. La respuesta honesta: **la mitad ya existe.** Exceso de share of voice, share of search, la grilla de assets distintivos, el adstock en modelos de marketing mix. Binet y Field midieron que cada diez puntos de exceso de share of voice se asocian a medio punto de crecimiento anual de participación. Nielsen lo replicó sobre 123 marcas.

Presentar eso como novedad es la forma más rápida de que un CMO con lecturas te desarme en la primera reunión.

Pero había un hueco. Ningún reporte de marca responde estas dos preguntas:

- **¿Cuánto de mi presupuesto construyó marca y cuánto solo compensó el olvido?**
- **¿Cuál es mi piso de inversión para no perder terreno?**

Todo reporte muestra gasto y resultado. Ninguno muestra la separación entre reponer y acumular. Y el costo de quedarse quieto no está presupuestado en ninguna línea, en ninguna categoría, en casi ninguna empresa.

De ahí salió la métrica: **Net Build Rate**. Qué porcentaje del presupuesto de marca construyó, después de descontar lo que se diluyó y lo que se fue en reposición.

<figure>
<div class="pliego-dato">
<p class="fig-titulo">De cada 100 pesos de presupuesto de marca</p>
<table>
<tr><td>Invertidos</td><td class="num apagado">100</td></tr>
<tr><td>Se diluyeron en piezas que no puntuaron</td><td class="num">−35</td></tr>
<tr><td>Repusieron la memoria evaporada</td><td class="num">−45</td></tr>
<tr class="total"><td><strong>Construyeron</strong></td><td class="num construye">= 20</td></tr>
</table>
<p class="fig-titulo" style="margin:1.2rem 0 0">Net Build Rate = <span class="construye">+20%</span></p>
</div>
<figcaption>El mismo cálculo puede dar negativo: si se diluyen 50 y la reposición exige 65, el resultado es −15%. Se gastó el presupuesto completo y la marca terminó el trimestre con menos posición que al empezar.</figcaption>
</figure>

## Los tres errores que aparecieron después

Acá viene la parte que quería registrar de verdad. La primera versión de la métrica tenía tres defectos serios. **Los tres los cometió el modelo. Los tres aparecieron por preguntas mías.**

Vale la pena detenerse en eso: no los detecté leyendo la fórmula ni auditando la lógica. Los destapé preguntando cosas obvias desde la operación. Preguntas que no requieren saber matemática, sino haber trabajado con presupuestos de medios reales.

### Error 1 — El cero mal explicado

<p class="detectado">Detectado preguntando:<br>«¿por qué llega solo a 0.30 y no un rango de 0 a 100?»</p>

La primera versión traía umbrales: más de 0.30 era «acumulación real», cerca de cero era «cinta de correr». Sonaba razonable. Era fantasía.

Una marca en equilibrio da cero **por definición matemática**: si tu posición es estable y tu inversión también, el piso de mantenimiento se come exactamente toda tu inversión efectiva. No queda nada para acumular. Eso no es fracaso, es mantenimiento saludable.

<figure>
<p class="fig-titulo">La escala real, con el cero en su lugar</p>
<svg viewBox="0 0 640 230" role="img" aria-label="Escala completa de Net Build Rate de menos cien a más cien por ciento">
  <rect class="barra" x="0" y="60" width="150" height="46"/>
  <rect class="barra" x="150" y="60" width="115" height="46" opacity=".72"/>
  <rect class="barra" x="265" y="60" width="90" height="46" opacity=".22"/>
  <rect class="barra--construye" x="355" y="60" width="150" height="46" opacity=".7"/>
  <rect class="barra--construye" x="505" y="60" width="135" height="46"/>

  <g font-size="10" text-anchor="middle" font-weight="600">
    <text x="75" y="88" fill="var(--papel)">Erosión rápida</text>
    <text x="207" y="88" fill="var(--papel)">Erosión lenta</text>
    <text x="310" y="88" fill="var(--tinta)">Mantiene</text>
    <text x="430" y="88" fill="var(--tinta)">Construye</text>
    <text x="572" y="88" fill="var(--tinta)">Marcas nuevas</text>
  </g>

  <line class="eje" x1="310" y1="32" x2="310" y2="60" stroke-width="1.5"/>
  <text class="anotacion" x="310" y="24" text-anchor="middle">0 = equilibrio contable</text>

  <g class="rotulo-eje" text-anchor="middle">
    <text x="8" y="122" text-anchor="start">−100%</text>
    <text x="265" y="122">−5%</text>
    <text x="355" y="122">+5%</text>
    <text x="632" y="122" text-anchor="end">+100%</text>
  </g>

  <line x1="400" y1="106" x2="400" y2="152" stroke="var(--ambar-hondo)" stroke-width="1.4" stroke-dasharray="4 3"/>
  <circle cx="400" cy="106" r="3.5" fill="var(--ambar-hondo)"/>
  <rect x="400" y="152" width="240" height="52" fill="var(--ambar)" opacity=".14"/>
  <text class="anotacion anotacion--ambar" x="412" y="170">Techo estructural</text>
  <text class="rotulo-eje" x="412" y="186" fill="var(--ambar-hondo)">Inalcanzable con la inversión actual</text>
</svg>
<figcaption>El máximo no es +100%: es uno menos el piso dividido la inversión. Si una marca invierte 100 y su piso es 92, su techo real es 8%. Mi umbral de 30% le pedía algo matemáticamente imposible.</figcaption>
</figure>

Ese error tenía consecuencias prácticas: el cliente iba a medir por primera vez, iba a dar cerca de cero, y con mi escala eso se leía como alarma cuando era normal.

**La corrección:** el signo es interpretable desde el día uno; la magnitud no. Los umbrales se calibran con la distribución histórica de cada marca, no se fijan de antemano.

Y el techo dejó de ser una restricción para convertirse en un resultado: si el techo de una marca es 8% y la ambición de crecimiento exige más, la palanca no es mejorar la creatividad. Es subir el presupuesto. Ese es un argumento que antes no se podía hacer con datos.

### Error 2 — La rúbrica castigaba a la radio

<p class="detectado">Detectado preguntando:<br>«¿cómo incluyo medios como radio, vallas u otras acciones de brand?»</p>

El coeficiente de coherencia se calculaba auditando cada pieza contra tres criterios. El primero pedía «al menos tres assets distintivos»: logo, color, tipografía, música, claim.

La respuesta fue admitir el problema de raíz: **una cuña de radio impecable puntúa mal por no poder usar logo ni color.** Eso hacía que el coeficiente midiera *mix de medios* en vez de coherencia. El número dejaba de significar lo que decía significar.

<figure>
<div class="pliego-dato">
<p class="fig-titulo">Assets disponibles según el canal</p>
<table>
<tr><th>Asset</th><th class="centro">Video</th><th class="centro">OOH</th><th class="centro">Radio</th></tr>
<tr><td>Logotipo</td><td class="centro">●</td><td class="centro">●</td><td class="centro apagado">—</td></tr>
<tr><td>Paleta y tipografía</td><td class="centro">●</td><td class="centro">●</td><td class="centro apagado">—</td></tr>
<tr><td>Estilo fotográfico</td><td class="centro">●</td><td class="centro">●</td><td class="centro apagado">—</td></tr>
<tr><td>Sonic logo o música</td><td class="centro">●</td><td class="centro apagado">—</td><td class="centro">●</td></tr>
<tr><td>Tono de voz</td><td class="centro">●</td><td class="centro apagado">—</td><td class="centro">●</td></tr>
<tr><td>Claim y vocabulario</td><td class="centro">●</td><td class="centro">●</td><td class="centro">●</td></tr>
<tr><td>Atleta embajador</td><td class="centro">●</td><td class="centro">●</td><td class="centro">●</td></tr>
<tr class="total"><td><strong>Aplicables</strong></td><td class="centro"><strong>7</strong></td><td class="centro"><strong>5</strong></td><td class="centro"><strong>4</strong></td></tr>
</table>
</div>
<figcaption>La corrección: cada canal se puntúa contra los assets que ese canal puede usar. Una valla con 4 de sus 5 aplicables puntúa 0.80. Una cuña de radio con 3 de sus 4 puntúa 0.75. Ahora son comparables.</figcaption>
</figure>

Un aprendizaje lateral: la forma de pedir la lista de assets determina lo que te van a entregar. Si pedís «los assets distintivos», te dan los visuales. Hay que pedir «los assets distintivos por tipo: visual, sonoro, verbal y experiencial».

### Error 3 — El que cometí yo

<p class="detectado">Propuse algo que rompía el método, y me lo rechazaron.</p>

Sugerí sumar una ponderación por alcance. Una valla en punto central llega a 10.000 personas y una periférica a 3.000; cumpliendo los mismos criterios, no deberían pesar igual.

El rechazo vino con dos argumentos que no había visto.

**Uno.** El alcance ya está en la inversión. El OOH se cotiza por tráfico — la valla central cuesta más precisamente porque llega a más gente. Y como el coeficiente se pondera por inversión, ya pesa más. Sumarlo otra vez lo cuenta dos veces.

**Dos, y más grave.** El alcance también está del lado del resultado. La posición de marca se mide por búsquedas; si la valla llegó a más gente, más gente busca. Meterlo también del lado del input hubiera inflado artificialmente la correlación del backtest. La validación habría dado bien no porque el método funcione, sino porque estaría correlacionando el alcance consigo mismo.

**La salida:** el alcance se captura siempre como campo, no entra al cálculo, y se reporta como métrica hermana. Una marca puede tener build rate alto con alcance bajo —hizo poco, pero muy bien— o al revés. Ese cruce dice más que cualquier número fusionado.

<svg class="filete-arcos" viewBox="0 0 120 22" aria-hidden="true"><path d="M4 18 A 14 14 0 0 1 32 18 M32 18 A 20 20 0 0 0 72 18 M72 18 A 12 12 0 0 1 96 18 M96 18 A 10 10 0 0 0 116 18"/></svg>

## Lo que me llevo del proceso

**El valor no estuvo en la idea inicial.** La analogía con Recamán era mala y no sobrevivió al primer cuestionamiento. Lo que sirvió fue el desvío que provocó.

**Los mejores momentos fueron las contradicciones.** Cuando el modelo lineal me dijo lo contrario de lo que yo creía. Cuando descubrí que los umbrales eran matemáticamente inalcanzables. Cuando mi propuesta de ponderar por alcance resultó romper la validación. Ninguno de esos momentos fue cómodo y los tres mejoraron el resultado.

<p class="remate">Definir cómo sabrías que estás equivocado es más valioso que defender que tenés razón.</p>

La parte del método de la que estoy más conforme no es la fórmula: es el control contra el predictor ingenuo. Comparamos la métrica contra la explicación más simple posible —mirar solo cuánto se gastó—. Si el gasto a secas predice igual de bien, toda la auditoría de coherencia no aportó nada y se descarta.

### Sobre el reparto de trabajo

Es la parte que más me interesa registrar, porque no se parece a cómo se suele contar el trabajo con IA.

**Lo que aportó el modelo:** formalizar el modelo matemático, correr las simulaciones, reconocer qué parte de esto ya estaba publicado y validado, construir la métrica, y rechazar mi propuesta de alcance con un argumento técnico que yo no tenía.

**Lo que aporté yo:** la pregunta inicial, la intuición equivocada que abrió el desvío, y —esto es lo importante— [[criteria|las preguntas operativas]] que destaparon los dos errores graves. Ninguna de esas preguntas requería saber matemática. Requerían haber peleado con presupuestos de medios, haber discutido un plan con un CMO, saber que en la región buena parte del sell-out pasa por retail y eso desfasa los datos.

Eso me dejó una lectura incómoda para los dos lados del debate habitual. La IA no reemplazó mi criterio: cometió errores que solo alguien con contexto operativo iba a ver. Pero tampoco fue una herramienta pasiva: me corrigió la analogía invertida en el primer intercambio y me rechazó una propuesta que hubiera invalidado la validación entera.

**El modo que funcionó fue [[arquitectura-loops|el de fricción, no el de asistencia]].** Un modelo complaciente me hubiera dejado llegar a la reunión con umbrales matemáticamente imposibles y una rúbrica que castigaba a la mitad de los canales. Y yo, sin cuestionar lo que me daba, hubiera llegado igual.

## Dónde está esto hoy

**No está validado.** Es una hipótesis con criterio de aceptación definido. El próximo paso es un backtest sobre doce trimestres de historia de una marca real: calcular la métrica a ciegas, contrastarla contra lo que efectivamente pasó, y descartarla si no predice.

Puede que no funcione. Eso también sería un resultado.

Lo que sí me llevo, funcione o no, es el registro de cómo una pregunta ociosa de las tres de la tarde se convirtió en cuatro horas de trabajo real. No porque la pregunta fuera buena, sino porque la seguí hasta donde dejó de ser interesante y algo mejor apareció en el camino.

<p class="fin">Fin del registro</p>
