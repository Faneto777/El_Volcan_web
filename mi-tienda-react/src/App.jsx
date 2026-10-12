import { Link, Route, Routes, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Catálogo El Volcán</h1>
      <div className="row g-4">
        {productos.map((producto) => (
          <div className="col-12 col-md-4" key={producto.id}>
            <ProductoCard producto={producto} onAgregar={agregar} />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link className="btn btn-outline-primary" to="/productos">
          Ver catálogo completo
        </Link>
      </div>
    </div>
  );
}

function Catalogo() {
  const { agregar } = useCarrito();
  const productos = obtenerProductos();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Productos</h1>
      <div className="row g-4">
        {productos.map((producto) => (
          <div className="col-12 col-md-4" key={producto.id}>
            <ProductoCard producto={producto} onAgregar={agregar} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Detalle() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const producto = obtenerProductoPorId(id);

  if (!producto) {
    return (
      <div className="container mt-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link className="btn btn-primary mt-3" to="/productos">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
        </div>
        <div className="col-12 col-md-6">
          <h1>{producto.nombre}</h1>
          <p className="text-secondary">{producto.descripcion}</p>
          <p className="fs-4 fw-bold">{formatearPrecio(producto.precio)}</p>
          <p>Stock: {producto.stock}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => agregar(producto)}
            disabled={producto.stock <= 0}
          >
            {producto.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Carrito() {
  const { items, cambiarCantidad, eliminar, vaciar, total } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h1>Carrito vacío</h1>
        <Link className="btn btn-primary mt-3" to="/productos">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Carrito</h1>
      <ul className="list-group mb-3">
        {items.map((item) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
            <span>{item.nombre} x {item.cantidad}</span>
            <span className="d-flex gap-2 align-items-center">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(item.id, -1)}>-</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => eliminar(item.id)}>Eliminar</button>
            </span>
          </li>
        ))}
      </ul>
      <p className="fs-4">Total: <strong>{formatearPrecio(total)}</strong></p>
      <div className="d-flex gap-2">
        <Link className="btn btn-success" to="/checkout">Comprar ahora</Link>
        <button type="button" className="btn btn-outline-danger" onClick={vaciar}>Vaciar carrito</button>
      </div>
    </div>
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
    </>
  );
}

export default App