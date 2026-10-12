import ProductoCard from '../components/ProductoCard'
import { useCarrito } from '../context/useCarrito'
import { obtenerProductosEnOferta } from '../services/productoService'

function Ofertas() {
  const { agregar } = useCarrito()
  const productos = obtenerProductosEnOferta()

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ofertas</h1>
      {productos.length === 0 ? (
        <p className="text-center text-secondary">No hay ofertas disponibles por ahora.</p>
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

export default Ofertas
