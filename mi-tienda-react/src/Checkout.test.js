import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CarritoProvider from './context/CarritoProvider'
import { Checkout } from './pages/Checkout'

const CLAVE_CARRITO = 'elvolcan_react_carrito'

const itemEjemplo = {
  id: 'CL001',
  nombre: 'Cilindro GLP 5 kg',
  precio: 6500,
  imagen: '/assets/productos/cilindro.jpg',
  cantidad: 2,
}

const montar = () =>
  render(
    <MemoryRouter initialEntries={['/checkout']}>
      <CarritoProvider>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-correcto" element={<p>PAGO CORRECTO</p>} />
          <Route path="/pago-error" element={<p>PAGO ERROR</p>} />
        </Routes>
      </CarritoProvider>
    </MemoryRouter>
  )

const escribir = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })

describe('Checkout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar un mensaje si el carrito esta vacio', () => {
    montar()

    expect(screen.getByText('No hay productos para pagar.')).not.toBeNull()
    expect(screen.queryByRole('button', { name: /pagar ahora/i })).toBeNull()
  })

  it('deberia mostrar error y no navegar si el formulario esta incompleto', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([itemEjemplo]))
    montar()

    fireEvent.click(screen.getByRole('button', { name: /pagar ahora/i }))

    expect(
      screen.getByText('Completa nombre, correo válido, calle y comuna para continuar.')
    ).not.toBeNull()
    expect(screen.queryByText('PAGO CORRECTO')).toBeNull()
    expect(screen.queryByText('PAGO ERROR')).toBeNull()
   
    expect(screen.getByRole('button', { name: /pagar ahora/i })).not.toBeNull()
  })

  it('deberia exigir la calle aunque el resto de los datos este completo', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([itemEjemplo]))
    montar()

    escribir('Nombre*', 'Jose')
    escribir('Apellidos*', 'Perez')
    escribir('Correo*', 'jose@correo.cl')
    fireEvent.click(screen.getByRole('button', { name: /pagar ahora/i }))

    expect(
      screen.getByText('Completa nombre, correo válido, calle y comuna para continuar.')
    ).not.toBeNull()
    expect(screen.queryByText('PAGO CORRECTO')).toBeNull()
  })

  it('deberia navegar a pago correcto y vaciar el carrito con datos completos', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([itemEjemplo]))
    montar()

    escribir('Nombre*', 'Jose')
    escribir('Apellidos*', 'Perez')
    escribir('Correo*', 'jose@correo.cl')
    escribir('Calle*', 'Los Crisantemos 123')
    fireEvent.click(screen.getByRole('button', { name: /pagar ahora/i }))

    expect(screen.getByText('PAGO CORRECTO')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([])
  })
})