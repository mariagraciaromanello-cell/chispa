/* =========================================================
   CHISPA — script.js
   =========================================================
   Índice:
   1. URLs de las miniapps (EDITAR ACÁ cuando tengas las URLs finales)
   2. Datos de las miniapps
   3. Render de las tarjetas de miniapps
   4. Menú de navegación (celular)
   5. Botón "Próximamente" (sin acción todavía)
   6. Animación de aparición de tarjetas
   ========================================================= */

/* ---------------------------------------------------------
   1. URLs DE LAS MINIAPPS
   ---------------------------------------------------------
   IMPORTANTE: reemplazar estos valores cuando tengamos las
   URLs definitivas de GitHub Pages de cada miniapp.
   No se inventó ninguna URL real: son placeholders.
--------------------------------------------------------- */
const URL_REGALA_BIEN = "URL_REGALA_BIEN";
const URL_LA_RULETA = "URL_LA_RULETA";
const URL_CUANTO_ME_CUESTA = "URL_CUANTO_ME_CUESTA";
const URL_MI_CUENTA = "URL_MI_CUENTA";

/* ---------------------------------------------------------
   2. DATOS DE LAS MINIAPPS
   ---------------------------------------------------------
   Estructura pensada para poder agregar nuevas miniapps
   fácilmente en el futuro, sin tocar el HTML.
   "accent" es el color de acento de cada tarjeta (una de
   las variables definidas en styles.css).
--------------------------------------------------------- */
const miniapps = [
  {
    icono: "🎁",
    nombre: "Regalá bien",
    descripcion: "Encontrá ideas de regalos según la persona, la ocasión, tu presupuesto y sus gustos.",
    boton: "Abrir Regalá bien",
    url: URL_REGALA_BIEN,
    accent: "var(--color-spark-2)"
  },
  {
    icono: "🎡",
    nombre: "Que la suerte decida",
    tagline: "Menos vueltas. Una decisión.",
    descripcion: "Cuando no sabés qué elegir, poné las opciones y dejá que la ruleta tome la decisión.",
    boton: "Abrir la ruleta",
    url: URL_LA_RULETA,
    accent: "var(--color-teal)"
  },
  {
    icono: "🧮",
    nombre: "¿Cuánto me cuesta?",
    descripcion: "Calculá cuánto te cuesta hacer, cocinar o producir algo y conocé su costo por unidad.",
    boton: "Abrir calculadora",
    url: URL_CUANTO_ME_CUESTA,
    accent: "var(--color-spark-1)"
  },
  {
    icono: "🧾",
    nombre: "Mi cuenta",
    descripcion: "Dividí una cuenta fácilmente y calculá cuánto corresponde pagar a cada persona.",
    boton: "Abrir Mi cuenta",
    url: URL_MI_CUENTA,
    accent: "var(--color-spark-2)"
  }
];

/* ---------------------------------------------------------
   3. RENDER DE LAS TARJETAS DE MINIAPPS
--------------------------------------------------------- */
function crearTarjetaMiniapp(miniapp) {
  const card = document.createElement("article");
  card.className = "miniapp-card";
  card.style.setProperty("--card-accent", miniapp.accent);

  const icono = document.createElement("div");
  icono.className = "miniapp-icon";
  icono.setAttribute("aria-hidden", "true");
  icono.textContent = miniapp.icono;
  card.appendChild(icono);

  const nombre = document.createElement("h3");
  nombre.className = "miniapp-name";
  nombre.textContent = miniapp.nombre;
  card.appendChild(nombre);

  if (miniapp.tagline) {
    const tagline = document.createElement("p");
    tagline.className = "miniapp-tagline";
    tagline.textContent = miniapp.tagline;
    card.appendChild(tagline);
  }

  const descripcion = document.createElement("p");
  descripcion.className = "miniapp-desc";
  descripcion.textContent = miniapp.descripcion;
  card.appendChild(descripcion);

  const boton = document.createElement("a");
  boton.className = "btn-card";
  boton.href = miniapp.url;
  boton.textContent = miniapp.boton;
  boton.setAttribute("aria-label", miniapp.boton + " (" + miniapp.nombre + ")");

  // Los placeholders (URL_...) todavía no son enlaces reales:
  // evitamos que intenten navegar y avisamos en consola.
  const esPlaceholder = miniapp.url && miniapp.url.startsWith("URL_");
  if (esPlaceholder) {
    boton.setAttribute("aria-disabled", "true");
    boton.addEventListener("click", function (evento) {
      evento.preventDefault();
      console.info(
        "CHISPA: falta configurar la URL real de '" + miniapp.nombre +
        "'. Reemplazá " + miniapp.url + " en script.js."
      );
    });
  } else {
    boton.target = "_blank";
    boton.rel = "noopener noreferrer";
  }

  card.appendChild(boton);
  return card;
}

function renderizarMiniapps() {
  const contenedor = document.getElementById("miniappsGrid");
  if (!contenedor) return;

  miniapps.forEach(function (miniapp) {
    contenedor.appendChild(crearTarjetaMiniapp(miniapp));
  });
}

/* ---------------------------------------------------------
   4. MENÚ DE NAVEGACIÓN (CELULAR)
--------------------------------------------------------- */
function inicializarNavegacion() {
  const boton = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (!boton || !nav) return;

  function cerrarMenu() {
    boton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  function alternarMenu() {
    const abierto = boton.getAttribute("aria-expanded") === "true";
    boton.setAttribute("aria-expanded", String(!abierto));
    nav.classList.toggle("is-open", !abierto);
  }

  boton.addEventListener("click", alternarMenu);

  // Cerrar el menú al elegir un enlace (comodidad en celular).
  nav.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", cerrarMenu);
  });

  // Cerrar el menú si la pantalla pasa a tamaño de escritorio.
  const mediaEscritorio = window.matchMedia("(min-width: 900px)");
  mediaEscritorio.addEventListener("change", function (evento) {
    if (evento.matches) cerrarMenu();
  });
}

/* ---------------------------------------------------------
   5. BOTÓN "PRÓXIMAMENTE"
   ---------------------------------------------------------
   Por ahora no realiza ninguna acción, tal como se pidió.
   Queda preparado para convertirse en "Crear mi Chispa"
   en una futura versión.
--------------------------------------------------------- */
function inicializarBotonProximamente() {
  const boton = document.getElementById("proximamenteBtn");
  if (!boton) return;

  boton.addEventListener("click", function () {
    // Intencionalmente sin acción en la Etapa 1.
  });
}

/* ---------------------------------------------------------
   6. ANIMACIÓN DE APARICIÓN DE TARJETAS
   ---------------------------------------------------------
   Usa IntersectionObserver para revelar las tarjetas al
   entrar en pantalla. Respeta prefers-reduced-motion.
--------------------------------------------------------- */
function inicializarAnimacionTarjetas() {
  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const tarjetas = document.querySelectorAll(".miniapp-card");

  if (prefiereMenosMovimiento || !("IntersectionObserver" in window)) {
    tarjetas.forEach(function (tarjeta) {
      tarjeta.classList.add("is-visible");
    });
    return;
  }

  const observador = new IntersectionObserver(
    function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  tarjetas.forEach(function (tarjeta) {
    observador.observe(tarjeta);
  });
}

/* ---------------------------------------------------------
   INICIALIZACIÓN
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  renderizarMiniapps();
  inicializarNavegacion();
  inicializarBotonProximamente();
  inicializarAnimacionTarjetas();
});
