import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../services/productsAPI';
import { cartsAPI } from '../services/cartsAPI';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProductById(id);
      setProduct(response.payload);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      let cartId = localStorage.getItem('cartId');

      if (!cartId) {
        const response = await cartsAPI.createCart();
        cartId = response.payload._id;
        localStorage.setItem('cartId', cartId);
      }

      await cartsAPI.addProductToCart(cartId, product._id);
      alert('✅ Producto agregado al carrito');
      navigate(`/cart/${cartId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al agregar producto');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error">Producto no encontrado</div>
        <Link to="/" className="btn btn-primary">Volver a productos</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Volver a productos</Link>

      <div className="product-detail">
        <div className="product-detail-content">
          <h1>{product.title}</h1>
          
          <p className="product-price">${product.price}</p>

          <div className="product-info">
            <p><strong>Descripción:</strong> {product.description}</p>
            <p><strong>Código:</strong> {product.code}</p>
            <p><strong>Categoría:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stock} unidades</p>
            <p>
              <strong>Estado:</strong>{' '}
              <span className={`status ${product.status ? 'available' : 'unavailable'}`}>
                {product.status ? '✓ Disponible' : '✗ No disponible'}
              </span>
            </p>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn btn-add-to-cart"
            disabled={!product.status || product.stock === 0}
          >
            🛒 Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;