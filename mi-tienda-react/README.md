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
TOTAL: 10 SUCCESS
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
