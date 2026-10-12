const CLAVE_USUARIOS = 'elvolcan_usuarios'

const USUARIOS_DEFAULT = [
  { nombre: 'Administradora', email: 'administradora@gmail.com', password: 'admin123', rol: 'administrador', activo: true },
  { nombre: 'Juan Perez', email: 'operador@gmail.com', password: 'volcan123', rol: 'operador', activo: true },
  { nombre: 'Repartidor Demo', email: 'repartidordemo@gmail.com', password: 'demo123', rol: 'repartidor', activo: true },
  { nombre: 'Luis Fuentes', email: 'luis.fuentes@gmail.com', password: 'demo123', rol: 'repartidor', activo: true },
  { nombre: 'Clienta Demo', email: 'clientedemo@gmail.com', password: 'demo123', rol: 'cliente', activo: true },
]

function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista))
}

export function obtenerUsuarios() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS))
    if (Array.isArray(datos)) return datos
  } catch {
    //
  }
  guardarUsuarios(USUARIOS_DEFAULT.map((u) => ({ ...u })))
  return USUARIOS_DEFAULT.map((u) => ({ ...u }))
}

export function crearUsuario(datos) {
  const lista = obtenerUsuarios()
  if (lista.some((u) => u.email.toLowerCase() === datos.email.toLowerCase())) {
    throw new Error('Ya existe un usuario con ese correo')
  }
  const nuevo = { rol: 'cliente', activo: true, ...datos }
  guardarUsuarios([...lista, nuevo])
  return nuevo
}

export function actualizarUsuario(email, cambios) {
  const lista = obtenerUsuarios()
  const indice = lista.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
  if (indice === -1) return null
  const actualizado = { ...lista[indice], ...cambios, email: lista[indice].email }
  lista[indice] = actualizado
  guardarUsuarios(lista)
  return actualizado
}

export function eliminarUsuario(email) {
  const lista = obtenerUsuarios()
  const nueva = lista.filter((u) => u.email.toLowerCase() !== email.toLowerCase())
  if (nueva.length === lista.length) return false
  guardarUsuarios(nueva)
  return true
}

export function restablecerUsuarios() {
  guardarUsuarios(USUARIOS_DEFAULT.map((u) => ({ ...u })))
}
