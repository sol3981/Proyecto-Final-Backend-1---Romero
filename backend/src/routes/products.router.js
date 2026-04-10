import { Router } from 'express';
import Product from '../models/product.model.js';

const router = Router();

// GET / - Listar productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construir filtro
    const filter = {};
    if (query) {
      // Permitir buscar por categoría o disponibilidad
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

    // Ordenamiento por precio
    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    // Ejecutar query con paginación
    const result = await Product.paginate(filter, options);

    // Construir links de paginación
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildLink = (pageNum) => {
      const params = new URLSearchParams();
      params.set('limit', limit);
      params.set('page', pageNum);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
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

// POST / - Crear producto
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Emitir evento de socket para actualizar en tiempo real
    const products = await Product.find().lean();
    req.io.emit('updateProducts', products);

    res.status(201).json({
      status: 'success',
      message: 'Producto creado exitosamente',
      payload: product
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    // Emitir evento de socket
    const products = await Product.find().lean();
    req.io.emit('updateProducts', products);

    res.json({
      status: 'success',
      message: 'Producto actualizado exitosamente',
      payload: product
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.pid);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    // Emitir evento de socket
    const products = await Product.find().lean();
    req.io.emit('updateProducts', products);

    res.json({
      status: 'success',
      message: 'Producto eliminado exitosamente',
      payload: product
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;