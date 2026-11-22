import { Navigate } from 'react-router-dom'
import { RUTA_INICIO_POR_ROL, leerRol } from '../services/sesion'

function RutaProtegida({ roles, children }) {
    const rol = leerRol()

    if (!rol) return <Navigate to="/login" replace />
    if (!roles.includes(rol)) return <Navigate to={RUTA_INICIO_POR_ROL[rol] ?? '/'} replace />

    return children
}

export default RutaProtegida