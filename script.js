// Nav — hamburger menu (mobile)
(() => {
  const burger = document.getElementById("nav-burger");
  const panel = document.getElementById("nav-mobile-panel");
  if (!burger || !panel) return;

  function closeMenu() {
    panel.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", () => {
    const isOpen = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", isOpen);
    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  panel
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
})();

// Nav y footer — logo animado (Lottie, SVG renderer, fondo transparente)
// Mismo tratamiento que sanjuan_potencia: el logo propio del sitio queda
// como <img> estatico, el de FlexFlix pasa a Lottie.
(() => {
  if (typeof lottie === "undefined") return;

  ["nav-logo-lottie", "footer-logo-lottie"].forEach((id) => {
    const container = document.getElementById(id);
    if (!container) return;

    lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "assets/img/lottie/flexflix-logo.json",
      assetsPath: "assets/img/lottie/images/",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });
  });
})();

// Nav — dropdown "Acceder" (desktop): agrupa los 3 accesos en un trigger
// compacto en vez de mostrarlos como 3 textos sueltos en la barra
(() => {
  const dropdown = document.querySelector(".nav-access-dropdown");
  const toggle = document.getElementById("nav-access-toggle");
  const menu = document.getElementById("nav-access-menu");
  if (!dropdown || !toggle || !menu) return;

  function closeDropdown() {
    dropdown.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains("is-open");
    dropdown.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

  menu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeDropdown));
})();

// Nav — header transparente sobre el hero, pasa a fondo solido + blur al scrollear
(() => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  function updateNavScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", updateNavScroll, { passive: true });
  updateNavScroll();
})();

// Nav — mide el alto real del header (fixed) y lo aplica como scroll-padding-top,
// asi los anclas del nav dejan siempre el arranque real de la seccion visible
// debajo del header, sin depender de un valor fijo adivinado por CSS que se
// desalinea entre resoluciones (logo/nav cambian de alto con el viewport).
(() => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  function updateScrollPadding() {
    document.documentElement.style.scrollPaddingTop = nav.offsetHeight + "px";
    document.documentElement.style.setProperty(
      "--nav-h",
      nav.offsetHeight + "px",
    );
  }

  window.addEventListener("resize", updateScrollPadding, { passive: true });
  updateScrollPadding();
  // el logo/las tipografias pueden tardar un frame en asentar su alto final
  requestAnimationFrame(updateScrollPadding);
})();

// Stat counters (seccion Evidencia) — anima los numeros de 0 a su valor
// final una vez que entran en pantalla. Portado tal cual de referencia/
// entre-rios (mecanismo generico, funciona igual para cualquier .stat-counter
// con data-target/data-decimals/data-prefix/data-suffix).
(() => {
  const counters = document.querySelectorAll(".stat-counter");
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    function format(value) {
      const fixed = value.toFixed(decimals);
      const [intPart, decPart] = fixed.split(".");
      const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return (
        prefix +
        (decPart ? intFormatted + "," + decPart : intFormatted) +
        suffix
      );
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((el) => observer.observe(el));
})();

// Programas — los 6 paneles ya estan armados en el HTML (uno por programa)
// y comparten la misma celda de grid en CSS (.programa-esquema), asi que el
// alto de la fila lo define el panel mas alto de los 6 y no salta al
// cambiar de tab. Cambiar de tab es solo alternar la clase is-active
// (visibility, no display:none — eso sacaria al panel del calculo de alto).
(() => {
  const tabs = document.querySelectorAll(".programa-tab");
  if (!tabs.length) return;

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.programa;
      tabs.forEach((t) => t.classList.toggle("active", t === btn));
      document.querySelectorAll(".programa-esquema").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.programa === key);
      });
    });
  });
})();

// FlexClass / PACCC — panel de detalle desktop
const STEP_DATA = {
  1: {
    title: "Personaliza",
    color: "var(--paccc-p)",
    tabLabel: "P",
    badge: "01",
    intro: "Adaptá FlexClass para tu aula.",
    long: "Elige las preguntas del reservorio curricular, suma las suyas, decide con qué herramienta de IA van a trabajar sus estudiantes y ajusta los tiempos. Acá se orquesta la experiencia cognitiva para este grupo, en este contexto, en este momento.",
    imgSrc: "assets/img/Paccc-01-Personaliza.jpg",
  },
  2: {
    title: "Aprende",
    color: "var(--paccc-a)",
    tabLabel: "A",
    badge: "02",
    intro: "Contenido adaptado a Mendoza",
    long: "El tema se lo cuenta un personaje en primera persona, con la historia y la identidad de la provincia como base del curso, y sobre eso el estudiante conversa y crea después.",
    imgSrc: "assets/img/Paccc-02-Aprende.jpg",
  },
  3: {
    title: "Conversa",
    color: "var(--paccc-c1)",
    tabLabel: "C",
    badge: "03",
    intro: "Preguntas antes que respuestas",
    long: "FlexFlixGPT es el chat de la plataforma: una IA que solo habla del tema de la clase y está hecha para repreguntar. El estudiante dialoga con ella a partir de preguntas curadas y agrupadas por intención: repaso, exploración, preguntas esenciales. La IA no cierra el tema, lo abre.",
    imgSrc: "assets/img/Paccc-03-Conversa.jpg",
  },
  4: {
    title: "Crea",
    color: "var(--paccc-c2)",
    tabLabel: "C",
    badge: "04",
    intro: "De consumir a producir",
    long: "Cada tema trae una IA y una consigna concreta: un video, una canción, una infografía. La clase da los pasos y el tutorial de la IA; el resultado es la pieza del estudiante.",
    imgSrc: "assets/img/Paccc-04-Crea.jpg",
  },
  5: {
    title: "Comparte",
    color: "var(--paccc-c3)",
    tabLabel: "C",
    badge: "05",
    intro: "El trabajo creado sube a la hoja de entrega del curso.",
    long: "El docente lo revisa y devuelve una retroalimentación puntual sobre la producción real del estudiante, cerrando el ciclo pedagógico.",
    imgSrc: "assets/img/Paccc-05-Comparte.jpg",
  },
};
const STEP_ORDER = ["1", "2", "3", "4", "5"];
let activeKey = "1";

function renderDetail(key) {
  const s = STEP_DATA[key];
  const panel = document.getElementById("paccc-detail");
  panel.style.borderColor = s.color;
  document
    .querySelectorAll(".nav-arrow-btn")
    .forEach((b) => (b.style.background = s.color));
  document.getElementById("paccc-detail-img").src = s.imgSrc;
  const badge = document.getElementById("paccc-detail-badge");
  badge.textContent = s.badge || "";
  badge.style.color = s.color;
  document.getElementById("paccc-detail-title").textContent = s.title;
  document.getElementById("paccc-detail-title").style.color = s.color;
  document.getElementById("paccc-detail-intro").textContent = s.intro;
  document.getElementById("paccc-detail-long").textContent = s.long;
  document.getElementById("paccc-detail-long").style.display = s.long
    ? "block"
    : "none";
  const creaList = document.getElementById("paccc-crea-list");
  if (creaList) creaList.style.display = key === "4" ? "grid" : "none";
}

function setActive(key) {
  activeKey = key;
  document.querySelectorAll(".paccc-seg").forEach((c) => {
    c.classList.toggle("active", c.dataset.key === key);
  });
  renderDetail(key);
}

document.querySelectorAll(".paccc-seg").forEach((seg) => {
  seg.addEventListener("click", () => setActive(seg.dataset.key));
});
document.getElementById("paccc-prev").addEventListener("click", () => {
  const i = STEP_ORDER.indexOf(activeKey);
  setActive(STEP_ORDER[(i - 1 + STEP_ORDER.length) % STEP_ORDER.length]);
});
document.getElementById("paccc-next").addEventListener("click", () => {
  const i = STEP_ORDER.indexOf(activeKey);
  setActive(STEP_ORDER[(i + 1) % STEP_ORDER.length]);
});

// initial detail render
renderDetail(activeKey);

// PACCC mobile — one vertical card per stage (image, texto), scroll horizontal con snap.
// Mismo STEP_DATA que el desktop: sin duplicar contenido a mano.
(() => {
  const track = document.getElementById("paccc-mobile-carousel");
  const dotsWrap = document.getElementById("paccc-mobile-dots");
  if (!track || !dotsWrap) return;

  const creaIcons = [
    { src: "assets/img/icon-08.png", label: "Videos" },
    { src: "assets/img/icon-09.png", label: "Mapas mentales" },
    { src: "assets/img/icon-10.png", label: "Historias" },
    { src: "assets/img/icon-11.png", label: "Canciones" },
    { src: "assets/img/icon-12.png", label: "Líneas de tiempo" },
    { src: "assets/img/icon-13.png", label: "Presentaciones" },
    { src: "assets/img/icon-14.png", label: "Infografías" },
  ];

  STEP_ORDER.forEach((key) => {
    const s = STEP_DATA[key];

    const card = document.createElement("div");
    card.className = "paccc-mobile-card";
    card.style.setProperty("--card-color", s.color);

    const photo = document.createElement("div");
    photo.className = "paccc-mobile-card-photo";
    photo.innerHTML = `<img src="${s.imgSrc}" alt="" loading="lazy" decoding="async">`;

    const body = document.createElement("div");
    body.className = "paccc-mobile-card-body";

    const letter = document.createElement("div");
    letter.className = "paccc-mobile-card-letter";
    letter.textContent = s.tabLabel || "";
    letter.setAttribute("aria-hidden", "true");

    const badge = document.createElement("div");
    badge.className = "paccc-mobile-card-badge";
    badge.textContent = s.badge || "";
    badge.style.color = s.color;

    const title = document.createElement("h3");
    title.className = "paccc-mobile-card-title";
    title.textContent = s.title;

    const intro = document.createElement("div");
    intro.className = "paccc-mobile-card-intro";
    intro.textContent = s.intro;

    const long = document.createElement("div");
    long.className = "paccc-mobile-card-long";
    long.textContent = s.long;

    body.append(letter, badge, title, intro, long);

    if (key === "4") {
      const list = document.createElement("div");
      list.className = "paccc-mobile-crea-list is-visible";
      creaIcons.forEach(({ src, label }) => {
        const row = document.createElement("div");
        row.innerHTML = `<img src="${src}" alt="" loading="lazy" decoding="async">${label}`;
        list.appendChild(row);
      });
      body.appendChild(list);
    }

    card.append(photo, body);
    track.appendChild(card);

    const dot = document.createElement("span");
    dot.className = "paccc-mobile-dot";
    dot.style.setProperty("--dot-color", s.color);
    dotsWrap.appendChild(dot);
  });

  const cards = Array.from(track.children);
  const dots = Array.from(dotsWrap.children);
  const dotObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = cards.indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle("active", i === idx));
      });
    },
    { root: track, threshold: 0.6 },
  );
  cards.forEach((c) => dotObserver.observe(c));
})();

// Reconocimientos — coleccion centralizada de los 8 premios; se filtra por
// "featured" para armar la primera fila (4) y la segunda fila (4).
(() => {
  const RECONOCIMIENTOS_ITEMS = [
    {
      id: "time",
      institution: "TIME / STATISTA",
      name: "Top 100 EdTech Companies",
      description:
        "Selección mundial de las 100 mejores empresas de tecnología educativa (2026).",
      src: "assets/img/premios/martin-times.png",
      alt: "TIME - World's Top EdTech Companies",
      featured: true,
    },
    {
      id: "youtube",
      institution: "YOUTUBE",
      name: "Botones de oro",
      description: "Entregados por YouTube a los canales Aula365 y Educatina.",
      src: "assets/img/premios/premios__youtube.png",
      alt: "YouTube",
      featured: true,
    },
    {
      id: "holoniq",
      institution: "HOLONIQ",
      name: "Top 200",
      description: "Selección global de 200 empresas de tecnología educativa.",
      src: "assets/img/premios/premios__holon.png",
      alt: "HolonIQ",
      featured: true,
    },
    {
      id: "guinness",
      institution: "GUINNESS WORLD RECORDS",
      name: "Récord mundial",
      description:
        "Al cómic colaborativo con la mayor cantidad de autores del mundo.",
      src: "assets/img/premios/premios__Guinness.png",
      alt: "Guinness World Records",
      featured: true,
    },
    {
      id: "tato",
      institution: "CAPIT",
      name: "Premio Tato",
      description:
        "Mejor programa infantil, por la serie Los Creadores (2017).",
      src: "assets/img/premios/tato.webp",
      alt: "Premio Tato",
      featured: true,
      logoSize: "small",
    },
    {
      id: "parents",
      institution: "PARENTS' CHOICE FOUNDATION",
      name: "Parents' Choice Awards",
      description:
        "Sello de calidad otorgado a productos educativos para chicos y familias.",
      src: "assets/img/premios/premios__parents.png",
      alt: "Parents' Choice",
      featured: false,
    },
    {
      id: "sadosky",
      institution: "CESSI",
      name: "Sadosky de Oro",
      description:
        "A la trayectoria empresarial y a la mejor solución de innovación tecnológica aplicada a la educación (2015).",
      src: "assets/img/premios/premios__Sadosky.png",
      alt: "Premios Sadosky",
      featured: false,
    },
    {
      id: "wsa",
      institution: "WORLD SUMMIT AWARDS",
      name: "Innovación educativa",
      description:
        "Otorgado por la ONU al Programa de Alfabetización Digital (2005).",
      src: "assets/img/premios/premios__wsa.png",
      alt: "World Summit Award",
      featured: false,
      logoSize: "large",
    },
    {
      id: "martinfierro",
      institution: "APTRA",
      name: "Premio Martín Fierro",
      description:
        "Mejor programa infantil por la serie transmedia Los Creadores (2016).",
      src: "assets/img/premios/martin-fierro.jpg",
      alt: "Premio Martín Fierro",
      featured: false,
    },
  ];

  const featuredEl = document.getElementById("reconocimientos-featured");
  const secondaryEl = document.getElementById("reconocimientos-secondary");
  const mobileRailEl = document.getElementById("reconocimientos-mobile-rail");
  if (!featuredEl || !secondaryEl || !mobileRailEl) return;

  function buildAwardCard(item) {
    const card = document.createElement("div");
    card.className =
      "award-card " +
      (item.featured ? "award-card--featured" : "award-card--secondary");
    card.setAttribute("role", "listitem");
    card.setAttribute("data-reveal-card", "");

    const stage = document.createElement("div");
    stage.className = "award-logo-stage";
    if (item.logoSize === "small") stage.classList.add("is-small");
    else if (item.logoSize === "large") stage.classList.add("is-large");

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    stage.appendChild(img);

    const body = document.createElement("div");
    body.className = "award-body";

    const institution = document.createElement("div");
    institution.className = "award-institution";
    institution.textContent = item.institution;

    const name = document.createElement("h3");
    name.className = "award-name";
    name.textContent = item.name;

    const description = document.createElement("div");
    description.className = "award-description";
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

// Creaciones con IA — galeria masonry: coleccion centralizada de datos,
// render de columnas (con clonado controlado para el loop) y lightbox
// accesible. Mecanismo copiado tal cual del sitio hermano Entre Rios
// (referencia/) — mismas 4 columnas verticales con loop infinito por CSS,
// mismo lightbox; solo cambian los datos (CREACIONES_ITEMS, con las 17
// creaciones reales de Mendoza) y el reparto en columnas.
(() => {
  const GAL = "assets/img/creaciones/";
  // Cada pieza comunica: area curricular · categoria (formato/soporte) · que
  // demuestra sobre el aprendizaje. Se renderiza siempre visible (no solo al
  // hover) para que funcione igual en mobile/touch.
  const CREACIONES_ITEMS = [
    {
      src: GAL + "01.png",
      alt: "Documento interactivo sobre el uso crítico y responsable de la inteligencia artificial",
      categoria: "Presentación interactiva",
      titulo: "El arte de preguntar a la IA",
      area: "Tecnología y Ciudadanía Digital",
      demuestra:
        "Formulación de preguntas y consignas claras, uso responsable de la inteligencia artificial, revisión crítica de respuestas, detección de errores y sesgos, cuidado de la privacidad y toma de decisiones fundamentadas.",
    },
    {
      src: GAL + "02.png",
      alt: "Historieta educativa sobre Lionel investigando con inteligencia artificial",
      categoria: "Historieta educativa",
      titulo: "Lionel y la inteligencia artificial",
      area: "Tecnología y Ambiente",
      demuestra:
        "Uso de la IA como apoyo para investigar, contraste de fuentes confiables, identificación y corrección de información inexacta, análisis de problemáticas ambientales y construcción de conclusiones propias.",
    },
    {
      src: GAL + "03.png",
      alt: "Línea de tiempo ilustrada del proceso de independencia argentina",
      categoria: "Línea de tiempo",
      titulo: "De la Ilustración a la Independencia",
      area: "Historia",
      demuestra:
        "Relación cronológica entre la Ilustración, la Independencia de Estados Unidos, la Revolución Francesa, el Virreinato del Río de la Plata, las Invasiones Inglesas, la Revolución de Mayo y la Independencia argentina.",
    },
    {
      src: GAL + "04.png",
      alt: "Mapa conceptual sobre nacionalismo, regionalismo y localismo",
      categoria: "Mapa conceptual",
      titulo: "Identidad, cultura y territorio",
      area: "Geografía y Ciencias Sociales",
      demuestra:
        "Comprensión de las distintas escalas de pertenencia territorial, construcción de identidades colectivas, diversidad cultural y relaciones entre nacionalismo, regionalismo y localismo, incluyendo formas de convivencia y tensión.",
    },
    {
      src: GAL + "05.png",
      alt: "Infografía sobre el uso crítico, controlado y responsable de la inteligencia artificial",
      categoria: "Infografía",
      titulo: "Criterio, control y responsabilidad frente a la IA",
      area: "Tecnología y Ciudadanía Digital",
      demuestra:
        "Capacidad para decidir cuándo usar IA, preguntar con un propósito definido, revisar sus respuestas, reconocer sesgos, errores y riesgos de privacidad, verificar la información y asumir la decisión final como responsabilidad humana.",
    },
    {
      src: GAL + "06.png",
      alt: "Afiche artístico de un semáforo mental asociado con sonidos y emociones",
      categoria: "Afiche",
      titulo: "Semáforo mental",
      area: "Educación Emocional y Música",
      demuestra:
        "Reconocimiento de estados emocionales mediante la metáfora del semáforo, identificación de señales de pausa, alerta y avance, percepción de estímulos sonoros y desarrollo de estrategias de autorregulación.",
    },
    {
      src: GAL + "07.png",
      alt: "Infografía histórica sobre la última dictadura militar argentina",
      categoria: "Infografía histórica",
      titulo: "Memoria, verdad y justicia",
      area: "Historia y Construcción de Ciudadanía",
      demuestra:
        "Comprensión del golpe de Estado del 24 de marzo de 1976, la dictadura y el terrorismo de Estado, las desapariciones forzadas, la lucha de los organismos de derechos humanos y el valor de la memoria para la vida democrática.",
    },
    {
      src: GAL + "08.png",
      alt: "Comparación gráfica entre una función afín y una función cuadrática",
      categoria: "Cuadro comparativo",
      titulo: "Función afín y función cuadrática",
      area: "Matemática",
      demuestra:
        "Diferenciación entre rectas y parábolas, interpretación de pendiente y ordenada al origen, identificación de raíces, vértice y eje de simetría, y análisis del discriminante de una función cuadrática.",
    },
    {
      src: GAL + "09.png",
      alt: "Diagrama de Venn aplicado a conjuntos de música y deportes",
      categoria: "Diagrama de Venn",
      titulo: "Teoría de conjuntos",
      area: "Matemática",
      demuestra:
        "Representación de conjuntos mediante diagramas de Venn, reconocimiento del universo, pertenencia, intersección y diferencia, y clasificación de elementos según propiedades compartidas.",
    },
    {
      src: GAL + "10.png",
      alt: "Infografía paso a paso para resolver una división con números decimales",
      categoria: "Infografía",
      titulo: "División con decimales",
      area: "Matemática",
      demuestra:
        "Comprensión del procedimiento para dividir por un número decimal, transformación del divisor en entero, aplicación de operaciones equivalentes, resolución del cálculo y comprobación del resultado mediante la multiplicación.",
    },
    {
      src: GAL + "11.jpg",
      alt: "Mapa mental sobre la conquista de América",
      categoria: "Mapa mental",
      titulo: "Conquista de América",
      area: "Historia",
      demuestra:
        "Organización de las causas, actores, procesos y consecuencias de la conquista, comprensión del contexto europeo y americano, reconocimiento de interpretaciones históricas y análisis del impacto sobre los pueblos originarios.",
    },
    {
      src: GAL + "12.png",
      alt: "Cuadro comparativo ilustrado de las teorías evolutivas de Lamarck y Darwin",
      categoria: "Cuadro comparativo",
      titulo: "Lamarck y Darwin: teorías de la evolución",
      area: "Biología",
      demuestra:
        "Comparación entre uso y desuso, herencia de caracteres adquiridos, variación heredable y selección natural, junto con la comprensión de genes, mutaciones, herencia, poblaciones y síntesis evolutiva moderna.",
    },
    {
      src: GAL + "13.png",
      alt: "Documento interactivo con mapas de los recursos naturales de América y Argentina",
      categoria: "Presentación interactiva",
      titulo: "Recursos naturales en América y Argentina",
      area: "Geografía y Ambiente",
      demuestra:
        "Identificación y localización de recursos naturales, diferenciación entre recursos renovables y no renovables, reconocimiento de su distribución territorial y análisis de su aprovechamiento e impacto ambiental.",
    },
    {
      src: GAL + "14.png",
      alt: "Infografía sobre los procesos y consecuencias de la conquista de América",
      categoria: "Infografía histórica",
      titulo: "Conquista de América: procesos y consecuencias",
      area: "Historia",
      demuestra:
        "Comprensión de la diversidad de los pueblos originarios antes de 1492, las rutas europeas, las conquistas y alianzas, las resistencias indígenas y las consecuencias demográficas, económicas, políticas, religiosas, lingüísticas y culturales.",
    },
    {
      src: GAL + "15.png",
      alt: "Producción sonora sobre la estructura del texto expositivo",
      categoria: "Producción sonora",
      titulo: "El texto expositivo",
      area: "Lengua y Literatura",
      demuestra:
        "Reconocimiento de la finalidad informativa del texto expositivo, organización de ideas en introducción, desarrollo y conclusión, producción de explicaciones claras y adaptación de un contenido escrito al lenguaje oral y sonoro.",
    },
    {
      src: GAL + "16.jpg",
      alt: "Línea de tiempo digital sobre la evolución de las problemáticas ambientales",
      categoria: "Línea de tiempo",
      titulo: "Línea del tiempo sobre la problemática ambiental",
      area: "Geografía y Ambiente",
      demuestra:
        "Organización cronológica de acontecimientos ambientales, reconocimiento de cambios en la relación entre sociedad y naturaleza, identificación de causas y consecuencias y comparación de problemáticas de Argentina y el mundo.",
    },
    {
      src: GAL + "17.png",
      alt: "Infografía sobre el Humanismo y el Renacimiento entre los siglos XIV y XVI",
      categoria: "Infografía histórica",
      titulo: "Humanismo y Renacimiento",
      area: "Historia y Arte",
      demuestra:
        "Comprensión del paso de la Edad Media a la Modernidad, recuperación de la Antigüedad clásica, centralidad del ser humano y la razón, desarrollo de la ciencia y la observación, perspectiva artística, imprenta y difusión del conocimiento.",
    },
  ];
  const CREACIONES_COLUMN_LAYOUT = [
    { direction: "up", indices: [0, 4, 8, 12] },
    { direction: "down", indices: [1, 5, 9, 13] },
    { direction: "up", indices: [2, 6, 10, 14] },
    { direction: "down", indices: [3, 7, 11, 15, 16] },
  ];

  const columnsEl = document.getElementById("creaciones-columns");
  if (!columnsEl) return;

  function buildCard(index, isClone) {
    const item = CREACIONES_ITEMS[index];
    const wrap = document.createElement("div");
    wrap.className = "creaciones-item";
    wrap.setAttribute("role", "listitem");

    const frame = document.createElement("button");
    frame.type = "button";
    frame.className = "creaciones-frame";
    frame.dataset.index = String(index);
    frame.setAttribute(
      "aria-label",
      'Ver "' +
        item.titulo +
        '" — ' +
        item.area +
        " · " +
        item.categoria +
        ". Demuestra: " +
        item.demuestra,
    );

    // Los clones (para el loop visual infinito) son el mismo contenido
    // repetido: se ocultan del lector de pantalla y se sacan del tab order,
    // sin afectar el click ni la animacion.
    if (isClone) {
      wrap.setAttribute("aria-hidden", "true");
      frame.tabIndex = -1;
    }

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";

    const meta = document.createElement("div");
    meta.className = "creaciones-meta";

    const primary = document.createElement("div");
    primary.className = "creaciones-meta-primary";
    primary.textContent = item.area + " · " + item.categoria;

    const proof = document.createElement("div");
    proof.className = "creaciones-meta-proof";
    proof.textContent = "Demuestra: " + item.demuestra;

    meta.append(primary, proof);
    frame.append(img, meta);
    wrap.appendChild(frame);
    return wrap;
  }

  CREACIONES_COLUMN_LAYOUT.forEach((colDef) => {
    const col = document.createElement("div");
    col.className = "creaciones-col creaciones-col-" + colDef.direction;
    const track = document.createElement("div");
    track.className = "creaciones-col-track";

    colDef.indices.forEach((i) => track.appendChild(buildCard(i, false)));
    // Clonado controlado: misma coleccion, mismo orden, para el loop infinito sin saltos.
    colDef.indices.forEach((i) => track.appendChild(buildCard(i, true)));

    col.appendChild(track);
    columnsEl.appendChild(col);
  });

  // Lightbox
  const lightbox = document.getElementById("creaciones-lightbox");
  const lightboxImg = document.getElementById("creaciones-lightbox-img");
  const lightboxCaption = document.getElementById(
    "creaciones-lightbox-caption",
  );
  const prevBtn = lightbox
    ? lightbox.querySelector(".creaciones-lightbox-prev")
    : null;
  const nextBtn = lightbox
    ? lightbox.querySelector(".creaciones-lightbox-next")
    : null;
  let currentIndex = 0;

  function renderLightbox() {
    const item = CREACIONES_ITEMS[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.innerHTML =
      '<div class="creaciones-lightbox-title">' + item.titulo + "</div>" +
      '<div class="creaciones-lightbox-tag">' + item.area + " · " + item.categoria + "</div>" +
      '<p class="creaciones-lightbox-desc">' + item.demuestra + "</p>";
  }

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showRelative(delta) {
    currentIndex =
      (currentIndex + delta + CREACIONES_ITEMS.length) %
      CREACIONES_ITEMS.length;
    renderLightbox();
  }

  if (lightbox) {
    columnsEl.addEventListener("click", (e) => {
      const frame = e.target.closest(".creaciones-frame");
      if (!frame) return;
      openLightbox(Number(frame.dataset.index));
    });

    lightbox.querySelectorAll("[data-creaciones-dismiss]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });
    prevBtn.addEventListener("click", () => showRelative(-1));
    nextBtn.addEventListener("click", () => showRelative(1));

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showRelative(-1);
      else if (e.key === "ArrowRight") showRelative(1);
    });
  }
})();

// Hero video source — el atributo media="" en <source> de <video> (a
// diferencia de <picture>) se evalua una sola vez, cuando el navegador elige
// la fuente al cargar el elemento, y NO se re-evalua si la ventana cambia de
// ancho despues (herramientas de preview multi-resolucion, o alguien
// resizeando el browser, pueden quedar con el video "equivocado" pegado).
// Esto fuerza la fuente correcta activamente cada vez que se cruza el
// breakpoint de 900px, en vez de confiar solo en la seleccion inicial del
// <source> estatico (que igual queda como fallback si JS no corre).
(() => {
  const video = document.getElementById("hero-video");
  if (!video) return;
  const MOBILE_SRC = "assets/videos/Mendoza-Vertical.mp4";
  const DESKTOP_SRC = "assets/videos/Intro-Mendoza-Hori.mp4";
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
  window.addEventListener("resize", syncHeroVideoSource, { passive: true });
})();

// Hero bottom fade (desktop). El video (panoramico) va siempre a
// width:100%/height:auto anclado arriba dentro de un hero a 100svh (nunca se
// recorta), lo que deja un hueco debajo del video que ya se ve del color
// correcto (fondo propio de #hero-section); esto mide ese hueco real entre
// el hero y el video y reubica/redimensiona el degrade para que la costura
// no se note. En mobile (<=900px) el degrade lo resuelve el CSS solo
// (ver style.css, #hero-bottom-fade con !important) — no calcular aca.
(() => {
  const heroSection = document.getElementById("hero-section");
  const video = document.getElementById("hero-video");
  const fadeEl = document.getElementById("hero-bottom-fade");
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

    fadeEl.style.height = totalHeight + "px";
    fadeEl.style.background = `linear-gradient(to bottom,rgba(var(--bg-dark-2-rgb),0) 0%,var(--bg-dark-2) ${blendPct}%,var(--bg-dark-1) 100%)`;
  }

  video.addEventListener("loadedmetadata", updateFade);
  video.addEventListener("canplay", updateFade);
  window.addEventListener("resize", updateFade);
  updateFade();
  // Reintentos escalonados por si el video tarda en reportar su tamaño
  // real (con el guard de arriba, los intentos tempranos no rompen nada,
  // solo no hacen efecto hasta que haya altura real que medir).
  [100, 300, 800, 1500].forEach((ms) => setTimeout(updateFade, ms));
})();
