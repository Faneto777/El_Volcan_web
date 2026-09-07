const CLAVE_SESION_ADMIN = "elvolcan_sesion_admin";
const CLAVE_OPERADOR = "elvolcan_operador";
const CLAVE_PEDIDOS = "elvolcan_pedidos";
const CLAVE_REPARTIDORES = "elvolcan_repartidores";
const CLAVE_USUARIOS_REPARTIDOR = "elvolcan_usuarios_repartidor";
const CLAVE_CLIENTES = "elvolcan_usuarios";

const ESTADOS = {
  pendiente: { texto: "Pendiente", clase: "bg-pendiente" },
  asignado: { texto: "Asignado", clase: "bg-asignado" },
  camino: { texto: "En camino", clase: "bg-camino" },
  entregado: { texto: "Entregado", clase: "bg-entregado" },
};

const PRECIOS_CILINDROS = {
  "5 kg": 6990,
  "11 kg": 15990,
  "15 kg": 18990,
  "45 kg": 48990,
};

const REPARTIDORES_DEFAULT = ["Carlos R.", "Pedro M.", "Luis F."];

const USUARIOS_REPARTIDOR_DEFAULT = [
  { id: 1, nombre: "Repartidor Demo", email: "repartidordemo@gmail.com", password: "demo123", activo: true },
  { id: 2, nombre: "Luis Fuentes", email: "luis.fuentes@gmail.com", password: "demo123", activo: true },
  { id: 3, nombre: "Carlos Muñoz", email: "carlos.munoz@gmail.com", password: "demo123", activo: true },
];

const CUENTAS_FIJAS = [
  { nombre: "Administradora Demo", email: "administradora@gmail.com", rol: "administrador" },
  { nombre: "Juan Perez", email: "operador@gmail.com", rol: "operador" },
];

const PEDIDOS_DEFAULT = [
  {
    id: "001",
    cliente: "Ana García",
    direccion: "Av. O'Higgins 120, Chillán Centro",
    cilindro: "11 kg",
    estado: "entregado",
    repartidor: "Carlos R.",
    lat: -36.6035,
    lng: -72.101,
  },
  {
    id: "002",
    cliente: "Luis Torres",
    direccion: "El Roble 456, Chillán Centro",
    cilindro: "15 kg",
    estado: "camino",
    repartidor: "Pedro M.",
    lat: -36.606,
    lng: -72.1018,
  },
  {
    id: "003",
    cliente: "Jorge Ruiz",
    direccion: "Av. Ecuador 120, Chillán",
    cilindro: "5 kg",
    estado: "pendiente",
    repartidor: "",
    lat: -36.6026,
    lng: -72.09,
  },
  {
    id: "004",
    cliente: "María Fernanda Díaz",
    direccion: "Av. Alonso de Ercilla 780, Chillán Centro",
    cilindro: "15 kg",
    estado: "asignado",
    repartidor: "Carlos R.",
    lat: -36.6105,
    lng: -72.1068,
  },
  {
    id: "005",
    cliente: "Rodrigo Sepúlveda",
    direccion: "Av. Argentina 642, Chillán",
    cilindro: "11 kg",
    estado: "entregado",
    repartidor: "Pedro M.",
    lat: -36.6098,
    lng: -72.0945,
  },
  {
    id: "006",
    cliente: "Constanza Ríos",
    direccion: "Lautaro 320, Chillán Viejo",
    cilindro: "5 kg",
    estado: "camino",
    repartidor: "Luis F.",
    lat: -36.6248,
    lng: -72.135,
  },
];

let mapaAdmin = null;

function escapar(texto) {
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

function notificarAdmin(mensaje, error) {
  let aviso = document.getElementById("notificacionAdmin");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "notificacionAdmin";
    aviso.className = "notificacion-admin";
    document.body.appendChild(aviso);
  }
  aviso.textContent = mensaje;
  aviso.classList.toggle("error", Boolean(error));
  aviso.classList.add("visible");
  clearTimeout(aviso._temporizador);
  aviso._temporizador = setTimeout(() => aviso.classList.remove("visible"), 2600);
}

function sesionAdminActiva() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_SESION_ADMIN));
    return datos && datos.rol === "administrador";
  } catch (error) {
    return false;
  }
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

function leerNombresRepartidores() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_REPARTIDORES));
    if (Array.isArray(datos) && datos.length > 0) return datos;
  } catch (error) {}
  localStorage.setItem(CLAVE_REPARTIDORES, JSON.stringify(REPARTIDORES_DEFAULT));
  return REPARTIDORES_DEFAULT.slice();
}

function guardarNombresRepartidores(lista) {
  localStorage.setItem(CLAVE_REPARTIDORES, JSON.stringify(lista));
}

function leerUsuariosRepartidor() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS_REPARTIDOR));
    if (Array.isArray(datos)) return datos;
  } catch (error) {}
  localStorage.setItem(CLAVE_USUARIOS_REPARTIDOR, JSON.stringify(USUARIOS_REPARTIDOR_DEFAULT));
  return USUARIOS_REPARTIDOR_DEFAULT.slice();
}

function guardarUsuariosRepartidor(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS_REPARTIDOR, JSON.stringify(usuarios));
}

function leerClientes() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CLIENTES));
    if (Array.isArray(datos)) return datos;
  } catch (error) {}
  return [];
}

function guardarClientes(clientes) {
  localStorage.setItem(CLAVE_CLIENTES, JSON.stringify(clientes));
}

function precioCilindro(cilindro) {
  return PRECIOS_CILINDROS[cilindro] || 0;
}



function renderizarKpis() {
  const pedidos = leerPedidos();
  const clientes = leerClientes();
  const repartidores = leerUsuariosRepartidor();

  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const asignados = pedidos.filter((p) => p.estado === "asignado").length;
  const camino = pedidos.filter((p) => p.estado === "camino").length;
  const entregados = pedidos.filter((p) => p.estado === "entregado").length;
  const ingresos = pedidos.reduce((total, p) => total + precioCilindro(p.cilindro), 0);

  document.getElementById("kpiTotal").textContent = pedidos.length;
  document.getElementById("kpiPendientes").textContent = pendientes + asignados;
  document.getElementById("kpiCamino").textContent = camino;
  document.getElementById("kpiEntregados").textContent = entregados;
  document.getElementById("kpiIngresos").textContent = formatearPrecio(ingresos);
  document.getElementById("kpiRepartidores").textContent = repartidores.filter((u) => u.activo !== false).length;
  document.getElementById("kpiClientes").textContent = clientes.length;
}



function opcionesEstado(actual) {
  return Object.keys(ESTADOS)
    .map(
      (clave) =>
        `<option value="${clave}"${clave === actual ? " selected" : ""}>${ESTADOS[clave].texto}</option>`
    )
    .join("");
}

function opcionesRepartidor(actual) {
  const nombres = leerNombresRepartidores();
  let html = '<option value="">Sin asignar</option>';
  nombres.forEach((nombre) => {
    const seleccion = nombre === actual ? " selected" : "";
    html += `<option value="${escapar(nombre)}"${seleccion}>${escapar(nombre)}</option>`;
  });
  return html;
}

function renderizarPedidos() {
  const cuerpo = document.getElementById("tablaPedidos");
  if (!cuerpo) return;
  const pedidos = leerPedidos();

  if (pedidos.length === 0) {
    cuerpo.innerHTML =
      '<tr><td colspan="6" style="text-align:center;color:#777;">No hay pedidos registrados.</td></tr>';
    return;
  }

  cuerpo.innerHTML = pedidos
    .map((pedido) => {
      const estado = ESTADOS[pedido.estado] || ESTADOS.pendiente;
      return `
        <tr data-id="${escapar(pedido.id)}">
          <td>${escapar(pedido.id)}</td>
          <td>${escapar(pedido.cliente)}</td>
          <td>${escapar(pedido.direccion)}</td>
          <td>${escapar(pedido.cilindro)} · ${formatearPrecio(precioCilindro(pedido.cilindro))}</td>
          <td>
            <select class="select-control-admin select-estado">
              ${opcionesEstado(pedido.estado)}
            </select>
          </td>
          <td>
            <select class="select-control-admin select-repartidor">
              ${opcionesRepartidor(pedido.repartidor)}
            </select>
          </td>
        </tr>`;
    })
    .join("");
}



function renderizarUsuarios() {
  const cuerpo = document.getElementById("tablaUsuarios");
  if (!cuerpo) return;

  const repartidores = leerUsuariosRepartidor();
  const clientes = leerClientes();

  const filaRepartidor = (usuario) => {
    const activo = usuario.activo !== false;
    return `
      <tr data-tipo="repartidor" data-id="${usuario.id}">
        <td>${escapar(usuario.nombre)}</td>
        <td>${escapar(usuario.email)}</td>
        <td><span class="badge-rol rol-repartidor">Repartidor</span></td>
        <td class="${activo ? "cuenta-activa" : "cuenta-inactiva"} badge-estado-cuenta">
          ${activo ? "● Activa" : "● Desactivada"}
        </td>
        <td>
          <div class="acciones-usuario">
            <button type="button" class="btn-accion editar-usuario">✏️ Editar</button>
            <button type="button" class="btn-accion ${activo ? "desactivar" : "activar"} toggle-activo">
              ${activo ? "Desactivar" : "Activar"}
            </button>
          </div>
        </td>
      </tr>`;
  };

  const filaCliente = (cliente) => {
    const activo = cliente.activo !== false;
    return `
      <tr data-tipo="cliente" data-id="${cliente.id}">
        <td>${escapar(cliente.nombre)}</td>
        <td>${escapar(cliente.email)}</td>
        <td><span class="badge-rol">Cliente</span></td>
        <td class="${activo ? "cuenta-activa" : "cuenta-inactiva"} badge-estado-cuenta">
          ${activo ? "● Activa" : "● Desactivada"}
        </td>
        <td>
          <div class="acciones-usuario">
            <button type="button" class="btn-accion editar-usuario">✏️ Editar</button>
            <button type="button" class="btn-accion ${activo ? "desactivar" : "activar"} toggle-activo">
              ${activo ? "Desactivar" : "Activar"}
            </button>
          </div>
        </td>
      </tr>`;
  };

  const filaFija = (cuenta) => `
    <tr>
      <td>${escapar(cuenta.nombre)}</td>
      <td>${escapar(cuenta.email)}</td>
      <td><span class="badge-rol rol-${cuenta.rol}">${cuenta.rol === "administrador" ? "Administrador" : "Operador"}</span></td>
      <td class="cuenta-activa badge-estado-cuenta">● Activa</td>
      <td><span style="color:#999;font-size:12px;">Cuenta de sistema</span></td>
    </tr>`;

  const filas =
    CUENTAS_FIJAS.map(filaFija).join("") +
    repartidores.map(filaRepartidor).join("") +
    clientes.map(filaCliente).join("");

  cuerpo.innerHTML =
    filas || '<tr><td colspan="5" style="text-align:center;color:#777;">No hay usuarios registrados.</td></tr>';
}

function buscarUsuarioPorEmail(email) {
  const repartidores = leerUsuariosRepartidor();
  const repartidor = repartidores.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (repartidor) return { tipo: "repartidor", usuario: repartidor };
  const clientes = leerClientes();
  const cliente = clientes.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (cliente) return { tipo: "cliente", usuario: cliente };
  return null;
}



function abrirModalUsuario(usuario, tipo) {
  document.getElementById("tituloModalUsuario").textContent = usuario
    ? "Editar usuario"
    : "Nuevo usuario";
  document.getElementById("usuario-id").value = usuario ? usuario.id : "";
  document.getElementById("usuario-origen").value = usuario ? tipo : "";
  document.getElementById("usuario-nombre").value = usuario ? usuario.nombre : "";
  document.getElementById("usuario-email").value = usuario ? usuario.email : "";
  document.getElementById("usuario-contrasena").value = usuario ? usuario.password || "" : "";
  document.getElementById("usuario-rol").value = usuario ? (tipo === "repartidor" ? "repartidor" : "cliente") : "repartidor";
  document.getElementById("usuario-activo").checked = usuario ? usuario.activo !== false : true;
  document.getElementById("overlayModalUsuario").classList.add("abierto");
}

function cerrarModalUsuario() {
  document.getElementById("overlayModalUsuario").classList.remove("abierto");
}

function guardarUsuarioDesdeModal() {
  const id = document.getElementById("usuario-id").value;
  const origen = document.getElementById("usuario-origen").value;
  const nombre = document.getElementById("usuario-nombre").value.trim();
  const email = document.getElementById("usuario-email").value.trim();
  const password = document.getElementById("usuario-contrasena").value;
  const rol = document.getElementById("usuario-rol").value;
  const activo = document.getElementById("usuario-activo").checked;

  if (!nombre || !email || !password) {
    notificarAdmin("Completa nombre, correo y contraseña.", true);
    return;
  }

  if (id) {
    
    if (origen === "repartidor") {
      const repartidores = leerUsuariosRepartidor();
      const usuario = repartidores.find((u) => u.id === Number(id));
      if (!usuario) return;
      const nombreAnterior = usuario.nombre;
      const duplicado = buscarUsuarioPorEmail(email);
      if (duplicado && duplicado.usuario.email !== usuario.email) {
        notificarAdmin("Ya existe un usuario con ese correo.", true);
        return;
      }
      const nuevaCuenta = rol === "repartidor";
      usuario.nombre = nombre;
      usuario.email = email;
      usuario.password = password;
      usuario.activo = activo;
      guardarUsuariosRepartidor(repartidores);
     
      let nombres = leerNombresRepartidores();
      if (nombreAnterior !== nombre) {
        nombres = nombres.map((n) => (n === nombreAnterior ? nombre : n));
      }
      if (nuevaCuenta && !nombres.includes(nombre)) nombres.push(nombre);
      if (rol !== "repartidor") nombres = nombres.filter((n) => n !== nombre);
      guardarNombresRepartidores(nombres);
    } else {
      const clientes = leerClientes();
      const cliente = clientes.find((u) => String(u.id) === String(id));
      if (!cliente) return;
      const duplicado = buscarUsuarioPorEmail(email);
      if (duplicado && duplicado.usuario.email !== cliente.email) {
        notificarAdmin("Ya existe un usuario con ese correo.", true);
        return;
      }
      cliente.nombre = nombre;
      cliente.email = email;
      cliente.password = password;
      cliente.activo = activo;
      guardarClientes(clientes);
    }
    notificarAdmin("Usuario actualizado correctamente.");
  } else {
  
    const duplicado = buscarUsuarioPorEmail(email);
    if (duplicado) {
      notificarAdmin("Ya existe un usuario con ese correo.", true);
      return;
    }
    if (rol === "repartidor") {
      const repartidores = leerUsuariosRepartidor();
      const maxId = repartidores.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0);
      repartidores.push({
        id: maxId + 1,
        nombre,
        email,
        password,
        activo,
      });
      guardarUsuariosRepartidor(repartidores);
      const nombres = leerNombresRepartidores();
      if (!nombres.includes(nombre)) {
        nombres.push(nombre);
        guardarNombresRepartidores(nombres);
      }
      notificarAdmin("Repartidor creado correctamente.");
    } else {
      const clientes = leerClientes();
      clientes.push({
        id: "u" + Date.now(),
        nombre,
        email,
        telefono: "",
        direccion: "",
        password,
        activo,
      });
      guardarClientes(clientes);
      notificarAdmin("Cliente creado correctamente.");
    }
  }

  cerrarModalUsuario();
  renderizarKpis();
  renderizarUsuarios();
  renderizarPedidos();
}

function alternarEstadoUsuario(fila) {
  const tipo = fila.dataset.tipo;
  const id = fila.dataset.id;

  if (tipo === "repartidor") {
    const repartidores = leerUsuariosRepartidor();
    const usuario = repartidores.find((u) => u.id === Number(id));
    if (!usuario) return;
    usuario.activo = usuario.activo === false;
    guardarUsuariosRepartidor(repartidores);
    let nombres = leerNombresRepartidores();
    if (usuario.activo) {
      if (!nombres.includes(usuario.nombre)) nombres.push(usuario.nombre);
    } else {
      nombres = nombres.filter((n) => n !== usuario.nombre);
    }
    guardarNombresRepartidores(nombres);
    notificarAdmin(usuario.activo ? "Repartidor activado." : "Repartidor desactivado (no podrá iniciar sesión).");
  } else {
    const clientes = leerClientes();
    const cliente = clientes.find((u) => String(u.id) === String(id));
    if (!cliente) return;
    cliente.activo = cliente.activo === false;
    guardarClientes(clientes);
    notificarAdmin(cliente.activo ? "Cliente activado." : "Cliente desactivado (no podrá iniciar sesión).");
  }

  renderizarKpis();
  renderizarUsuarios();
}


function barraHTML(etiqueta, valor, maximo) {
  const ancho = maximo > 0 ? Math.round((valor / maximo) * 100) : 0;
  return `
    <div class="barra-rendimiento">
      <span class="etiqueta">${escapar(etiqueta)}</span>
      <div class="pista"><div class="relleno" style="width:${ancho}%"></div></div>
      <span class="valor">${valor}</span>
    </div>`;
}

function renderizarReportesPendientes() {
  const pedidos = leerPedidos();
  const nombres = leerNombresRepartidores();

  const contenedorRepartidores = document.getElementById("barrasRepartidores");
  if (contenedorRepartidores) {
    const conPedidos = nombres.concat(
      pedidos.map((p) => p.repartidor).filter((nombre, i, arr) => nombre && arr.indexOf(nombre) === i && !nombres.includes(nombre))
    );
    const datos = conPedidos.map((nombre) => {
      const asignados = pedidos.filter((p) => p.repartidor === nombre);
      return {
        nombre,
        asignados: asignados.length,
        entregados: asignados.filter((p) => p.estado === "entregado").length,
      };
    });
    const maximo = Math.max(1, ...datos.map((d) => d.asignados));
    contenedorRepartidores.innerHTML = datos
      .map((d) => barraHTML(`${d.nombre} (${d.entregados} entregados)`, d.asignados, maximo))
      .join("");
  }

  const contenedorIngresos = document.getElementById("barrasIngresos");
  if (contenedorIngresos) {
    const etiquetas = [
      { clave: "pendiente", texto: "Pendientes" },
      { clave: "asignado", texto: "Asignados" },
      { clave: "camino", texto: "En camino" },
      { clave: "entregado", texto: "Entregados" },
    ];
    const filas = etiquetas.map((e) => {
      const monto = pedidos
        .filter((p) => p.estado === e.clave)
        .reduce((total, p) => total + precioCilindro(p.cilindro), 0);
      return { texto: e.texto, monto };
    });
    const maximo = Math.max(1, ...filas.map((f) => f.monto));
    contenedorIngresos.innerHTML = filas
      .map((f) => barraHTML(f.texto, formatearPrecio(f.monto), maximo))
      .join("");
  }
}

function renderizarMapa() {
  const contenedor = document.getElementById("mapa-admin");
  if (!contenedor || typeof L === "undefined") return;

  if (mapaAdmin) {
    mapaAdmin.remove();
    mapaAdmin = null;
  }

  mapaAdmin = L.map("mapa-admin").setView([-36.6066, -72.1034], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(mapaAdmin);

  const colores = {
    pendiente: "gray",
    asignado: "blue",
    camino: "orange",
    entregado: "green",
  };

  leerPedidos().forEach((pedido) => {
    const color = colores[pedido.estado] || "gray";
    const icono = L.divIcon({
      className: "marcador-admin",
      html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,.4)"></span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([pedido.lat, pedido.lng], { icon: icono })
      .addTo(mapaAdmin)
      .bindPopup(
        `<b>#${escapar(pedido.id)} · ${escapar(pedido.cliente)}</b><br>` +
          `${escapar(pedido.cilindro)} — ${ESTADOS[pedido.estado] ? ESTADOS[pedido.estado].texto : pedido.estado}<br>` +
          `${pedido.repartidor ? "Repartidor: " + escapar(pedido.repartidor) : "Sin repartidor"}`
      );
  });
}


function configurarEventos() {
  document.querySelectorAll(".tab-admin").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.querySelectorAll(".tab-admin").forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");
      document.querySelectorAll(".pestana").forEach((p) => p.classList.add("oculta"));
      const pestana = document.getElementById("pestana-" + boton.dataset.pestana);
      if (pestana) pestana.classList.remove("oculta");
      if (boton.dataset.pestana === "reportes") {
        renderizarReportesPendientes();
        setTimeout(renderizarMapa, 60);
      }
    });
  });

  document.getElementById("tablaPedidos").addEventListener("change", (evento) => {
    const fila = evento.target.closest("tr[data-id]");
    if (!fila) return;
    const pedidos = leerPedidos();
    const pedido = pedidos.find((p) => String(p.id) === String(fila.dataset.id));
    if (!pedido) return;
    if (evento.target.classList.contains("select-estado")) pedido.estado = evento.target.value;
    if (evento.target.classList.contains("select-repartidor")) pedido.repartidor = evento.target.value;
    guardarPedidos(pedidos);
    renderizarKpis();
    renderizarPedidos();
  });

  document.getElementById("btnNuevoUsuario").addEventListener("click", () => abrirModalUsuario(null, ""));
  document.getElementById("btnCerrarModalUsuario").addEventListener("click", cerrarModalUsuario);
  document.getElementById("btnCancelarUsuario").addEventListener("click", cerrarModalUsuario);
  document.getElementById("overlayModalUsuario").addEventListener("click", (evento) => {
    if (evento.target.id === "overlayModalUsuario") cerrarModalUsuario();
  });

  document.getElementById("tablaUsuarios").addEventListener("click", (evento) => {
    const botonEditar = evento.target.closest(".editar-usuario");
    if (botonEditar) {
      const fila = botonEditar.closest("tr[data-tipo]");
      const tipo = fila.dataset.tipo;
      const id = fila.dataset.id;
      if (tipo === "repartidor") {
        const usuario = leerUsuariosRepartidor().find((u) => u.id === Number(id));
        if (usuario) abrirModalUsuario(usuario, "repartidor");
      } else {
        const cliente = leerClientes().find((u) => String(u.id) === String(id));
        if (cliente) abrirModalUsuario(cliente, "cliente");
      }
      return;
    }

    const botonToggle = evento.target.closest(".toggle-activo");
    if (botonToggle) {
      const fila = botonToggle.closest("tr[data-tipo]");
      alternarEstadoUsuario(fila);
    }
  });

  document.getElementById("formUsuario").addEventListener("submit", (evento) => {
    evento.preventDefault();
    guardarUsuarioDesdeModal();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarModalUsuario();
  });

  document.getElementById("btnCerrarSesionAdmin").addEventListener("click", (evento) => {
    evento.preventDefault();
    localStorage.removeItem(CLAVE_SESION_ADMIN);
    window.location.href = "../admin/login-admin.html";
  });

  setTimeout(renderizarMapa, 100);
}

document.addEventListener("DOMContentLoaded", () => {
  const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION_ADMIN) || "null");
  if (!sesionAdminActiva()) {
    window.location.href = "../admin/login-admin.html";
    return;
  }

  const nombreAdmin = document.getElementById("nombreAdmin");
  if (nombreAdmin) nombreAdmin.textContent = sesion.nombre;

  renderizarKpis();
  renderizarPedidos();
  renderizarUsuarios();
  configurarEventos();
});