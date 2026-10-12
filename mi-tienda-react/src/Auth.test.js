import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Login, Registro } from './pages/Auth'

const CLAVE_SESION = 'elvolcan_usuario'

const montar = (ruta, elemento) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/" element={<p>PAGINA INICIO</p>} />
        <Route path={ruta} element={elemento} />
      </Routes>
    </MemoryRouter>
  )

const escribir = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })

describe('Formulario de Login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar error si el correo es invalido', () => {
    montar('/login', <Login />)

    escribir('Correo', 'correo-sin-arroba')
    escribir('Contraseña', 'abc12345')
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(screen.getByText('Ingresa un correo electrónico válido.')).not.toBeNull()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('deberia bloquear el ingreso si la contraseña tiene menos de 6 caracteres', () => {
    montar('/login', <Login />)

    escribir('Correo', 'jose@correo.cl')
    escribir('Contraseña', '12345')
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).not.toBeNull()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
    expect(screen.queryByText('PAGINA INICIO')).toBeNull()
  })

  it('deberia guardar la sesion y navegar al inicio con datos validos', () => {
    montar('/login', <Login />)

    escribir('Correo', 'jose@correo.cl')
    escribir('Contraseña', 'abc12345')
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    expect(screen.getByText('PAGINA INICIO')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).correo).toBe('jose@correo.cl')
  })

  it('deberia entrar con la cuenta demo sin escribir nada', () => {
    montar('/login', <Login />)

    fireEvent.click(screen.getByRole('button', { name: /usar cuenta demo/i }))

    expect(screen.getByText('PAGINA INICIO')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).correo).toBe('clientedemo@gmail.com')
  })
})

describe('Formulario de Registro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const llenar = ({ nombre, correo, password, confirmar }) => {
    escribir('Nombre', nombre)
    escribir('Correo', correo)
    escribir('Contraseña', password)
    escribir('Confirmar contraseña', confirmar)
    fireEvent.click(screen.getByRole('button', { name: /registrarme/i }))
  }

  const valido = {
    nombre: 'Jose Perez',
    correo: 'jose@correo.cl',
    password: 'clave123',
    confirmar: 'clave123',
  }

  it('deberia mostrar error si el nombre tiene menos de 3 caracteres', () => {
    montar('/registro', <Registro />)

    llenar({ ...valido, nombre: 'Jo' })

    expect(screen.getByText('Ingresa un nombre válido (mínimo 3 letras).')).not.toBeNull()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('deberia mostrar error si la contraseña no tiene numero', () => {
    montar('/registro', <Registro />)

    llenar({ ...valido, password: 'sololetras', confirmar: 'sololetras' })

    expect(
      screen.getByText('La contraseña debe tener al menos 6 caracteres, una letra y un número.')
    ).not.toBeNull()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('deberia mostrar error si confirmar contraseña es distinto', () => {
    montar('/registro', <Registro />)

    llenar({ ...valido, confirmar: 'otraclave9' })

    expect(screen.getByText('Las contraseñas no coinciden.')).not.toBeNull()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('deberia registrar y navegar al inicio con datos validos', () => {
    montar('/registro', <Registro />)

    llenar(valido)

    expect(screen.getByText('PAGINA INICIO')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).nombre).toBe('Jose Perez')
  })
})