import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const BLOGS = [
  { id: '1', titulo: 'Seguridad con el gas en el hogar', resumen: 'Consejos para usar cilindros de forma segura.', contenido: 'Revisa mangueras, reguladores y ventilación. Ante olor a gas, ventila y no enciendas fuego.' },
  { id: '2', titulo: '¿Qué cilindro me conviene?', resumen: '5, 11, 15 o 45 kg según tu consumo.', contenido: 'Para 1-2 personas el 5 kg basta, familias usan 11-15 kg y negocios el 45 kg.' },
]

export function Nosotros() {
  return (
    <div className="container mt-5">
      <h1>Nosotros</h1>
      <p className="text-secondary">Distribuidora El Volcán: venta y despacho de gas licuado, cilindros y accesorios para el hogar. Servicio rápido y seguro.</p>
    </div>
  )
}

export function Blog() {
  return (
    <div className="container mt-5">
      <h1>Blog</h1>
      <div className="row g-4 mt-2">
        {BLOGS.map((b) => (
          <div className="col-12 col-md-6" key={b.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{b.titulo}</h5>
                <p className="card-text text-secondary">{b.resumen}</p>
                <Link className="btn btn-outline-primary" to={`/blog/${b.id}`}>Leer más</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BlogDetalle() {
  const { id } = useParams()
  const blog = BLOGS.find((b) => b.id === id)
  if (!blog) {
    return (
      <div className="container mt-5 text-center">
        <h2>Artículo no encontrado</h2>
        <Link className="btn btn-primary mt-3" to="/blog">Volver al blog</Link>
      </div>
    )
  }
  return (
    <div className="container mt-5">
      <h1>{blog.titulo}</h1>
      <p>{blog.contenido}</p>
      <Link className="btn btn-outline-secondary" to="/blog">Volver</Link>
    </div>
  )
}

export function Contacto() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    if (nombre.trim().length < 3) {
      setError('Ingresa un nombre válido.')
      return
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)) {
      setError('Ingresa un correo válido.')
      return
    }
    if (mensaje.trim().length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres.')
      return
    }
    setError('')
    setOk('Gracias por escribirnos. Te responderemos a la brevedad.')
    setNombre('')
    setCorreo('')
    setMensaje('')
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '640px' }}>
      <h1>Contacto</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}
      <form onSubmit={enviar} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="nombre">Nombre</label>
          <input id="nombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="correo">Correo</label>
          <input id="correo" type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="mensaje">Mensaje</label>
          <textarea id="mensaje" className="form-control" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  )
}
