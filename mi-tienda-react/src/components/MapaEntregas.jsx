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
      mapa = L.map(ref.current)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(mapa)

      const conUbicacion = pedidos.filter(
        (p) => typeof p.lat === 'number' && typeof p.lng === 'number'
      )

      conUbicacion.forEach((p) => {
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

      if (conUbicacion.length === 1) {
        mapa.setView([conUbicacion[0].lat, conUbicacion[0].lng], zoom)
      } else if (conUbicacion.length > 1) {
        const limites = L.latLngBounds(conUbicacion.map((p) => [p.lat, p.lng]))
        mapa.fitBounds(limites, { padding: [45, 45], maxZoom: zoom })
      } else {
        mapa.setView(centro, zoom)
      }
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
