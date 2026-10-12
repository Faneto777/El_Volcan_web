import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Contacto } from './pages/Info'

describe('Formulario de Contacto', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const montar = () =>
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>
    )

  const escribir = (etiqueta, valor) =>
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })

  const enviar = ({ nombre, correo, mensaje }) => {
    escribir('Nombre', nombre)
    escribir('Correo', correo)
    escribir('Mensaje', mensaje)
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
  }

  it('deberia mostrar error si el mensaje tiene menos de 10 caracteres', () => {
    montar()

    enviar({ nombre: 'Jose Perez', correo: 'jose@correo.cl', mensaje: 'Hola' })

    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).not.toBeNull()
    expect(screen.queryByText(/Gracias por escribirnos/)).toBeNull()
  })

  it('deberia mostrar exito y limpiar el formulario con datos validos', () => {
    montar()

    enviar({
      nombre: 'Jose Perez',
      correo: 'jose@correo.cl',
      mensaje: 'Quisiera cotizar 10 cilindros de 15 kg',
    })

    expect(screen.getByText(/Gracias por escribirnos/)).not.toBeNull()
    expect(screen.queryByText('El mensaje debe tener al menos 10 caracteres.')).toBeNull()
    expect(screen.getByLabelText('Mensaje').value).toBe('')
  })
})