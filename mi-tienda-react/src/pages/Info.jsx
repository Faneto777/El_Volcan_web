import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const BLOGS = [
  { id: '1', titulo: 'Seguridad con el gas en el hogar', resumen: 'Consejos para usar cilindros de forma segura.', contenido: 'Revisa mangueras, reguladores y ventilación. Ante olor a gas, ventila y no enciendas fuego.' },
  { id: '2', titulo: '¿Qué cilindro me conviene?', resumen: '5, 11, 15 o 45 kg según tu consumo.', contenido: 'Para 1-2 personas el 5 kg basta, familias usan 11-15 kg y negocios el 45 kg.' },
]

export function Nosotros() {
  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Nosotros</h1>
          <p className="descripcion-seccion">Distribuidora El Volcán: venta y despacho de gas licuado, cilindros y accesorios para el hogar. Servicio rápido y seguro.</p>
        </div>
      </section>
    </main>
  )
}

export function Blog() {
  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Blog</h1>
          <div className="grid-beneficios">
            {BLOGS.map((b) => (
              <div className="tarjeta-beneficio" key={b.id} style={{ textAlign: 'left' }}>
                <h3>{b.titulo}</h3>
                <p>{b.resumen}</p>
                <Link className="boton boton-secundario mt-2" to={`/blog/${b.id}`}>Leer más</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export function BlogDetalle() {
  const { id } = useParams()
  const blog = BLOGS.find((b) => b.id === id)
  if (!blog) {
    return (
      <main>
        <section>
          <div className="container text-center">
            <h2 className="titulo-seccion">Artículo no encontrado</h2>
            <Link className="boton mt-3" to="/blog">Volver al blog</Link>
          </div>
        </section>
      </main>
    )
  }
  return (
    <main>
      <section>
        <div className="container">
          <div className="panel">
            <h1>{blog.titulo}</h1>
            <p>{blog.contenido}</p>
            <Link className="boton boton-secundario" to="/blog">Volver</Link>
          </div>
        </div>
      </section>
    </main>
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
    <main>
      <section>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h1 className="titulo-seccion">Contacto</h1>
          <div className="panel">
            {error && <div className="alert alert-danger">{error}</div>}
            {ok && <div className="alert alert-success">{ok}</div>}
            <form onSubmit={enviar} noValidate>
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="correo">Correo</label>
                <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea id="mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
              </div>
              <button type="submit" className="boton">Enviar</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
