export const CLAVE_SESION_CLIENTE = 'elvolcan_usuario'

export const RUTA_INICIO_POR_ROL = {
    ADMIN: '/admin',
    VENDEDOR: '/vendedor',
    REPARTIDOR: '/repartidor',
    CLIENTE: '/',
}

export const SESION_PERSONAL_POR_ROL = {
    ADMIN: 'administrador',
    VENDEDOR: 'operador',
    REPARTIDOR: 'repartidor',
}

export function leerSesionCliente() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION_CLIENTE))
    } catch {
        return null
    }
}

export function leerRol() {
    return leerSesionCliente()?.rol?.toUpperCase() ?? null
}