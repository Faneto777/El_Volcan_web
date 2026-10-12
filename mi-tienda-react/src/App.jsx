import { Link, Route, Routes, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductoCard from './components/ProductoCard';
import { useCarrito } from './context/useCarrito';
import { obtenerProductoPorId, obtenerProductos } from './services/productoService';
import { formatearPrecio } from './utils/formato';
import { CategoriaDetalle, Categorias } from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import { Checkout, PagoCorrecto, PagoError } from './pages/Checkout';
import { Login, Registro } from './pages/Auth';
import { Blog, BlogDetalle, Contacto, Nosotros } from './pages/Info';
import { AdminDashboard, AdminProductos } from './pages/Admin';

function Inicio() {
  const { agregar } = useCarrito();
  const productos = obtenerProductos().slice(0, 6);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-texto">
            <span className="hero-badge"><span aria-hidden="true">&#128293;</span> Servicio rápido en tu domicilio</span>
            <h1>Tu gas llegó. <span>El Volcán</span> lo lleva a tu hogar.</h1>
            <p>
              Distribuimos gas licuado para uso doméstico y comercial con cilindros certificados,
              precios justos y despacho a domicilio en toda la comuna.
            </p>
            <div className="hero-acciones">
              <Link to="/productos" className="boton">Ver productos</Link>
              <Link to="/contacto" className="boton boton-secundario">Pedir a domicilio</Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <span className="balon-decorativo">&#128738;</span>
            <p><strong>Distribuidora El Volcán</strong><br />Gas para toda ocasión</p>
          </div>
        </div>
      </section>

      <section className="beneficios">
        <div className="container">
          <div className="grid-beneficios">
            <div className="tarjeta-beneficio">
              <div className="icono-beneficio" aria-hidden="true">&#128666;</div>
              <h3>Despacho a domicilio</h3>
              <p>Llevamos el cilindro hasta tu puerta en tiempo récord.</p>
            </div>
            <div className="tarjeta-beneficio">
              <div className="icono-beneficio" aria-hidden="true">&#128994;</div>
              <h3>Gas de calidad</h3>
              <p>Cilindros certificados y revisados para máxima seguridad.</p>
            </div>
            <div className="tarjeta-beneficio">
              <div className="icono-beneficio" aria-hidden="true">&#128176;</div>
              <h3>Precios justos</h3>
              <p>Tarifas claras y competitivas, sin sorpresas al pagar.</p>
            </div>
            <div className="tarjeta-beneficio">
              <div className="icono-beneficio" aria-hidden="true">&#128737;</div>
              <h3>Personal experto</h3>
              <p>Equipo capacitado para instalar tu gas de forma segura.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="productos">
        <div className="container">
          <h2 className="titulo-seccion">Catálogo El Volcán</h2>
          <p className="descripcion-seccion">
            Los cilindros más pedidos de nuestra distribuidora. Revisa el catálogo completo con todas las
            tarifas de gas, reguladores, mangueras y accesorios.
          </p>
          <div className="grid-productos grid-destacados">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} onAgregar={agregar} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link className="boton" to="/productos">
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>¿Necesitas recarga urgente?</h2>
          <p>Contáctanos y coordina el despacho de tu gas en la misma jornada.</p>
          <Link to="/contacto" className="boton boton-secundario">Solicitar reparto</Link>
        </div>
      </section>
    </main>
  );
}

function Catalogo() {
  const { agregar } = useCarrito();
  const productos = obtenerProductos();

  return (
    <main>
      <section>
        <div className="container">
          <h2 className="titulo-seccion">Productos</h2>
          <p className="descripcion-seccion">
            Catálogo completo de cilindros, reguladores, mangueras y accesorios.
          </p>
          <div className="grid-productos">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} onAgregar={agregar} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Detalle() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const producto = obtenerProductoPorId(id);

  if (!producto) {
    return (
      <main>
        <section>
          <div className="container text-center">
            <h2 className="titulo-seccion">Producto no encontrado</h2>
            <Link className="boton mt-3" to="/productos">Volver al catálogo</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <div className="container">
          <div className="panel">
            <div className="grid-formulario">
              <div>
                <img src={producto.imagen} alt={producto.nombre} style={{ borderRadius: '10px' }} />
              </div>
              <div>
                <h1>{producto.nombre}</h1>
                <p className="producto-descripcion">{producto.descripcion}</p>
                <p className="producto-precio"><small>Precio del producto</small>{formatearPrecio(producto.precio)}</p>
                <p>Stock: {producto.stock}</p>
                <button
                  type="button"
                  className="btn-agregar-carrito"
                  onClick={() => agregar(producto)}
                  disabled={producto.stock <= 0}
                >
                  {producto.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Carrito() {
  const { items, cambiarCantidad, eliminar, vaciar, total } = useCarrito();

  if (items.length === 0) {
    return (
      <main>
        <section>
          <div className="container text-center">
            <h1 className="titulo-seccion">Carrito vacío</h1>
            <Link className="boton mt-3" to="/productos">Ver productos</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Carrito</h1>
          <div className="panel">
            <div className="tabla-seccion">
              <table>
                <thead><tr><th>Producto</th><th>Cantidad</th><th>Acciones</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nombre} x {item.cantidad}</td>
                      <td>{item.cantidad}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn-agregar-carrito" onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                          <button type="button" className="btn-agregar-carrito" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                          <button type="button" className="boton boton-secundario" onClick={() => eliminar(item.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="producto-precio mt-3"><small>Total</small>{formatearPrecio(total)}</p>
            <div className="d-flex gap-2 mt-2">
              <Link className="boton" to="/checkout">Comprar ahora</Link>
              <button type="button" className="boton boton-secundario" onClick={vaciar}>Vaciar carrito</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Catalogo />} />
        <Route path="/productos/:id" element={<Detalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:id" element={<CategoriaDetalle />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago-correcto" element={<PagoCorrecto />} />
        <Route path="/pago-error" element={<PagoError />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetalle />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App