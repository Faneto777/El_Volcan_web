import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminSistema from './pages/AdminSistema'
import { Operador, Repartidor } from './pages/Personal'

const montar = (ruta, elemento) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      {elemento}
    </MemoryRouter>
  )

describe('Panel del administrador (sistema)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar los KPIs y las tres pestañas', () => {
    montar('/admin/sistema', <AdminSistema />)

    expect(screen.getByText('Pedidos registrados')).not.toBeNull()
    expect(screen.getByRole('button', { name: /pedidos/i })).not.toBeNull()
    expect(screen.getByRole('button', { name: /usuarios y roles/i })).not.toBeNull()
    expect(screen.getByRole('button', { name: /reportes/i })).not.toBeNull()
  })

  it('deberia cambiar a la pestaña de usuarios y mostrar la tabla', () => {
    montar('/admin/sistema', <AdminSistema />)

    fireEvent.click(screen.getByRole('button', { name: /usuarios y roles/i }))

    expect(screen.getByText('Usuarios del sistema')).not.toBeNull()
    expect(screen.getByText('administradora@gmail.com')).not.toBeNull()
  })

  it('deberia cambiar a la pestaña de reportes y mostrar el mapa', () => {
    montar('/admin/sistema', <AdminSistema />)

    fireEvent.click(screen.getByRole('button', { name: /reportes/i }))

    expect(screen.getByText('Carga por repartidor')).not.toBeNull()
    expect(screen.getByText('Mapa de entregas')).not.toBeNull()
  })
})

describe('Panel de la operadora', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar las tarjetas y la tabla de pedidos', () => {
    montar('/operador', <Operador />)

    expect(screen.getByText('Pedidos Hoy')).not.toBeNull()
    expect(screen.getByText('Pedidos del Día')).not.toBeNull()
    expect(screen.getByText('Ana García')).not.toBeNull()
  })

  it('deberia abrir el modal de nuevo pedido', () => {
    montar('/operador', <Operador />)

    fireEvent.click(screen.getByRole('button', { name: /nuevo pedido/i }))

    expect(screen.getByText('Crear pedido')).not.toBeNull()
  })
})

describe('Panel del repartidor', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia mostrar la lista de entregas con su contador', () => {
    montar('/repartidor', <Repartidor />)

    expect(screen.getByText('Mis entregas')).not.toBeNull()
    expect(screen.getByText('Josefina Pérez')).not.toBeNull()
  })

  it('deberia avanzar un pedido a en camino', () => {
    montar('/repartidor', <Repartidor />)

    fireEvent.click(screen.getAllByRole('button', { name: /marcar en camino/i })[0])

    expect(screen.getAllByRole('button', { name: /marcar entregado/i }).length).toBeGreaterThan(0)
  })
})
