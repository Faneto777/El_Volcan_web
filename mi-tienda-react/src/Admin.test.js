import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminDashboard, AdminProductos } from './pages/Admin'
import { PRODUCTOS_PRUEBA } from './test/productosPrueba'
import { simularApiDeProductos } from './test/fetchMock'

const montar = (elemento) => render(<MemoryRouter>{elemento}</MemoryRouter>)

const escribir = (placeholder, valor) =>
    fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } })

const filasDeDatos = () => screen.getAllByRole('row').length - 1

const esperarFilas = (cantidad) =>
    waitFor(() => {
      if (filasDeDatos() !== cantidad) throw new Error(`Se esperaban ${cantidad} filas`)
    })

describe('Dashboard del administrador', () => {
  beforeEach(() => {
    localStorage.clear()
    simularApiDeProductos(PRODUCTOS_PRUEBA)
  })

  it('deberia mostrar los KPIs de productos, stock total y ofertas', async () => {
    const stockTotal = PRODUCTOS_PRUEBA.reduce((suma, p) => suma + p.stock, 0)
    const enOferta = PRODUCTOS_PRUEBA.filter((p) => p.oferta).length

    montar(<AdminDashboard />)

    expect(screen.getByRole('heading', { name: 'Panel administrador' })).not.toBeNull()
    expect(await screen.findByText(String(PRODUCTOS_PRUEBA.length))).not.toBeNull()
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
    simularApiDeProductos(PRODUCTOS_PRUEBA)
  })

  it('deberia listar los 14 productos en la tabla', async () => {
    montar(<AdminProductos />)

    await esperarFilas(14)
  })

  it('deberia mostrar error si faltan codigo y nombre', async () => {
    montar(<AdminProductos />)

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    expect(screen.getByText('Código y nombre son obligatorios.')).not.toBeNull()
    await esperarFilas(14)
  })

  it('deberia crear un producto nuevo y mostrarlo en la tabla', async () => {
    montar(<AdminProductos />)
    await esperarFilas(14)

    escribir('Código', 'XX001')
    escribir('Nombre', 'Cilindro de prueba')
    escribir('Precio', '5000')
    escribir('Stock', '15')
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    expect(await screen.findByText('Cilindro de prueba')).not.toBeNull()
    expect(screen.getByText('$5.000')).not.toBeNull()
    await esperarFilas(15)
  })

  it('deberia actualizar un producto existente si el codigo ya existe', async () => {
    montar(<AdminProductos />)
    await esperarFilas(14)

    escribir('Código', 'CL001')
    escribir('Nombre', 'Cilindro editado')
    escribir('Precio', '7000')
    escribir('Stock', '10')
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    expect(await screen.findByText('Cilindro editado')).not.toBeNull()
    expect(screen.queryByText('Cilindro GLP 5 kg')).toBeNull()
    await esperarFilas(14)
  })

  it('deberia eliminar un producto de la tabla', async () => {
    montar(<AdminProductos />)
    expect(await screen.findByText('Cilindro GLP 5 kg')).not.toBeNull()

    fireEvent.click(screen.getAllByRole('button', { name: /^eliminar$/i })[0])

    await waitFor(() => {
      if (screen.queryByText('Cilindro GLP 5 kg')) throw new Error('Sigue visible')
    })
    await esperarFilas(13)
  })
})