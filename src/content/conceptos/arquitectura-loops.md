---
titulo: Arquitectura de loops
estado: fruto
dominio: ingeniería
plantada: 2026-01-20
podada: 2026-07-15
conecta: [rubrica-skills, criteria]
cosecha: Aplicada a WA Copilot y al monitor de medios de Buentipo
resumen: Desarrollo spec-driven con subagentes maker/checker/challenger. La ventaja no es la IA, es el loop de validación que la rodea.
---

Todo el mundo tiene acceso al mismo modelo. La ventaja competitiva no está en la herramienta de IA, está en el **loop de validación** que armás alrededor: cómo atacás el spec antes de construir, cómo validás lo construido, cómo retomás sin perder contexto.

## Los tres subagentes

- **Maker** — construye contra el spec.
- **Checker** — valida invariantes, no impresiones.
- **Challenger** — ataca el spec para encontrar los huecos *antes* de codear.

## Spec primero, código después

El error caro es empezar a construir sobre un spec con agujeros. El challenger existe para romper el spec en seco. Un invariante que no se puede violar vale más que diez tests que pasan por casualidad.

## Cosecha

Está deployada, no es teoría: gobierna WA Copilot (el copiloto de ventas por WhatsApp) y el sistema de monitoreo de medios longitudinal de Buentipo. Se apoya en [[criteria]] para saber qué debe decidir el sistema, y en [[rubrica-skills]] para la calidad de cada pieza.
