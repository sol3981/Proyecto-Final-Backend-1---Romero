import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productsPath = path.join(__dirname, '../data/products.json');
const productManager = new ProductManager(productsPath);

// GET / - Listar todos los productos
router.get('/', (req, res) => {
  try {
    const products = productManager.getProducts();
    res.json({
      status: 'success',
      payload: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /:pid - Obtener producto por ID
router.get('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: `No se encontró el producto con ID ${productId}`
      });
    }

    res.json({
      status: 'success',
      payload: product
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST / - Agregar un nuevo producto
router.post('/', (req, res) => {
  try {
    const newProduct = productManager.addProduct(req.body);
    
    // Emitir evento de socket para actualizar en tiempo real
    req.io.emit('updateProducts', productManager.getProducts());
    
    res.status(201).json({
      status: 'success',
      message: 'Producto creado exitosamente',
      payload: newProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /:pid - Actualizar un producto
router.put('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = productManager.updateProduct(productId, req.body);
    res.json({
      status: 'success',
      message: 'Producto actualizado exitosamente',
      payload: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /:pid - Eliminar un producto
router.delete('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const deletedProduct = productManager.deleteProduct(productId);
    
    // Emitir evento de socket para actualizar en tiempo real
    req.io.emit('updateProducts', productManager.getProducts());
    
    res.json({
      status: 'success',
      message: 'Producto eliminado exitosamente',
      payload: deletedProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;