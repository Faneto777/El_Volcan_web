const CLAVE_PRODUCTOS = 'elvolcan_react_productos_v2'

export const CATEGORIAS = [
  { id: 'cilindros', nombre: 'Cilindros de Gas' },
  { id: 'reguladores', nombre: 'Reguladores' },
  { id: 'mangueras', nombre: 'Mangueras y Conexiones' },
  { id: 'accesorios', nombre: 'Accesorios' },
]

const productosIniciales = [
  { id: 'CL001', nombre: 'Cilindro GLP 5 kg', descripcion: 'Cilindro de gas licuado de petróleo 5 kg. Para uso residencial (cocina, calefacción pequeña).', precio: 6500, stock: 80, categoria: 'cilindros', imagen: '/assets/productos/cilindro%205kg.jpg', oferta: false, precioOferta: null },
  { id: 'CL002', nombre: 'Cilindro GLP 11 kg', descripcion: 'Cilindro estándar doméstico. El más utilizado en hogares chilenos. Compatible con reguladores estándar.', precio: 12000, stock: 200, categoria: 'cilindros', imagen: '/assets/productos/cilindro%2011kg.jpg', oferta: false, precioOferta: null },
  { id: 'CL003', nombre: 'Cilindro GLP 15 kg', descripcion: 'Cilindro de mayor capacidad para hogares de alto consumo o locales pequeños.', precio: 16000, stock: 90, categoria: 'cilindros', imagen: '/assets/productos/cilindro%2015kg.jpg', oferta: false, precioOferta: null },
  { id: 'CL004', nombre: 'Cilindro GLP 45 kg', descripcion: 'Cilindro industrial. Uso comercial: restaurantes, talleres, calefacción de locales.', precio: 45000, stock: 30, categoria: 'cilindros', imagen: '/assets/productos/cilindro%2045.jpg', oferta: false, precioOferta: null },
  { id: 'RG001', nombre: 'Regulador doméstico estándar', descripcion: 'Regulador de 1 etapa para cilindros 5, 11 y 15 kg. Presión de salida 28 mbar.', precio: 8990, stock: 45, categoria: 'reguladores', imagen: '/assets/productos/regulador%20domestico%20estandar.jpg', oferta: false, precioOferta: null },
  { id: 'RG002', nombre: 'Regulador de alta presión', descripcion: 'Regulador para cocinas industriales o equipos de mayor consumo. Presión regulable.', precio: 18990, stock: 12, categoria: 'reguladores', imagen: '/assets/productos/regulador%20de%20alta%20presion.jpg', oferta: false, precioOferta: null },
  { id: 'RG003', nombre: 'Regulador dual (2 salidas)', descripcion: 'Permite conectar dos artefactos simultáneamente al mismo cilindro.', precio: 14990, stock: 18, categoria: 'reguladores', imagen: '/assets/productos/regulador%20dual%202%20salidas.jpg', oferta: true, precioOferta: 12990 },
  { id: 'MG001', nombre: 'Manguera gas 1.5 m', descripcion: 'Manguera flexible homologada. Diámetro interior 9mm. Compatible con reguladores estándar.', precio: 3990, stock: 80, categoria: 'mangueras', imagen: '/assets/productos/manguera%20gas%201.5m.jpg', oferta: false, precioOferta: null },
  { id: 'MG002', nombre: 'Manguera gas 3 m', descripcion: 'Manguera larga para instalaciones donde el artefacto está alejado del cilindro.', precio: 6990, stock: 50, categoria: 'mangueras', imagen: '/assets/productos/manguera%20gas%203m.jpg', oferta: false, precioOferta: null },
  { id: 'MG003', nombre: 'Abrazadera metálica', descripcion: 'Abrazadera de acero para asegurar la conexión manguera-regulador y manguera-artefacto.', precio: 990, stock: 200, categoria: 'mangueras', imagen: '/assets/productos/abrazadera%20metalica.jpg', oferta: false, precioOferta: null },
  { id: 'MG004', nombre: 'Kit conexión completo', descripcion: 'Regulador + manguera 1.5 m + abrazaderas. Todo lo necesario para instalar un cilindro nuevo.', precio: 12990, stock: 25, categoria: 'mangueras', imagen: '/assets/productos/kit%20conexion%20completo.jpg', oferta: true, precioOferta: 10990 },
  { id: 'AC001', nombre: 'Carro porta cilindro 11/15 kg', descripcion: 'Carro metálico con ruedas para transportar cilindros dentro del hogar con seguridad.', precio: 12990, stock: 20, categoria: 'accesorios', imagen: '/assets/productos/carro%20porta%20cilindro.jpg', oferta: false, precioOferta: null },
  { id: 'AC002', nombre: 'Tapa protectora para válvula', descripcion: 'Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte.', precio: 1490, stock: 60, categoria: 'accesorios', imagen: '/assets/productos/tapas%20protectoras.jpg', oferta: false, precioOferta: null },
  { id: 'AC003', nombre: 'Detector de gas a batería', descripcion: 'Sensor electroquímico. Alarma sonora y visual ante fuga de gas GLP o metano.', precio: 19990, stock: 8, categoria: 'accesorios', imagen: '/assets/productos/detector%20de%20gas.jpg', oferta: false, precioOferta: null },
]

function leerProductos() {
  const datos = localStorage.getItem(CLAVE_PRODUCTOS)

  if (datos) {
    try {
      const lista = JSON.parse(datos)
      if (Array.isArray(lista)) return lista
    } catch {
      console.warn('No se pudo leer el listado de productos')
    }
  }

  guardarProductos([...productosIniciales])
  return [...productosIniciales]
}

function guardarProductos(lista) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista))
}

export function crearProducto(datos) {
  const lista = leerProductos()

  if (lista.some((p) => p.id === datos.id)) {
    throw new Error('Ya existe un producto con ese código')
  }

  const nuevo = {
    oferta: false,
    precioOferta: null,
    stock: 0,
    ...datos,
  }

  guardarProductos([...lista, nuevo])
  return nuevo
}

export function obtenerProductos() {
  return leerProductos()
}

export function obtenerProductoPorId(id) {
  const producto = leerProductos().find((p) => p.id === id)
  return producto || null
}

export function obtenerProductosEnOferta() {
  return leerProductos().filter((p) => p.oferta)
}

export function obtenerProductosPorCategoria(categoria) {
  return leerProductos().filter((p) => p.categoria === categoria)
}

export function precioFinal(producto) {
  return producto.oferta && producto.precioOferta ? producto.precioOferta : producto.precio
}

export function actualizarProducto(id, cambios) {
  const lista = leerProductos()
  const indice = lista.findIndex((p) => p.id === id)

  if (indice === -1) return null

  const actualizado = { ...lista[indice], ...cambios, id }
  lista[indice] = actualizado
  guardarProductos(lista)

  return actualizado
}

export function eliminarProducto(id) {
  const lista = leerProductos()
  const nuevaLista = lista.filter((p) => p.id !== id)

  if (nuevaLista.length === lista.length) return false

  guardarProductos(nuevaLista)
  return true
}

export function restablecerProductos() {
  guardarProductos([...productosIniciales])
}
