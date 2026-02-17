import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const cartsPath = path.join(__dirname, '../data/carts.json');
const cartManager = new CartManager(cartsPath);

// POST / - Crear un nuevo carrito
router.post('/', (req, res) => {
  try {
    const newCart = cartManager.createCart();
    res.status(201).json({
      status: 'success',
      message: 'Carrito creado exitosamente',
      payload: newCart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /:cid - Listar productos de un carrito
router.get('/:cid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: `No se encontró el carrito con ID ${cartId}`
      });
    }

    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const updatedCart = cartManager.addProductToCart(cartId, productId);

    res.json({
      status: 'success',
      message: 'Producto agregado al carrito exitosamente',
      payload: updatedCart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;