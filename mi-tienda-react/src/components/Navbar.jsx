import { Link, NavLink } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { formatearPrecio } from '../utils/formato'

function Navbar() {
  const { totalUnidades, total } = useCarrito()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/assets/logo/logosinfondo.png" alt="Logo El Volcán" height="36" />
          El Volcán
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Mostrar menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Productos</NavLink>
            </li>
          </ul>

          <Link className="btn btn-success" to="/carrito">
            🛒 Carrito ({totalUnidades}) {formatearPrecio(total)}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar