import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerMisComprasDesdeApi } from '../services/productoService'
import { formatearPrecio } from '../utils/formato'

export default function MisCompras() {
  const [boletas, setBoletas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerMisComprasDesdeApi()
      .then(setBoletas)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Mis compras</h1>
          <p className="descripcion-seccion">
            Consulta las boletas asociadas a tu cuenta.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          {!error && boletas.length === 0 && (
            <p className="descripcion-seccion">Todavía no tienes compras registradas.</p>
          )}

          {boletas.map((boleta) => (
            <div className="panel mt-3" key={boleta.id}>
              <div className="d-flex justify-content-between flex-wrap gap-2">
                <h3>Boleta #{boleta.id}</h3>
                <strong>{formatearPrecio(Number(boleta.total))}</strong>
              </div>
              <p>Fecha: {new Date(boleta.fecha).toLocaleString('es-CL')}</p>
              <div className="tabla-seccion">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boleta.detalles?.map((detalle) => (
                      <tr key={detalle.id}>
                        <td>{detalle.producto?.nombre}</td>
                        <td>{detalle.cantidad}</td>
                        <td>{formatearPrecio(Number(detalle.precioUnitario))}</td>
                        <td>{formatearPrecio(Number(detalle.subtotal))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <Link className="boton mt-3" to="/productos">Seguir comprando</Link>
        </div>
      </section>
    </main>
  )
}
