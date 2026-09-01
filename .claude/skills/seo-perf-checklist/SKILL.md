---
name: seo-perf-checklist
description: Checklist de SEO tecnico y performance que Next.js resuelve solo pero que en un sitio HTML/CSS/JS plano hay que agregar a mano (JSON-LD, canonical, lang, og:image, fuentes self-hosted, facade de YouTube, GA4, robots/sitemap/llms.txt). Usar al terminar de armar una landing nueva, antes de darla por lista para entregar/publicar.
---

# SEO tecnico y performance sin framework

Sale de comparar una entrega en HTML/CSS/JS puro contra el mismo sitio
portado a Next.js (proyecto Entre Rios Aprende+, agosto 2026): el diseno,
copy y secciones eran identicos: lo unico que el framework sumaba de mas
era esta lista. Ninguno de estos items depende de Next — son estandares
de HTML/HTTP que se pueden dejar clavados en cualquier sitio estatico.
Repasar esta lista antes de dar una landing por terminada.

## 1. `<html lang="...">`

Poner el idioma/variante real, no un default generico:
```html
<html lang="es-AR">
```

## 2. Canonical

Sin esto, si el sitio queda espejado en un dominio de staging (Vercel,
Netlify, IP de prueba), Google puede indexar la copia equivocada:
```html
<link rel="canonical" href="https://dominio-real.com/" />
```

## 3. Open Graph + Twitter Card (og:image)

Sin esto, al compartir el link en WhatsApp/Slack/redes sale sin imagen ni
descripcion:
```html
<meta property="og:title" content="Titulo del sitio" />
<meta property="og:description" content="Bajada corta, una linea." />
<meta property="og:image" content="https://dominio-real.com/img/og.jpg" />
<meta property="og:url" content="https://dominio-real.com/" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```
`og:image` en formato horizontal (1200x630), menor a 300KB, con texto legible
en miniatura (asi se ve en la previa de WhatsApp).

## 4. JSON-LD

Le da a Google datos estructurados sin depender de que scrapee bien el
HTML visual. Minimo, tipo Organization:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nombre del sitio/producto",
  "url": "https://dominio-real.com/",
  "logo": "https://dominio-real.com/img/logo.png"
}
</script>
```
Va pegado en el `<head>`, texto plano — no requiere build step.

## 5. Fuentes self-hosted (no Google Fonts por `<link>` a CDN)

Un `<link href="https://fonts.googleapis.com/...">` agrega un roundtrip
DNS+TLS extra antes de que el texto pueda pintarse (lo que Next resuelve
solo con `next/font`, que descarga y sirve las fuentes desde el propio
dominio). A mano:
1. Bajar los `.woff2` de la fuente (Google Fonts permite descargarlas).
2. Servirlas desde `assets/fonts/` del propio sitio.
3. Declararlas y precargar la que se usa arriba del fold:
```html
<link rel="preload" href="/assets/fonts/Nunito-Regular.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: 'Nunito';
  src: url('/assets/fonts/Nunito-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```
`font-display: swap` evita el "flash de texto invisible" mientras carga.

## 6. Facade de YouTube (sin cookies hasta el click)

Un `<iframe>` de YouTube embebido desde el arranque carga scripts de
Google y planta cookies aunque nadie reproduzca el video, y suma peso
inicial. El patron "facade": se muestra una miniatura + boton de play, y
recien se inyecta el iframe real al hacer click.
```html
<div class="yt-facade" data-yt-id="VIDEO_ID">
  <img src="https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg" alt="" loading="lazy">
  <button class="yt-play" aria-label="Reproducir video"></button>
</div>
```
```js
document.querySelectorAll('.yt-facade').forEach((el) => {
  el.addEventListener('click', () => {
    const id = el.dataset.ytId;
    el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1"
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  }, { once: true });
});
```
Usar `youtube-nocookie.com`, no `youtube.com`, para el iframe real.

## 7. GA4 + eventos custom

El script de gtag no es especifico de ningun framework:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```
Eventos de negocio (ej. al confirmar el envio de un form) van sueltos donde
pasa la accion real, no en el `submit` crudo — igual que se hizo en
Contacto.tsx del proyecto ER+: medir el lead *entregado*, no el click:
```js
gtag('event', 'contacto_enviado', { perfil, motivo, ruta });
```

## 8. robots.txt / sitemap.xml / llms.txt

Tres archivos estaticos en la raiz del sitio, sin build step:
- `robots.txt`: que rutas puede indexar el crawler.
- `sitemap.xml`: lista de URLs con `<lastmod>`, ayuda a que Google las
  encuentre mas rapido.
- `llms.txt`: propuesta abierta para orientar crawlers de IA sobre de que
  trata el sitio (opcional, cada vez mas comun).

## Fuera de este checklist

Compresion de imagenes/video: ver skill `media-compression` de este mismo
proyecto — es otro item que Next hace solo (`next/image`) y que ahi ya
esta resuelto con `sharp`/`ffmpeg-static`.
