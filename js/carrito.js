const CLAVE_CARRITO = "elvolcan_carrito";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function mostrarNotificacion(mensaje) {
  let aviso = $("#notificacion");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "notificacion";
    aviso.className = "notificacion";
    document.body.appendChild(aviso);
  }
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  clearTimeout(aviso._temporizador);
  aviso._temporizador = setTimeout(() => {
    aviso.classList.remove("visible");
  }, 2400);
}

function actualizarBadge() {
  const badge = $("#badgeCarrito");
  if (!badge) return;
  const carrito = leerCarrito();
  const totalUnidades = carrito.reduce((total, item) => total + item.cantidad, 0);
  badge.textContent = totalUnidades;
  badge.classList.toggle("oculto", totalUnidades === 0);
}

function encontrarProducto(productoId) {
  const botones = $$(".btn-agregar-carrito");
  for (const boton of botones) {
    if (boton.dataset.id === String(productoId)) {
      return {
        id: boton.dataset.id,
        nombre: boton.dataset.nombre,
        precio: parseFloat(boton.dataset.precio) || 0,
        imagen: boton.dataset.imagen || "",
        emoji: boton.dataset.emoji || "balon",
      };
    }
  }
  return null;
}

function agregarAlCarrito(productoId) {
  const producto = encontrarProducto(productoId);
  if (!producto) {
    mostrarNotificacion("No se encontró el producto.");
    return;
  }
  const carrito = leerCarrito();
  const existente = carrito.find((item) => String(item.id) === String(producto.id));
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito(carrito);
  actualizarBadge();
  renderizarCarrito();
  mostrarNotificacion(`${producto.nombre} agregado al carrito.`);
}

function cambiarCantidad(productoId, delta) {
  const carrito = leerCarrito();
  const item = carrito.find((elemento) => String(elemento.id) === String(productoId));
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) {
    return eliminarDelCarrito(productoId);
  }
  guardarCarrito(carrito);
  actualizarBadge();
  renderizarCarrito();
}

function eliminarDelCarrito(productoId) {
  let carrito = leerCarrito();
  carrito = carrito.filter((item) => String(item.id) !== String(productoId));
  guardarCarrito(carrito);
  actualizarBadge();
  renderizarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem(CLAVE_CARRITO);
  actualizarBadge();
  renderizarCarrito();
}

function emojiPara(tipoImagen) {
  const tipos = {
    balon: "\uD83D\uDEE2",
    anafe: "\uD83C\uDF73",
    cocina: "\uD83D\uDD25",
    regulador: "\uD83D\uDD27",
    manguera: "\uD83C\uDF00",
    abrazadera: "\uD83D\uDD29",
    kit: "\uD83E\uDDF0",
    carro: "\uD83D\uDEDE",
    tapa: "\uD83D\uDEE1",
    detector: "\uD83D\uDCE1",
  };
  return tipos[tipoImagen] || "\uD83D\uDEE2";
}

function renderizarCarrito() {
  const contenedor = $("#listaCarrito");
  if (!contenedor) return;
  const carrito = leerCarrito();
  const vacio = $("#carritoVacio");

  if (carrito.length === 0) {
    contenedor.innerHTML = "";
    if (vacio) vacio.style.display = "";
    actualizarTotales();
    return;
  }

  if (vacio) vacio.style.display = "none";

  contenedor.innerHTML = carrito
    .map(
      (item) => `
      <div class="item-carrito">
        <div class="item-imagen">
          <img src="${escaparHTML(item.imagen)}" alt="${escaparHTML(item.nombre)}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <span style="display:none;">${emojiPara(item.emoji)}</span>
        </div>
        <div class="item-info">
          <h3>${escaparHTML(item.nombre)}</h3>
          <p class="precio-unitario">${formatearPrecio(item.precio)}</p>
          <p>Subtotal: ${formatearPrecio(item.precio * item.cantidad)}</p>
        </div>
        <div class="item-acciones">
          <div class="controles-cantidad">
            <button type="button" data-accion="restar" data-id="${escaparHTML(item.id)}" aria-label="Restar">−</button>
            <span>${item.cantidad}</span>
            <button type="button" data-accion="sumar" data-id="${escaparHTML(item.id)}" aria-label="Sumar">+</button>
          </div>
          <button type="button" class="boton-eliminar-item" data-accion="eliminar" data-id="${escaparHTML(item.id)}">Eliminar</button>
        </div>
      </div>`
    )
    .join("");

  actualizarTotales();
}

function actualizarTotales() {
  const carrito = leerCarrito();
  const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
  const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  const elCantidad = $("#totalUnidades");
  const elSubtotal = $("#totalSubtotal");
  const elTotal = $("#totalFinal");
  const botonComprar = $("#btnFinalizarCompra");
  const botonVaciar = $("#btnVaciarCarrito");

  if (elCantidad) elCantidad.textContent = cantidad;
  if (elSubtotal) elSubtotal.textContent = formatearPrecio(subtotal);
  if (elTotal) elTotal.textContent = formatearPrecio(subtotal);

  if (botonComprar) botonComprar.disabled = carrito.length === 0;
  if (botonVaciar) botonVaciar.disabled = carrito.length === 0;
}

function abrirCarrito() {
  const overlay = $("#overlayCarrito");
  if (overlay) overlay.classList.add("abierto");
}

function cerrarCarrito() {
  const overlay = $("#overlayCarrito");
  if (overlay) overlay.classList.remove("abierto");
}

function finalizarCompra() {
  const carrito = leerCarrito();
  if (carrito.length === 0) {
    mostrarNotificacion("Tu carrito está vacío.");
    return;
  }
  if (!estaLogueado()) {
    cerrarCarrito();
    mostrarNotificacion("Debes iniciar sesión para finalizar tu compra.");
    setTimeout(() => {
      window.location.href = urlLoginConRedireccion();
    }, 900);
    return;
  }
  vaciarCarrito();
  cerrarCarrito();
  mostrarNotificacion("Pedido recibido. Te contactaremos para coordinar el despacho.");
}

function configurarEventos() {
  document.addEventListener("click", (evento) => {
    const botonAgregar = evento.target.closest(".btn-agregar-carrito");
    if (botonAgregar) {
      agregarAlCarrito(botonAgregar.dataset.id);
      return;
    }

    const botonCarrito = evento.target.closest("#btnAbrirCarrito");
    if (botonCarrito) {
      abrirCarrito();
      return;
    }

    const botonCerrar = evento.target.closest("#btnCerrarCarrito");
    if (botonCerrar) {
      cerrarCarrito();
      return;
    }

    if (evento.target.classList.contains("overlay-carrito")) {
      cerrarCarrito();
      return;
    }

    const botonAccion = evento.target.closest("[data-accion]");
    if (botonAccion) {
      if (!botonAccion.closest("#listaCarrito")) return;
      const id = botonAccion.dataset.id;
      const accion = botonAccion.dataset.accion;
      if (accion === "sumar") cambiarCantidad(id, 1);
      if (accion === "restar") cambiarCantidad(id, -1);
      if (accion === "eliminar") eliminarDelCarrito(id);
      return;
    }

    const botonVaciar = evento.target.closest("#btnVaciarCarrito");
    if (botonVaciar) {
      vaciarCarrito();
      mostrarNotificacion("Carrito vaciado.");
      return;
    }

    const botonFinalizar = evento.target.closest("#btnFinalizarCompra");
    if (botonFinalizar) {
      finalizarCompra();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarCarrito();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarEventos();
  actualizarBadge();
  renderizarCarrito();
});