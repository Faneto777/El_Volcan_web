export const CLAVE_SESION_PERSONAL = 'elvolcan_sesion_personal'

const CUENTAS = [
  { nombre: 'Administradora', email: 'administradora@gmail.com', password: 'admin123', rol: 'administrador', destino: '/admin' },
  { nombre: 'Juan Perez', email: 'operador@gmail.com', password: 'volcan123', rol: 'operador', destino: '/operador' },
  { nombre: 'Repartidor Demo', email: 'repartidordemo@gmail.com', password: 'demo123', rol: 'repartidor', destino: '/repartidor' },
]

export function iniciarSesionPersonal(correo, password) {
  const cuenta = CUENTAS.find((c) => c.email === correo && c.password === password)
  if (!cuenta) return null
  const sesion = { nombre: cuenta.nombre, email: cuenta.email, rol: cuenta.rol }
  localStorage.setItem(CLAVE_SESION_PERSONAL, JSON.stringify(sesion))
  return { ...sesion, destino: cuenta.destino }
}

export function leerSesionPersonal() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION_PERSONAL)) ?? null
  } catch {
    return null
  }
}
