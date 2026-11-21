export const CLAVE_SESION_PERSONAL = 'elvolcan_sesion_personal'

export function leerSesionPersonal() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION_PERSONAL)) ?? null
  } catch {
    return null
  }
}
