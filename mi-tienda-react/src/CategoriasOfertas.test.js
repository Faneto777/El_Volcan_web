import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CarritoProvider from './context/CarritoProvider'
import { Categorias, CategoriaDetalle } from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import { simularApiProductos } from './test/productosPrueba'

const montar = (ruta) =>
    render(
        <MemoryRouter initialEntries={[ruta]}>
          <CarritoProvider>
            <Routes>
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categorias/:id" element={<CategoriaDetalle />} />
              <Route path="/ofertas" element={<Ofertas />} />
            </Routes>
          </CarritoProvider>
        </MemoryRouter>
    )

describe('Pagina de Categorias', () => {
  beforeEach(() => {
    localStorage.clear()
    simularApiProductos()
  })

  it('deberia listar las 4 categorias', () => {
    montar('/categorias')

    expect(screen.getByText('Cilindros de Gas')).not.toBeNull()
    expect(screen.getByText('Reguladores')).not.toBeNull()
    expect(screen.getByText('Mangueras y Conexiones')).not.toBeNull()
    expect(screen.getByText('Accesorios')).not.toBeNull()
    expect(screen.getAllByRole('link', { name: /ver productos/i }).length).toBe(4)
  })

  it('deberia filtrar y mostrar solo los productos de la categoria', async () => {
    montar('/categorias/reguladores')

    expect(await screen.findByText('Regulador doméstico estándar')).not.toBeNull()
    expect(screen.getByText('Regulador de alta presión')).not.toBeNull()
    expect(screen.getByText('Regulador dual (2 salidas)')).not.toBeNull()

    expect(screen.queryByText('Cilindro GLP 5 kg')).toBeNull()
    expect(screen.queryByText('Manguera gas 1.5 m')).toBeNull()
  })

  it('deberia mostrar un mensaje si la categoria no existe', async () => {
    montar('/categorias/inexistente')

    expect(await screen.findByText('Categoría no encontrada')).not.toBeNull()
  })
})

describe('Pagina de Ofertas', () => {
  beforeEach(() => {
    localStorage.clear()
    simularApiProductos()
  })

  it('deberia mostrar solo los productos en oferta', async () => {
    montar('/ofertas')

    expect(await screen.findByText('Regulador dual (2 salidas)')).not.toBeNull()
    expect(screen.getByText('Kit conexión completo')).not.toBeNull()
    expect(screen.queryByText('Cilindro GLP 11 kg')).toBeNull()
    expect(screen.queryByText('Detector de gas a batería')).toBeNull()
  })

  it('deberia mostrar el precio de oferta junto al precio original tachado', async () => {
    montar('/ofertas')

    expect(await screen.findByText('$14.990')).not.toBeNull()
    expect(screen.getByText('$10.990')).not.toBeNull()
    expect(screen.getAllByText('$12.990').length).toBe(2)
  })

  it('deberia mostrar un mensaje si no hay ofertas', async () => {
    window.fetch.and.callFake(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    )

    montar('/ofertas')

    expect(await screen.findByText('No hay ofertas disponibles por ahora.')).not.toBeNull()
  })
})