import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
  restablecerProductos,
} from '../services/productoService'
import { formatearPrecio } from '../utils/formato'

export function AdminDashboard() {
  const productos = obtenerProductos()
  const stockTotal = productos.reduce((s, p) => s + p.stock, 0)
  const enOferta = productos.filter((p) => p.oferta).length

  return (
    <div className="container mt-5">
      <h1>Panel administrador</h1>
      <div className="row g-4 mt-2">
        <div className="col-12 col-md-4">
          <div className="card text-bg-primary"><div className="card-body"><h5>Productos</h5><p className="fs-3 mb-0">{productos.length}</p></div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card text-bg-success"><div className="card-body"><h5>Stock total</h5><p className="fs-3 mb-0">{stockTotal}</p></div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card text-bg-warning"><div className="card-body"><h5>En oferta</h5><p className="fs-3 mb-0">{enOferta}</p></div></div>
        </div>
      </div>
      <div className="mt-4 d-flex gap-2">
        <Link className="btn btn-primary" to="/admin/productos">Gestionar productos</Link>
        <Link className="btn btn-outline-secondary" to="/">Ver tienda</Link>
      </div>
    </div>
  )
}

export function AdminProductos() {
  const [lista, setLista] = useState(obtenerProductos())
  const [form, setForm] = useState({ id: '', nombre: '', precio: '', stock: '', categoria: 'cilindros' })
  const [error, setError] = useState('')

  const refrescar = () => setLista(obtenerProductos())

  const guardar = (e) => {
    e.preventDefault()
    setError('')
    if (!form.id.trim() || !form.nombre.trim()) {
      setError('Código y nombre son obligatorios.')
      return
    }
    const datos = { id: form.id.trim(), nombre: form.nombre.trim(), precio: Number(form.precio) || 0, stock: Number(form.stock) || 0, categoria: form.categoria, descripcion: '', imagen: '' }
    try {
      if (obtenerProductos().some((p) => p.id === datos.id)) {
        actualizarProducto(datos.id, datos)
      } else {
        crearProducto(datos)
      }
      setForm({ id: '', nombre: '', precio: '', stock: '', categoria: 'cilindros' })
      refrescar()
    } catch (err) {
      setError(err.message)
    }
  }

  const eliminar = (id) => {
    eliminarProducto(id)
    refrescar()
  }

  return (
    <div className="container mt-5">
      <h1>Productos</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={guardar} className="row g-2 mt-2">
        <div className="col-6 col-md-2"><input className="form-control" placeholder="Código" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></div>
        <div className="col-6 col-md-3"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
        <div className="col-6 col-md-2"><input className="form-control" type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} /></div>
        <div className="col-6 col-md-2"><input className="form-control" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
        <div className="col-6 col-md-2">
          <select className="form-select" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
            <option value="cilindros">Cilindros</option>
            <option value="reguladores">Reguladores</option>
            <option value="mangueras">Mangueras</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>
        <div className="col-12 col-md-1"><button type="submit" className="btn btn-success w-100">Guardar</button></div>
      </form>
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{formatearPrecio(p.precio)}</td>
                <td>{p.stock}</td>
                <td><button type="button" className="btn btn-sm btn-danger" onClick={() => eliminar(p.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-outline-secondary" onClick={() => { restablecerProductos(); refrescar() }}>Restablecer</button>
    </div>
  )
}
