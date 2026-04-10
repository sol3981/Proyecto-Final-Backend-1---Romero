import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/productsAPI';
import { cartsAPI } from '../services/cartsAPI';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Obtener parámetros de la URL
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const sort = searchParams.get('sort') || '';
  const query = searchParams.get('query') || '';

  useEffect(() => {
    loadProducts();
  }, [page, limit, sort, query]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (sort) params.sort = sort;
      if (query) params.query = query;

      const response = await productsAPI.getProducts(params);
      setProducts(response.payload || []);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.page,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage
      });
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      let cartId = localStorage.getItem('cartId');

      if (!cartId) {
        const response = await cartsAPI.createCart();
        cartId = response.payload._id;
        localStorage.setItem('cartId', cartId);
      }

      await cartsAPI.addProductToCart(cartId, productId);
      alert('✅ Producto agregado al carrito');
      navigate(`/cart/${cartId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al agregar producto');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    
    newParams.set('page', '1'); // Reset a página 1 al cambiar filtros
    setSearchParams(newParams);
  };

  const changePage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Catálogo de Productos</h2>

      {/* Filtros */}
      <div className="filters">
        <div className="filter-group">
          <label>Categoría:</label>
          <select name="query" value={query} onChange={handleFilterChange}>
            <option value="">Todas</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Audio">Audio</option>
            <option value="disponible">Disponibles</option>
            <option value="no-disponible">No disponibles</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por precio:</label>
          <select name="sort" value={sort} onChange={handleFilterChange}>
            <option value="">Sin orden</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Productos por página:</label>
          <select name="limit" value={limit} onChange={handleFilterChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Grid de productos */}
      {products.length > 0 ? (
        <>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="btn btn-pagination"
              >
                ← Anterior
              </button>

              <span className="page-info">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>

              <button 
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="btn btn-pagination"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-products">
          <h3>📦 No hay productos disponibles</h3>
          <p>Intenta cambiar los filtros</p>
        </div>
      )}
    </div>
  );
}

export default Products;