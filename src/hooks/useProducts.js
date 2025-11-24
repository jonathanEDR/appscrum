import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDataCache } from '../context/DataContext';
import { apiService } from '../services/apiService';

/**
 * Hook personalizado para obtener la lista de productos con caché
 * @returns {Object} { products, loading, error, refetch }
 */
export const useProducts = () => {
  const { getToken } = useAuth();
  const { getCachedData, setCachedData } = useDataCache();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Verificar caché primero
      const cached = getCachedData('productos');
      if (cached) {
        setProducts(cached);
        setLoading(false);
        return cached;
      }

      // 2. Si no hay caché, hacer petición a la API
      const data = await apiService.get('/products', getToken);
      const productList = data.products || data.productos || [];
      
      setProducts(productList);
      setCachedData('productos', productList);
      setError(null);
      
      return productList;
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []); // ✅ Solo se ejecuta una vez al montar

  // Función para refrescar manualmente (invalidando caché)
  const refetch = async () => {
    const { invalidateCache } = useDataCache();
    invalidateCache('productos');
    return await loadProducts();
  };

  return { 
    products, 
    loading, 
    error,
    refetch 
  };
};

export default useProducts;
