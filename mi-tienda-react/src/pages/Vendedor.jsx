import { useEffect, useState } from 'react'
import {
    obtenerBoletaPorIdDesdeApi,
    obtenerBoletasDesdeApi,
    obtenerProductosDesdeApi,
} from '../services/productoService'
import { formatearPrecio } from '../utils/formato'

function Vendedor() {
    const [productos, setProductos] = useState([])
    const [boletas, setBoletas] = useState([])
    const [boletaSeleccionada, setBoletaSeleccionada] = useState(null)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        let activo = true

        Promise.all([obtenerProductosDesdeApi(), obtenerBoletasDesdeApi()])
            .then(([listaProductos, listaBoletas]) => {
                if (!activo) return
                setProductos(listaProductos)
                setBoletas(listaBoletas)
            })
            .catch((err) => {
                if (activo) setError(err.message)
            })
            .finally(() => {
                if (activo) setCargando(false)
            })

        return () => {
            activo = false
        }
    }, [])

    async function verBoleta(id) {
        try {
            setError('')
            setBoletaSeleccionada(await obtenerBoletaPorIdDesdeApi(id))
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <main className="container py-4">
            <h1 className="h3 mb-4">Panel vendedor</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {cargando && <p>Cargando datos del backend...</p>}

            <section className="mb-5">
                <h2 className="h5">Productos del catálogo</h2>
                <div className="table-responsive">
                    <table className="table table-sm table-striped align-middle">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.categoria?.nombre ?? producto.categoria?.id ?? '-'}</td>
                                <td>{formatearPrecio(producto.precio)}</td>
                                <td>{producto.stock}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-5">
                <h2 className="h5">Órdenes (boletas)</h2>
                <div className="table-responsive">
                    <table className="table table-sm table-striped align-middle">
                        <thead>
                        <tr>
                            <th>N°</th>
                            <th>Cliente</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {boletas.map((boleta) => (
                            <tr key={boleta.id}>
                                <td>{boleta.id}</td>
                                <td>{boleta.usuario?.email ?? '-'}</td>
                                <td>{boleta.estado}</td>
                                <td>{formatearPrecio(boleta.total)}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => verBoleta(boleta.id)}
                                    >
                                        Ver detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {boletaSeleccionada && (
                <section className="card card-body">
                    <h2 className="h5">Boleta N° {boletaSeleccionada.id}</h2>
                    <p>Estado: {boletaSeleccionada.estado}</p>
                    <ul>
                        {boletaSeleccionada.detalles?.map((detalle, i) => (
                            <li key={i}>
                                {detalle.producto?.nombre} × {detalle.cantidad}
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setBoletaSeleccionada(null)}
                    >
                        Cerrar
                    </button>
                </section>
            )}
        </main>
    )
}

export default Vendedor