import { Link, useParams } from 'react-router-dom'
import ProductoCard from '../components/ProductoCard'
import { useCarrito } from '../context/useCarrito'
import { CATEGORIAS, useProductos } from '../services/productoService'

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
  const { productos, error } = useProductos()
  const productosFiltrados = productos.filter(
      (producto) => producto.categoria === id
  )

  if (error) {
    return <p className="alert alert-danger">{error}</p>
  }

  if (productosFiltrados.length === 0) {
    return (
        <main>
          <section>
            <div className="container">
              <h1 className="titulo-seccion">{categoria.nombre}</h1>
              <p className="descripcion-seccion">
                No hay productos en esta categoría.
              </p>
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
          <div className="grid-productos">
            {productosFiltrados.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onAgregar={agregar}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

