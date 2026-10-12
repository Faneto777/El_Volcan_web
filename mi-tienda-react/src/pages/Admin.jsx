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
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Panel administrador</h1>
          <div className="grid-beneficios">
            <div className="tarjeta-beneficio">
              <h3>Productos</h3>
              <p className="producto-precio">{productos.length}</p>
            </div>
            <div className="tarjeta-beneficio">
              <h3>Stock total</h3>
              <p className="producto-precio">{stockTotal}</p>
            </div>
            <div className="tarjeta-beneficio">
              <h3>En oferta</h3>
              <p className="producto-precio">{enOferta}</p>
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <Link className="boton" to="/admin/productos">Gestionar productos</Link>
            <Link className="boton boton-secundario" to="/admin/sistema">Sistema administrativo</Link>
            <Link className="boton boton-secundario" to="/">Ver tienda</Link>
          </div>
        </div>
      </section>
    </main>
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
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Productos</h1>
          <div className="panel">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={guardar} className="grid-formulario">
              <div className="campo"><input placeholder="Código" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></div>
              <div className="campo"><input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
              <div className="campo"><input type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} /></div>
              <div className="campo"><input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
              <div className="campo">
                <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                  <option value="cilindros">Cilindros</option>
                  <option value="reguladores">Reguladores</option>
                  <option value="mangueras">Mangueras</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>
              <div className="campo"><button type="submit" className="boton">Guardar</button></div>
            </form>
            <div className="tabla-seccion mt-4">
              <table>
                <thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
                <tbody>
                  {lista.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{formatearPrecio(p.precio)}</td>
                      <td>{p.stock}</td>
                      <td><button type="button" className="boton boton-secundario" onClick={() => eliminar(p.id)}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="boton boton-secundario mt-3" onClick={() => { restablecerProductos(); refrescar() }}>Restablecer</button>
          </div>
        </div>
      </section>
    </main>
  )
}
