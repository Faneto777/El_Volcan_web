import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import CarritoProvider from './context/CarritoProvider'

const CLAVE_CARRITO = 'elvolcan_react_carrito'

const itemEjemplo = {
  id: 'CL001',
  nombre: 'Cilindro GLP 5 kg',
  precio: 6500,
  imagen: '/assets/productos/cilindro.jpg',
  cantidad: 2,
}

const montar = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </MemoryRouter>
  )

describe('Rutas de la aplicacion (App)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar el catalogo de inicio con 6 productos', () => {
    montar('/')

    expect(screen.getByRole('heading', { name: 'Catálogo El Volcán' })).not.toBeNull()
    expect(screen.getAllByRole('button', { name: /^agregar$/i }).length).toBe(6)
    expect(screen.getByRole('link', { name: /ver catálogo completo/i })).not.toBeNull()
  })

  it('deberia mostrar los 14 productos en la pagina de catalogo', () => {
    montar('/productos')

    expect(screen.getByRole('heading', { name: 'Productos' })).not.toBeNull()
    expect(screen.getAllByRole('button', { name: /^agregar$/i }).length).toBe(14)
  })

  it('deberia mostrar el detalle de un producto y agregarlo al carrito', () => {
    montar('/productos/CL001')

    expect(screen.getByRole('heading', { name: 'Cilindro GLP 5 kg' })).not.toBeNull()
    expect(screen.getByText(/\(0\)/)).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }))

    expect(screen.getByText(/\(1\)/)).not.toBeNull()
  })

  it('deberia mostrar un mensaje si el producto no existe', () => {
    montar('/productos/NOEXISTE')

    expect(screen.getByText('Producto no encontrado')).not.toBeNull()
  })

  it('deberia mostrar el carrito vacio cuando no hay productos', () => {
    montar('/carrito')

    expect(screen.getByRole('heading', { name: 'Carrito vacío' })).not.toBeNull()
  })

  it('deberia mostrar los productos del carrito y permitir subir la cantidad', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([itemEjemplo]))
    montar('/carrito')

    expect(screen.getByText('Cilindro GLP 5 kg x 2')).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '+' }))

    expect(screen.getByText('Cilindro GLP 5 kg x 3')).not.toBeNull()
  })

  it('deberia bajar la cantidad y eliminar el producto del carrito', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ ...itemEjemplo, cantidad: 1 }]))
    montar('/carrito')

    fireEvent.click(screen.getByRole('button', { name: '-' }))

    expect(screen.getByRole('heading', { name: 'Carrito vacío' })).not.toBeNull()
  })

  it('deberia vaciar el carrito con el boton Vaciar carrito', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([itemEjemplo]))
    montar('/carrito')

    fireEvent.click(screen.getByRole('button', { name: /vaciar carrito/i }))

    expect(screen.getByRole('heading', { name: 'Carrito vacío' })).not.toBeNull()
  })

  it('deberia eliminar un producto con el boton Eliminar', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([itemEjemplo]))
    montar('/carrito')

    fireEvent.click(screen.getByRole('button', { name: /^eliminar$/i }))

    expect(screen.getByRole('heading', { name: 'Carrito vacío' })).not.toBeNull()
  })
})