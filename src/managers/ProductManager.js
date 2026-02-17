import fs from 'fs';
import path from 'path';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.init();
  }

  // Inicializar el archivo si no existe
  init() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, JSON.stringify([], null, 2));
      }
      this.products = this.loadProducts();
    } catch (error) {
      console.error('Error inicializando ProductManager:', error);
      this.products = [];
    }
  }

  // Cargar productos desde el archivo
  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo productos:', error);
      return [];
    }
  }

  // Guardar productos en el archivo
  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error guardando productos:', error);
      throw new Error('No se pudieron guardar los productos');
    }
  }

  // Obtener todos los productos
  getProducts() {
    this.products = this.loadProducts();
    return this.products;
  }

  // Obtener producto por ID
  getProductById(id) {
    this.products = this.loadProducts();
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  // Agregar un nuevo producto
  addProduct(productData) {
    this.products = this.loadProducts();

    // Validar campos obligatorios
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    // Verificar que el código no esté repetido
    const codeExists = this.products.some(p => p.code === productData.code);
    if (codeExists) {
      throw new Error(`Ya existe un producto con el código ${productData.code}`);
    }

    // Generar ID único
    const newId = this.products.length > 0 
      ? Math.max(...this.products.map(p => p.id)) + 1 
      : 1;

    // Crear el nuevo producto
    const newProduct = {
      id: newId,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: productData.status !== undefined ? productData.status : true,
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: productData.thumbnails || []
    };

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  // Actualizar un producto
  updateProduct(id, updateData) {
    this.products = this.loadProducts();
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`No se encontró el producto con ID ${id}`);
    }

    // No permitir actualizar el ID
    delete updateData.id;

    // Si se intenta actualizar el código, verificar que no esté repetido
    if (updateData.code && updateData.code !== this.products[index].code) {
      const codeExists = this.products.some(p => p.code === updateData.code);
      if (codeExists) {
        throw new Error(`Ya existe un producto con el código ${updateData.code}`);
      }
    }

    // Actualizar el producto
    this.products[index] = {
      ...this.products[index],
      ...updateData
    };

    this.saveProducts();
    return this.products[index];
  }

  // Eliminar un producto
  deleteProduct(id) {
    this.products = this.loadProducts();
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`No se encontró el producto con ID ${id}`);
    }

    const deletedProduct = this.products.splice(index, 1);
    this.saveProducts();
    return deletedProduct[0];
  }
}

export default ProductManager;