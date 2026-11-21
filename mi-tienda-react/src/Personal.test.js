import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Personal } from './pages/Personal'

describe('Acceso del personal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deberia redirigir al login unificado del backend', () => {
    render(
      <MemoryRouter initialEntries={['/personal']}>
        <Routes>
          <Route path="/personal" element={<Personal />} />
          <Route path="/login" element={<p>PAGINA LOGIN</p>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('PAGINA LOGIN')).not.toBeNull()
  })
})
