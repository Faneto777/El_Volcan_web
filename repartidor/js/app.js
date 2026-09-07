const ESTADOS_PEDIDO = {
    pendiente: "Pendiente",
    "en camino": "En camino",
    entregado: "Entregado",
};

function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

function notificarRepartidor(mensaje, error) {
    let aviso = document.getElementById("notificacionRepartidor");
    if (!aviso) {
        aviso = document.createElement("div");
        aviso.id = "notificacionRepartidor";
        aviso.className = "notificacion-repartidor";
        document.body.appendChild(aviso);
    }
    aviso.textContent = mensaje;
    aviso.classList.toggle("error", Boolean(error));
    aviso.classList.add("visible");
    clearTimeout(aviso._temporizador);
    aviso._temporizador = setTimeout(() => {
        aviso.classList.remove("visible");
    }, 2600);
}

function configurarLoginRepartidor() {
    const formulario = document.getElementById("formLoginRepartidor");
    if (!formulario) return;

    if (typeof configurarFormulario === "function") {
        configurarFormulario(formulario, "", (form) => {
            const email = form.querySelector('[name="email"]').value.trim();
            const password = form.querySelector('[name="password"]').value;
            const aviso = form.querySelector(".mensaje-exito");
            const usuarios = leerUsuariosRepartidor();
            const usuario = usuarios.find(
                (u) => String(u.email).toLowerCase() === String(email).toLowerCase()
            );
            if (usuario && usuario.password === password && usuario.activo !== false) {
                localStorage.setItem(
                    REPARTIDOR_SESION_KEY,
                    JSON.stringify({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: "repartidor" })
                );
                aviso.className = "mensaje-exito visible";
                aviso.textContent = "Sesión iniciada. Cargando tus entregas...";
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 800);
            } else {
                aviso.className = "mensaje-exito visible error";
                aviso.textContent = "Correo o contraseña incorrectos. Usa la cuenta de prueba.";
            }
        });
    }

    const botonDemo = document.getElementById("btnUsarDemoRepartidor");
    if (botonDemo) {
        botonDemo.addEventListener("click", () => {
            formulario.querySelector('[name="email"]').value = "repartidordemo@gmail.com";
            formulario.querySelector('[name="password"]').value = "demo123";
            formulario.requestSubmit();
        });
    }
}

function misPedidos(sesion) {
    return leerPedidos().filter((pedido) => pedido.repartidorId === sesion.id);
}

function renderizarPedidos(sesion) {
    const lista = document.getElementById("listaPedidos");
    const avisoVacio = document.getElementById("avisoVacio");
    const contador = document.getElementById("contadorPedidos");
    if (!lista) return;

    const pedidos = misPedidos(sesion);
    contador.textContent = pedidos.length;
    avisoVacio.hidden = pedidos.length > 0;
    if (pedidos.length === 0) {
        lista.innerHTML = "";
        return;
    }

    lista.innerHTML = pedidos
        .sort((a, b) => {
            if (a.estado === "entregado" && b.estado !== "entregado") return 1;
            if (b.estado === "entregado" && a.estado !== "entregado") return -1;
            return a.estado === "pendiente" && b.estado !== "pendiente" ? -1 : 0;
        })
        .map((pedido) => {
            const estado = ESTADOS_PEDIDO[pedido.estado] || pedido.estado;
            const boton =
                pedido.estado === "pendiente"
                    ? `<button type="button" class="boton-accion en-camino" data-id="${pedido.id}" data-estado="en camino">🚚 Marcar en camino</button>`
                    : pedido.estado === "en camino"
                      ? `<button type="button" class="boton-accion entregado" data-id="${pedido.id}" data-estado="entregado">✅ Marcar entregado</button>`
                      : `<span class="sello-entregado">✔ Entregado</span>`;
            return `
                <article class="tarjeta-pedido ${pedido.estado === "entregado" ? "pedido-finalizado" : ""}" data-id="${pedido.id}">
                    <header class="cabecera-pedido">
                        <span class="pedido-id">#${pedido.id}</span>
                        <span class="badge-estado estado-${pedido.estado.replace(" ", "-")}">${estado}</span>
                    </header>
                    <h3>${escaparHTML(pedido.cliente)}</h3>
                    <p class="direccion-pedido">📍 ${escaparHTML(pedido.direccion)} · ${escaparHTML(pedido.comuna)}</p>
                    <p class="detalle-pedido">${escaparHTML(pedido.productos)} · ${formatearPrecio(pedido.total)}</p>
                    <p class="fecha-pedido">🕐 ${escaparHTML(pedido.fecha)}</p>
                    <div class="acciones-pedido">
                        <a class="boton-comollegar" target="_blank" rel="noopener"
                           href="https://www.google.com/maps/dir/?api=1&destination=${pedido.lat},${pedido.lng}">
                            🧭 Cómo llegar
                        </a>
                        ${boton}
                    </div>
                </article>`;
        })
        .join("");
}

function cambiarEstadoPedido(id, nuevoEstado) {
    const pedidos = leerPedidos();
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;
    pedido.estado = nuevoEstado;
    guardarPedidos(pedidos);
    const sesion = obtenerSesionRepartidor();
    renderizarPedidos(sesion);
    actualizarMarcadores();
    notificarRepartidor(
        nuevoEstado === "entregado"
            ? `Pedido #${id} marcado como entregado.`
            : `Pedido #${id} en camino. ¡Buen viaje!`
    );
}

/* Menú hamburguesa y navegación */
function abrirMenu() {
    document.getElementById("menuLateral").classList.add("abierto");
    document.getElementById("overlayMenu").classList.add("visible");
    document.body.classList.add("menu-abierto");
}

function cerrarMenu() {
    document.getElementById("menuLateral").classList.remove("abierto");
    document.getElementById("overlayMenu").classList.remove("visible");
    document.body.classList.remove("menu-abierto");
}

function mostrarSeccion(nombre) {
    document.getElementById("seccionPedidos").classList.toggle("oculta", nombre !== "pedidos");
    document.getElementById("seccionMapa").classList.toggle("oculta", nombre !== "mapa");
    document.querySelectorAll(".item-menu, .item-inferior").forEach((boton) => {
        const accion = boton.dataset.accion;
        const activo =
            (nombre === "mapa" && (accion === "verMapa" || accion === "miUbicacion")) ||
            (nombre === "pedidos" && accion === "verPedidos");
        boton.classList.toggle("activo", activo);
    });
    if (nombre === "mapa") inicializarMapa();
    cerrarMenu();
}

/* Mapa Leaflet + GPS */
let mapa = null;
let capaMarcadores = null;
let marcadorGps = null;

function inicializarMapa() {
    const contenedor = document.getElementById("mapa");
    if (!contenedor || typeof L === "undefined") {
        const aviso = document.getElementById("avisoMapa");
        if (aviso) aviso.textContent = "No se pudo cargar el mapa. Revisa tu conexión a internet.";
        return;
    }
    if (mapa) {
        setTimeout(() => mapa.invalidateSize(), 50);
        return;
    }
    const sesion = obtenerSesionRepartidor();
    const pedidos = misPedidos(sesion);
    const primerPedido = pedidos.find((p) => p.estado !== "entregado") || pedidos[0];
    const centro = primerPedido ? [primerPedido.lat, primerPedido.lng] : [-36.6064, -72.1034];

    mapa = L.map("mapa", { zoomControl: true }).setView(centro, 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);

    const iconoPedido = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    capaMarcadores = L.layerGroup().addTo(mapa);
    actualizarMarcadores(iconoPedido);
    setTimeout(() => mapa.invalidateSize(), 150);
}

function actualizarMarcadores(icono) {
    if (!mapa || !capaMarcadores) return;
    const sesion = obtenerSesionRepartidor();
    if (!sesion) return;
    const iconoPedido = icono || {
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    };

    capaMarcadores.clearLayers();
    misPedidos(sesion)
        .filter((pedido) => pedido.estado !== "entregado")
        .forEach((pedido) => {
            const color = pedido.estado === "en camino" ? "#ff6b2b" : "#0d2b45";
            const marcador = L.circleMarker([pedido.lat, pedido.lng], {
                radius: 10,
                color: "#ffffff",
                weight: 2,
                fillColor: color,
                fillOpacity: 1,
            });
            marcador.bindPopup(
                `<strong>#${pedido.id} · ${escaparHTML(pedido.cliente)}</strong><br>` +
                    `${escaparHTML(pedido.direccion)}<br>` +
                    `<a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${pedido.lat},${pedido.lng}">Cómo llegar</a>`
            );
            capaMarcadores.addLayer(marcador);
        });
}

function centrarGpsYMostrarMapa() {
    mostrarSeccion("mapa");
    const aviso = document.getElementById("avisoMapa");
    if (typeof navigator === "undefined" || !navigator.geolocation) {
        if (aviso) aviso.textContent = "Tu dispositivo no soporta geolocalización.";
        return;
    }
    if (aviso) aviso.textContent = "Buscando tu ubicación por GPS...";
    navigator.geolocation.getCurrentPosition(
        (posicion) => {
            const lat = posicion.coords.latitude;
            const lng = posicion.coords.longitude;
            inicializarMapa();
            if (!mapa) return;
            if (!marcadorGps) {
                marcadorGps = L.circleMarker([lat, lng], {
                    radius: 9,
                    color: "#2a9d4a",
                    weight: 3,
                    fillColor: "#2a9d4a",
                    fillOpacity: 0.85,
                })
                    .bindPopup("<strong>Tu ubicación</strong>")
                    .addTo(mapa);
            } else {
                marcadorGps.setLatLng([lat, lng]);
            }
            mapa.setView([lat, lng], 15);
            if (aviso)
                aviso.textContent =
                    "GPS activado. Toca los puntos azules de tus pedidos o usa «Cómo llegar» para la ruta.";
        },
        () => {
            if (aviso)
                aviso.textContent = "No se pudo obtener tu ubicación. Activa el GPS y el permiso de ubicación.";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
}

/* Arranque */
function iniciarPanelRepartidor(sesion) {
    document.getElementById("nombreRepartidor").textContent = sesion.nombre;
    document.getElementById("nombreMenu").textContent = sesion.nombre;
    document.getElementById("emailMenu").textContent = sesion.email;

    renderizarPedidos(sesion);

    document.getElementById("btnAbrirMenu").addEventListener("click", abrirMenu);
    document.getElementById("overlayMenu").addEventListener("click", cerrarMenu);

    document.querySelectorAll(".item-menu, .item-inferior").forEach((boton) => {
        boton.addEventListener("click", () => {
            if (boton.dataset.accion === "verPedidos") mostrarSeccion("pedidos");
            if (boton.dataset.accion === "verMapa") mostrarSeccion("mapa");
            if (boton.dataset.accion === "miUbicacion") centrarGpsYMostrarMapa();
        });
    });

    document.getElementById("btnGps").addEventListener("click", centrarGpsYMostrarMapa);

    document.getElementById("btnCerrarSesionRep").addEventListener("click", () => {
        localStorage.removeItem(REPARTIDOR_SESION_KEY);
        window.location.href = "login.html";
    });

    document.getElementById("listaPedidos").addEventListener("click", (evento) => {
        const boton = evento.target.closest(".boton-accion");
        if (!boton) return;
        cambiarEstadoPedido(Number(boton.dataset.id), boton.dataset.estado);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("formLoginRepartidor")) {
        configurarLoginRepartidor();
        return;
    }
    const sesion = obtenerSesionRepartidor();
    if (!sesion || !sesion.id) {
        window.location.href = "login.html";
        return;
    }
    if (!leerUsuariosRepartidor().some((u) => u.id === sesion.id)) {
        localStorage.removeItem(REPARTIDOR_SESION_KEY);
        window.location.href = "login.html";
        return;
    }
    iniciarPanelRepartidor(sesion);
});