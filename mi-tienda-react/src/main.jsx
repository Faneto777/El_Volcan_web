import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import './estilos/volcan.css'
import App from './App.jsx'
import CarritoProvider from './context/CarritoProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </HashRouter>
  </StrictMode>,
)