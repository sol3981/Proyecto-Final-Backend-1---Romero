import { Router } from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

const router = Router();

// Vista: Productos con paginación
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construir filtro
    const filter = {};
    if (query) {
      if (query === 'disponible') {
        filter.status = true;
      } else if (query === 'no-disponible') {
        filter.status = false;
      } else {
        filter.category = query;
      }
    }

    // Opciones de paginación
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };

    // Ordenamiento
    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const result = await Product.paginate(filter, options);

    // Construir parámetros para links
    const buildQueryString = (pageNum) => {
      const params = new URLSearchParams();
      params.set('page', pageNum);
      params.set('limit', limit);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return params.toString();
    };

    res.render('products', {
      title: 'Productos',
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage ? `/products?${buildQueryString(result.prevPage)}` : null,
      nextLink: result.hasNextPage ? `/products?${buildQueryString(result.nextPage)}` : null,
      query: query || '',
      sort: sort || ''
    });
  } catch (error) {
    res.status(500).render('products', {
      title: 'Productos',
      products: [],
      error: 'Error al cargar productos'
    });
  }
});

// Vista: Detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Producto no encontrado'
      });
    }

    res.render('productDetail', {
      title: product.title,
      product: product
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el producto'
    });
  }
});

// Vista: Carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Carrito no encontrado'
      });
    }

    // Calcular total
    const total = cart.products.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.render('cart', {
      title: 'Mi Carrito',
      cartId: req.params.cid,
      products: cart.products,
      hasProducts: cart.products.length > 0,
      total: total.toFixed(2)
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el carrito'
    });
  }
});

// Vista: Real Time Products (mantener la original)
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find().lean();
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
      error: 'Error al cargar productos'
    });
  }
});

// Vista: Home - Redirigir a productos
router.get('/', (req, res) => {
  res.redirect('/products');
});

export default router;