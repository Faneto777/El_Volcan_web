import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RUTA_INICIO_POR_ROL, SESION_PERSONAL_POR_ROL } from '../services/sesion'

const CLAVE_SESION = 'elvolcan_usuario'
const CLAVE_SESION_PERSONAL = 'elvolcan_sesion_personal'
const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:8080/api/v1'

function validarEmail(correo) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correo)
}

export function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const ingresar = async (e) => {
    e.preventDefault()
    if (!validarEmail(correo)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: correo,
          password,
        }),
      })

      if (!respuesta.ok) {
        throw new Error('Credenciales invalidas')
      }

      const datos = await respuesta.json()
      const rol = datos.rol?.toUpperCase()
      localStorage.setItem(
          CLAVE_SESION,
          JSON.stringify({
            nombre: datos.nombre,
            correo: datos.email,
            rol,
            token: datos.token,
          })
      )

      const rolPersonal = SESION_PERSONAL_POR_ROL[rol]
      if (rolPersonal) {
        localStorage.setItem(
            CLAVE_SESION_PERSONAL,
            JSON.stringify({
              nombre: datos.nombre,
              email: datos.email,
              rol: rolPersonal,
            })
        )
      } else {
        localStorage.removeItem(CLAVE_SESION_PERSONAL)
      }

      navigate(RUTA_INICIO_POR_ROL[rol] ?? '/')
    } catch (err) {
      setError('Correo o contraseña incorrectos.')
    }
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
            <p className="text-center mt-3">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
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

  const registrar = async (e) => {
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

    try {
      const respuesta = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email: correo, password }),
      })

      if (!respuesta.ok) {
        const datos = await respuesta.json().catch(() => null)
        throw new Error(datos?.detail || datos?.message || 'No se pudo crear la cuenta')
      }

      const datos = await respuesta.json()
      localStorage.setItem(
          CLAVE_SESION,
          JSON.stringify({
            nombre: datos.nombre,
            correo: datos.email,
            rol: datos.rol?.toUpperCase(),
            token: datos.token,
          })
      )
      localStorage.removeItem(CLAVE_SESION_PERSONAL)
      navigate('/')
    } catch (err) {
      setError('Correo o contraseña incorrectos.')
    }
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
