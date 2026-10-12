import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import CarritoProvider from './context/CarritoProvider'
import { useCarrito } from './context/useCarrito'

describe('Pruebas del carrito', () => {
  const producto = {
    id: 'CL001',
    nombre: 'Cilindro GLP 5 kg',
    descripcion: 'Cilindro de prueba',
    precio: 6500,
    imagen: '/assets/productos/cilindro.jpg',
    stock: 10,
    oferta: false,
    precioOferta: null,
  }

  beforeEach(() => {
    localStorage.removeItem('elvolcan_react_carrito')
  })

  function BotonDePrueba({ prod }) {
    const { agregar } = useCarrito()
    return <button onClick={() => agregar(prod)}>Agregar</button>
  }

  const montar = (prod) =>
    render(
      <BrowserRouter>
        <CarritoProvider>
          <Navbar />
          <BotonDePrueba prod={prod} />
        </CarritoProvider>
      </BrowserRouter>
    )

  it('deberia subir el contador y el total al agregar un producto', () => {
    montar(producto)

    expect(screen.getByText(/\(0\)/)).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /agregar/i }))

    expect(screen.getByText(/\(1\)/)).not.toBeNull()
    expect(screen.getByText(/\$6\.500/)).not.toBeNull()
  })

  it('deberia sumar la cantidad si agrego el mismo producto otra vez', () => {
    montar(producto)

    const btnAgregar = screen.getByRole('button', { name: /agregar/i })
    fireEvent.click(btnAgregar)
    fireEvent.click(btnAgregar)

    expect(screen.getByText(/\(2\)/)).not.toBeNull()
    expect(screen.getByText(/\$13\.000/)).not.toBeNull()
  })
})