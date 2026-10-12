import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/useCarrito'
import { formatearPrecio } from '../utils/formato'

const CLAVE_SESION = 'elvolcan_usuario'

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION)) ?? null
  } catch {
    return null
  }
}

export function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const navigate = useNavigate()
  const sesion = leerSesion()
  const [form, setForm] = useState({
    nombre: sesion?.nombre ?? '',
    apellidos: sesion?.apellidos ?? '',
    correo: sesion?.correo ?? '',
    calle: '',
    depto: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: '',
  })
  const [error, setError] = useState('')

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const pagar = (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.correo.includes('@') || !form.calle.trim() || !form.comuna.trim()) {
      setError('Completa nombre, correo válido, calle y comuna para continuar.')
      return
    }
    if (items.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }
    const nro = `nro #${Date.now().toString().slice(-8)}`
    const pagoOk = total > 0
    vaciar()
    navigate(pagoOk ? `/pago-correcto?orden=${encodeURIComponent(nro)}` : '/pago-error', {
      state: { total, form, nro },
    })
  }

  if (items.length === 0) {
    return (
      <main>
        <section>
          <div className="container text-center">
            <h1 className="titulo-seccion">Checkout</h1>
            <p className="descripcion-seccion">No hay productos para pagar.</p>
            <Link className="boton" to="/productos">Ver productos</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section>
        <div className="container">
          <h1 className="titulo-seccion">Checkout</h1>
          <p className="descripcion-seccion">Completa tus datos y dirección de entrega. Total a pagar: <strong>{formatearPrecio(total)}</strong></p>
          <div className="panel">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={pagar} noValidate>
              <h4>Información del cliente</h4>
              <div className="grid-formulario">
                <div className="campo">
                  <label htmlFor="nombre">Nombre*</label>
                  <input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} />
                </div>
                <div className="campo">
                  <label htmlFor="apellidos">Apellidos*</label>
                  <input id="apellidos" name="apellidos" value={form.apellidos} onChange={cambiar} />
                </div>
                <div className="campo">
                  <label htmlFor="correo">Correo*</label>
                  <input id="correo" name="correo" type="email" value={form.correo} onChange={cambiar} />
                </div>
              </div>
              <h4 className="mt-4">Dirección de entrega</h4>
              <div className="grid-formulario">
                <div className="campo">
                  <label htmlFor="calle">Calle*</label>
                  <input id="calle" name="calle" value={form.calle} onChange={cambiar} placeholder="Ej: Los crisantemos, Edificio Norte" />
                </div>
                <div className="campo">
                  <label htmlFor="depto">Departamento (opcional)</label>
                  <input id="depto" name="depto" value={form.depto} onChange={cambiar} placeholder="Ej: 603" />
                </div>
                <div className="campo">
                  <label htmlFor="region">Región*</label>
                  <input id="region" name="region" value={form.region} onChange={cambiar} />
                </div>
                <div className="campo">
                  <label htmlFor="comuna">Comuna*</label>
                  <input id="comuna" name="comuna" value={form.comuna} onChange={cambiar} />
                </div>
                <div className="campo campo-ancho">
                  <label htmlFor="indicaciones">Indicaciones (opcional)</label>
                  <textarea id="indicaciones" name="indicaciones" value={form.indicaciones} onChange={cambiar} />
                </div>
              </div>
              <button type="submit" className="boton mt-4">Pagar ahora {formatearPrecio(total)}</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export function PagoCorrecto() {
  return (
    <main>
      <section>
        <div className="container text-center">
          <h1 className="titulo-seccion">✅ Se ha realizado la compra</h1>
          <p className="descripcion-seccion">Gracias por tu compra. Te enviaremos la boleta a tu correo.</p>
          <Link className="boton" to="/productos">Seguir comprando</Link>
        </div>
      </section>
    </main>
  )
}

export function PagoError() {
  return (
    <main>
      <section>
        <div className="container text-center">
          <h1 className="titulo-seccion">❌ No se pudo realizar el pago</h1>
          <p className="descripcion-seccion">Inténtalo nuevamente o revisa los datos de entrega.</p>
          <Link className="boton" to="/checkout">Volver a realizar el pago</Link>
        </div>
      </section>
    </main>
  )
}
