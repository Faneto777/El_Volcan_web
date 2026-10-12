import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductoCard from './components/ProductoCard'

describe('Pruebas de ProductoCard', () => {
  const producto = {
    id: 'CL001',
    nombre: 'Cilindro GLP 5 kg',
    descripcion: 'Cilindro de gas licuado de petroleo 5 kg',
    precio: 6500,
    imagen: '/assets/productos/cilindro.jpg',
    stock: 10,
    oferta: false,
    precioOferta: null,
  }

  const mostrar = (prod) =>
    render(
      <BrowserRouter>
        <ProductoCard producto={prod} onAgregar={() => {}} />
      </BrowserRouter>
    )

  it('deberia mostrar el nombre y la descripcion del producto', () => {
    mostrar(producto)

    expect(screen.getByText('Cilindro GLP 5 kg')).not.toBeNull()
    expect(screen.getByText(/Cilindro de gas licuado/)).not.toBeNull()
  })

  it('deberia mostrar el precio con formato de moneda', () => {
    mostrar(producto)

    expect(screen.getByText('$6.500')).not.toBeNull()
  })

  it('deberia dejar el boton deshabilitado cuando el stock es 0', () => {
    mostrar({ ...producto, stock: 0 })

    const btnAgregar = screen.getByRole('button', { name: /sin stock/i })
    expect(btnAgregar.disabled).toBeTrue()
  })

  it('deberia mostrar el precio viejo tachado si el producto esta en oferta', () => {
    mostrar({ ...producto, oferta: true, precioOferta: 5000 })

    expect(screen.getByText('$6.500')).not.toBeNull()
    expect(screen.getByText('$5.000')).not.toBeNull()
  })

  it('deberia llamar a onAgregar con el producto cuando aprieto agregar', () => {
    const espia = jasmine.createSpy('onAgregar')

    render(
      <BrowserRouter>
        <ProductoCard producto={producto} onAgregar={espia} />
      </BrowserRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /agregar/i }))

    expect(espia).toHaveBeenCalledWith(producto)
  })
})