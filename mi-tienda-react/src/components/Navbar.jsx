import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { BASE_URL } from '../services/productoService'
import { CLAVE_SESION_CLIENTE, leerSesionCliente } from '../services/sesion'
import { formatearPrecio } from '../utils/formato'

const CLAVE_SESION_PERSONAL = 'elvolcan_sesion_personal'

function enlaceClase({ isActive }) {
  return isActive ? 'activo' : undefined
}

function Navbar() {
  const { totalUnidades, total } = useCarrito()
  const navigate = useNavigate()
  const sesion = leerSesionCliente()
  const rol = sesion?.rol?.toUpperCase()

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
            {rol === 'ADMIN' && (
                <NavLink to="/admin" className={enlaceClase}>Panel admin</NavLink>
            )}
            {rol === 'ADMIN' && (
                <NavLink to="/operador" className={enlaceClase}>Panel operador</NavLink>
            )}
            {(rol === 'VENDEDOR' || rol === 'ADMIN') && (
                <NavLink to="/vendedor" className={enlaceClase}>Panel vendedor</NavLink>
            )}
            {(rol === 'REPARTIDOR' || rol === 'ADMIN') && (
                <NavLink to="/repartidor" className={enlaceClase}>Panel repartidor</NavLink>
            )}
            {rol === 'CLIENTE' && (
                <NavLink to="/mis-compras" className={enlaceClase}>Mis compras</NavLink>
            )}
            <div className="area-cuenta">
              {sesion ? (
                  <>
                <span className="usuario-activo">
                  👤 {sesion.nombre ?? sesion.correo}{rol ? ` · ${rol}` : ''}
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