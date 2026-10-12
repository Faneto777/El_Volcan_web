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
      <div className="container mt-5 text-center">
        <h1>Checkout</h1>
        <p className="text-secondary">No hay productos para pagar.</p>
        <Link className="btn btn-primary" to="/productos">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <h1>Checkout</h1>
      <p className="text-secondary">Completa tus datos y dirección de entrega. Total a pagar: <strong>{formatearPrecio(total)}</strong></p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={pagar} noValidate>
        <h4 className="mt-4">Información del cliente</h4>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="nombre">Nombre*</label>
            <input id="nombre" name="nombre" className="form-control" value={form.nombre} onChange={cambiar} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="apellidos">Apellidos*</label>
            <input id="apellidos" name="apellidos" className="form-control" value={form.apellidos} onChange={cambiar} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="correo">Correo*</label>
            <input id="correo" name="correo" type="email" className="form-control" value={form.correo} onChange={cambiar} />
          </div>
        </div>
        <h4 className="mt-4">Dirección de entrega</h4>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="calle">Calle*</label>
            <input id="calle" name="calle" className="form-control" value={form.calle} onChange={cambiar} placeholder="Ej: Los crisantemos, Edificio Norte" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="depto">Departamento (opcional)</label>
            <input id="depto" name="depto" className="form-control" value={form.depto} onChange={cambiar} placeholder="Ej: 603" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="region">Región*</label>
            <input id="region" name="region" className="form-control" value={form.region} onChange={cambiar} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="comuna">Comuna*</label>
            <input id="comuna" name="comuna" className="form-control" value={form.comuna} onChange={cambiar} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="indicaciones">Indicaciones (opcional)</label>
            <textarea id="indicaciones" name="indicaciones" className="form-control" value={form.indicaciones} onChange={cambiar} />
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-4">Pagar ahora {formatearPrecio(total)}</button>
      </form>
    </div>
  )
}

export function PagoCorrecto() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="text-success">✅ Se ha realizado la compra</h1>
      <p className="text-secondary">Gracias por tu compra. Te enviaremos la boleta a tu correo.</p>
      <Link className="btn btn-primary mt-3" to="/productos">Seguir comprando</Link>
    </div>
  )
}

export function PagoError() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="text-danger">❌ No se pudo realizar el pago</h1>
      <p className="text-secondary">Inténtalo nuevamente o revisa los datos de entrega.</p>
      <Link className="btn btn-success mt-3" to="/checkout">Volver a realizar el pago</Link>
    </div>
  )
}
