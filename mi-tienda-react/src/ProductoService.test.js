import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosPorCategoria,
  actualizarProducto,
  eliminarProducto,
  restablecerProductos,
} from './services/productoService'

const CLAVE = 'elvolcan_react_productos_v3'

const productoNuevo = {
  id: 'XX001',
  nombre: 'Cilindro de prueba',
  descripcion: 'Producto creado dentro de las pruebas',
  precio: 5000,
  stock: 15,
  categoria: 'cilindros',
}

describe('Pruebas de productoService', () => {
  beforeEach(() => {
    localStorage.removeItem(CLAVE)
  })

  afterEach(() => {
    localStorage.removeItem(CLAVE)
  })

  it('deberia cargar el listado inicial de productos', () => {
    expect(obtenerProductos().length).toBe(14)
  })

  it('deberia obtener un producto por su id', () => {
    expect(obtenerProductoPorId('CL001').nombre).toBe('Cilindro GLP 5 kg')
  })

  it('deberia devolver null cuando el producto no existe', () => {
    expect(obtenerProductoPorId('NOEXISTE')).toBeNull()
  })

  it('deberia filtrar los productos por categoria', () => {
    expect(obtenerProductosPorCategoria('cilindros').length).toBe(4)
    expect(obtenerProductosPorCategoria('accesorios').length).toBe(3)
  })

  it('deberia crear un producto y sumarlo al listado', () => {
    const creado = crearProducto(productoNuevo)

    expect(creado.id).toBe('XX001')
    expect(obtenerProductos().length).toBe(15)
  })

  it('deberia persistir el producto creado en localStorage', () => {
    crearProducto(productoNuevo)

    const guardados = JSON.parse(localStorage.getItem(CLAVE))

    expect(guardados.length).toBe(15)
    expect(guardados.some((p) => p.id === 'XX001')).toBeTrue()
  })

  it('deberia lanzar error al crear un producto con id repetido', () => {
    crearProducto(productoNuevo)

    expect(() => crearProducto({ ...productoNuevo, nombre: 'Otro' })).toThrow()
  })

  it('deberia actualizar los datos de un producto existente', () => {
    const actualizado = actualizarProducto('CL001', { precio: 7000, stock: 5 })

    expect(actualizado.precio).toBe(7000)
    expect(obtenerProductoPorId('CL001').precio).toBe(7000)
  })

  it('deberia devolver null al actualizar un producto inexistente', () => {
    expect(actualizarProducto('NOEXISTE', { precio: 1000 })).toBeNull()
  })

  it('deberia eliminar un producto del listado', () => {
    expect(eliminarProducto('CL001')).toBeTrue()
    expect(obtenerProductos().length).toBe(13)
    expect(obtenerProductoPorId('CL001')).toBeNull()
  })

  it('deberia devolver false al eliminar un producto inexistente', () => {
    expect(eliminarProducto('NOEXISTE')).toBeFalse()
  })

  it('deberia restablecer el listado inicial de productos', () => {
    crearProducto(productoNuevo)
    eliminarProducto('CL001')

    restablecerProductos()

    expect(obtenerProductos().length).toBe(14)
    expect(obtenerProductoPorId('CL001')).not.toBeNull()
  })
})