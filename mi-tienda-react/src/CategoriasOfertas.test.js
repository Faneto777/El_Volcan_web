import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CarritoProvider from './context/CarritoProvider'
import { Categorias, CategoriaDetalle } from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import { actualizarProducto, obtenerProductosEnOferta } from './services/productoService'

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
  })

  it('deberia listar las 4 categorias', () => {
    montar('/categorias')

    expect(screen.getByText('Cilindros de Gas')).not.toBeNull()
    expect(screen.getByText('Reguladores')).not.toBeNull()
    expect(screen.getByText('Mangueras y Conexiones')).not.toBeNull()
    expect(screen.getByText('Accesorios')).not.toBeNull()
    expect(screen.getAllByRole('link', { name: /ver productos/i }).length).toBe(4)
  })

  it('deberia filtrar y mostrar solo los productos de la categoria', () => {
    montar('/categorias/reguladores')

    expect(screen.getByText('Regulador doméstico estándar')).not.toBeNull()
    expect(screen.getByText('Regulador de alta presión')).not.toBeNull()
    expect(screen.getByText('Regulador dual (2 salidas)')).not.toBeNull()

    expect(screen.queryByText('Cilindro GLP 5 kg')).toBeNull()
    expect(screen.queryByText('Manguera gas 1.5 m')).toBeNull()
  })

  it('deberia mostrar un mensaje si la categoria no existe', () => {
    montar('/categorias/inexistente')

    expect(screen.getByText('Categoría no encontrada')).not.toBeNull()
  })
})

describe('Pagina de Ofertas', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar solo los productos en oferta', () => {
    montar('/ofertas')

    expect(screen.getByText('Regulador dual (2 salidas)')).not.toBeNull()
    expect(screen.getByText('Kit conexión completo')).not.toBeNull()
    expect(screen.queryByText('Cilindro GLP 11 kg')).toBeNull()
    expect(screen.queryByText('Detector de gas a batería')).toBeNull()
  })

  it('deberia mostrar el precio de oferta junto al precio original tachado', () => {
    montar('/ofertas')

    expect(screen.getByText('$14.990')).not.toBeNull()
    expect(screen.getByText('$10.990')).not.toBeNull()
    
    expect(screen.getAllByText('$12.990').length).toBe(2)
  })

  it('deberia mostrar un mensaje si no hay ofertas', () => {
    obtenerProductosEnOferta().forEach((p) => actualizarProducto(p.id, { oferta: false }))

    montar('/ofertas')

    expect(screen.getByText('No hay ofertas disponibles por ahora.')).not.toBeNull()
  })
})