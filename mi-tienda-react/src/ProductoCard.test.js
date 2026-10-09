import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductoCard from './components/ProductoCard';

const productoBase = {
  id: 'CL003',
  nombre: 'Cilindro 15kg',
  descripcion: 'Gas licuado de prueba',
  precio: 16000,
  imagen: 'ruta-falsa.jpg',
  stock: 10,
  oferta: false,
  precioOferta: null,
};

function renderCard(producto = productoBase) {
  return render(
    <MemoryRouter>
      <ProductoCard producto={producto} onAgregar={() => {}} />
    </MemoryRouter>
  );
}

describe("Pruebas del Componente ProductoCard", () => {

  it("Prueba 1: Debería renderizar el nombre del producto en el DOM", () => {
    renderCard();

    const tituloDelProducto = screen.getByText("Cilindro 15kg");

    expect(tituloDelProducto).not.toBeNull();
  });

  it("Prueba 2: Debería renderizar la descripción del producto", () => {
    renderCard({
      ...productoBase,
      id: 'CL004',
      nombre: 'Cilindro 45kg',
      descripcion: 'Formato industrial de alto consumo',
    });

    const descripcion = screen.getByText("Formato industrial de alto consumo");
    expect(descripcion).not.toBeNull();
  });

});