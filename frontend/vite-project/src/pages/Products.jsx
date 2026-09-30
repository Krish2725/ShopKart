import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import axiosInstance from '../../axiosCalls/axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f6fb' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.02em' }}>Our Products</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: '1 1 300px', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#fff', minWidth: '200px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '4rem', fontSize: '1.25rem', color: '#64748b' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', borderWidth: '4px', borderTopColor: '#4f46e5' }}></div>
            Loading products...
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', textAlign: 'center', background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #f87171' }}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>No products available.</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

}

export default Products;
