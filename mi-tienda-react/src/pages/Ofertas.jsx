import ProductoCard from '../components/ProductoCard'
import { useCarrito } from '../context/useCarrito'
import { useProductos } from '../services/productoService'

function Ofertas() {
  const { agregar } = useCarrito()
  const { productos, error } = useProductos()
  const ofertas = productos.filter((producto) => producto.oferta)

  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Ofertas</h1>
          <p className="descripcion-seccion">Todos los productos en oferta, con precios rebajados.</p>
          {error ? (
            <p className="alert alert-danger">{error}</p>
          ) : ofertas.length === 0 ? (
            <p className="descripcion-seccion">No hay ofertas disponibles por ahora.</p>
          ) : (
            <div className="grid-productos">
              {ofertas.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} onAgregar={agregar} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Ofertas
