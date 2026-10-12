import { Link } from 'react-router-dom'
import { precioFinal } from '../services/productoService'
import { formatearPrecio } from '../utils/formato'

function ProductoCard({ producto, onAgregar }) {
  const { id, nombre, descripcion, precio, imagen, stock, oferta } = producto
  const sinStock = stock <= 0

  return (
    <article className="producto">
      <div className="producto-imagen">
        <img src={imagen} alt={nombre} loading="lazy" />
      </div>
      <div className="producto-cuerpo">
        <h3>{nombre}</h3>
        <p className="producto-descripcion">{descripcion}</p>
        <div className="producto-pie">
          <span className="producto-precio">
            <small>Precio del producto</small>
            {oferta && (
              <span className="text-decoration-line-through text-muted me-2">
                {formatearPrecio(precio)}
              </span>
            )}
            {formatearPrecio(precioFinal(producto))}
          </span>
          <button
            type="button"
            className="btn-agregar-carrito"
            onClick={() => onAgregar(producto)}
            disabled={sinStock}
          >
            {sinStock ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
        <Link className="boton boton-secundario" to={`/productos/${id}`}>
          Ver detalle
        </Link>
      </div>
    </article>
  )
}

export default ProductoCard
