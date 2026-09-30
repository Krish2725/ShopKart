import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import axiosInstance from '../../axiosCalls/axios';

function Products() {
  const navigate = useNavigate();
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
              <div key={product._id} style={{
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)';
                }}>
                <div style={{ height: '240px', width: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>PRODUCT IMAGE</span>
                  )}
                  {/* Category Pill Over Image */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255, 255, 255, 0.9)', color: '#4f46e5', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {product.category}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.75rem', color: '#0f172a', lineHeight: '1.4' }}>
                    {product.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
                      ₹{product.price?.toLocaleString('en-IN') || product.price}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: product.stock > 0 ? '#10b981' : '#ef4444', marginBottom: '1.5rem', fontWeight: '600' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock > 0 ? '#10b981' : '#ef4444', marginRight: '6px' }}></span>
                    {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
                  </div>

                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      padding: '0.85rem',
                      background: '#0f172a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s, transform 0.1s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#334155'}
                    onMouseOut={(e) => e.target.style.background = '#0f172a'}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
