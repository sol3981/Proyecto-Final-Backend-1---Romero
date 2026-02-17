import fs from 'fs';

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.init();
  }

  // Inicializar el archivo si no existe
  init() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, JSON.stringify([], null, 2));
      }
      this.carts = this.loadCarts();
    } catch (error) {
      console.error('Error inicializando CartManager:', error);
      this.carts = [];
    }
  }

  // Cargar carritos desde el archivo
  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo carritos:', error);
      return [];
    }
  }

  // Guardar carritos en el archivo
  saveCarts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error('Error guardando carritos:', error);
      throw new Error('No se pudieron guardar los carritos');
    }
  }

  // Crear un nuevo carrito
  createCart() {
    this.carts = this.loadCarts();

    // Generar ID único
    const newId = this.carts.length > 0 
      ? Math.max(...this.carts.map(c => c.id)) + 1 
      : 1;

    const newCart = {
      id: newId,
      products: []
    };

    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  // Obtener carrito por ID
  getCartById(id) {
    this.carts = this.loadCarts();
    const cart = this.carts.find(c => c.id === id);
    return cart || null;
  }

  // Agregar producto al carrito
  addProductToCart(cartId, productId) {
    this.carts = this.loadCarts();
    const cartIndex = this.carts.findIndex(c => c.id === cartId);

    if (cartIndex === -1) {
      throw new Error(`No se encontró el carrito con ID ${cartId}`);
    }

    const cart = this.carts[cartIndex];
    
    // Buscar si el producto ya existe en el carrito
    const productIndex = cart.products.findIndex(p => p.product === productId);

    if (productIndex !== -1) {
      // Si existe, incrementar la cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si no existe, agregarlo con cantidad 1
      cart.products.push({
        product: productId,
        quantity: 1
      });
    }

    this.carts[cartIndex] = cart;
    this.saveCarts();
    return cart;
  }

  // Obtener todos los carritos (método auxiliar)
  getCarts() {
    this.carts = this.loadCarts();
    return this.carts;
  }
}

export default CartManager;