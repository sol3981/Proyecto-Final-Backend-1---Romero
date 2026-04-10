import axios from 'axios';

const API_URL = '/api/carts';

export const cartsAPI = {
  // Crear carrito
  createCart: async () => {
    const { data } = await axios.post(API_URL);
    return data;
  },

  // Obtener carrito por ID
  getCartById: async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  },

  // Agregar producto al carrito
  addProductToCart: async (cartId, productId) => {
    const { data } = await axios.post(`${API_URL}/${cartId}/product/${productId}`);
    return data;
  },

  // Actualizar cantidad de producto
  updateProductQuantity: async (cartId, productId, quantity) => {
    const { data } = await axios.put(`${API_URL}/${cartId}/products/${productId}`, { quantity });
    return data;
  },

  // Eliminar producto del carrito
  removeProductFromCart: async (cartId, productId) => {
    const { data } = await axios.delete(`${API_URL}/${cartId}/products/${productId}`);
    return data;
  },

  // Vaciar carrito
  clearCart: async (cartId) => {
    const { data } = await axios.delete(`${API_URL}/${cartId}`);
    return data;
  },

  // Actualizar todo el carrito
  updateCart: async (cartId, products) => {
    const { data } = await axios.put(`${API_URL}/${cartId}`, { products });
    return data;
  }
};