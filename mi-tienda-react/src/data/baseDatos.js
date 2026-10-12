// Compatibilidad: la fuente única es services/productoService.js
// Se re-exporta para no romper imports existentes en App y CarritoProvider.
export {
  CATEGORIAS,
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosEnOferta,
  obtenerProductosPorCategoria,
  precioFinal,
  actualizarProducto,
  eliminarProducto,
  restablecerProductos,
} from '../services/productoService'
