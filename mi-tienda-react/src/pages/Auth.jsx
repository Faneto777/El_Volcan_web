import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CLAVE_SESION = 'elvolcan_usuario'

function validarEmail(correo) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)
}

export function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const ingresar = (e) => {
    e.preventDefault()
    if (!validarEmail(correo)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ correo }))
    navigate('/')
  }

  const usarDemo = () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Cliente Demo', correo: 'clientedemo@gmail.com' }))
    navigate('/')
  }

  return (
    <main>
      <section>
        <div className="container" style={{ maxWidth: '480px' }}>
          <h1 className="titulo-seccion">Iniciar sesión</h1>
          <div className="panel">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={ingresar} noValidate>
              <div className="campo">
                <label htmlFor="correo">Correo</label>
                <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="password">Contraseña</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="boton boton-ancho">Ingresar</button>
            </form>
            <div className="panel-demo">
              <p>
                <strong>Cuenta de prueba:</strong> <code>clientedemo@gmail.com</code> / <code>demo123</code>.
                Úsala para simular un inicio de sesión sin registrarte.
              </p>
              <button type="button" className="boton boton-secundario" onClick={usarDemo}>Usar cuenta demo</button>
            </div>
            <p className="text-center mt-3">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
      <p className="text-center">¿Eres personal de la empresa? <Link to="/personal">Acceso del personal</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

export function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')

  const registrar = (e) => {
    e.preventDefault()
    if (nombre.trim().length < 3) {
      setError('Ingresa un nombre válido (mínimo 3 letras).')
      return
    }
    if (!validarEmail(correo)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password)) {
      setError('La contraseña debe tener al menos 6 caracteres, una letra y un número.')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre, correo }))
    navigate('/')
  }

  return (
    <main>
      <section>
        <div className="container" style={{ maxWidth: '480px' }}>
          <h1 className="titulo-seccion">Crear cuenta</h1>
          <div className="panel">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={registrar} noValidate>
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="correo">Correo</label>
                <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="password">Contraseña</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="campo">
                <label htmlFor="confirmar">Confirmar contraseña</label>
                <input id="confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
              </div>
              <button type="submit" className="boton boton-ancho">Registrarme</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
