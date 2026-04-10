import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import './App.css';

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    // Aquí podrías cargar el número de items del carrito
    // Por ahora dejamos en 0
  }, []);

  return (
    <Router>
      <div className="app">
        <Header cartItemsCount={cartItemsCount} />
        <main>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart/:id" element={<Cart />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;