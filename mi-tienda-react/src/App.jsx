import 'bootstrap/dist/css/bootstrap.min.css';
import ProductoCard from './components/ProductoCard'; // Importamos el componente

function App() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Catálogo El Volcán</h1>
      
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <ProductoCard 
            nombre="Cilindro 15kg" 
            descripcion="Gas licuado ideal para estufas y cocinas domésticas."
            imagen="https://via.placeholder.com/300x200?text=Cilindro+15kg" 
          />
        </div>

        <div className="col-12 col-md-4">
          <ProductoCard 
            nombre="Cilindro 45kg" 
            descripcion="Formato industrial y de alto consumo residencial."
            imagen="https://via.placeholder.com/300x200?text=Cilindro+45kg" 
          />
        </div>
      </div>
    </div>
  )
}

export default App