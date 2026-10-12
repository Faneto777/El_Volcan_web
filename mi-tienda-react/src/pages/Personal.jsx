import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MapaEntregas from '../components/MapaEntregas'
import { BASE_URL } from '../services/productoService'
import { ESTADOS_PEDIDO, actualizarPedido, crearPedido, obtenerPedidos, obtenerRepartidores } from '../services/pedidosService'
import { CLAVE_SESION_PERSONAL, iniciarSesionPersonal, leerSesionPersonal } from '../services/sesionPersonal'

export function Personal() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const entrar = (e) => {
    e.preventDefault()
    const sesion = iniciarSesionPersonal(correo.trim(), password)
    if (!sesion) {
      setError('Correo o contraseña incorrectos. Usa una de las cuentas señaladas.')
      return
    }
    navigate(sesion.destino)
  }

  return (
    <main>
      <section>
        <div className="container" style={{ maxWidth: '520px' }}>
          <h1 className="titulo-seccion">Acceso del personal</h1>
          <p className="descripcion-seccion">Ingreso exclusivo para el personal interno de la distribuidora.</p>
          <div className="panel">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={entrar} noValidate>
              <div className="campo">
                <label htmlFor="correo">Correo interno</label>
                <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="operador@gmail.com" />
              </div>
              <div className="campo">
                <label htmlFor="password">Contraseña</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" />
              </div>
              <button type="submit" className="boton boton-ancho">Entrar al panel</button>
            </form>
            <div className="panel-demo">
              <p><strong>Administradora:</strong> <code>administradora@gmail.com</code> / <code>admin123</code></p>
              <p><strong>Operadora:</strong> <code>operador@gmail.com</code> / <code>volcan123</code></p>
              <p><strong>Repartidor:</strong> <code>repartidordemo@gmail.com</code> / <code>demo123</code></p>
            </div>
            <p className="text-center mt-3"><Link to="/login">Volver al ingreso de clientes</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

function leerSesion() {
  return leerSesionPersonal()
}

function cerrarSesionPersonal(navigate) {
  localStorage.removeItem(CLAVE_SESION_PERSONAL)
  navigate('/personal')
}

export function Operador() {
  const navigate = useNavigate()
  const sesion = leerSesion()
  const [pedidos, setPedidos] = useState(obtenerPedidos)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevo, setNuevo] = useState({ cliente: '', direccion: '', cilindro: '5 kg' })

  const refrescar = () => setPedidos(obtenerPedidos())
  const hoy = pedidos.length
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const enCamino = pedidos.filter((p) => p.estado === 'camino').length
  const entregados = pedidos.filter((p) => p.estado === 'entregado').length
  const repartidores = obtenerRepartidores()

  const cambiarPedido = (id, cambios) => {
    actualizarPedido(id, cambios)
    refrescar()
  }

  const guardarPedido = (e) => {
    e.preventDefault()
    if (!nuevo.cliente.trim() || !nuevo.direccion.trim()) return
    crearPedido(nuevo)
    setNuevo({ cliente: '', direccion: '', cilindro: '5 kg' })
    setModalAbierto(false)
    refrescar()
  }

  return (
    <>
      <header className="header-operador">
        <div className="marca-operador">
          <img src={`${BASE_URL}assets/logo/logosinfondo.png`} alt="El Volcán" className="logo-operador" />
          <h2>El Volcán</h2>
        </div>
        <div className="info-operador">
          <span>Operadora: <span>{sesion?.nombre ?? 'Sin sesión'}</span></span>
          <span className="separador">|</span>
          <button type="button" className="boton-cerrar-sesion" onClick={() => cerrarSesionPersonal(navigate)}>Cerrar Sesión</button>
        </div>
      </header>

      <main className="dashboard">
        <section className="col-izquierda">
          <div className="tarjetas-grid">
            <div className="tarjeta t-hoy"><p>Pedidos Hoy</p><h2>{hoy}</h2></div>
            <div className="tarjeta t-pendientes"><p>Pendientes</p><h2>{pendientes}</h2></div>
            <div className="tarjeta t-camino"><p>En Camino</p><h2>{enCamino}</h2></div>
            <div className="tarjeta t-entregados"><p>Entregados</p><h2>{entregados}</h2></div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Pedidos del Día</h3>
                <p className="panel-subtitulo">Gestiona, crea y asigna los pedidos activos.</p>
              </div>
              <button type="button" className="btn-nuevo" onClick={() => setModalAbierto(true)}>+ Nuevo Pedido</button>
            </div>

            <div className="tabla-contenedor">
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
                  {pedidos.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: '#777' }}>No hay pedidos registrados.</td></tr>
                  )}
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

        <section className="col-derecha">
          <div className="panel panel-mapa">
            <h3>Mapa de Entregas</h3>
            <p className="panel-subtitulo">Ubicación en tiempo real de repartidores y destinos.</p>
            <MapaEntregas id="mapa-operador" pedidos={pedidos} />
          </div>
        </section>
      </main>

      {modalAbierto && (
        <div className="overlay-modal abierto" onClick={(e) => { if (e.target.className.includes('overlay-modal')) setModalAbierto(false) }}>
          <div className="modal">
            <div className="modal-header">
              <h3>Nuevo Pedido</h3>
              <button type="button" className="boton-cerrar-modal" aria-label="Cerrar" onClick={() => setModalAbierto(false)}>&#10005;</button>
            </div>
            <form onSubmit={guardarPedido} noValidate>
              <div className="campo-modal">
                <label htmlFor="nuevo-cliente">Cliente <span className="requerido">*</span></label>
                <input type="text" id="nuevo-cliente" value={nuevo.cliente} onChange={(e) => setNuevo({ ...nuevo, cliente: e.target.value })} placeholder="Nombre del cliente" autoComplete="off" />
              </div>
              <div className="campo-modal">
                <label htmlFor="nuevo-direccion">Dirección <span className="requerido">*</span></label>
                <input type="text" id="nuevo-direccion" value={nuevo.direccion} onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })} placeholder="Dirección de despacho" autoComplete="off" />
              </div>
              <div className="campo-modal">
                <label htmlFor="nuevo-cilindro">Cilindro <span className="requerido">*</span></label>
                <select id="nuevo-cilindro" value={nuevo.cilindro} onChange={(e) => setNuevo({ ...nuevo, cilindro: e.target.value })}>
                  <option value="5 kg">5 kg</option>
                  <option value="11 kg">11 kg</option>
                  <option value="15 kg">15 kg</option>
                  <option value="45 kg">45 kg</option>
                </select>
              </div>
              <div className="modal-acciones">
                <button type="button" className="boton-cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn-crear">Crear pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function Repartidor() {
  const navigate = useNavigate()
  const sesion = leerSesion()
  const [pedidos, setPedidos] = useState(obtenerPedidos)
  const [vista, setVista] = useState('pedidos')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const mios = pedidos.filter((p) => !sesion || p.repartidor === sesion.nombre || p.repartidor === '')
  const visibles = (mios.length > 0 ? mios : pedidos).slice().sort((a, b) => {
    if (a.estado === 'entregado' && b.estado !== 'entregado') return 1
    if (b.estado === 'entregado' && a.estado !== 'entregado') return -1
    return 0
  })

  const avanzar = (id, estado) => {
    actualizarPedido(id, { estado })
    setPedidos(obtenerPedidos())
  }

  const cerrar = () => {
    cerrarSesionPersonal(navigate)
  }

  return (
    <div className="app-movil">
      <header className="barra-superior">
        <button type="button" className="boton-menu" aria-label="Abrir menú" onClick={() => setMenuAbierto(!menuAbierto)}>
          <span></span><span></span><span></span>
        </button>
        <div className="titulo-barra">
          <span className="titulo-marca">El Volcán</span>
          <span className="subtitulo-marca">{sesion?.nombre ?? 'Repartidor'}</span>
        </div>
        <span className="estado-en-linea" title="Conexión GPS">●</span>
      </header>

      <nav className={`menu-lateral${menuAbierto ? ' abierto' : ''}`} aria-label="Menú del repartidor">
        <div className="perfil-menu">
          <img src={`${BASE_URL}assets/logo/logosinfondo.png`} alt="Logo El Volcán" className="avatar-logo" />
          <div>
            <strong>{sesion?.nombre ?? 'Repartidor'}</strong>
            <small>{sesion?.email ?? '—'}</small>
          </div>
        </div>
        <ul className="lista-menu">
          <li><button type="button" className={`item-menu${vista === 'pedidos' ? ' activo' : ''}`} onClick={() => { setVista('pedidos'); setMenuAbierto(false) }}>📦 Mis pedidos</button></li>
          <li><button type="button" className={`item-menu${vista === 'mapa' ? ' activo' : ''}`} onClick={() => { setVista('mapa'); setMenuAbierto(false) }}>🗺️ Mapa en vivo</button></li>
        </ul>
        <button type="button" className="boton-cerrar-sesion" onClick={cerrar}>Cerrar sesión</button>
      </nav>
      <div className={`overlay-menu${menuAbierto ? ' visible' : ''}`} onClick={() => setMenuAbierto(false)}></div>

      <main className="contenido">
        {vista === 'pedidos' && (
          <section className="seccion" aria-labelledby="tituloPedidos">
            <div className="encabezado-seccion">
              <h2 id="tituloPedidos">Mis entregas</h2>
              <span className="contador-pedidos">{visibles.length}</span>
            </div>
            {visibles.length === 0 && (
              <p className="ayuda">No tienes pedidos asignados por ahora. Vuelve a revisar en un momento.</p>
            )}
            <div className="lista-pedidos">
              {visibles.map((pedido) => (
                <article className={`tarjeta-pedido${pedido.estado === 'entregado' ? ' pedido-finalizado' : ''}`} key={pedido.id}>
                  <header className="cabecera-pedido">
                    <span className="pedido-id">#{pedido.id}</span>
                    <span className={`badge-estado estado-${pedido.estado}`}>{ESTADOS_PEDIDO[pedido.estado] ?? pedido.estado}</span>
                  </header>
                  <h3>{pedido.cliente}</h3>
                  <p className="direccion-pedido">📍 {pedido.direccion}</p>
                  <p className="detalle-pedido">{pedido.cilindro}</p>
                  <div className="acciones-pedido">
                    {pedido.estado === 'pendiente' && (
                      <button type="button" className="boton-accion en-camino" onClick={() => avanzar(pedido.id, 'camino')}>🚚 Marcar en camino</button>
                    )}
                    {pedido.estado === 'camino' && (
                      <button type="button" className="boton-accion entregado" onClick={() => avanzar(pedido.id, 'entregado')}>✅ Marcar entregado</button>
                    )}
                    {pedido.estado === 'entregado' && (
                      <span className="sello-entregado">✔ Entregado</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {vista === 'mapa' && (
          <section className="seccion" aria-labelledby="tituloMapa">
            <div className="encabezado-seccion">
              <h2 id="tituloMapa">Mapa de entregas</h2>
            </div>
            <div className="mapa-contenedor">
              <MapaEntregas id="mapa" pedidos={visibles} />
            </div>
            <p className="ayuda">Toca cualquier marcador para ver el pedido.</p>
          </section>
        )}
      </main>

      <nav className="barra-inferior" aria-label="Navegación rápida">
        <button type="button" className={`item-inferior${vista === 'pedidos' ? ' activo' : ''}`} onClick={() => setVista('pedidos')}>📦<span>Pedidos</span></button>
        <button type="button" className={`item-inferior${vista === 'mapa' ? ' activo' : ''}`} onClick={() => setVista('mapa')}>🗺️<span>Mapa</span></button>
      </nav>
    </div>
  )
}
