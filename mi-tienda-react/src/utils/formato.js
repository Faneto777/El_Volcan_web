export function formatearPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-CL')
}