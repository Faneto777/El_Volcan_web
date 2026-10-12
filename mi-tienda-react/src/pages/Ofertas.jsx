import ProductoCard from '../components/ProductoCard'
import { useCarrito } from '../context/useCarrito'
import { obtenerProductosEnOferta } from '../services/productoService'

function Ofertas() {
  const { agregar } = useCarrito()
  const productos = obtenerProductosEnOferta()

  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Ofertas</h1>
          <p className="descripcion-seccion">Todos los productos en oferta, con precios rebajados.</p>
          {productos.length === 0 ? (
            <p className="descripcion-seccion">No hay ofertas disponibles por ahora.</p>
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

export default Ofertas
