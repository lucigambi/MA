---
name: media-compression
description: Como comprimir videos e imagenes pesados de este sitio sin depender de nada instalado a nivel sistema. Usar siempre que se suba un video/imagen nueva que pese mucho (arriba de ~15-20MB para video, ~500KB para imagen), o cuando GitHub/Vercel avisen que un archivo es demasiado grande.
---

# Compresion de media (por proyecto, sin instalar nada global)

No usar `ffmpeg`/`magick`/`convert` del sistema — en Windows `convert` choca
con el comando nativo de conversion de discos, y no hay garantia de que
ffmpeg este instalado en la maquina. En vez de eso, instalar las
herramientas COMO DEPENDENCIA DE ESTE PROYECTO (aisladas, no tocan nada del
sistema, listas apenas se corre `npm install`):

```bash
npm install --save-dev ffmpeg-static sharp
```

- `ffmpeg-static` descarga un `ffmpeg.exe` propio dentro de `node_modules/ffmpeg-static/` — no hace falta instalar ffmpeg en Windows.
- `sharp` comprime/redimensiona imagenes sin depender de ningun binario externo (trae su propio motor).
- Agregar `node_modules/` al `.gitignore` (no se versiona, se reinstala con `npm install` si hace falta).

## Videos

Ubicar el binario y correr ffmpeg con la ruta completa (no esta en el PATH):

```bash
FFMPEG="node_modules/ffmpeg-static/ffmpeg.exe"
```

**Videos verticales/testimonios (1080x1920 o similar, con audio real, boton play):**
```bash
"$FFMPEG" -y -i entrada.mp4 \
  -vf "scale=720:1280:flags=lanczos" \
  -c:v libx264 -preset medium -crf 26 -profile:v high -level 4.1 \
  -c:a aac -b:a 128k -movflags +faststart \
  salida.mp4
```
720px de ancho (no 1080) alcanza y sobra para un video que se ve en un reproductor de pantalla completa en mobile o una card — bajar de 1080 a 720 es la mayor parte del ahorro. CRF 26 es indistinguible a simple vista en video de "alguien hablando" (poco movimiento).

**Videos de fondo del hero (autoplay, muted, loop — SIN audio real que se escuche):**
```bash
"$FFMPEG" -y -i entrada.mp4 \
  -vf "scale=1920:-2:flags=lanczos" \
  -c:v libx264 -preset medium -crf 24 -profile:v high -level 4.1 \
  -an -movflags +faststart \
  salida.mp4
```
`-an` saca el audio del archivo entero (si el video tiene `muted` en el HTML, nunca se escucha — no tiene sentido pagar el peso). Ancho tope 1920 (o 720 si es la fuente mobile-only, ver `media="(max-width:900px)"` en el `<source>`) — no hace falta mas resolucion que el ancho real de pantalla donde se muestra.

Resultados reales en este sitio (Mendoza Aumentada, 25/08/2026): 5 videos de
Voces bajaron de 54-83MB a 5.4-9MB cada uno; el hero desktop de 91MB a
7.8MB, el hero mobile de 37MB a 3.5MB. Calidad verificada extrayendo un
frame de muestra (`-ss 00:00:05 -frames:v 1 check.jpg`) y mirandolo antes de
reemplazar el original — nunca dar por buena una compresion sin mirar
al menos un frame real.

**Chequear el resultado antes de pisar el original:** escribir a un archivo
temporal (o carpeta `_compressed/`), comparar tamaños con `ls -lh`, sacar un
frame de muestra y mirarlo, y solo despues mover/renombrar sobre el archivo
real. Nunca sobreescribir directo sin verificar.

## Imagenes

```js
const sharp = require('sharp');
sharp('entrada.jpg').resize({ width: 1600 }).jpeg({ quality: 82 }).toFile('salida.jpg');
sharp('entrada.png').resize({ width: 1600 }).png({ quality: 82, compressionLevel: 9 }).toFile('salida.png');
```
Ajustar `width` al ancho maximo real al que se muestra la imagen en el sitio (nunca mas grande que eso) y `quality` entre 75-85 para JPEG (buen balance, sin artefactos visibles en fotos).
