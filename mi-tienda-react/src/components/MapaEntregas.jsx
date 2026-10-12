import { useEffect, useRef } from 'react'
import L from 'leaflet'

const CENTRO_CHILLAN = [-36.6066, -72.1034]
const COLORES = { pendiente: 'gray', asignado: 'blue', camino: 'orange', entregado: 'green' }

function MapaEntregas({ id, pedidos, centro = CENTRO_CHILLAN, zoom = 14 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    let mapa = null
    try {
      mapa = L.map(ref.current).setView(centro, zoom)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(mapa)
      pedidos.forEach((p) => {
        if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return
        const icono = L.divIcon({
          className: 'marcador-pedido',
          html: `<span class="punto punto-${COLORES[p.estado] || 'gray'}"></span>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })
        L.marker([p.lat, p.lng], { icon: icono })
          .addTo(mapa)
          .bindPopup(`<b>${p.cliente}</b><br>${p.cilindro}`)
      })
    } catch {
      //
    }
    return () => {
      try {
        mapa?.remove()
      } catch {
        //
      }
    }
  }, [pedidos, centro, zoom])

  return <div id={id} ref={ref}></div>
}

export default MapaEntregas
