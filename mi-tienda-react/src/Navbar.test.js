import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import CarritoProvider from './context/CarritoProvider'

describe('Pruebas del Navbar', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.removeItem('elvolcan_react_carrito')
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

    // El botón renderiza: Carrito (0) $0
    expect(screen.getByText(/\(0\)/)).not.toBeNull()
  })
})