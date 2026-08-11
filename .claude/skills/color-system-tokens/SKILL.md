---
name: color-system-tokens
description: "Arquitectura de tokens de color en 3 capas (primitivos → semánticos → componentes) para que cualquier sitio nuevo se arme cambiando solo 2-3 colores base, y toda la paleta de grises, fondos de sección, bordes y textos se derive matemáticamente de ahí. Usar siempre que se defina la paleta de colores de un sitio o componente nuevo, o al iniciar un proyecto — no hace falta que el usuario lo pida explícitamente. La elección de QUÉ colores de marca usar sigue siendo del usuario; esta skill fija cómo se estructuran y derivan una vez elegidos."
---

# Color System — Tokens en 3 capas

Nunca usar un color "suelto" (hex directo) en un componente. Todo pasa por semánticos, que a su vez leen de primitivos. Cambiás los primitivos (2-3 valores) y se reacomoda todo el sitio.

## Capa 1 — Primitivos (lo único que cambiás por proyecto)

Definir solo esto por sitio nuevo:

```css
:root {
  --brand-hue: 250;        /* el matiz de marca, 0-360 */
  --brand-saturation: 70%; /* saturación base */
  --neutral-hue: 250;       /* mismo hue que brand, desaturado — da grises con "temperatura" coherente con la marca, no grises fríos genéricos */
}
```

Si el proyecto pide 2 colores de marca (ej. accent + secundario), agregar un segundo `--brand-2-hue`. Nunca más de 2 hues de marca — el resto lo resuelve la escala de grises.

## Capa 2 — Escalas generadas (se calculan solas, no se tocan)

**Escala de grises (10 pasos), generada en HSL desde `--neutral-hue` con saturación bajísima:**

```css
:root {
  --gray-50:  hsl(var(--neutral-hue) 20% 98%);
  --gray-100: hsl(var(--neutral-hue) 16% 95%);
  --gray-200: hsl(var(--neutral-hue) 14% 90%);
  --gray-300: hsl(var(--neutral-hue) 12% 82%);
  --gray-400: hsl(var(--neutral-hue) 10% 65%);
  --gray-500: hsl(var(--neutral-hue) 8%  48%);
  --gray-600: hsl(var(--neutral-hue) 10% 36%);
  --gray-700: hsl(var(--neutral-hue) 12% 26%);
  --gray-800: hsl(var(--neutral-hue) 14% 16%);
  --gray-900: hsl(var(--neutral-hue) 16% 9%);
}
```

**Escala de marca (10 pasos), misma lógica pero con la saturación real:**

```css
:root {
  --brand-50:  hsl(var(--brand-hue) var(--brand-saturation) 96%);
  --brand-100: hsl(var(--brand-hue) var(--brand-saturation) 90%);
  --brand-200: hsl(var(--brand-hue) var(--brand-saturation) 80%);
  --brand-300: hsl(var(--brand-hue) var(--brand-saturation) 68%);
  --brand-400: hsl(var(--brand-hue) var(--brand-saturation) 58%);
  --brand-500: hsl(var(--brand-hue) var(--brand-saturation) 50%); /* el color "principal" que la marca reconoce */
  --brand-600: hsl(var(--brand-hue) var(--brand-saturation) 42%);
  --brand-700: hsl(var(--brand-hue) var(--brand-saturation) 34%);
  --brand-800: hsl(var(--brand-hue) var(--brand-saturation) 24%);
  --brand-900: hsl(var(--brand-hue) var(--brand-saturation) 14%);
}
```

Por qué HSL y no hex a mano: mover un solo número (`--brand-hue`) rota toda la paleta manteniendo relaciones de luminosidad correctas. Elegir a mano 10 hex por escala nunca da una progresión pareja.

## Capa 3 — Semánticos (lo que se usa en el CSS de componentes, siempre)

Nunca escribir `var(--gray-100)` directo en un componente — siempre a través de estos:

```css
:root {
  /* Fondos */
  --bg-base:        var(--gray-50);   /* fondo general de página */
  --bg-section:      var(--gray-100);  /* fondo alterno entre secciones, para separar sin borde */
  --bg-elevated:      #ffffff;          /* cards, modales — siempre por encima del fondo */
  --bg-inverse:       var(--gray-900); /* secciones oscuras / footer */

  /* Texto */
  --text-primary:    var(--gray-900);
  --text-secondary:  var(--gray-600);
  --text-muted:      var(--gray-400);
  --text-inverse:    var(--gray-50);   /* texto sobre --bg-inverse */

  /* Bordes */
  --border-subtle:   var(--gray-200);
  --border-default:  var(--gray-300);

  /* Marca / interacción */
  --accent:           var(--brand-500);
  --accent-hover:      var(--brand-600);
  --accent-subtle:    var(--brand-50);  /* fondos suaves, badges, hover de fila */
  --accent-text-on:    #ffffff;          /* texto sobre --accent, chequear contraste (ver skill responsive-typography-standards, punto 4) */

  /* Estado — fijos, no derivan del hue de marca */
  --success: hsl(142 70% 40%);
  --warning: hsl(38 92% 50%);
  --error:   hsl(0 72% 50%);
}
```

## Dark mode (si el proyecto lo pide)

Con esta arquitectura, dark mode es redefinir SOLO la capa semántica dentro de `[data-theme="dark"]`, sin tocar primitivos ni componentes:

```css
[data-theme="dark"] {
  --bg-base: var(--gray-900);
  --bg-section: var(--gray-800);
  --bg-elevated: var(--gray-800);
  --text-primary: var(--gray-50);
  --text-secondary: var(--gray-300);
  --border-subtle: var(--gray-700);
}
```

## Reglas de uso

- Componentes SIEMPRE leen de la capa 3 (semánticos). Nunca `--gray-500` o `--brand-500` directo en un componente — si hace falta un valor nuevo, se agrega un semántico nuevo, no se rompe la capa.
- Al arrancar un sitio nuevo: solo tocar `--brand-hue`, `--brand-saturation`, `--neutral-hue` de la capa 1. Todo lo demás se recalcula solo.
- Chequear contraste de `--text-*` sobre `--bg-*` con las reglas WCAG de la skill `responsive-typography-standards` antes de cerrar la paleta — la fórmula HSL da progresión pareja pero no garantiza el ratio exacto, siempre verificar los pares que se usan en texto real.
- Si el brief pide colores de marca ya fijos (no HSL libre), convertir ese hex a HSL, tomar su hue/saturación como base de la capa 1, y generar el resto de la escala igual.

## Checklist

- [ ] Solo 2-3 variables tocadas por proyecto (capa 1)
- [ ] Ningún hex suelto en componentes — todo vía semánticos
- [ ] Escala de grises con el mismo hue que la marca (no gris frío genérico)
- [ ] Contraste texto/fondo verificado en los pares reales que se usan
- [ ] Dark mode (si aplica) resuelto solo redefiniendo capa 2, cero cambios en componentes
