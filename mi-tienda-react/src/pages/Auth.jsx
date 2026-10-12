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

  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h1 className="text-center mb-4">Iniciar sesión</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={ingresar} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="correo">Correo</label>
          <input id="correo" type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Contraseña</label>
          <input id="password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
      </form>
      <p className="text-center mt-3">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
    </div>
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
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h1 className="text-center mb-4">Crear cuenta</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={registrar} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="nombre">Nombre</label>
          <input id="nombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="correo">Correo</label>
          <input id="correo" type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Contraseña</label>
          <input id="password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="confirmar">Confirmar contraseña</label>
          <input id="confirmar" type="password" className="form-control" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Registrarme</button>
      </form>
    </div>
  )
}
