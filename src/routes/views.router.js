import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productsPath = path.join(__dirname, '../data/products.json');
const productManager = new ProductManager(productsPath);

// Ruta: Home - Vista estática de productos
router.get('/', (req, res) => {
  try {
    const products = productManager.getProducts();
    res.render('home', {
      title: 'Lista de Productos',
      products: products,
      hasProducts: products.length > 0
    });
  } catch (error) {
    res.status(500).render('home', {
      title: 'Lista de Productos',
      products: [],
      hasProducts: false,
      error: 'Error al cargar los productos'
    });
  }
});

// Ruta: Real Time Products - Vista con WebSockets
router.get('/realtimeproducts', (req, res) => {
  try {
    const products = productManager.getProducts();
    res.render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products: products,
      hasProducts: products.length > 0
    });
  } catch (error) {
    res.status(500).render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products: [],
      hasProducts: false,
      error: 'Error al cargar los productos'
    });
  }
});

export default router;