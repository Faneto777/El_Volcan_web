import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MapaEntregas from '../components/MapaEntregas'
import { BASE_URL } from '../services/productoService'
import { ESTADOS_PEDIDO, actualizarPedido, obtenerPedidos, obtenerRepartidores } from '../services/pedidosService'
import { CLAVE_SESION_PERSONAL, leerSesionPersonal } from '../services/sesionPersonal'
import { actualizarUsuario, crearUsuario, eliminarUsuario, obtenerUsuarios } from '../services/usuariosService'

function cerrarSesion(navigate) {
  localStorage.removeItem(CLAVE_SESION_PERSONAL)
  navigate('/personal')
}

function AdminSistema() {
  const navigate = useNavigate()
  const sesion = leerSesionPersonal()
  const [pestana, setPestana] = useState('pedidos')
  const [pedidos, setPedidos] = useState(obtenerPedidos)
  const [usuarios, setUsuarios] = useState(obtenerUsuarios)
  const [modalUsuario, setModalUsuario] = useState(null)
  const [formUsuario, setFormUsuario] = useState({ nombre: '', email: '', password: 'demo123', rol: 'repartidor', activo: true })
  const [errorUsuario, setErrorUsuario] = useState('')

  const refrescarPedidos = () => setPedidos(obtenerPedidos())
  const refrescarUsuarios = () => setUsuarios(obtenerUsuarios())

  const total = pedidos.length
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const camino = pedidos.filter((p) => p.estado === 'camino').length
  const entregados = pedidos.filter((p) => p.estado === 'entregado').length
  const repartidores = obtenerRepartidores()
  const clientes = usuarios.filter((u) => u.rol === 'cliente').length

  const cambiarPedido = (id, cambios) => {
    actualizarPedido(id, cambios)
    refrescarPedidos()
  }

  const abrirNuevoUsuario = () => {
    setFormUsuario({ nombre: '', email: '', password: 'demo123', rol: 'repartidor', activo: true })
    setErrorUsuario('')
    setModalUsuario({ modo: 'nuevo' })
  }

  const abrirEditarUsuario = (usuario) => {
    setFormUsuario({ ...usuario })
    setErrorUsuario('')
    setModalUsuario({ modo: 'editar', emailOriginal: usuario.email })
  }

  const guardarUsuario = (e) => {
    e.preventDefault()
    if (!formUsuario.nombre.trim() || !formUsuario.email.includes('@')) {
      setErrorUsuario('Nombre y correo válido son obligatorios.')
      return
    }
    try {
      if (modalUsuario.modo === 'nuevo') {
        crearUsuario(formUsuario)
      } else {
        actualizarUsuario(modalUsuario.emailOriginal, formUsuario)
      }
      setModalUsuario(null)
      refrescarUsuarios()
    } catch (err) {
      setErrorUsuario(err.message)
    }
  }

  const maxCarga = Math.max(1, ...repartidores.map((r) => pedidos.filter((p) => p.repartidor === r).length))

  return (
    <>
      <header className="header-admin">
        <div className="marca-admin">
          <img src={`${BASE_URL}assets/logo/logosinfondo.png`} alt="El Volcán" className="logo-admin" />
          <div>
            <h1>El Volcán</h1>
            <span className="subtitulo-panel">Panel de administración</span>
          </div>
        </div>
        <div className="info-admin">
          <span>Administradora: <span>{sesion?.nombre ?? '—'}</span></span>
          <span className="separador-admin">|</span>
          <button type="button" className="boton-cerrar-sesion" onClick={() => cerrarSesion(navigate)}>Cerrar Sesión</button>
        </div>
      </header>

      <main className="dashboard-admin">
        <section className="kpis-grid" aria-label="Indicadores del sistema">
          <div className="kpi kpi-total"><p>Pedidos registrados</p><h2>{total}</h2></div>
          <div className="kpi kpi-pendientes"><p>Pendientes</p><h2>{pendientes}</h2></div>
          <div className="kpi kpi-camino"><p>En camino</p><h2>{camino}</h2></div>
          <div className="kpi kpi-entregados"><p>Entregados</p><h2>{entregados}</h2></div>
          <div className="kpi kpi-ingresos"><p>Pedidos en reparto</p><h2>{camino}</h2></div>
          <div className="kpi kpi-repartidores"><p>Repartidores activos</p><h2>{repartidores.length}</h2></div>
          <div className="kpi kpi-clientes"><p>Clientes registrados</p><h2>{clientes}</h2></div>
        </section>

        <nav className="tabs-admin" aria-label="Secciones del panel">
          <button type="button" className={`tab-admin${pestana === 'pedidos' ? ' activo' : ''}`} onClick={() => setPestana('pedidos')}>📦 Pedidos</button>
          <button type="button" className={`tab-admin${pestana === 'usuarios' ? ' activo' : ''}`} onClick={() => setPestana('usuarios')}>👥 Usuarios y roles</button>
          <button type="button" className={`tab-admin${pestana === 'reportes' ? ' activo' : ''}`} onClick={() => setPestana('reportes')}>📊 Reportes</button>
          <Link className="tab-admin" to="/admin">🏪 Tienda</Link>
        </nav>

        {pestana === 'pedidos' && (
          <section className="pestana">
            <div className="panel-admin">
              <div className="panel-header-admin">
                <div>
                  <h3>Pedidos del sistema</h3>
                  <p className="panel-subtitulo-admin">Acceso total: cambia estados y asigna repartidores.</p>
                </div>
              </div>
              <div className="tabla-contenedor-admin">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Dirección</th>
                      <th>Cilindro</th>
                      <th>Estado</th>
                      <th>Repartidor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>{pedido.cliente}</td>
                        <td>{pedido.direccion}</td>
                        <td>{pedido.cilindro}</td>
                        <td>
                          <select value={pedido.estado} onChange={(e) => cambiarPedido(pedido.id, { estado: e.target.value })} aria-label={`Estado del pedido ${pedido.id}`}>
                            {Object.keys(ESTADOS_PEDIDO).map((clave) => (
                              <option key={clave} value={clave}>{ESTADOS_PEDIDO[clave]}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select value={pedido.repartidor} onChange={(e) => cambiarPedido(pedido.id, { repartidor: e.target.value })} aria-label={`Repartidor del pedido ${pedido.id}`}>
                            <option value="">Sin asignar</option>
                            {repartidores.map((rep) => (
                              <option key={rep} value={rep}>{rep}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {pestana === 'usuarios' && (
          <section className="pestana">
            <div className="panel-admin">
              <div className="panel-header-admin">
                <div>
                  <h3>Usuarios del sistema</h3>
                  <p className="panel-subtitulo-admin">Crea, edita, desactiva o reasigna roles de usuario.</p>
                </div>
                <button type="button" className="btn-nuevo-admin" onClick={abrirNuevoUsuario}>+ Nuevo usuario</button>
              </div>
              <div className="tabla-contenedor-admin">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.email}>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>{u.rol}</td>
                        <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button type="button" className="boton boton-secundario" onClick={() => abrirEditarUsuario(u)}>Editar</button>
                            <button type="button" className="boton boton-secundario" onClick={() => { eliminarUsuario(u.email); refrescarUsuarios() }}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {pestana === 'reportes' && (
          <section className="pestana">
            <div className="grid-reportes">
              <div className="panel-admin">
                <div className="panel-header-admin">
                  <h3>Carga por repartidor</h3>
                  <p className="panel-subtitulo-admin">Pedidos asignados por cada repartidor.</p>
                </div>
                {repartidores.map((rep) => {
                  const carga = pedidos.filter((p) => p.repartidor === rep).length
                  return (
                    <div key={rep} style={{ marginBottom: '10px' }}>
                      <p>{rep}: {carga}</p>
                      <div style={{ background: '#eef1f5', borderRadius: '6px' }}>
                        <div style={{ width: `${Math.round((carga / maxCarga) * 100)}%`, background: '#0d2b45', color: '#fff', borderRadius: '6px', padding: '2px 8px' }}>{carga}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="panel-admin">
                <div className="panel-header-admin">
                  <h3>Pedidos por estado</h3>
                  <p className="panel-subtitulo-admin">Distribución actual de los pedidos.</p>
                </div>
                {Object.keys(ESTADOS_PEDIDO).map((clave) => {
                  const n = pedidos.filter((p) => p.estado === clave).length
                  return (
                    <div key={clave} style={{ marginBottom: '10px' }}>
                      <p>{ESTADOS_PEDIDO[clave]}: {n}</p>
                      <div style={{ background: '#eef1f5', borderRadius: '6px' }}>
                        <div style={{ width: `${total === 0 ? 0 : Math.round((n / total) * 100)}%`, background: '#ff6b2b', color: '#fff', borderRadius: '6px', padding: '2px 8px' }}>{n}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="panel-admin panel-mapa-admin">
                <div className="panel-header-admin">
                  <h3>Mapa de entregas</h3>
                  <p className="panel-subtitulo-admin">Todos los destinos del sistema (Chillán y alrededores).</p>
                </div>
                <MapaEntregas id="mapa-admin" pedidos={pedidos} />
              </div>
            </div>
          </section>
        )}
      </main>

      {modalUsuario && (
        <div className="overlay-modal abierto" onClick={(e) => { if (e.target.className.includes('overlay-modal')) setModalUsuario(null) }}>
          <div className="modal usuario-modal">
            <div className="modal-header">
              <h3>{modalUsuario.modo === 'nuevo' ? 'Nuevo usuario' : 'Editar usuario'}</h3>
              <button type="button" className="boton-cerrar-modal" aria-label="Cerrar" onClick={() => setModalUsuario(null)}>&#10005;</button>
            </div>
            {errorUsuario && <div className="alert alert-danger">{errorUsuario}</div>}
            <form onSubmit={guardarUsuario} noValidate>
              <div className="campo-modal">
                <label htmlFor="usuario-nombre">Nombre <span className="requerido">*</span></label>
                <input type="text" id="usuario-nombre" value={formUsuario.nombre} onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} placeholder="Nombre completo" autoComplete="off" />
              </div>
              <div className="campo-modal">
                <label htmlFor="usuario-email">Correo <span className="requerido">*</span></label>
                <input type="email" id="usuario-email" value={formUsuario.email} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} placeholder="nombre@gmail.com" autoComplete="off" disabled={modalUsuario.modo === 'editar'} />
              </div>
              <div className="campo-modal">
                <label htmlFor="usuario-rol">Rol <span className="requerido">*</span></label>
                <select id="usuario-rol" value={formUsuario.rol} onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })}>
                  <option value="repartidor">Repartidor</option>
                  <option value="operador">Operador</option>
                  <option value="administrador">Administrador</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
              <label className="campo-check">
                <input type="checkbox" checked={formUsuario.activo} onChange={(e) => setFormUsuario({ ...formUsuario, activo: e.target.checked })} />
                <span>Cuenta activa (puede iniciar sesión)</span>
              </label>
              <div className="modal-acciones">
                <button type="button" className="boton-cancelar" onClick={() => setModalUsuario(null)}>Cancelar</button>
                <button type="submit" className="btn-crear usuario-guardar">Guardar usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminSistema
