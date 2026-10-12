import { Link, useParams } from 'react-router-dom'
import ProductoCard from '../components/ProductoCard'
import { useCarrito } from '../context/useCarrito'
import { CATEGORIAS, obtenerProductosPorCategoria } from '../services/productoService'

export function Categorias() {
  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Categorías</h1>
          <p className="descripcion-seccion">Explora los productos separados por categoría.</p>
          <div className="grid-beneficios">
            {CATEGORIAS.map((cat) => (
              <div className="tarjeta-beneficio" key={cat.id}>
                <h3>{cat.nombre}</h3>
                <p>Revisa todos los productos de esta categoría.</p>
                <Link className="boton mt-2" to={`/categorias/${cat.id}`}>
                  Ver productos
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export function CategoriaDetalle() {
  const { id } = useParams()
  const { agregar } = useCarrito()
  const categoria = CATEGORIAS.find((c) => c.id === id)
  const productos = obtenerProductosPorCategoria(id)

  if (!categoria) {
    return (
      <main>
        <section>
          <div className="container text-center">
            <h2 className="titulo-seccion">Categoría no encontrada</h2>
            <Link className="boton mt-3" to="/categorias">Volver a categorías</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">{categoria.nombre}</h1>
          {productos.length === 0 ? (
            <p className="descripcion-seccion">No hay productos en esta categoría.</p>
          ) : (
            <div className="grid-productos">
              {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} onAgregar={agregar} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
