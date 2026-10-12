import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CLAVE_SESION_PERSONAL } from './services/sesionPersonal'
import { Personal } from './pages/Personal'

const montar = () =>
  render(
    <MemoryRouter initialEntries={['/personal']}>
      <Routes>
        <Route path="/personal" element={<Personal />} />
        <Route path="/admin" element={<p>PANEL ADMIN</p>} />
        <Route path="/operador" element={<p>PANEL OPERADOR</p>} />
        <Route path="/repartidor" element={<p>PANEL REPARTIDOR</p>} />
      </Routes>
    </MemoryRouter>
  )

const entrar = (correo, password) => {
  fireEvent.change(screen.getByLabelText('Correo interno'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: /entrar al panel/i }))
}

describe('Acceso del personal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar error con credenciales incorrectas', () => {
    montar()

    entrar('nadie@correo.cl', 'clave123')

    expect(screen.getByText('Correo o contraseña incorrectos. Usa una de las cuentas señaladas.')).not.toBeNull()
    expect(localStorage.getItem(CLAVE_SESION_PERSONAL)).toBeNull()
  })

  it('deberia entrar al panel admin con la cuenta administradora', () => {
    montar()

    entrar('administradora@gmail.com', 'admin123')

    expect(screen.getByText('PANEL ADMIN')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION_PERSONAL)).rol).toBe('administrador')
  })

  it('deberia entrar al panel de la operadora', () => {
    montar()

    entrar('operador@gmail.com', 'volcan123')

    expect(screen.getByText('PANEL OPERADOR')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION_PERSONAL)).rol).toBe('operador')
  })

  it('deberia entrar al panel del repartidor', () => {
    montar()

    entrar('repartidordemo@gmail.com', 'demo123')

    expect(screen.getByText('PANEL REPARTIDOR')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION_PERSONAL)).rol).toBe('repartidor')
  })
})
