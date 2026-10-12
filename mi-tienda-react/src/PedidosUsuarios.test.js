import {
  actualizarPedido,
  crearPedido,
  obtenerPedidos,
  obtenerRepartidores,
  restablecerPedidos,
} from './services/pedidosService'
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  restablecerUsuarios,
} from './services/usuariosService'

describe('Servicio de pedidos', () => {
  beforeEach(() => {
    localStorage.removeItem('elvolcan_pedidos')
    localStorage.removeItem('elvolcan_repartidores')
  })

  afterEach(() => {
    localStorage.removeItem('elvolcan_pedidos')
    localStorage.removeItem('elvolcan_repartidores')
  })

  it('deberia cargar los 7 pedidos iniciales', () => {
    expect(obtenerPedidos().length).toBe(7)
  })

  it('deberia cargar los repartidores por defecto', () => {
    expect(obtenerRepartidores().length).toBe(4)
  })

  it('deberia crear un pedido en estado pendiente', () => {
    const nuevo = crearPedido({ cliente: 'Prueba', direccion: 'Calle 123', cilindro: '5 kg' })

    expect(nuevo.estado).toBe('pendiente')
    expect(obtenerPedidos().length).toBe(8)
  })

  it('deberia actualizar el estado y repartidor de un pedido', () => {
    const actualizado = actualizarPedido('004', { estado: 'camino', repartidor: 'Carlos R.' })

    expect(actualizado.estado).toBe('camino')
    expect(obtenerPedidos().find((p) => p.id === '004').repartidor).toBe('Carlos R.')
  })

  it('deberia devolver null al actualizar un pedido inexistente', () => {
    expect(actualizarPedido('999', { estado: 'camino' })).toBeNull()
  })

  it('deberia restablecer los pedidos iniciales', () => {
    crearPedido({ cliente: 'Prueba', direccion: 'Calle 123', cilindro: '5 kg' })
    restablecerPedidos()

    expect(obtenerPedidos().length).toBe(7)
  })
})

describe('Servicio de usuarios', () => {
  beforeEach(() => {
    localStorage.removeItem('elvolcan_usuarios')
  })

  afterEach(() => {
    localStorage.removeItem('elvolcan_usuarios')
  })

  it('deberia cargar los 5 usuarios iniciales', () => {
    expect(obtenerUsuarios().length).toBe(5)
  })

  it('deberia crear un usuario nuevo', () => {
    crearUsuario({ nombre: 'Nuevo', email: 'nuevo@correo.cl', password: 'demo123', rol: 'cliente' })

    expect(obtenerUsuarios().length).toBe(6)
  })

  it('deberia lanzar error con correo repetido', () => {
    expect(() => crearUsuario({ nombre: 'Otro', email: 'operador@gmail.com', password: 'x' })).toThrow()
  })

  it('deberia actualizar el rol de un usuario', () => {
    const actualizado = actualizarUsuario('operador@gmail.com', { rol: 'administrador' })

    expect(actualizado.rol).toBe('administrador')
  })

  it('deberia eliminar un usuario', () => {
    expect(eliminarUsuario('operador@gmail.com')).toBeTrue()
    expect(obtenerUsuarios().length).toBe(4)
  })

  it('deberia restablecer los usuarios iniciales', () => {
    eliminarUsuario('operador@gmail.com')
    restablecerUsuarios()

    expect(obtenerUsuarios().length).toBe(5)
  })
})
