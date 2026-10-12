import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { BASE_URL } from '../services/productoService'
import { formatearPrecio } from '../utils/formato'

const CLAVE_SESION_CLIENTE = 'elvolcan_usuario'
const CLAVE_SESION_PERSONAL = 'elvolcan_sesion_personal'

function leerSesion() {
  try {
    const personal = JSON.parse(localStorage.getItem(CLAVE_SESION_PERSONAL))
    if (personal) return { ...personal, esPersonal: true }
  } catch {
    //
  }
  try {
    const cliente = JSON.parse(localStorage.getItem(CLAVE_SESION_CLIENTE))
    if (cliente) return { ...cliente, esPersonal: false }
  } catch {
    //
  }
  return null
}

function enlaceClase({ isActive }) {
  return isActive ? 'activo' : undefined
}

function Navbar() {
  const { totalUnidades, total } = useCarrito()
  const navigate = useNavigate()
  const sesion = leerSesion()

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION_CLIENTE)
    localStorage.removeItem(CLAVE_SESION_PERSONAL)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand">
          <img className="brand-logo" src={`${BASE_URL}assets/logo/logosinfondo.png`} alt="Logo de Distribuidora El Volcán" />
          <span>
            El Volcán
            <small>Gas Licuado</small>
          </span>
        </Link>

        <input type="checkbox" id="menuToggle" className="menu-toggle" hidden />
        <label htmlFor="menuToggle" className="icono-toggle" aria-hidden="true">&#9776;</label>

        <nav>
          <NavLink to="/" end className={enlaceClase}>Inicio</NavLink>
          <NavLink to="/productos" className={enlaceClase}>Productos</NavLink>
          <NavLink to="/categorias" className={enlaceClase}>Categorías</NavLink>
          <NavLink to="/ofertas" className={enlaceClase}>Ofertas</NavLink>
          <NavLink to="/nosotros" className={enlaceClase}>Nosotros</NavLink>
          <NavLink to="/blog" className={enlaceClase}>Blog</NavLink>
          <NavLink to="/contacto" className={enlaceClase}>Contacto</NavLink>
          <div className="area-cuenta">
            {sesion ? (
              <>
                <span className="usuario-activo">
                  👤 {sesion.nombre ?? sesion.email}{sesion.rol ? ` · ${sesion.rol}` : ''}
                </span>
                <button type="button" className="boton-cerrar-sesion" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={enlaceClase}>Ingresar</NavLink>
                <NavLink to="/registro" className={enlaceClase}>Registro</NavLink>
              </>
            )}
          </div>
        </nav>

        <Link className="boton-carrito" to="/carrito" aria-label="Abrir carrito de compras">
          <span aria-hidden="true">&#128722;</span>
          {' '}Carrito ({totalUnidades}) {formatearPrecio(total)}
          <span className={`badge-carrito${totalUnidades === 0 ? ' oculto' : ''}`}>{totalUnidades}</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
