import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { BASE_URL } from '../services/productoService'
import { formatearPrecio } from '../utils/formato'

function enlaceClase({ isActive }) {
  return isActive ? 'activo' : undefined
}

function Navbar() {
  const { totalUnidades, total } = useCarrito()

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
            <NavLink to="/login" className={enlaceClase}>Ingresar</NavLink>
            <NavLink to="/registro" className={enlaceClase}>Registro</NavLink>
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
