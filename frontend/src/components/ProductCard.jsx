import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-header">
        <h3>{product.title}</h3>
        <span className={`status ${product.status ? 'available' : 'unavailable'}`}>
          {product.status ? '✓ Disponible' : '✗ No disponible'}
        </span>
      </div>

      <p className="product-description">{product.description}</p>
      
      <p className="product-price">${product.price}</p>

      <div className="product-badges">
        <span className="badge badge-code">{product.code}</span>
        <span className="badge badge-category">{product.category}</span>
        <span className="badge badge-stock">Stock: {product.stock}</span>
      </div>

      <div className="product-actions">
        <Link to={`/product/${product._id}`} className="btn btn-primary">
          Ver Detalles
        </Link>
        <button 
          onClick={() => onAddToCart(product._id)} 
          className="btn btn-success"
          disabled={!product.status || product.stock === 0}
        >
          🛒 Agregar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;