const REPARTIDOR_USUARIOS_KEY = "elvolcan_usuarios_repartidor";
const REPARTIDOR_SESION_KEY = "elvolcan_sesion_repartidor";
const PEDIDOS_KEY = "elvolcan_pedidos";

function obtenerDatosInicialesRepartidores() {
  return {
    usuarios: [
      { id: 1, nombre: "Repartidor Demo", email: "repartidordemo@gmail.com", password: "demo123" },
      { id: 2, nombre: "Luis Fuentes", email: "luis.fuentes@gmail.com", password: "demo123" },
    ],
    pedidos: [
      {
        id: 1001,
        cliente: "Josefina Pérez",
        direccion: "Av. O'Higgins 1234, depto 45",
        comuna: "Chillán Centro",
        lat: -36.6038,
        lng: -72.0988,
        productos: "Cilindro 11 kg",
        total: 15990,
        estado: "pendiente",
        repartidorId: 1,
        fecha: "Hoy 10:30",
      },
      {
        id: 1002,
        cliente: "Miguel Ángel Rojas",
        direccion: "El Roble 25, depto 302",
        comuna: "Chillán Centro",
        lat: -36.606,
        lng: -72.1018,
        productos: "Cilindro 15 kg + Regulador doméstico",
        total: 24880,
        estado: "en camino",
        repartidorId: 1,
        fecha: "Hoy 09:15",
      },
      {
        id: 1003,
        cliente: "Camila Torres",
        direccion: "Av. Ecuador 950, casa 18",
        comuna: "Chillán",
        lat: -36.6026,
        lng: -72.09,
        productos: "Cilindro 5 kg",
        total: 6990,
        estado: "entregado",
        repartidorId: 1,
        fecha: "Ayer 17:40",
      },
      {
        id: 1004,
        cliente: "Valentina Soto",
        direccion: "Av. Alonso de Ercilla 651",
        comuna: "Chillán Centro",
        lat: -36.6105,
        lng: -72.1068,
        productos: "Cilindro 45 kg",
        total: 48990,
        estado: "pendiente",
        repartidorId: 2,
        fecha: "Hoy 11:00",
      },
    ],
  };
}

function leerUsuariosRepartidor() {
  try {
    const datos = JSON.parse(localStorage.getItem(REPARTIDOR_USUARIOS_KEY));
    if (Array.isArray(datos)) return datos;
  } catch (error) {}
  const inicial = obtenerDatosInicialesRepartidores().usuarios;
  localStorage.setItem(REPARTIDOR_USUARIOS_KEY, JSON.stringify(inicial));
  return inicial;
}

let pedidosEnMemoria = null;

function leerPedidos() {
  if (!pedidosEnMemoria) {
    pedidosEnMemoria = obtenerDatosInicialesRepartidores().pedidos.map((pedido) => Object.assign({}, pedido));
  }
  return pedidosEnMemoria;
}

function guardarPedidos(pedidos) {
  pedidosEnMemoria = pedidos;
}

function obtenerSesionRepartidor() {
  try {
    return JSON.parse(localStorage.getItem(REPARTIDOR_SESION_KEY));
  } catch (error) {
    return null;
  }
}