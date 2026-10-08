import React from 'react';

function ProductoCard({ nombre, descripcion, imagen }) {
  return (
    <div className="card shadow-sm h-100">
      <img 
        src={imagen} 
        className="card-img-top" 
        alt={nombre} 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-dark">{nombre}</h5>
        <p className="card-text text-secondary flex-grow-1">
          {descripcion}
        </p>
        <button className="btn btn-primary w-100 fw-bold mt-auto">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductoCard;