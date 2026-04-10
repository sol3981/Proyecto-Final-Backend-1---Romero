import axios from 'axios';

const API_URL = '/api/products';

export const productsAPI = {
  // Obtener productos con paginación y filtros
  getProducts: async (params = {}) => {
    const { data } = await axios.get(API_URL, { params });
    return data;
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  },

  // Crear producto
  createProduct: async (productData) => {
    const { data } = await axios.post(API_URL, productData);
    return data;
  },

  // Actualizar producto
  updateProduct: async (id, productData) => {
    const { data } = await axios.put(`${API_URL}/${id}`, productData);
    return data;
  },

  // Eliminar producto
  deleteProduct: async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  }
};