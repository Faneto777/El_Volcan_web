# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Pruebas unitarias (Karma + Jasmine)

## Requisitos

Antes de correr los tests hay que tener **Node.js** instalado (la versión LTS, 20 o superior).
Se descarga desde [nodejs.org](https://nodejs.org) o en PowerShell con:

```powershell
winget install OpenJS.NodeJS.LTS
```

Chequear que quedó:
```powershell
node -v
```

## Instalar las dependencias

Las carpetas `node_modules` no se suben al repositorio, así que después de clonar hay que instalar todo:

```powershell
npm install
```

> En PowerShell puede que tengas que usar `npm.cmd` en vez de `npm`, si tu configuración de ejecución de scripts está restringida.

## Correr los tests

```powershell
npm test
```

Eso levanta Karma en Chrome headless y al final tira algo como:
```
TOTAL: 41 SUCCESS
```

Para ver los tests corriendo en el Chrome normal, en `karma.conf.cjs` cambia:
```js
browsers: ['Chrome'],      // en vez de ChromeHeadless
singleRun: false,
```

## Qué se está probando

| # | Tipo | Qué revisa | Archivo |
|---|------|-----------|---------|
| 1 | Render | Muestra el nombre y la descripción del producto | `src/ProductoCard.test.js` |
| 2 | Render | Muestra el precio con formato de moneda | `src/ProductoCard.test.js` |
| 3 | Render | Muestra el nombre de la tienda | `src/Navbar.test.js` |
| 4 | Render | Muestra los links de Inicio y Productos | `src/Navbar.test.js` |
| 5 | Render | Muestra el carrito en `(0)` cuando está vacío | `src/Navbar.test.js` |
| 6 | Props | Deshabilita el botón cuando el stock es 0 | `src/ProductoCard.test.js` |
| 7 | Props | Muestra el precio tachado si el producto está en oferta | `src/ProductoCard.test.js` |
| 8 | Estado | El carrito sube contador y total al agregar un producto | `src/CarritoProvider.test.js` |
| 9 | Estado | Suma la cantidad si se agrega el mismo producto de nuevo | `src/CarritoProvider.test.js` |
| 10 | Evento | El clic en Agregar llama a `onAgregar` con el producto | `src/ProductoCard.test.js` |
| 11-22 | Servicio | Lógica de `productoService`  | `src/ProductoService.test.js` |
| 23 | Formulario | Login: correo inválido muestra error y no guarda sesión | `src/Auth.test.js` |
| 24 | Formulario | Login: contraseña de menos de 6 caracteres bloquea el ingreso | `src/Auth.test.js` |
| 25 | Formulario | Login: datos válidos guardan la sesión y navegan al inicio | `src/Auth.test.js` |
| 26 | Formulario | Registro: nombre de menos de 3 caracteres muestra error | `src/Auth.test.js` |
| 27 | Formulario | Registro: contraseña sin número muestra error | `src/Auth.test.js` |
| 28 | Formulario | Registro: confirmar contraseña distinta muestra error | `src/Auth.test.js` |
| 29 | Formulario | Registro: datos válidos registran y navegan al inicio | `src/Auth.test.js` |
| 30 | Formulario | Contacto: mensaje de menos de 10 caracteres muestra error | `src/Contacto.test.js` |
| 31 | Formulario | Contacto: envío válido muestra éxito y limpia el formulario | `src/Contacto.test.js` |
| 32 | Vista | Checkout: carrito vacío muestra mensaje | `src/Checkout.test.js` |
| 33 | Formulario | Checkout: formulario incompleto muestra error y no navega | `src/Checkout.test.js` |
| 34 | Formulario | Checkout: la calle es obligatoria aunque el resto esté completo | `src/Checkout.test.js` |
| 35 | Flujo | Checkout: datos completos navegan a pago correcto y vacían el carrito | `src/Checkout.test.js` |
| 36 | Vista | Categorías: lista las 4 categorías | `src/CategoriasOfertas.test.js` |
| 37 | Filtro | Categoría: muestra solo los productos de esa categoría | `src/CategoriasOfertas.test.js` |
| 38 | Vista | Categoría inexistente muestra mensaje | `src/CategoriasOfertas.test.js` |
| 39 | Filtro | Ofertas: muestra solo los productos en oferta | `src/CategoriasOfertas.test.js` |
| 40 | Vista | Ofertas: muestra precio de oferta y precio original tachado | `src/CategoriasOfertas.test.js` |
| 41 | Vista | Ofertas: sin ofertas muestra mensaje | `src/CategoriasOfertas.test.js` |

Total: **41 tests**.

## Cobertura de código

Se mide con `karma-coverage` (Istanbul). `npm test` ahora genera el reporte al final:

```powershell
npm test
```

- Resumen y tabla por archivo: aparecen en la consola.
- Reporte navegable: abrir `coverage/index.html` en el navegador.

> Solo se miden los archivos de `src/` que algún test carga. `App.jsx` y `Admin.jsx` aún no tienen tests, por lo que no aparecen en el reporte.

## Otros comandos

```powershell
npm run dev      # levanta la tienda en el navegador
npm run build    # genera la versión de producción
npm run lint     # revisa el código
```

## Si algo falla

- **`No binary for ChromeHeadless browser`**: falta instalar Chrome. Se arregla con `npm install -D puppeteer` y agregando al inicio de `karma.conf.cjs`:
  ```js
  process.env.CHROME_BIN = require('puppeteer').executablePath()
  ```

- **`Cannot find module '@testing-library/dom'`**: hay que instalarlo aparte, no viene con `@testing-library/react` en su versión 16:
  ```powershell
  npm install -D @testing-library/dom
  ```
