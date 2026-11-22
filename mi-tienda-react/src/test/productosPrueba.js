const CATEGORIA = {
    cilindros: { id: 1, nombre: 'Cilindros de Gas' },
    reguladores: { id: 2, nombre: 'Reguladores' },
    mangueras: { id: 3, nombre: 'Mangueras y Conexiones' },
    accesorios: { id: 4, nombre: 'Accesorios' },
}

export const PRODUCTOS_PRUEBA = [
    { id: 'CL001', nombre: 'Cilindro GLP 5 kg', precio: 6500, stock: 80, categoria: CATEGORIA.cilindros, oferta: false, precioOferta: null },
    { id: 'CL002', nombre: 'Cilindro GLP 11 kg', precio: 12000, stock: 200, categoria: CATEGORIA.cilindros, oferta: false, precioOferta: null },
    { id: 'CL003', nombre: 'Cilindro GLP 15 kg', precio: 16000, stock: 90, categoria: CATEGORIA.cilindros, oferta: false, precioOferta: null },
    { id: 'CL004', nombre: 'Cilindro GLP 45 kg', precio: 45000, stock: 30, categoria: CATEGORIA.cilindros, oferta: false, precioOferta: null },
    { id: 'RG001', nombre: 'Regulador doméstico estándar', precio: 8990, stock: 45, categoria: CATEGORIA.reguladores, oferta: false, precioOferta: null },
    { id: 'RG002', nombre: 'Regulador de alta presión', precio: 18990, stock: 12, categoria: CATEGORIA.reguladores, oferta: false, precioOferta: null },
    { id: 'RG003', nombre: 'Regulador dual (2 salidas)', precio: 14990, stock: 18, categoria: CATEGORIA.reguladores, oferta: true, precioOferta: 12990 },
    { id: 'MG001', nombre: 'Manguera gas 1.5 m', precio: 3990, stock: 80, categoria: CATEGORIA.mangueras, oferta: false, precioOferta: null },
    { id: 'MG002', nombre: 'Manguera gas 3 m', precio: 6990, stock: 50, categoria: CATEGORIA.mangueras, oferta: false, precioOferta: null },
    { id: 'MG003', nombre: 'Abrazadera metálica', precio: 990, stock: 200, categoria: CATEGORIA.mangueras, oferta: false, precioOferta: null },
    { id: 'MG004', nombre: 'Kit conexión completo', precio: 12990, stock: 25, categoria: CATEGORIA.mangueras, oferta: true, precioOferta: 10990 },
    { id: 'AC001', nombre: 'Carro porta cilindro 11/15 kg', precio: 12990, stock: 20, categoria: CATEGORIA.accesorios, oferta: false, precioOferta: null },
    { id: 'AC002', nombre: 'Tapa protectora para válvula', precio: 1490, stock: 60, categoria: CATEGORIA.accesorios, oferta: false, precioOferta: null },
    { id: 'AC003', nombre: 'Detector de gas a batería', precio: 19990, stock: 8, categoria: CATEGORIA.accesorios, oferta: false, precioOferta: null },
]

export function simularApiProductos(lista = PRODUCTOS_PRUEBA) {
    return spyOn(window, 'fetch').and.callFake(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(lista) })
    )
}