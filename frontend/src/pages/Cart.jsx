import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cartsAPI } from '../services/cartsAPI';
import './Cart.css';

function Cart() {
  const { id } = useParams();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, [id]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartsAPI.getCartById(id);
      setCart(response.payload);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartsAPI.updateProductQuantity(id, productId, newQuantity);
      loadCart();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar cantidad');
    }
  };

  const removeProduct = async (productId) => {
    if (!window.confirm('¿Eliminar este producto?')) return;

    try {
      await cartsAPI.removeProductFromCart(id, productId);
      loadCart();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar producto');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('¿Vaciar todo el carrito?')) return;

    try {
      await cartsAPI.clearCart(id);
      loadCart();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al vaciar carrito');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando carrito...</div>
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>🛒 Tu carrito está vacío</h2>
          <p>Agrega productos desde el catálogo</p>
          <Link to="/" className="btn btn-primary">Ver Productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">🛒 Mi Carrito de Compras</h2>

      <div className="cart-content">
        {cart.products.map((item) => (
          <div key={item.product._id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.product.title}</h3>
              <p className="cart-item-description">{item.product.description}</p>
              <p className="cart-item-price">${item.product.price}</p>
            </div>

            <div className="cart-item-quantity">
              <p><strong>Cantidad:</strong></p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="btn-quantity"
                >
                  -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="btn-quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="cart-item-total">
              <p><strong>Subtotal:</strong></p>
              <p className="subtotal">${(item.product.price * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => removeProduct(item.product._id)}
                className="btn btn-remove"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}

        <div className="cart-summary">
          <h3>Total: <span className="total-price">${calculateTotal()}</span></h3>
          <div className="cart-actions">
            <button onClick={clearCart} className="btn btn-danger">
              Vaciar Carrito
            </button>
            <button className="btn btn-success">
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;