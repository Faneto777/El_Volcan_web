import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminDashboard, AdminProductos } from './pages/Admin'
import { obtenerProductos } from './services/productoService'

const montar = (elemento) => render(<MemoryRouter>{elemento}</MemoryRouter>)

const escribir = (placeholder, valor) =>
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } })

const filasDeDatos = () => screen.getAllByRole('row').length - 1

describe('Dashboard del administrador', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar los KPIs de productos, stock total y ofertas', () => {
    const productos = obtenerProductos()
    const stockTotal = productos.reduce((suma, p) => suma + p.stock, 0)
    const enOferta = productos.filter((p) => p.oferta).length

    montar(<AdminDashboard />)

    expect(screen.getByRole('heading', { name: 'Panel administrador' })).not.toBeNull()
    expect(screen.getByText(String(productos.length))).not.toBeNull()
    expect(screen.getByText(String(stockTotal))).not.toBeNull()
    expect(screen.getByText(String(enOferta))).not.toBeNull()
  })

  it('deberia mostrar los enlaces para gestionar productos y volver a la tienda', () => {
    montar(<AdminDashboard />)

    expect(screen.getByRole('link', { name: /gestionar productos/i })).not.toBeNull()
    expect(screen.getByRole('link', { name: /ver tienda/i })).not.toBeNull()
  })
})

describe('CRUD de productos del administrador', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia listar los 14 productos en la tabla', () => {
    montar(<AdminProductos />)

    expect(filasDeDatos()).toBe(14)
  })

  it('deberia mostrar error si faltan codigo y nombre', () => {
    montar(<AdminProductos />)

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    expect(screen.getByText('Código y nombre son obligatorios.')).not.toBeNull()
    expect(filasDeDatos()).toBe(14)
  })

  it('deberia crear un producto nuevo y mostrarlo en la tabla', () => {
    montar(<AdminProductos />)

    escribir('Código', 'XX001')
    escribir('Nombre', 'Cilindro de prueba')
    escribir('Precio', '5000')
    escribir('Stock', '15')
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    expect(screen.getByText('Cilindro de prueba')).not.toBeNull()
    expect(screen.getByText('$5.000')).not.toBeNull()
    expect(filasDeDatos()).toBe(15)
  })

  it('deberia actualizar un producto existente si el codigo ya existe', () => {
    montar(<AdminProductos />)

    escribir('Código', 'CL001')
    escribir('Nombre', 'Cilindro editado')
    escribir('Precio', '7000')
    escribir('Stock', '10')
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    expect(screen.getByText('Cilindro editado')).not.toBeNull()
    expect(screen.queryByText('Cilindro GLP 5 kg')).toBeNull()
    expect(filasDeDatos()).toBe(14)
  })

  it('deberia eliminar un producto de la tabla', () => {
    montar(<AdminProductos />)

    fireEvent.click(screen.getAllByRole('button', { name: /^eliminar$/i })[0])

    expect(screen.queryByText('Cilindro GLP 5 kg')).toBeNull()
    expect(filasDeDatos()).toBe(13)
  })

  it('deberia restablecer los productos originales', () => {
    montar(<AdminProductos />)

    fireEvent.click(screen.getAllByRole('button', { name: /^eliminar$/i })[0])
    expect(filasDeDatos()).toBe(13)

    fireEvent.click(screen.getByRole('button', { name: /restablecer/i }))

    expect(filasDeDatos()).toBe(14)
    expect(screen.getByText('Cilindro GLP 5 kg')).not.toBeNull()
  })
})