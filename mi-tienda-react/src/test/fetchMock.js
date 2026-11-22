export function simularFetch(cuerpo, { ok = true, status = 200 } = {}) {
    return spyOn(window, 'fetch').and.callFake(() =>
        Promise.resolve({ ok, status, json: () => Promise.resolve(cuerpo) })
    )
}

export function simularApiDeProductos(listaInicial) {
    let productos = JSON.parse(JSON.stringify(listaInicial))

    return spyOn(window, 'fetch').and.callFake((url, opciones = {}) => {
        const metodo = (opciones.method ?? 'GET').toUpperCase()
        const cuerpo = opciones.body ? JSON.parse(opciones.body) : null
        const id = decodeURIComponent(url.split('/productos/')[1] ?? '')
        let datos = productos

        if (metodo === 'POST') {
            productos = [...productos, cuerpo]
            datos = cuerpo
        } else if (metodo === 'PUT') {
            productos = productos.map((p) => (p.id === id ? { ...cuerpo, id } : p))
            datos = cuerpo
        } else if (metodo === 'DELETE') {
            productos = productos.filter((p) => p.id !== id)
            datos = {}
        }

        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(datos) })
    })
}