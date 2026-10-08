import { useEffect, useState } from 'react'
import { CarritoContext } from './carritoContext'
import { precioFinal } from '../data/baseDatos'

const CLAVE_CARRITO = 'elvolcan_react_carrito'

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO))
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito)

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
  }, [items])

  const agregar = (producto) => {
    setItems((previos) => {
      const existe = previos.find((i) => i.id === producto.id)
      if (existe) {
        return previos.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        )
      }
      return [
        ...previos,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: precioFinal(producto),
          imagen: producto.imagen,
          cantidad: 1,
        },
      ]
    })
  }

  const cambiarCantidad = (id, delta) => {
    setItems((previos) =>
      previos
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0),
    )
  }

  const eliminar = (id) => setItems((previos) => previos.filter((i) => i.id !== id))
  const vaciar = () => setItems([])

  const totalUnidades = items.reduce((suma, i) => suma + i.cantidad, 0)
  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  const valor = { items, agregar, cambiarCantidad, eliminar, vaciar, totalUnidades, total }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}

export default CarritoProvider