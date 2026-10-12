import { Link, useParams } from 'react-router-dom'
import ProductoCard from '../components/ProductoCard'
import { useCarrito } from '../context/useCarrito'
import { CATEGORIAS, obtenerProductosPorCategoria } from '../services/productoService'

export function Categorias() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Categorías</h1>
      <div className="row g-4">
        {CATEGORIAS.map((cat) => (
          <div className="col-12 col-md-6 col-lg-3" key={cat.id}>
            <div className="card h-100 shadow-sm text-center">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{cat.nombre}</h5>
                <Link className="btn btn-primary mt-auto" to={`/categorias/${cat.id}`}>
                  Ver productos
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CategoriaDetalle() {
  const { id } = useParams()
  const { agregar } = useCarrito()
  const categoria = CATEGORIAS.find((c) => c.id === id)
  const productos = obtenerProductosPorCategoria(id)

  if (!categoria) {
    return (
      <div className="container mt-5 text-center">
        <h2>Categoría no encontrada</h2>
        <Link className="btn btn-primary mt-3" to="/categorias">Volver a categorías</Link>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{categoria.nombre}</h1>
      {productos.length === 0 ? (
        <p className="text-center text-secondary">No hay productos en esta categoría.</p>
      ) : (
        <div className="row g-4">
          {productos.map((producto) => (
            <div className="col-12 col-md-4" key={producto.id}>
              <ProductoCard producto={producto} onAgregar={agregar} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
