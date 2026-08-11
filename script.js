// Nav — hamburger menu (mobile)
(() => {
  const burger = document.getElementById('nav-burger');
  const panel = document.getElementById('nav-mobile-panel');
  if (!burger || !panel) return;

  function closeMenu() {
    panel.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', () => {
    const isOpen = !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', isOpen);
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
})();

// Nav — header transparente sobre el hero, pasa a fondo solido + blur al scrollear
(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function updateNavScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();
})();

// Nav — mide el alto real del header (fixed) y lo aplica como scroll-padding-top,
// asi los anclas del nav dejan siempre el arranque real de la seccion visible
// debajo del header, sin depender de un valor fijo adivinado por CSS que se
// desalinea entre resoluciones (logo/nav cambian de alto con el viewport).
(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function updateScrollPadding() {
    document.documentElement.style.scrollPaddingTop = nav.offsetHeight + 'px';
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }

  window.addEventListener('resize', updateScrollPadding, { passive: true });
  updateScrollPadding();
  // el logo/las tipografias pueden tardar un frame en asentar su alto final
  requestAnimationFrame(updateScrollPadding);
})();

// FlexClass / PACCC — panel de detalle desktop
const STEP_DATA = {
  1: { title: 'Personaliza', color: 'var(--paccc-p)', tabLabel: 'P', badge: '01',
    intro: 'Adaptá FlexClass para tu aula.',
    long: 'Elige las preguntas del reservorio curricular, suma las suyas, decide con qué herramienta de IA van a trabajar sus estudiantes y ajusta los tiempos. Acá se orquesta la experiencia cognitiva para este grupo, en este contexto, en este momento.',
    imgSrc: 'assets/img/Paccc-01-Personaliza.jpg' },
  2: { title: 'Aprende', color: 'var(--paccc-a)', tabLabel: 'A', badge: '02',
    intro: 'Contenido adaptado a Mendoza',
    long: 'El tema se lo cuenta un personaje en primera persona, con la historia y la identidad de la provincia como base del curso, y sobre eso el estudiante conversa y crea después.',
    imgSrc: 'assets/img/Paccc-02-Aprende.jpg' },
  3: { title: 'Conversa', color: 'var(--paccc-c1)', tabLabel: 'C', badge: '03',
    intro: 'Preguntas antes que respuestas',
    long: 'FlexFlixGPT es el chat de la plataforma: una IA que solo habla del tema de la clase y está hecha para repreguntar. El estudiante dialoga con ella a partir de preguntas curadas y agrupadas por intención: repaso, exploración, preguntas esenciales. La IA no cierra el tema, lo abre.',
    imgSrc: 'assets/img/Paccc-03-Conversa.jpg' },
  4: { title: 'Crea', color: 'var(--paccc-c2)', tabLabel: 'C', badge: '04',
    intro: 'De consumir a producir',
    long: 'Cada tema trae una IA y una consigna concreta: un video, una canción, una infografía. La clase da los pasos y el tutorial de la IA; el resultado es la pieza del estudiante.',
    imgSrc: 'assets/img/Paccc-04-Crea.jpg' },
  5: { title: 'Comparte', color: 'var(--paccc-c3)', tabLabel: 'C', badge: '05',
    intro: 'El trabajo creado sube a la hoja de entrega del curso.',
    long: 'El docente lo revisa y devuelve una retroalimentación puntual sobre la producción real del estudiante, cerrando el ciclo pedagógico.',
    imgSrc: 'assets/img/Paccc-05-Comparte.jpg' }
};
const STEP_ORDER = ['1', '2', '3', '4', '5'];
let activeKey = '1';

function renderDetail(key) {
  const s = STEP_DATA[key];
  const panel = document.getElementById('paccc-detail');
  panel.style.borderColor = s.color;
  document.querySelectorAll('.nav-arrow-btn').forEach(b => b.style.background = s.color);
  document.getElementById('paccc-detail-img').src = s.imgSrc;
  const badge = document.getElementById('paccc-detail-badge');
  badge.textContent = s.badge || '';
  badge.style.color = s.color;
  document.getElementById('paccc-detail-title').textContent = s.title;
  document.getElementById('paccc-detail-title').style.color = s.color;
  document.getElementById('paccc-detail-intro').textContent = s.intro;
  document.getElementById('paccc-detail-long').textContent = s.long;
  document.getElementById('paccc-detail-long').style.display = s.long ? 'block' : 'none';
  const bot = document.getElementById('paccc-bot');
  if (bot) bot.style.display = key === '3' ? 'block' : 'none';
  const creaList = document.getElementById('paccc-crea-list');
  if (creaList) creaList.style.display = key === '4' ? 'grid' : 'none';
}

function setActive(key) {
  activeKey = key;
  document.querySelectorAll('.paccc-seg').forEach(c => {
    c.classList.toggle('active', c.dataset.key === key);
  });
  renderDetail(key);
}

document.querySelectorAll('.paccc-seg').forEach(seg => {
  seg.addEventListener('click', () => setActive(seg.dataset.key));
});
document.getElementById('paccc-prev').addEventListener('click', () => {
  const i = STEP_ORDER.indexOf(activeKey);
  setActive(STEP_ORDER[(i - 1 + STEP_ORDER.length) % STEP_ORDER.length]);
});
document.getElementById('paccc-next').addEventListener('click', () => {
  const i = STEP_ORDER.indexOf(activeKey);
  setActive(STEP_ORDER[(i + 1) % STEP_ORDER.length]);
});

// initial detail render
renderDetail(activeKey);

// PACCC mobile — one vertical card per stage (image, texto), scroll horizontal con snap.
// Mismo STEP_DATA que el desktop: sin duplicar contenido a mano.
(() => {
  const track = document.getElementById('paccc-mobile-carousel');
  const dotsWrap = document.getElementById('paccc-mobile-dots');
  if (!track || !dotsWrap) return;

  const creaIcons = [
    { src: 'assets/img/icon-08.png', label: 'Videos' },
    { src: 'assets/img/icon-09.png', label: 'Mapas mentales' },
    { src: 'assets/img/icon-10.png', label: 'Historias' },
    { src: 'assets/img/icon-11.png', label: 'Canciones' },
    { src: 'assets/img/icon-12.png', label: 'Líneas de tiempo' },
    { src: 'assets/img/icon-13.png', label: 'Presentaciones' },
    { src: 'assets/img/icon-14.png', label: 'Infografías' },
  ];

  STEP_ORDER.forEach((key) => {
    const s = STEP_DATA[key];

    const card = document.createElement('div');
    card.className = 'paccc-mobile-card';
    card.style.setProperty('--card-color', s.color);

    const photo = document.createElement('div');
    photo.className = 'paccc-mobile-card-photo';
    photo.innerHTML = `<img src="${s.imgSrc}" alt="" loading="lazy" decoding="async">`;

    const body = document.createElement('div');
    body.className = 'paccc-mobile-card-body';

    const letter = document.createElement('div');
    letter.className = 'paccc-mobile-card-letter';
    letter.textContent = s.tabLabel || '';
    letter.setAttribute('aria-hidden', 'true');

    const badge = document.createElement('div');
    badge.className = 'paccc-mobile-card-badge';
    badge.textContent = s.badge || '';
    badge.style.color = s.color;

    const title = document.createElement('h3');
    title.className = 'paccc-mobile-card-title';
    title.textContent = s.title;

    const intro = document.createElement('div');
    intro.className = 'paccc-mobile-card-intro';
    intro.textContent = s.intro;

    const long = document.createElement('div');
    long.className = 'paccc-mobile-card-long';
    long.textContent = s.long;

    body.append(letter, badge, title, intro, long);

    if (key === '4') {
      const list = document.createElement('div');
      list.className = 'paccc-mobile-crea-list is-visible';
      creaIcons.forEach(({ src, label }) => {
        const row = document.createElement('div');
        row.innerHTML = `<img src="${src}" alt="" loading="lazy" decoding="async">${label}`;
        list.appendChild(row);
      });
      body.appendChild(list);
    }

    card.append(photo, body);
    track.appendChild(card);

    const dot = document.createElement('span');
    dot.className = 'paccc-mobile-dot';
    dot.style.setProperty('--dot-color', s.color);
    dotsWrap.appendChild(dot);
  });

  const cards = Array.from(track.children);
  const dots = Array.from(dotsWrap.children);
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const idx = cards.indexOf(entry.target);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    });
  }, { root: track, threshold: 0.6 });
  cards.forEach((c) => dotObserver.observe(c));
})();

// Reconocimientos — coleccion centralizada de los 8 premios; se filtra por
// "featured" para armar la primera fila (4) y la segunda fila (4).
(() => {
  const RECONOCIMIENTOS_ITEMS = [
    { id: 'youtube', institution: 'YOUTUBE', name: 'Botones de oro', description: 'Entregados por YouTube a los canales Aula365 y Educatina.', src: 'assets/img/premios/premios__youtube.png', alt: 'YouTube', featured: true },
    { id: 'holoniq', institution: 'HOLONIQ', name: 'Top 200', description: 'Selección global de 200 empresas de tecnología educativa.', src: 'assets/img/premios/premios__holon.png', alt: 'HolonIQ', featured: true },
    { id: 'guinness', institution: 'GUINNESS WORLD RECORDS', name: 'Récord mundial', description: 'Al cómic colaborativo con la mayor cantidad de autores del mundo.', src: 'assets/img/premios/premios__Guinness.png', alt: 'Guinness World Records', featured: true },
    { id: 'tato', institution: 'CAPIT', name: 'Premio Tato', description: 'Mejor programa infantil, por la serie Los Creadores (2017).', src: 'assets/img/premios/tato.jpg', alt: 'Premio Tato', featured: true, logoSize: 'small' },
    { id: 'parents', institution: "PARENTS' CHOICE FOUNDATION", name: "Parents' Choice Awards", description: 'Sello de calidad otorgado a productos educativos para chicos y familias.', src: 'assets/img/premios/premios__parents.png', alt: "Parents' Choice", featured: false },
    { id: 'sadosky', institution: 'CESSI', name: 'Sadosky de Oro', description: 'A la trayectoria empresarial y a la mejor solución de innovación tecnológica aplicada a la educación (2015).', src: 'assets/img/premios/premios__Sadosky.png', alt: 'Premios Sadosky', featured: false },
    { id: 'wsa', institution: 'WORLD SUMMIT AWARDS', name: 'Innovación educativa', description: 'Otorgado por la ONU al Programa de Alfabetización Digital (2005).', src: 'assets/img/premios/premios__wsa.png', alt: 'World Summit Award', featured: false, logoSize: 'large' },
    { id: 'martinfierro', institution: 'APTRA', name: 'Premio Martín Fierro', description: 'Mejor programa infantil por la serie transmedia Los Creadores (2016).', src: 'assets/img/premios/martin-fierro.png', alt: 'Premio Martín Fierro', featured: false },
  ];

  const featuredEl = document.getElementById('reconocimientos-featured');
  const secondaryEl = document.getElementById('reconocimientos-secondary');
  const mobileRailEl = document.getElementById('reconocimientos-mobile-rail');
  if (!featuredEl || !secondaryEl || !mobileRailEl) return;

  function buildAwardCard(item) {
    const card = document.createElement('div');
    card.className = 'award-card ' + (item.featured ? 'award-card--featured' : 'award-card--secondary');
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-reveal-card', '');

    const stage = document.createElement('div');
    stage.className = 'award-logo-stage';
    if (item.logoSize === 'small') stage.classList.add('is-small');
    else if (item.logoSize === 'large') stage.classList.add('is-large');

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    stage.appendChild(img);

    const body = document.createElement('div');
    body.className = 'award-body';

    const institution = document.createElement('div');
    institution.className = 'award-institution';
    institution.textContent = item.institution;

    const name = document.createElement('h3');
    name.className = 'award-name';
    name.textContent = item.name;

    const description = document.createElement('div');
    description.className = 'award-description';
    description.textContent = item.description;

    body.append(institution, name, description);
    card.append(stage, body);
    return card;
  }

  RECONOCIMIENTOS_ITEMS.filter((item) => item.featured).forEach((item) => {
    featuredEl.appendChild(buildAwardCard(item));
  });
  RECONOCIMIENTOS_ITEMS.filter((item) => !item.featured).forEach((item) => {
    secondaryEl.appendChild(buildAwardCard(item));
  });
  // Mobile: las 7 en un unico rail horizontal, mismo orden de la coleccion.
  RECONOCIMIENTOS_ITEMS.forEach((item) => {
    mobileRailEl.appendChild(buildAwardCard(item));
  });
})();

// PixelTexture — reusable decorative overlay of flickering pixel squares.
// Renders `count` absolutely-positioned squares into `container`, sized/colored/timed
// from the brand palette, biased toward the top-right corner (masked via CSS).
function PixelTexture(container, count = 26) {
  if (!container) return;

  const sizes = [6, 8, 12, 16, 24];
  const accentColors = ['var(--accent-lime)', 'var(--accent-fuchsia)', 'var(--accent-cyan)', 'var(--accent-coral)'];
  const baseColors = ['var(--accent-blue)', 'var(--accent-violet)'];

  const squares = Array.from({ length: count }, () => {
    const isAccent = Math.random() < 0.22;
    const onLeft = Math.random() < 0.5;
    return {
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: isAccent
        ? accentColors[Math.floor(Math.random() * accentColors.length)]
        : baseColors[Math.floor(Math.random() * baseColors.length)],
      side: onLeft ? 'left' : 'right',
      offset: (Math.random() * 16).toFixed(1) + '%',
      top: (Math.random() * 96).toFixed(1) + '%',
      opacityBase: isAccent ? 0.03 + Math.random() * 0.05 : 0.02 + Math.random() * 0.05,
      opacityMax: isAccent ? 0.65 + Math.random() * 0.3 : 0.5 + Math.random() * 0.25,
      duration: 1.4 + Math.random() * 2.2,
      delay: Math.random() * 4,
      blur: Math.random() < 0.35 ? (Math.random() < 0.5 ? 2 : 4) : 0
    };
  });

  const frag = document.createDocumentFragment();
  squares.forEach((sq) => {
    const el = document.createElement('span');
    el.className = 'pixel-sq';
    // Tamano responsive: escala con el ancho de pantalla (referencia 1920px)
    // en vez de quedar fijo en px, para que no se vean gigantes/grotescos en
    // notebook o tablet. La densidad (cantidad visible) se ajusta aparte via CSS.
    const responsiveSize = `clamp(3px, ${(sq.size / 19.2).toFixed(2)}vw, ${sq.size}px)`;
    el.style.width = responsiveSize;
    el.style.height = responsiveSize;
    el.style.top = sq.top;
    el.style[sq.side] = sq.offset;
    el.style.background = sq.color;
    if (sq.blur) el.style.filter = `blur(${sq.blur}px)`;
    el.style.setProperty('--op-a', sq.opacityBase.toFixed(2));
    el.style.setProperty('--op-b', sq.opacityMax.toFixed(2));
    el.style.setProperty('--dur', sq.duration.toFixed(1) + 's');
    el.style.setProperty('--delay', sq.delay.toFixed(1) + 's');
    frag.appendChild(el);
  });
  container.appendChild(frag);
}

// En mobile no se generan los cuadraditos decorativos — menos nodos/animaciones en pantallas chicas.
if (window.innerWidth > 900) {
  PixelTexture(document.getElementById('hero-pixel-texture'), 44);
  PixelTexture(document.getElementById('squares-layer'), 68);
  PixelTexture(document.getElementById('paccc-pixel-texture'), 34);
  PixelTexture(document.getElementById('creaciones-pixel-texture'), 34);
  PixelTexture(document.getElementById('security-pixel-texture'), 34);
  PixelTexture(document.getElementById('reconocimientos-pixel-texture'), 30);
  PixelTexture(document.getElementById('contacto-pixel-texture'), 34);
}

// Hero video source — el atributo media="" en <source> de <video> (a
// diferencia de <picture>) se evalua una sola vez, cuando el navegador elige
// la fuente al cargar el elemento, y NO se re-evalua si la ventana cambia de
// ancho despues (herramientas de preview multi-resolucion, o alguien
// resizeando el browser, pueden quedar con el video "equivocado" pegado).
// Esto fuerza la fuente correcta activamente cada vez que se cruza el
// breakpoint de 900px, en vez de confiar solo en la seleccion inicial del
// <source> estatico (que igual queda como fallback si JS no corre).
(() => {
  const video = document.getElementById('hero-video');
  if (!video) return;
  const MOBILE_SRC = 'assets/videos/cuadrado.mp4';
  const DESKTOP_SRC = 'assets/videos/hero-video-2.mp4';
  let isMobileSrc = null;

  function syncHeroVideoSource() {
    const wantMobile = window.innerWidth <= 900;
    if (wantMobile === isMobileSrc) return;
    isMobileSrc = wantMobile;
    const target = wantMobile ? MOBILE_SRC : DESKTOP_SRC;
    if (video.currentSrc.endsWith(target)) return;
    const wasPlaying = !video.paused;
    video.src = target;
    video.load();
    if (wasPlaying) video.play().catch(() => {});
  }

  syncHeroVideoSource();
  window.addEventListener('resize', syncHeroVideoSource, { passive: true });
})();

// Hero bottom fade. Desktop: el video (panoramico) va siempre a
// width:100%/height:auto anclado arriba dentro de un hero a 100svh (nunca se
// recorta), lo que deja un hueco debajo del video que ya se ve del color
// correcto (fondo propio de #hero-section); esto mide ese hueco real entre
// el hero y el video y reubica/redimensiona el degrade para que la costura
// no se note. Mobile (<=900px, ver CSS): el hero pasa a flujo normal (video
// + contenido en secuencia, sin hueco de por medio), asi que ahi el degrade
// solo hace un blend corto contra el propio borde inferior del video, no
// contra el hero-section entero.
(() => {
  const heroSection = document.getElementById('hero-section');
  const videoWrap = document.getElementById('hero-video-wrap');
  const video = document.getElementById('hero-video');
  const fadeEl = document.getElementById('hero-bottom-fade');
  if (!heroSection || !videoWrap || !video || !fadeEl) return;

  const BLEND_PX = 200; // how far the fade reaches up into the video for a soft transition (capped below on short videos, e.g. the mobile square clip, so it doesn't eat most of the frame)

  function updateFade() {
    const containerEl = window.innerWidth <= 900 ? videoWrap : heroSection;
    const containerRect = containerEl.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();
    const gapPx = Math.max(0, containerRect.bottom - videoRect.bottom);
    const blendPx = Math.min(BLEND_PX, videoRect.height * 0.25);

    const totalHeight = gapPx + blendPx;
    const blendPct = (blendPx / totalHeight) * 100;

    fadeEl.style.height = totalHeight + 'px';
    fadeEl.style.background =
      `linear-gradient(to bottom,rgba(var(--bg-dark-2-rgb),0) 0%,var(--bg-dark-2) ${blendPct}%,var(--bg-dark-1) 100%)`;
  }

  video.addEventListener('loadedmetadata', updateFade);
  window.addEventListener('resize', updateFade);
  updateFade();
  // safety net in case loadedmetadata already fired before this ran
  setTimeout(updateFade, 300);
})();
