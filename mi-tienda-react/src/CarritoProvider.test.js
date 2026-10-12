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
    // partimos siempre con el carrito vacio
    localStorage.removeItem('elvolcan_react_carrito')
  })

  // este boton es solo para los tests, usa el carrito igual que la app
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

    // aca va regex porque el navbar junta el precio con el texto del boton
    expect(screen.getByText(/\(1\)/)).not.toBeNull()
    expect(screen.getByText(/\$6\.500/)).not.toBeNull()
  })

  it('deberia sumar la cantidad si agrego el mismo producto otra vez', () => {
    montar(producto)

    const btnAgregar = screen.getByRole('button', { name: /agregar/i })
    fireEvent.click(btnAgregar)
    fireEvent.click(btnAgregar)

    // tiene que mostrar (2), no dos productos separados
    expect(screen.getByText(/\(2\)/)).not.toBeNull()
    expect(screen.getByText(/\$13\.000/)).not.toBeNull()
  })
})