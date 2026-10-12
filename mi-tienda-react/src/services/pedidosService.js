const CLAVE_PEDIDOS = 'elvolcan_pedidos'
const CLAVE_REPARTIDORES = 'elvolcan_repartidores'

export const ESTADOS_PEDIDO = {
  pendiente: 'Pendiente',
  asignado: 'Asignado',
  camino: 'En camino',
  entregado: 'Entregado',
}

const REPARTIDORES_DEFAULT = ['Carlos R.', 'Pedro M.', 'Repartidor Demo', 'Luis Fuentes']

const PEDIDOS_DEFAULT = [
  { id: '001', cliente: 'Ana García', direccion: 'Av. Las Flores 123', cilindro: '11 kg', estado: 'entregado', repartidor: 'Carlos R.', lat: -36.601, lng: -72.105 },
  { id: '002', cliente: 'Luis Torres', direccion: 'Jr. Los Pinos 456', cilindro: '15 kg', estado: 'camino', repartidor: 'Pedro M.', lat: -36.612, lng: -72.098 },
  { id: '004', cliente: 'Jorge Ruiz', direccion: 'Urb. El Sol 22', cilindro: '11 kg', estado: 'pendiente', repartidor: '', lat: -36.607, lng: -72.11 },
  { id: '1001', cliente: 'Josefina Pérez', direccion: "Av. O'Higgins 1234, depto 45", cilindro: '11 kg', estado: 'pendiente', repartidor: 'Repartidor Demo', lat: -36.6038, lng: -72.0988 },
  { id: '1002', cliente: 'Miguel Ángel Rojas', direccion: 'El Roble 25, depto 302', cilindro: '15 kg', estado: 'camino', repartidor: 'Repartidor Demo', lat: -36.606, lng: -72.1018 },
  { id: '1003', cliente: 'Camila Torres', direccion: 'Av. Ecuador 950, casa 18', cilindro: '5 kg', estado: 'entregado', repartidor: 'Repartidor Demo', lat: -36.6026, lng: -72.09 },
  { id: '1004', cliente: 'Valentina Soto', direccion: 'Av. Alonso de Ercilla 651', cilindro: '45 kg', estado: 'pendiente', repartidor: 'Luis Fuentes', lat: -36.6105, lng: -72.1068 },
]

function guardarPedidos(lista) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(lista))
}

export function obtenerRepartidores() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_REPARTIDORES))
    if (Array.isArray(datos) && datos.length > 0) return datos
  } catch {
    //
  }
  localStorage.setItem(CLAVE_REPARTIDORES, JSON.stringify(REPARTIDORES_DEFAULT))
  return [...REPARTIDORES_DEFAULT]
}

export function obtenerPedidos() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS))
    if (Array.isArray(datos)) return datos
  } catch {
    //
  }
  guardarPedidos(PEDIDOS_DEFAULT.map((p) => ({ ...p })))
  return PEDIDOS_DEFAULT.map((p) => ({ ...p }))
}

export function crearPedido({ cliente, direccion, cilindro }) {
  const lista = obtenerPedidos()
  const maxNumero = lista.reduce((max, p) => {
    const n = parseInt(p.id, 10)
    return Number.isNaN(n) ? max : Math.max(max, n)
  }, 0)
  const nuevo = {
    id: String(maxNumero + 1).padStart(3, '0'),
    cliente,
    direccion,
    cilindro,
    estado: 'pendiente',
    repartidor: '',
    lat: -36.6066 + (Math.random() - 0.5) * 0.02,
    lng: -72.1034 + (Math.random() - 0.5) * 0.02,
  }
  guardarPedidos([...lista, nuevo])
  return nuevo
}

export function actualizarPedido(id, cambios) {
  const lista = obtenerPedidos()
  const indice = lista.findIndex((p) => String(p.id) === String(id))
  if (indice === -1) return null
  const actualizado = { ...lista[indice], ...cambios, id: lista[indice].id }
  lista[indice] = actualizado
  guardarPedidos(lista)
  return actualizado
}

export function restablecerPedidos() {
  guardarPedidos(PEDIDOS_DEFAULT.map((p) => ({ ...p })))
}
