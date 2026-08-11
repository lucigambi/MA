---
name: responsive-typography-standards
description: "Reglas técnicas fijas y ya comprobadas para CUALQUIER sitio web nuevo o existente: tipografía fluida (clamp), jerarquía, contraste, breakpoints, accesibilidad, espaciado, imágenes, estados de componentes, meta tags y demás bases de un sitio profesional. Usar siempre que se escriba CSS/HTML de un sitio, landing, o componente — no hace falta que el usuario lo pida explícitamente. La identidad visual (colores de marca, tipografías elegidas, tono) sigue siendo decisión del usuario — esta skill solo fija los números y reglas técnicas subyacentes que no cambian de proyecto en proyecto."
---

# Responsive Typography & Layout Standards

Reglas técnicas fijas. No se negocian por proyecto — la identidad visual (colores, tipografías, tono) es aparte y la define el usuario cada vez. Esto es la base matemática/técnica que sí es igual siempre.

## 1. Nunca tamaños fijos — siempre clamp()

Todo `font-size`, y los `padding`/`margin`/`gap` grandes de sección, van en `clamp()`. Cero media queries solo para cambiar un tamaño de fuente.

**Fórmula (metodología Utopia.fyi, estándar de la industria):**

```
slope = (maxSize - minSize) / (maxWidth - minWidth)
yIntercept = -minWidth * slope + minSize
preferred_vw = yIntercept + (slope * 100)vw

clamp(minSize, preferred_vw, maxSize)
```

Viewports de referencia: **360px** (mobile mínimo) a **1240px** (desktop). No hace falta calcular a mano: usar https://utopia.fyi/type/calculator con esos valores, o el `clamp-calculator` de Utopia para casos sueltos.

## 2. Escala tipográfica (ratio modular)

No inventar tamaños salto a salto. Elegir UN ratio y derivar toda la escala:

- **Contenido denso / apps / dashboards:** ratio 1.2 (Minor Third)
- **Sitios de marketing / landing / editorial:** ratio 1.25–1.333 (Major Third / Perfect Fourth)
- Nunca mezclar dos ratios en el mismo sitio.

Escala típica de 7 pasos (usar como tokens CSS, ajustando min/max font-size del paso 0 según el ratio elegido):

```css
:root {
  --step--2: clamp(0.78rem, 0.77rem + 0.03vw, 0.80rem); /* caption/legal */
  --step--1: clamp(0.94rem, 0.91rem + 0.11vw, 1.00rem); /* texto secundario */
  --step-0:  clamp(1.13rem, 1.07rem + 0.23vw, 1.25rem); /* body */
  --step-1:  clamp(1.35rem, 1.26rem + 0.39vw, 1.56rem); /* h4/subtítulo */
  --step-2:  clamp(1.62rem, 1.48rem + 0.61vw, 1.95rem); /* h3 */
  --step-3:  clamp(1.94rem, 1.74rem + 0.90vw, 2.44rem); /* h2 */
  --step-4:  clamp(2.33rem, 2.04rem + 1.31vw, 3.05rem); /* h1 */
}
```
(Valores base para ratio ~1.25, viewport 360–1240. Recalcular con Utopia si el proyecto pide otro ratio.)

## 3. Line-height por tamaño (no un valor único global)

Regla: **cuanto más chico el texto, más alto el line-height; cuanto más grande, más bajo.**

- Body / texto largo (step -1 a 0): `line-height: 1.5` — mínimo WCAG 1.4.8 para bloques de texto.
- Subtítulos (step 1–2): `line-height: 1.3`
- Títulos grandes (step 3–4): `line-height: 1.1`
- Nunca bajar de 1.5 en párrafos largos; nunca dejar 1.1–1.2 en body copy (rompe legibilidad).

`max-width` de bloques de texto: **45–75 caracteres por línea** (`max-width: 65ch` es el default razonable).

## 4. Contraste — WCAG 2.1/2.2, no "se ve bien"

Chequear siempre, no a ojo:

- Texto normal (<24px o <18.66px bold): mínimo **4.5:1** (AA) — ideal 7:1 (AAA)
- Texto grande (≥24px, o ≥18.66px bold): mínimo **3:1** (AA)
- Componentes UI / iconos funcionales / bordes de inputs: mínimo **3:1**
- Nunca depender solo del color para transmitir estado (error/éxito) — sumar ícono o texto.

Verificar con la fórmula de luminancia relativa WCAG, o herramienta tipo WebAIM Contrast Checker antes de cerrar una paleta.

## 5. Breakpoints estándar (para lo que NO se resuelve con clamp — layout/grid)

```css
/* mobile first */
--bp-sm: 480px;   /* mobile grande */
--bp-md: 768px;   /* tablet */
--bp-lg: 1024px;  /* laptop */
--bp-xl: 1280px;  /* desktop */
--bp-2xl: 1536px; /* desktop grande */
```

Usar estos breakpoints solo para cambios estructurales (columnas, orden de bloques, mostrar/ocultar), nunca para tamaño de fuente — eso ya lo resuelve el clamp.

## 6. Espaciado fluido

Mismo criterio que la tipografía: `gap`, `padding` de sección y `margin` entre bloques grandes también en `clamp()`, escalando con el mismo par de viewports (360–1240).

```css
:root {
  --space-s:  clamp(1.13rem, 1.07rem + 0.23vw, 1.25rem);
  --space-m:  clamp(1.69rem, 1.61rem + 0.34vw, 1.88rem);
  --space-l:  clamp(2.25rem, 2.15rem + 0.45vw, 2.50rem);
  --space-xl: clamp(3.38rem, 3.22rem + 0.68vw, 3.75rem);
}
```

## 7. Renderizado — evitar letra "serruchada"

Sin esto, la tipografía se ve dentada/con aliasing sobre todo en fondos oscuros o tamaños chicos. Aplicar siempre en el body:

```css
body {
  -webkit-font-smoothing: antialiased;   /* Chrome/Safari/Webkit */
  -moz-osx-font-smoothing: grayscale;    /* Firefox en macOS */
  text-rendering: optimizeLegibility;    /* mejor kerning y ligaduras */
  font-synthesis: none;                  /* evita que el navegador "invente" bold/italic si falta el weight real */
}
```

Además:
- Usar siempre los **weights reales** de la fuente (400, 600, 700 como archivos/variable font), nunca `font-weight: bold` sobre una fuente que no tiene ese corte — ahí el navegador la sintetiza y queda borrosa/serruchada.
- Con variable fonts, cargar el rango completo (`font-variation-settings` o `@font-face` con `font-weight: 100 900`) en vez de múltiples archivos estáticos.
- Evitar `transform: scale()` para agrandar texto — reescala el bitmap ya renderizado y lo pixela. Usar siempre `font-size` (clamp, como en punto 1).
- En textos chicos sobre fondos con mucho contraste (blanco puro sobre negro puro), bajar levemente el peso de blanco a `#f5f5f5`/`rgba(255,255,255,0.92)` — el halation (efecto de "sangrado") en pantallas hace que blanco puro sobre negro puro se vea más agresivo y menos nítido.

## 8. Accesibilidad más allá del contraste

- `:focus-visible` siempre visible en todo elemento interactivo (nunca `outline: none` sin reemplazo). Ejemplo base:
```css
:focus-visible {
  outline: 2px solid var(--color-accent, #0066ff);
  outline-offset: 2px;
}
```
- Navegación completa por teclado: todo lo clickeable debe ser alcanzable con Tab y operable con Enter/Espacio.
- HTML semántico real: `<nav>`, `<main>`, `<header>`, `<footer>`, `<button>` para acciones — nunca `<div onclick>`. Un `<div>` no es focuseable ni accesible por lector de pantalla sin trabajo extra.
- Toda `<img>` con `alt` descriptivo (vacío `alt=""` solo si es puramente decorativa).

## 9. Sistema de espaciado — grid de 8pt

Todo padding/margin/gap en múltiplos de 4 u 8px (o su equivalente en rem: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem...). Nunca valores sueltos tipo `13px` o `22px` — ahí es donde un sitio se empieza a sentir "flojo" sin que se note por qué. Los tokens `--space-*` del punto 6 ya siguen esta lógica; extenderlos para todo el sitio, no solo para bloques grandes.

## 10. Imágenes optimizadas por defecto

- `loading="lazy"` en toda imagen fuera del viewport inicial (nunca en la imagen hero/LCP).
- `width` y `height` (o `aspect-ratio` en CSS) explícitos siempre — evita el salto de layout (CLS) mientras carga.
- Formatos modernos: WebP o AVIF como primario, con fallback via `<picture>` si hace falta compatibilidad vieja.
- `decoding="async"` como acompañante de `loading="lazy"`.

## 11. Respetar `prefers-reduced-motion`

Toda animación/transición no esencial debe poder desactivarse:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 12. Estados que siempre hay que contemplar

No alcanza con el estado "normal". Para cada componente interactivo, definir explícitamente: **hover, focus, active, disabled, loading, error, empty**. Un sitio que solo tiene el estado base se ve pobre apenas el usuario interactúa. Ejemplo mínimo por botón: color/opacidad distinta en hover, outline en focus, cursor y opacidad reducida en disabled, spinner o texto en loading.

## 13. Meta tags base, favicon y Open Graph

Todo sitio nuevo lleva como mínimo:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="...">
<link rel="icon" href="/favicon.ico">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="website">
```
Sin esto, el sitio se comparte feo en WhatsApp/redes (sin imagen ni descripción) — se nota mucho y es gratis de evitar.

## 14. Área táctil mínima

Todo botón, link o input clickeable: mínimo **44×44px** de área táctil real (aunque el ícono visual sea más chico, el área clickeable/padding tiene que llegar a eso). Estándar de accesibilidad táctil (WCAG 2.5.5 / Apple HIG). Sin esto, en mobile cuesta tocar bien y se siente amateur.

## 15. `box-sizing: border-box` global

Siempre, sin excepción, al principio de la hoja:
```css
*, *::before, *::after { box-sizing: border-box; }
```
Evita que paddings rompan anchos definidos — el clásico bug de "por qué esto desborda si el width dice 100%".

## 16. Print styles básicos (sitios institucionales/gobierno)

Para sitios tipo Entre Ríos Aprende+ (uso institucional, puede que alguien imprima una página):
```css
@media print {
  nav, footer, .no-print { display: none; }
  body { background: white; color: black; }
  a[href]::after { content: " (" attr(href) ")"; }
}
```

## 17. Optimización de imágenes y video (peso, no solo formato)

No alcanza con elegir WebP/AVIF (punto 10) — hay que optimizar el peso real del archivo antes de subirlo:

**Imágenes:**
- Comprimir siempre antes de subir (ej. `squoosh`, `sharp`, o el propio exportador de Photoshop en "guardar para web"). Objetivo: la imagen más liviana que no pierda calidad visible.
- Generar múltiples resoluciones y servir con `srcset`/`sizes` — no mandar la misma imagen de 4000px a mobile y desktop.
- Nunca subir una imagen más grande que su contenedor máximo real en el sitio.
- Ícono/logo vectorial: SVG optimizado (correr por `SVGO`), nunca PNG pesado para algo que es geometría simple.

**Video:**
- Comprimir con codec eficiente: H.264 (compatibilidad amplia) o AV1/VP9 (mejor compresión, para navegadores que lo soporten) vía `ffmpeg`.
- `poster` siempre definido — que no cargue un frame negro mientras el video pesado baja.
- `preload="metadata"` en vez de `preload="auto"` para videos que no son el hero (evita descargar el video entero si el usuario no lo ve).
- Videos de fondo/loop: sin audio, `muted`, resolución acotada (no subir 4K si se ve en un contenedor de 800px), y considerar recortar a la duración mínima necesaria en loop.
- Si es posible, servir por un CDN/servicio de streaming adaptativo en vez de archivo estático crudo para videos largos.

## 18. Descarga optimizada (no solo el peso del archivo)

Con la imagen ya comprimida (punto 17), falta optimizar cómo y cuándo se descarga:

- **Imagen hero/LCP:** `fetchpriority="high"` + `<link rel="preload" as="image">` en el `<head>` — que arranque a bajar antes que cualquier otra cosa, es la que define el tiempo de carga percibido.
- **Todo lo demás:** `loading="lazy"` (ya definido en punto 10) + `fetchpriority="low"` si compite con contenido más importante.
- **`preconnect`/`dns-prefetch`** al dominio del CDN/bucket de imágenes (ej. CloudFront, S3) en el `<head>`, para adelantar la conexión antes de necesitar el primer asset.
- **Cache-Control headers** agresivos en el CDN para assets estáticos (imágenes/video no cambian por request) — `Cache-Control: public, max-age=31536000, immutable` con nombre de archivo versionado/hasheado, así el usuario que vuelve no vuelve a descargar nada.
- **CDN siempre**, nunca servir imágenes/video pesado directo desde el mismo host del sitio si hay alternativa (CloudFront, Cloudflare Images, etc.) — reduce latencia y libera el server principal.
- Evitar que una imagen bloquee el render: nunca imágenes como `background-image` inline gigante sin optimizar: preferir `<img>` con lazy/fetchpriority controlable, que el navegador puede priorizar mejor que un CSS de fondo.

**Lo mismo para video:**

- **Video hero/above the fold:** nunca `autoplay` de un archivo pesado sin más — usar `preload="auto"` solo en ese caso puntual (es la excepción al `preload="metadata"` del punto 17), y `poster` optimizado (imagen liviana, no un frame pesado) para que se vea algo mientras carga.
- **CDN también para video**, nunca servido directo del host — mismo criterio que imágenes (CloudFront, Cloudflare Stream, Mux, etc.).
- **Cache-Control agresivo** igual que imágenes: el video no cambia entre requests, versionar el nombre de archivo y cachear fuerte (`max-age=31536000, immutable`).
- **`preconnect` al dominio del CDN de video** también, mismo criterio que con imágenes.
- Para video largo (no loop de fondo): considerar streaming adaptativo (HLS/DASH) en vez de un único MP4 pesado, así el navegador ajusta calidad según el ancho de banda real del usuario en vez de bajar todo el archivo de una.
- Nunca más de un video pesado autoplay por vista — si hay varios, que el resto arranque solo al entrar en viewport (Intersection Observer) y con `preload="none"`.

## 20. Protocolo de testeo antes de mostrar a alguien

Chequear en devtools maximizado en un monitor grande NO garantiza que se vea bien en notebook — el escalado de Windows (125%/150%, típico en notebooks) reduce el viewport CSS real por debajo de lo que devtools simula. Este protocolo es obligatorio antes de toda entrega o presentación:

**Anchos obligatorios a testear (además de mobile 360-480):**
- `1366×768` — resolución de notebook más común en entornos corporativos/oficina
- `1536×864` — equivale a 1920×1080 con escalado Windows al 125% (muy común en notebooks nuevas)
- `1280×720` — equivale a 1920×1080 con escalado al 150%, o notebooks chicas
- `1920×1080` — tu monitor a 100%, referencia de "mejor caso", nunca el único chequeo

**Cómo testear correctamente:**
- Nunca testear con la ventana del navegador maximizada en un monitor grande — redimensionar la ventana a mano al ancho real de notebook, o usar una herramienta de multi-viewport (Responsively App, gratis) que muestre varios anchos reales en simultáneo.
- Devtools responsive mode sirve para mobile, pero para rangos de notebook (1280–1536px) es más confiable achicar la ventana real del navegador que confiar en el simulador.
- Si hace falta certeza total, BrowserStack para ver en un dispositivo/notebook real, no simulado.

**Antes de una presentación específica (si se puede):**
- Pedir una sola vez `screen.width` desde la consola (F12) de la persona que va a mostrarlo, y agregar ese ancho a la lista fija de chequeo.

**Regla de oro:** un sitio que se ve bien en 1920px y en 375px pero no se chequeó en 1366/1536px, no está probado — ese rango intermedio es exactamente donde vive la mayoría de las notebooks reales.

## 21. Consistencia de estilos entre secciones — a rajatabla

Una vez definido un elemento reutilizable (h2 de sección, eyebrow, padding de sección, gap entre bloques, botón primario, etc.), ese estilo se aplica IDÉNTICO en todas las secciones del sitio y en todas las resoluciones — no se reinterpreta ni se ajusta "a ojo" sección por sección.

**Lo que SÍ varía libremente entre secciones (esto es diseño, no inconsistencia):**
- Layout: 2 columnas, grid de 5 cards, imagen de fondo + texto, carrusel — lo que pida el contenido de esa sección puntual.
- Cantidad y tipo de elementos: una sección puede no tener eyebrow, otra puede tener 3 botones, otra ninguno.
- Composición visual general: eso es criterio de diseño y cambia sección a sección a propósito.

**Lo que NUNCA varía, sea cual sea el layout (esto es sistema, no diseño):**
- Jerarquía tipográfica: un `h2` es SIEMPRE el mismo tamaño/peso/color/line-height, esté en una sección de 2 columnas, de 5 cards o de imagen+texto. Mismo criterio para `h3`, `eyebrow`, body copy.
- Padding vertical de sección (el espacio arriba/abajo del bloque completo) y el espaciado eyebrow→h2→texto: mismo token siempre, sin importar el layout interno.
- Radios de borde, sombras, estilos de botón: mismo componente reutilizado en cualquier sección donde aparezcan.

Regla corta: el **layout** (cómo se organizan los elementos dentro de la sección) es libre y depende del contenido; la **jerarquía y el espaciado del sistema** (tipografía, tokens de spacing, componentes) es fija y no depende de qué layout tenga esa sección puntual.

**Regla práctica:** estos elementos van como clases/componentes reutilizables (o tokens), nunca reescritos con estilos inline o clases nuevas por sección:
- `h2` de sección: mismo tamaño (clamp), mismo peso, mismo color, mismo margin-bottom en TODAS las secciones.
- `eyebrow` (texto chico arriba del título): mismo tamaño, tracking, color y espaciado respecto al h2, siempre.
- Padding vertical de sección (`section-padding`): un solo token (`--space-xl` o el que corresponda), no un valor distinto por sección "porque esta se ve más apretada".
- Botones, badges, cards: un solo componente reutilizado, nunca reescrito con clases ad-hoc por sección.

**Por qué pasa igual:** al construir sección por sección es tentador ajustar "un toque" cada una para que "se vea mejor" en el momento — eso es lo que después, sumado en 6-8 secciones, hace que el sitio se sienta inconsistente aunque cada sección individual esté bien. La regla es: si hace falta un ajuste, se corrige el token/componente global, nunca se parchea una sección sola.

**Chequeo:** antes de dar por cerrado, comparar los h2 de todas las secciones uno al lado del otro (zoom out del navegador o screenshot de cada uno) — si no son pixel-idénticos en tamaño/peso/espaciado, hay una inconsistencia para corregir en el token, no en la sección.

## 22. Checklist antes de dar por cerrado un sitio

- [ ] Cero `font-size` en px/rem fijos — todo clamp()
- [ ] Un solo ratio de escala tipográfica en todo el sitio
- [ ] Line-height 1.5+ en body, decreciente en títulos
- [ ] Todo texto pasa contraste 4.5:1 (o 3:1 si es grande)
- [ ] Breakpoints solo para layout, no para tipografía
- [ ] `max-width: 65ch` en bloques de texto largo
- [ ] Probado visualmente en 360px y en 1440px+, no solo en un tamaño
- [ ] `font-smoothing` + `text-rendering` aplicados, pesos reales (no bold sintético)
- [ ] Focus visible + navegación por teclado + HTML semántico
- [ ] Espaciado en grid de 8pt, sin valores sueltos
- [ ] Imágenes con lazy loading, width/height, formato moderno
- [ ] `prefers-reduced-motion` respetado
- [ ] Estados hover/focus/active/disabled/loading/error/empty definidos
- [ ] Meta tags + favicon + Open Graph completos
- [ ] Área táctil mínima 44×44px en interactivos
- [ ] `box-sizing: border-box` global
- [ ] Imágenes comprimidas y en resolución acorde a su contenedor (srcset)
- [ ] Videos comprimidos, con poster, preload correcto y sin audio si son loop de fondo
- [ ] Hero/LCP con preload + fetchpriority alto, CDN con cache headers agresivos
- [ ] Video en CDN, cache agresivo, un solo autoplay pesado por vista, resto con Intersection Observer
- [ ] Probado en 1366×768 y 1536×864 (notebook real), no solo mobile y monitor grande
- [ ] h2/eyebrow/padding de sección idénticos en todas las secciones (comparados uno al lado del otro)
