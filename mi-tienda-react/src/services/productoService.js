const CLAVE_PRODUCTOS = 'elvolcan_servicio_productos'

const productosIniciales = [
  {
    id: 'CL001',
    nombre: 'Cilindro GLP 5 kg',
    descripcion: 'Cilindro de gas licuado de petróleo de 5 kg para uso residencial.',
    precio: 6500,
    precioOferta: null,
    oferta: false,
    stock: 80,
    categoria: 'cilindros',
    imagen: '/assets/productos/cilindro 5kg.jpg',
  },
  {
    id: 'CL002',
    nombre: 'Cilindro GLP 11 kg',
    descripcion: 'Cilindro estándar doméstico, el más utilizado en hogares chilenos.',
    precio: 12000,
    precioOferta: null,
    oferta: false,
    stock: 200,
    categoria: 'cilindros',
    imagen: '/assets/productos/cilindro 11kg.jpg',
  },
  {
    id: 'CL003',
    nombre: 'Cilindro GLP 15 kg',
    descripcion: 'Cilindro de mayor capacidad para hogares con alto consumo.',
    precio: 16000,
    precioOferta: 13500,
    oferta: true,
    stock: 90,
    categoria: 'cilindros',
    imagen: '/assets/productos/cilindro 15kg.jpg',
  },
  {
    id: 'CL004',
    nombre: 'Cilindro GLP 45 kg',
    descripcion: 'Cilindro industrial para restaurantes, talleres y calefacción de locales.',
    precio: 45000,
    precioOferta: null,
    oferta: false,
    stock: 30,
    categoria: 'cilindros',
    imagen: '/assets/productos/cilindro 45.jpg',
  },
  {
    id: 'RG001',
    nombre: 'Regulador doméstico estándar',
    descripcion: 'Regulador de 1 etapa para cilindros de 5, 11 y 15 kg. Presión de salida 28 mbar.',
    precio: 8990,
    precioOferta: null,
    oferta: false,
    stock: 45,
    categoria: 'reguladores',
    imagen: '/assets/productos/regulador domestico estandar.jpg',
  },
  {
    id: 'RG002',
    nombre: 'Regulador de alta presión',
    descripcion: 'Regulador con presión regulable para cocinas industriales.',
    precio: 18990,
    precioOferta: null,
    oferta: false,
    stock: 12,
    categoria: 'reguladores',
    imagen: '/assets/productos/regulador de alta presion.jpg',
  },
  {
    id: 'MG001',
    nombre: 'Manguera gas 1.5 m',
    descripcion: 'Manguera flexible homologada, diámetro interior 9 mm.',
    precio: 3990,
    precioOferta: 2990,
    oferta: true,
    stock: 80,
    categoria: 'mangueras',
    imagen: '/assets/productos/manguera gas 1.5m.jpg',
  },
  {
    id: 'AC001',
    nombre: 'Detector de gas a batería',
    descripcion: 'Sensor electroquímico con alarma sonora y visual ante fuga de gas.',
    precio: 19990,
    precioOferta: null,
    oferta: false,
    stock: 8,
    categoria: 'accesorios',
    imagen: '/assets/productos/detector de gas.jpg',
  },
]

// Recupera los productos desde localStorage
// Si no hay datos guardados, carga la lista inicial
function leerProductos() {
  const datos = localStorage.getItem(CLAVE_PRODUCTOS)

  if (datos) {
    try {
      const lista = JSON.parse(datos)
      if (Array.isArray(lista)) return lista
    } catch (error) {
      console.warn('No se pudo leer el listado de productos')
    }
  }

  guardarProductos([...productosIniciales])
  return [...productosIniciales]
}

function guardarProductos(lista) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista))
}

// CREATE
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

// READ
export function obtenerProductos() {
  return leerProductos()
}

export function obtenerProductoPorId(id) {
  const producto = leerProductos().find((p) => p.id === id)
  return producto || null
}

export function obtenerProductosPorCategoria(categoria) {
  return leerProductos().filter((p) => p.categoria === categoria)
}

// UPDATE
export function actualizarProducto(id, cambios) {
  const lista = leerProductos()
  const indice = lista.findIndex((p) => p.id === id)

  if (indice === -1) return null

  const actualizado = { ...lista[indice], ...cambios, id }
  lista[indice] = actualizado
  guardarProductos(lista)

  return actualizado
}

// DELETE
export function eliminarProducto(id) {
  const lista = leerProductos()
  const nuevaLista = lista.filter((p) => p.id !== id)

  if (nuevaLista.length === lista.length) return false

  guardarProductos(nuevaLista)
  return true
}

// Restaura el listado inicial
export function restablecerProductos() {
  guardarProductos([...productosIniciales])
}