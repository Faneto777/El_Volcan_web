import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="grid-footer">
          <div>
            <div className="footer-logo">El Volcán</div>
            <p>
              Distribuidora de gas licuado comprometida con un servicio seguro, rápido y cercano para tu hogar y negocio.
            </p>
          </div>
          <div>
            <h4>Enlaces</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4>Cuenta</h4>
            <ul>
              <li><Link to="/login">Ingresar</Link></li>
              <li><Link to="/registro">Registrarme</Link></li>
            </ul>
          </div>
          <div>
            <h4>Atención</h4>
            <ul>
              <li>Lun a Sáb: 8:00 - 20:00</li>
              <li>Teléfono: +56 9 5555 1234</li>
              <li>Urgencias 24/7</li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">@ 2026 Distribuidora El Volcán. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
