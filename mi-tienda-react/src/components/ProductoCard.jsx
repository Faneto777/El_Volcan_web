import { Link } from 'react-router-dom'
import { precioFinal } from '../services/productoService'
import { formatearPrecio } from '../utils/formato'

function ProductoCard({ producto, onAgregar }) {
  const { id, nombre, descripcion, precio, imagen, stock, oferta } = producto
  const sinStock = stock <= 0

  return (
    <div className="card shadow-sm h-100">
      <img
        src={imagen}
        className="card-img-top"
        alt={nombre}
        style={{ height: '200px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{nombre}</h5>
        <p className="card-text text-secondary flex-grow-1">{descripcion}</p>

        <p className="mb-2">
          {oferta && (
            <span className="text-decoration-line-through text-muted me-2">
              {formatearPrecio(precio)}
            </span>
          )}
          <strong className="fs-5">{formatearPrecio(precioFinal(producto))}</strong>
        </p>

        <div className="d-flex gap-2 mt-auto">
          <Link className="btn btn-outline-secondary flex-fill" to={`/productos/${id}`}>
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn-primary flex-fill"
            onClick={() => onAgregar(producto)}
            disabled={sinStock}
          >
            {sinStock ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductoCard