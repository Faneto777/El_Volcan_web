import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import CarritoProvider from './context/CarritoProvider'

describe('Pruebas del Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const montar = () =>
    render(
      <BrowserRouter>
        <CarritoProvider>
          <Navbar />
        </CarritoProvider>
      </BrowserRouter>
    )

  it('deberia mostrar el nombre de la tienda', () => {
    montar()

    expect(screen.getByText('El Volcán')).not.toBeNull()
  })

  it('deberia mostrar los links de inicio y productos', () => {
    montar()

    expect(screen.getByText('Inicio')).not.toBeNull()
    expect(screen.getByText('Productos')).not.toBeNull()
  })

  it('deberia mostrar el carrito en cero cuando no hay nada agregado', () => {
    montar()

    expect(screen.getByText(/\(0\)/)).not.toBeNull()
  })

  it('deberia mostrar ingresar y registro cuando no hay sesion', () => {
    montar()

    expect(screen.getByText('Ingresar')).not.toBeNull()
    expect(screen.getByText('Registro')).not.toBeNull()
    expect(screen.queryByRole('button', { name: /cerrar sesión/i })).toBeNull()
  })

  it('deberia mostrar la sesion y cerrar sesion en vez de ingresar', () => {
    localStorage.setItem('elvolcan_sesion_personal', JSON.stringify({ nombre: 'Administradora', email: 'administradora@gmail.com', rol: 'administrador' }))
    montar()

    expect(screen.getByText(/Administradora/)).not.toBeNull()
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).not.toBeNull()
    expect(screen.queryByText('Ingresar')).toBeNull()
    expect(screen.queryByText('Registro')).toBeNull()
  })

  it('deberia volver a mostrar ingresar al cerrar sesion', () => {
    localStorage.setItem('elvolcan_usuario', JSON.stringify({ correo: 'jose@correo.cl' }))
    montar()

    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }))

    expect(screen.getByText('Ingresar')).not.toBeNull()
    expect(localStorage.getItem('elvolcan_usuario')).toBeNull()
    expect(localStorage.getItem('elvolcan_sesion_personal')).toBeNull()
  })
})