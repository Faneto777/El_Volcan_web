import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; 
import ProductoCard from './components/ProductoCard';

describe("Pruebas del Componente ProductoCard", () => {
  
  const productoMock = {
    id: 1,
    nombre: "Cilindro 15kg",
    descripcion: "Gas de prueba para test",
    precio: 15000,
    imagen: "ruta-falsa.jpg",
    stock: 5,
    oferta: false
  };

  it("Prueba 1: Debería renderizar la información del producto correctamente", () => {
    render(
      <BrowserRouter>
        <ProductoCard producto={productoMock} onAgregar={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText("Cilindro 15kg")).not.toBeNull();
    expect(screen.getByText("Gas de prueba para test")).not.toBeNull();
  });

  it("Prueba 2: Debería deshabilitar el botón y mostrar 'Sin stock' si el stock es 0", () => {
    const productoSinStock = { ...productoMock, stock: 0 };
    
    render(
      <BrowserRouter>
        <ProductoCard producto={productoSinStock} onAgregar={() => {}} />
      </BrowserRouter>
    );

    const boton = screen.getByRole('button', { name: /sin stock/i });
    expect(boton.disabled).toBeTrue();
  });

  it("Prueba 3: Debería ejecutar la función onAgregar al hacer clic", () => {
    const espiaAgregar = jasmine.createSpy('onAgregar');
    
    render(
      <BrowserRouter>
        <ProductoCard producto={productoMock} onAgregar={espiaAgregar} />
      </BrowserRouter>
    );

    const boton = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(boton);
    
    expect(espiaAgregar).toHaveBeenCalledWith(productoMock);
  });

});