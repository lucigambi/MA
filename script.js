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

// Nav y footer — logo animado (Lottie, SVG renderer, fondo transparente)
// Mismo tratamiento que sanjuan_potencia: el logo propio del sitio queda
// como <img> estatico, el de FlexFlix pasa a Lottie.
(() => {
  if (typeof lottie === 'undefined') return;

  ['nav-logo-lottie', 'footer-logo-lottie'].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;

    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/img/lottie/flexflix-logo.json',
      assetsPath: 'assets/img/lottie/images/',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });
  });
})();

// Nav — dropdown "Acceder" (desktop): agrupa los 3 accesos en un trigger
// compacto en vez de mostrarlos como 3 textos sueltos en la barra
(() => {
  const dropdown = document.querySelector('.nav-access-dropdown');
  const toggle = document.getElementById('nav-access-toggle');
  const menu = document.getElementById('nav-access-menu');
  if (!dropdown || !toggle || !menu) return;

  function closeDropdown() {
    dropdown.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains('is-open');
    dropdown.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDropdown));
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

// Stat counters (seccion Evidencia) — anima los numeros de 0 a su valor
// final una vez que entran en pantalla. Portado tal cual de referencia/
// entre-rios (mecanismo generico, funciona igual para cualquier .stat-counter
// con data-target/data-decimals/data-prefix/data-suffix).
(() => {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function format(value) {
      const fixed = value.toFixed(decimals);
      const [intPart, decPart] = fixed.split('.');
      const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return prefix + (decPart ? intFormatted + ',' + decPart : intFormatted) + suffix;
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((el) => observer.observe(el));
})();

// Programas — 6 folletos oficiales (mismo mecanismo de tabs que FlexClass/PACCC:
// click en un tab renderiza el detalle), pero panel claro/blanco con el color
// oficial de cada folleto (ya impreso, no se reinventa) en vez del panel oscuro
// de PACCC. El color se aplica via --programa-color (custom property), asi el
// CSS de titulo/subtitulo-badge/cajas destacadas/viñetas queda en una sola regla
// generica en vez de 6 bloques de color duplicados.
// Los 3 que coinciden con un acento de marca (Certificación IA/Refuerzo/
// Pisatón) leen el color en runtime de la misma variable CSS que el resto
// del sitio (:root en style.css), asi cambiar el tono ahi los actualiza
// tambien aca. Interdisciplinario/Convivencia/Docentes tienen su propio
// color oficial de folleto impreso, no derivan de marca a proposito.
const BRAND = getComputedStyle(document.documentElement);
const COLOR_TURQUESA = BRAND.getPropertyValue('--color-turquesa').trim();
const COLOR_NARANJA = BRAND.getPropertyValue('--color-naranja').trim();
const COLOR_VERDE = BRAND.getPropertyValue('--color-verde').trim();

const PROGRAMAS_DATA = {
  1: {
    color: COLOR_TURQUESA,
    img: 'assets/img/programas/CertificacionIA.png',
    alt: 'Certificación en Inteligencia Artificial',
    tab: 'Certificación IA',
    copete: 'Educación pública que abre oportunidades laborales reales',
    titulo: 'Certificación laboral en Inteligencia Artificial',
    subtitulo: '4° y 5° año · Nivel Secundario',
    texto: `
      <section class="programa-bloque">
        <p class="programa-destacado">Mendoza se convierte en la primera provincia argentina en certificar habilidades laborales en Inteligencia Artificial desde la escuela secundaria, integrando educación, tecnología y empleo joven como política pública.</p>
        <p>Este modelo transforma los últimos años del secundario en una plataforma de formación para la nueva economía, conectando el aula con el mundo laboral real y actual.</p>
      </section>
      <div class="programa-box">
        <strong>De la escuela mendocina al mundo laboral.</strong><br>Certificación oficial con impacto concreto en el mundo del trabajo.
      </div>
      <section class="programa-bloque">
        <h3>¿Qué logra esta política pública?</h3>
        <p>Los estudiantes egresan con una certificación laboral oficial como <strong>Operadores Junior en Inteligencia Artificial</strong>, validando competencias concretas para trabajar, crear y producir con tecnología de forma crítica y responsable.</p>
      </section>
      <section class="programa-bloque">
        <h3>Proyección laboral concreta</h3>
        <p>La certificación habilita perfiles como:</p>
        <ul>
          <li>Asistente creativo</li>
          <li>Community AI</li>
          <li>Operador e-commerce</li>
          <li>Tutor IA</li>
          <li>Soporte digital</li>
          <li>Data junior</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <h3>Los estudiantes desarrollan habilidades para:</h3>
        <ul>
          <li><strong>Pensar críticamente</strong> frente a la tecnología</li>
          <li><strong>Crear contenidos</strong> con criterio humano</li>
          <li><strong>Diseñar y entrenar</strong> agentes digitales</li>
          <li><strong>Resolver problemas</strong> complejos con IA</li>
          <li><strong>Usar tecnología</strong> de forma ética, segura y productiva</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <h3>Certificación con valor real</h3>
        <ul>
          <li>Portafolio digital de producciones</li>
          <li>Validación mediante código QR</li>
          <li>Trazabilidad y verificación con tecnología blockchain</li>
        </ul>
      </section>
    `
  },
  2: {
    color: '#ae4abd',
    img: 'assets/img/programas/Interdisciplinario.png',
    alt: 'Pensamiento interdisciplinario con IA',
    tab: 'Interdisciplinario',
    copete: 'La IA como herramienta transversal de aprendizaje',
    titulo: 'Pensamiento interdisciplinario con Inteligencia Artificial',
    subtitulo: '1°, 2° y 3° año · Nivel Secundario',
    texto: `
      <section class="programa-bloque">
        <p class="programa-destacado">Mendoza impulsa un modelo educativo propio e innovador que integra <strong>Inteligencia Artificial</strong>, currícula oficial y neurociencia para fortalecer las competencias que hoy demanda el mundo.</p>
        <p>Mendoza fortalece el pensamiento interdisciplinario y las competencias evaluadas internacionalmente, preparando a sus estudiantes para un mundo en transformación.</p>
      </section>
      <div class="programa-box">
        <strong>MÁS DE 200 CONTENIDOS CURRICULARES</strong><br>de la provincia se organizan en rutas de aprendizaje que permiten a los estudiantes comprender, conectar saberes y resolver desafíos reales con apoyo de IA segura y guiada.
      </div>
      <section class="programa-bloque">
        <h3>Un modelo pedagógico mendocino</h3>
        <p>Los estudiantes trabajan con IA integrada al aula, guiada por docentes, siguiendo la <strong>Metodología PACCC™</strong>.</p>
        <p><strong>CONVERSA · APRENDE · CREA · PERSONALIZA · COMPARTE</strong></p>
      </section>
      <section class="programa-bloque">
        <h3>¿Qué cambia en el aula?</h3>
        <ul>
          <li><strong>Aprendizajes</strong> más profundos y significativos</li>
          <li><strong>Ritmos personalizados</strong> para cada estudiante</li>
          <li><strong>Retroalimentación constante</strong> y orientada a mejorar</li>
          <li><strong>Producción activa</strong> de conocimiento, no consumo pasivo</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <h3>El rol del docente y la tecnología</h3>
        <ul>
          <li>No reemplaza al docente</li>
          <li>Potencia su capacidad de acompañar</li>
          <li>Permite personalizar y profundizar el aprendizaje</li>
        </ul>
      </section>
    `
  },
  3: {
    color: COLOR_NARANJA,
    img: 'assets/img/programas/Refuerzo.png',
    alt: 'Refuerzo de aprendizajes fundamentales',
    tab: 'Refuerzo',
    copete: 'Tecnología al servicio de la comprensión profunda',
    titulo: 'Refuerzo de aprendizajes fundamentales',
    subtitulo: 'Lengua y Matemática · Nivel Primario',
    texto: `
      <section class="programa-bloque">
        <p>Mendoza impulsa un modelo educativo para la escuela primaria que integra pedagogía, tecnología y neurociencia, fortaleciendo los aprendizajes fundamentales desde el inicio de la trayectoria escolar.</p>
      </section>
      <div class="programa-box">Comprender antes que memorizar</div>
      <section class="programa-bloque">
        <p>Un enfoque centrado en <strong>comprender antes que memorizar</strong>, donde cada aprendizaje se construye en tres momentos:</p>
        <ul>
          <li>Partir de una experiencia concreta</li>
          <li>Organizar el pensamiento de forma visual</li>
          <li>Formalizar y aplicar el concepto</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <h3>Aprender haciendo</h3>
        <p>Los chicos:</p>
        <ul>
          <li>Exploran</li>
          <li>Preguntan</li>
          <li>Crean</li>
          <li>Comprenden en profundidad</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <p>La Inteligencia Artificial se integra de forma segura y pedagógica, siempre guiada por docentes y respetando los ritmos de cada estudiante.</p>
      </section>
      <section class="programa-bloque">
        <h3>Aprender desde el comienzo</h3>
        <p>Una <strong>política pública</strong> que fortalece comprensión, autonomía y desarrollo cognitivo desde la infancia.</p>
      </section>
    `
  },
  4: {
    color: COLOR_VERDE,
    img: 'assets/img/programas/Pisaton.png',
    alt: 'Rentrenamiento de competencias en el hogar',
    tab: 'Pisatón',
    copete: 'La escuela se extiende más allá del aula',
    titulo: 'Rentrenamiento de competencias en el hogar',
    subtitulo: 'Pisatón',
    texto: `
      <section class="programa-bloque">
        <p>Una provincia que entiende que aprender <strong>no sucede solo en la escuela</strong>, sino en todo el entramado educativo y social.</p>
      </section>
      <div class="programa-box">Aprender más allá de la escuela</div>
      <section class="programa-bloque">
        <p>La <strong>PISATÓN</strong> propone experiencias de aprendizaje mediadas por <strong>Inteligencia Artificial segura</strong>, que conectan escuela y hogar para fortalecer habilidades fundamentales en contextos reales y cotidianos.</p>
      </section>
      <section class="programa-bloque">
        <ul>
          <li>Acompañar el aprendizaje desde el hogar</li>
          <li>Reforzar competencias clave evaluadas a nivel internacional</li>
          <li>Integrar tecnología, reflexión y participación familiar</li>
          <li>Promover hábitos de aprendizaje autónomo y continuo</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <p>Mendoza amplía su política educativa innovadora llevando el desarrollo de competencias clave más allá de la escuela, integrando a las familias como parte activa del ecosistema de aprendizaje.</p>
      </section>
    `
  },
  5: {
    color: '#744cc6',
    img: 'assets/img/programas/Convivencia.png',
    alt: 'Prevención del bullying',
    tab: 'Convivencia',
    copete: 'Convivencia digital y ciudadanía responsable',
    titulo: 'Prevención del bullying',
    subtitulo: 'Convivencia escolar',
    texto: `
      <section class="programa-bloque">
        <p class="programa-destacado">Mendoza impulsa una política pública innovadora de convivencia escolar que combina narrativa inmersiva, Inteligencia Artificial y pedagogía emocional.</p>
        <p>El abordaje del bullying se realiza desde una mirada preventiva, reflexiva y transformadora, involucrando a estudiantes, docentes y familias.</p>
      </section>
      <div class="programa-box">
        <strong>No es un enfoque punitivo.</strong><br>Es preventivo, sensible y escalable.
      </div>
      <section class="programa-bloque">
        <h3>Experiencias guiadas con IA educativa</h3>
        <ul>
          <li>Comprender una misma situación desde múltiples perspectivas (víctima, agresor, testigo)</li>
          <li>Reflexionar, escribir y dialogar con IA educativa</li>
          <li>Tomar decisiones y pensar sobre las propias acciones</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <h3>Un enfoque preventivo y medible</h3>
        <ul>
          <li>Detección temprana de riesgos</li>
          <li>Análisis de patrones de convivencia</li>
          <li>Intervenciones pedagógicas oportunas</li>
        </ul>
      </section>
      <section class="programa-bloque">
        <p>Mendoza transforma la convivencia escolar en una política pública basada en datos, empatía y acción educativa.</p>
      </section>
    `
  },
  6: {
    color: '#bd974b',
    img: 'assets/img/programas/Docentes.png',
    alt: 'Entrenamiento docente en Inteligencia Artificial',
    tab: 'Docentes',
    copete: 'Formación pedagógica para el aula del presente',
    titulo: 'Entrenamiento para docentes en Inteligencia Artificial',
    subtitulo: 'Docentes · Nivel Secundario',
    texto: `
      <section class="programa-bloque">
        <p class="programa-destacado">Acompañar a los docentes en la incorporación pedagógica, crítica y situada de la Inteligencia Artificial.</p>
        <p>Integrándola como aliada del pensamiento, la planificación y el aprendizaje en el aula.</p>
      </section>
      <section class="programa-bloque">
        <h3>Co-pensamiento con Inteligencia Artificial</h3>
        <p>Se promueve un enfoque en el que el rol docente se fortalece como guía, mediador y diseñador de experiencias de aprendizaje. Al mismo tiempo, se habilita a los estudiantes a producir, reflexionar y consolidar sus aprendizajes a través de creaciones propias, favoreciendo una participación activa y consciente en entornos mediados por tecnología.</p>
      </section>
      <div class="programa-box">
        <strong>Integrar Inteligencia Artificial a la enseñanza</strong><br>no es delegar el pensamiento, sino ampliarlo.
      </div>
      <section class="programa-bloque">
        <p>Este recorrido acompaña el desarrollo de nuevas prácticas pedagógicas, brindando seguridad, criterio y confianza para enseñar en el contexto actual.</p>
      </section>
      <section class="programa-bloque">
        <p>Como resultado, se potencia un aprendizaje más profundo, significativo y autónomo, con un uso responsable de la <strong>Inteligencia Artificial al servicio de la educación.</strong></p>
      </section>
    `
  }
};
const PROGRAMA_ORDER = ['1', '2', '3', '4', '5', '6'];
let activePrograma = '1';

function renderPrograma(key) {
  const p = PROGRAMAS_DATA[key];
  const detalle = document.getElementById('programa-detalle');
  if (!detalle || !p) return;
  // Se setea en el wrapper (no en el panel) para que herede tambien a las
  // flechas prev/next, que ahora son hermanas del panel, no hijas.
  detalle.closest('.programa-detalle-wrap').style.setProperty('--programa-color', p.color);
  document.getElementById('programa-img').src = p.img;
  document.getElementById('programa-img').alt = p.alt;
  document.getElementById('programa-media-title').textContent = p.tab;
  document.getElementById('programa-copete').textContent = p.copete;
  document.getElementById('programa-titulo').textContent = p.titulo;
  document.getElementById('programa-subtitulo').textContent = p.subtitulo;
  document.getElementById('programa-texto').innerHTML = p.texto;

  // Alinear el titulo blanco (sobre la foto) con el titulo del panel
  // blanco — la posicion de este ultimo varia segun cuanto texto tenga el
  // copete de cada programa, asi que se mide en vez de dejarlo fijo.
  const mediaTitle = document.getElementById('programa-media-title');
  const titulo = document.getElementById('programa-titulo');
  const content = titulo && titulo.closest('.programa-content');
  if (mediaTitle && titulo && content) {
    // +10: el borde de color de arriba de .programa-content (border-top)
    // no cuenta en offsetTop (se mide desde el padding-box del padre).
    const top = titulo.offsetTop + 10;
    mediaTitle.style.top = `${top}px`;
  }
}

function setActivePrograma(key) {
  activePrograma = key;
  document.querySelectorAll('.programa-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.programa === key);
  });
  renderPrograma(key);
}

document.querySelectorAll('.programa-tab').forEach((btn) => {
  // --tab-color se asigna aca (no hardcodeado en el HTML) leyendo del mismo
  // PROGRAMAS_DATA que alimenta el panel — una sola fuente, sin riesgo de
  // que tab y panel queden con colores distintos si se cambia uno y no el
  // otro (paso justamente lo que se corrigio con Pisaton/Certificacion IA).
  const p = PROGRAMAS_DATA[btn.dataset.programa];
  if (p) btn.style.setProperty('--tab-color', p.color);
  btn.addEventListener('click', () => setActivePrograma(btn.dataset.programa));
});

const programaPrevBtn = document.getElementById('programa-prev');
const programaNextBtn = document.getElementById('programa-next');
if (programaPrevBtn && programaNextBtn) {
  programaPrevBtn.addEventListener('click', () => {
    const i = PROGRAMA_ORDER.indexOf(activePrograma);
    setActivePrograma(PROGRAMA_ORDER[(i - 1 + PROGRAMA_ORDER.length) % PROGRAMA_ORDER.length]);
  });
  programaNextBtn.addEventListener('click', () => {
    const i = PROGRAMA_ORDER.indexOf(activePrograma);
    setActivePrograma(PROGRAMA_ORDER[(i + 1) % PROGRAMA_ORDER.length]);
  });
}

if (document.getElementById('programa-detalle')) {
  renderPrograma(activePrograma);

  // Flechas prev/next a una altura fija (no la del panel actual, que varia
  // segun cuanto texto tenga cada programa y las haria "saltar" al cambiar
  // de pestaña) — se calcula el promedio de alto entre los 6 programas una
  // sola vez al cargar, y se posicionan a la mitad de ese promedio.
  const detalleEl = document.getElementById('programa-detalle');
  const wrapEl = detalleEl.closest('.programa-detalle-wrap');
  if (wrapEl) {
    let total = 0;
    PROGRAMA_ORDER.forEach((key) => {
      renderPrograma(key);
      total += detalleEl.offsetHeight;
    });
    const avgHeight = total / PROGRAMA_ORDER.length;
    wrapEl.style.setProperty('--programa-nav-top', (avgHeight / 2).toFixed(0) + 'px');
    renderPrograma(activePrograma); // vuelve a dejar el panel activo real
  }
}

// Programas — acordeon mobile, generado desde la misma PROGRAMAS_DATA que
// alimenta las tabs de desktop (una sola fuente de contenido). <details
// name="programas-accordion"> es nativo: abre uno solo por vez sin JS extra.
(() => {
  const wrap = document.getElementById('programas-accordion');
  if (!wrap) return;

  PROGRAMA_ORDER.forEach((key) => {
    const p = PROGRAMAS_DATA[key];
    const item = document.createElement('details');
    item.className = 'programa-accordion-item';
    item.name = 'programas-accordion';
    item.style.setProperty('--programa-color', p.color);

    const summary = document.createElement('summary');
    summary.className = 'programa-accordion-header';
    summary.innerHTML =
      `<span class="programa-accordion-num">${key.padStart(2, '0')}</span>` +
      `<span class="programa-accordion-title">${p.tab}</span>` +
      `<span class="programa-accordion-icon" aria-hidden="true"></span>`;

    const body = document.createElement('div');
    body.className = 'programa-accordion-body';
    // Version recortada especifica para mobile (la de desktop es muy alta
    // y se ve mal en el acordeon) — mismo nombre de archivo + "-mob".
    const imgMobile = p.img.replace(/\.png$/, '-mob.png');
    body.innerHTML =
      `<img loading="lazy" decoding="async" src="${imgMobile}" alt="${p.alt}">` +
      `<p class="programa-copete">${p.copete}</p>` +
      `<h3 class="programa-titulo">${p.titulo}</h3>` +
      `<p class="programa-subtitulo">${p.subtitulo}</p>` +
      `<div class="programa-texto">${p.texto}</div>` +
      `<button type="button" class="programa-accordion-close">Cerrar</button>`;

    item.append(summary, body);
    wrap.appendChild(item);
  });

  // Boton "Cerrar" al final del panel — asi no hay que scrollear hasta
  // arriba para volver a plegar la card despues de leer el texto.
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.programa-accordion-close');
    if (!btn) return;
    const details = btn.closest('details');
    if (!details) return;
    details.open = false;
    // Al cerrar un panel largo, el contenido se achica de golpe pero el
    // scroll (en pixeles) queda donde estaba — visualmente "salta" a la
    // seccion que haya quedado en esa posicion (ej. Creaciones). Volver al
    // propio acordeon despues de cerrar evita ese salto.
    details.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
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

// Deco texture (estrellas/equis parpadeando a los costados) — sin JS a
// proposito: son <img> estaticos codeados directo en index.html (ver
// .deco-shape en style.css). Generarlos en runtime con JS + posiciones al
// azar en cada carga fue justamente lo que terminaba cortando la animacion
// sola despues de unos segundos; codeados a mano, igual que la prueba que
// confirmo que funciona, se sostienen sin problema.

// Creaciones — desktop: el grid estatico se reordena en 2 filas horizontales
// con loop infinito (mismo mecanismo que las columnas verticales de Entre
// Rios en referencia/, rotado a horizontal). Se REUBICAN los mismos nodos
// .creacion-card que ya estaban en el HTML (no se reescribe su contenido —
// el diseño de la card queda igual), se reparten alternados entre las 2
// filas y se clonan (aria-hidden, fuera del tab order) para el loop sin
// salto visual. En mobile no se toca nada, sigue el carrusel swipeable
// que ya existia.
if (window.innerWidth > 900) {
  (() => {
    const grid = document.getElementById('creaciones-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.creacion-card'));
    if (!cards.length) return;

    const rowA = cards.filter((_, i) => i % 2 === 0);
    const rowB = cards.filter((_, i) => i % 2 === 1);

    function buildRow(rowCards, direction) {
      const row = document.createElement('div');
      row.className = `creaciones-row creaciones-row--${direction}`;
      const track = document.createElement('div');
      track.className = 'creaciones-row-track';
      rowCards.forEach((card) => track.appendChild(card));
      rowCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a,button').forEach((el) => { el.tabIndex = -1; });
        track.appendChild(clone);
      });
      row.appendChild(track);
      return row;
    }

    const wrap = document.createElement('div');
    wrap.className = 'creaciones-rows';
    wrap.id = 'creaciones-grid';
    wrap.setAttribute('role', 'list');
    wrap.setAttribute('aria-label', 'Galería de creaciones curriculares con IA');
    wrap.appendChild(buildRow(rowA, 'left'));
    wrap.appendChild(buildRow(rowB, 'right'));

    grid.replaceWith(wrap);
  })();
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
  const MOBILE_SRC = 'assets/videos/Mendoza-Vertical.mp4';
  const DESKTOP_SRC = 'assets/videos/Intro-Mendoza-Hori.mp4';
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

// Hero bottom fade (desktop). El video (panoramico) va siempre a
// width:100%/height:auto anclado arriba dentro de un hero a 100svh (nunca se
// recorta), lo que deja un hueco debajo del video que ya se ve del color
// correcto (fondo propio de #hero-section); esto mide ese hueco real entre
// el hero y el video y reubica/redimensiona el degrade para que la costura
// no se note. En mobile (<=900px) el degrade lo resuelve el CSS solo
// (ver style.css, #hero-bottom-fade con !important) — no calcular aca.
(() => {
  const heroSection = document.getElementById('hero-section');
  const video = document.getElementById('hero-video');
  const fadeEl = document.getElementById('hero-bottom-fade');
  if (!heroSection || !video || !fadeEl) return;

  const BLEND_PX = 200; // how far the fade reaches up into the video for a soft transition

  function updateFade() {
    if (window.innerWidth <= 900) return;

    const containerRect = heroSection.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();
    // Si el video todavia no cargo metadata, getBoundingClientRect da 0 de
    // alto — con eso el calculo de abajo queda mal armado (blend a partir
    // de un video "invisible") y el fade termina viendose como una linea
    // dura en vez de un degrade, porque nunca se vuelve a recalcular bien
    // despues. Sin altura real todavia, no tocar el fade y esperar al
    // proximo intento (loadedmetadata/canplay/reintentos de abajo).
    if (videoRect.height < 2) return;

    const gapPx = Math.max(0, containerRect.bottom - videoRect.bottom);
    const blendPx = Math.min(BLEND_PX, videoRect.height * 0.25); // fundido video -> bg-dark-2
    // Ancho MINIMO en pixeles reservado para el segundo tramo del degrade
    // (bg-dark-2 -> bg-dark-1, el color de la seccion siguiente). Un tope
    // en PORCENTAJE (probado antes) no alcanza: con un video bajo (mobile,
    // max-height fijo) el gap da ~0 y el total queda tan chico que ese
    // porcentaje se traduce en unos pocos pixeles reales — invisible,
    // se seguia viendo como corte duro. Reservando un ancho fijo en px en
    // vez de un %, la transicion siempre tiene lugar real para notarse.
    const sectionBlendPx = 40;

    const totalHeight = gapPx + blendPx + sectionBlendPx;
    const blendPct = totalHeight > 0 ? (blendPx / totalHeight) * 100 : 0;

    fadeEl.style.height = totalHeight + 'px';
    fadeEl.style.background =
      `linear-gradient(to bottom,rgba(var(--bg-dark-2-rgb),0) 0%,var(--bg-dark-2) ${blendPct}%,var(--bg-dark-1) 100%)`;
  }

  video.addEventListener('loadedmetadata', updateFade);
  video.addEventListener('canplay', updateFade);
  window.addEventListener('resize', updateFade);
  updateFade();
  // Reintentos escalonados por si el video tarda en reportar su tamaño
  // real (con el guard de arriba, los intentos tempranos no rompen nada,
  // solo no hacen efecto hasta que haya altura real que medir).
  [100, 300, 800, 1500].forEach((ms) => setTimeout(updateFade, ms));
})();
