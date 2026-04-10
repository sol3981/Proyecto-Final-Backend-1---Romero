import { Link } from 'react-router-dom';
import './Header.css';

function Header({ cartItemsCount }) {
  const cartId = localStorage.getItem('cartId');

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🛍️ E-commerce</h1>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Productos</Link>
          {cartId && (
            <Link to={`/cart/${cartId}`} className="nav-link cart-link">
              🛒 Carrito
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;