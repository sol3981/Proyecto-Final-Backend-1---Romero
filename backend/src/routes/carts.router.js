import { Router } from 'express';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const router = Router();

// POST / - Crear carrito
router.post('/', async (req, res) => {
  try {
    const cart = new Cart({ products: [] });
    await cart.save();

    res.status(201).json({
      status: 'success',
      message: 'Carrito creado exitosamente',
      payload: cart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /:cid - Obtener carrito con productos poblados
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
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
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
      });
    }

    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    // Buscar si el producto ya existe en el carrito
    const existingProduct = cart.products.find(
      p => p.product.toString() === req.params.pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product: req.params.pid,
        quantity: 1
      });
    }

    await cart.save();

    // Poblar productos antes de enviar respuesta
    await cart.populate('products.product');

    res.json({
      status: 'success',
      message: 'Producto agregado al carrito',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
      });
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== req.params.pid
    );

    await cart.save();
    await cart.populate('products.product');

    res.json({
      status: 'success',
      message: 'Producto eliminado del carrito',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /:cid - Actualizar todo el carrito
router.put('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
      });
    }

    cart.products = req.body.products;
    await cart.save();
    await cart.populate('products.product');

    res.json({
      status: 'success',
      message: 'Carrito actualizado',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /:cid/products/:pid - Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad debe ser mayor a 0'
      });
    }

    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
      });
    }

    const productInCart = cart.products.find(
      p => p.product.toString() === req.params.pid
    );

    if (!productInCart) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado en el carrito'
      });
    }

    productInCart.quantity = quantity;
    await cart.save();
    await cart.populate('products.product');

    res.json({
      status: 'success',
      message: 'Cantidad actualizada',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
      });
    }

    cart.products = [];
    await cart.save();

    res.json({
      status: 'success',
      message: 'Carrito vaciado',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;