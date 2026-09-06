const CLAVE_OPERADOR = "elvolcan_operador";
const CLAVE_PEDIDOS = "elvolcan_pedidos";
const CLAVE_REPARTIDORES = "elvolcan_repartidores";

const ESTADOS = {
  pendiente: { texto: "Pendiente", clase: "bg-pendiente" },
  asignado: { texto: "Asignado", clase: "bg-asignado" },
  camino: { texto: "En camino", clase: "bg-camino" },
  entregado: { texto: "Entregado", clase: "bg-entregado" },
};

const REPARTIDORES_DEFAULT = ["Carlos R.", "Pedro M."];

const PEDIDOS_DEFAULT = [
  {
    id: "001",
    cliente: "Ana García",
    direccion: "Av. Las Flores 123",
    cilindro: "11 kg",
    estado: "entregado",
    repartidor: "Carlos R.",
    lat: -36.601,
    lng: -72.105,
  },
  {
    id: "002",
    cliente: "Luis Torres",
    direccion: "Jr. Los Pinos 456",
    cilindro: "15 kg",
    estado: "camino",
    repartidor: "Pedro M.",
    lat: -36.612,
    lng: -72.098,
  },
  {
    id: "004",
    cliente: "Jorge Ruiz",
    direccion: "Urb. El Sol 22",
    cilindro: "11 kg",
    estado: "pendiente",
    repartidor: "",
    lat: -36.607,
    lng: -72.11,
  },
];

const REPARTIDORES_UBICACION = {
  "Carlos R.": [-36.6105, -72.099],
  "Pedro M.": [-36.6018, -72.106],
};

let mapaOperador = null;

function sesionOperadorActiva() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_OPERADOR));
    if (!datos) return false;
    const nombre = document.getElementById("nombreOperador");
    if (nombre && datos.nombre) nombre.textContent = datos.nombre;
    return true;
  } catch (error) {
    return false;
  }
}

function leerRepartidores() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_REPARTIDORES));
    if (Array.isArray(datos) && datos.length > 0) return datos;
  } catch (error) {}
  localStorage.setItem(CLAVE_REPARTIDORES, JSON.stringify(REPARTIDORES_DEFAULT));
  return REPARTIDORES_DEFAULT.slice();
}

function leerPedidos() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS));
    if (Array.isArray(datos)) return datos;
  } catch (error) {}
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(PEDIDOS_DEFAULT));
  return PEDIDOS_DEFAULT.slice();
}

function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
}

function actualizarTarjetas(pedidos) {
  const hoy = pedidos.length;
  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const enCamino = pedidos.filter((p) => p.estado === "camino").length;
  const entregados = pedidos.filter((p) => p.estado === "entregado").length;

  const elHoy = document.getElementById("tHoy");
  const elPendientes = document.getElementById("tPendientes");
  const elCamino = document.getElementById("tCamino");
  const elEntregados = document.getElementById("tEntregados");

  if (elHoy) elHoy.textContent = hoy;
  if (elPendientes) elPendientes.textContent = pendientes;
  if (elCamino) elCamino.textContent = enCamino;
  if (elEntregados) elEntregados.textContent = entregados;
}

function opcionesRepartidor(actual) {
  const repartidores = leerRepartidores();
  let html = '<option value="">Sin asignar</option>';
  repartidores.forEach((rep) => {
    const seleccion = rep === actual ? " selected" : "";
    html += `<option value="${rep}"${seleccion}>${rep}</option>`;
  });
  return html;
}

function renderizarTabla(pedidos) {
  const cuerpo = document.getElementById("tablaPedidos");
  if (!cuerpo) return;

  if (pedidos.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#777;">No hay pedidos registrados.</td></tr>';
    return;
  }

  cuerpo.innerHTML = pedidos
    .map((pedido) => {
      const estado = ESTADOS[pedido.estado] || ESTADOS.pendiente;
      return `
        <tr data-id="${pedido.id}">
          <td>${pedido.id}</td>
          <td>${pedido.cliente}</td>
          <td>${pedido.direccion}</td>
          <td>${pedido.cilindro}</td>
          <td>
            <select class="select-rep select-estado">
              ${Object.keys(ESTADOS)
                .map(
                  (clave) =>
                    `<option value="${clave}"${clave === pedido.estado ? " selected" : ""}>${ESTADOS[clave].texto}</option>`
                )
                .join("")}
            </select>
          </td>
          <td>
            <select class="select-rep select-repartidor">
              ${opcionesRepartidor(pedido.repartidor)}
            </select>
          </td>
        </tr>`;
    })
    .join("");
}

function renderizarMapa(pedidos) {
  const contenedor = document.getElementById("mapa-operador");
  if (!contenedor) return;
  if (typeof L === "undefined") return;

  if (mapaOperador) {
    mapaOperador.remove();
    mapaOperador = null;
  }

  mapaOperador = L.map("mapa-operador").setView([-36.6066, -72.1034], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(mapaOperador);

  pedidos.forEach((pedido) => {
    const colorIcono = {
      pendiente: "gray",
      asignado: "blue",
      camino: "orange",
      entregado: "green",
    }[pedido.estado] || "gray";

    const icono = L.divIcon({
      className: "marcador-pedido",
      html: `<span class="punto punto-${colorIcono}"></span>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([pedido.lat, pedido.lng], { icon: icono })
      .addTo(mapaOperador)
      .bindPopup(`<b>${pedido.cliente}</b><br>${pedido.cilindro} — ${ESTADOS[pedido.estado].texto}`);
  });

  Object.keys(REPARTIDORES_UBICACION).forEach((nombre) => {
    const pos = REPARTIDORES_UBICACION[nombre];
    const iconoCamion = L.divIcon({
      className: "marcador-camion",
      html: '<span class="camion">&#128666;</span>',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
    L.marker(pos, { icon: iconoCamion })
      .addTo(mapaOperador)
      .bindPopup(`<b>${nombre}</b><br>Camion repartidor`);
  });
}

function renderizar() {
  const pedidos = leerPedidos();
  actualizarTarjetas(pedidos);
  renderizarTabla(pedidos);
  renderizarMapa(pedidos);
}

function abrirModal() {
  const modal = document.getElementById("modalNuevoPedido");
  if (modal) modal.classList.add("abierto");
}

function cerrarModal() {
  const modal = document.getElementById("modalNuevoPedido");
  if (modal) modal.classList.remove("abierto");
}

function crearPedido(datos) {
  const pedidos = leerPedidos();
  const maxNumero = pedidos.reduce((max, p) => {
    const n = parseInt(p.id, 10);
    return Number.isNaN(n) ? max : Math.max(max, n);
  }, 0);
  const nuevo = {
    id: String(maxNumero + 1).padStart(3, "0"),
    cliente: datos.cliente,
    direccion: datos.direccion,
    cilindro: datos.cilindro,
    estado: "pendiente",
    repartidor: "",
    lat: -36.6066 + (Math.random() - 0.5) * 0.02,
    lng: -72.1034 + (Math.random() - 0.5) * 0.02,
  };
  pedidos.push(nuevo);
  guardarPedidos(pedidos);
  renderizar();
}

function configurarEventos() {
  const enlaceCerrar = document.querySelector('a[href="../cliente/login.html"]');
  if (enlaceCerrar) {
    enlaceCerrar.addEventListener("click", (evento) => {
      evento.preventDefault();
      localStorage.removeItem(CLAVE_OPERADOR);
      window.location.href = "../admin/login-admin.html";
    });
  }

  document.getElementById("btnNuevoPedido").addEventListener("click", abrirModal);
  document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
  document.getElementById("btnCancelar").addEventListener("click", cerrarModal);
  document.getElementById("overlayModal").addEventListener("click", (evento) => {
    if (evento.target.id === "overlayModal") cerrarModal();
  });

  document.getElementById("formNuevoPedido").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const formulario = evento.target;
    const datos = {
      cliente: formulario.querySelector('[name="cliente"]').value.trim(),
      direccion: formulario.querySelector('[name="direccion"]').value.trim(),
      cilindro: formulario.querySelector('[name="cilindro"]').value,
    };
    if (!datos.cliente || !datos.direccion || !datos.cilindro) return;
    crearPedido(datos);
    formulario.reset();
    cerrarModal();
  });

  document.getElementById("tablaPedidos").addEventListener("change", (evento) => {
    const fila = evento.target.closest("tr[data-id]");
    if (!fila) return;
    const id = fila.dataset.id;
    const pedidos = leerPedidos();
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;

    if (evento.target.classList.contains("select-estado")) {
      pedido.estado = evento.target.value;
    }
    if (evento.target.classList.contains("select-repartidor")) {
      pedido.repartidor = evento.target.value;
    }

    guardarPedidos(pedidos);
    actualizarTarjetas(pedidos);
    renderizarMapa(pedidos);
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!sesionOperadorActiva()) {
    window.location.href = "../admin/login-admin.html";
    return;
  }
  configurarEventos();
  renderizar();
});
