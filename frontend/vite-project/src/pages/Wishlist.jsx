import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import axiosInstance from '../../axiosCalls/axios';
import { useAuth } from '../context/AuthContext';

function Wishlist() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/wishlist');
      if (response.data?.success || response.status === 200) {
        const items = Array.isArray(response.data?.wishlist)
          ? response.data.wishlist
          : Array.isArray(response.data)
          ? response.data
          : [];
        setWishlist(items);
      } else {
        setError(response.data?.message || 'Failed to fetch wishlist.');
      }
    } catch (err) {
      console.error('Fetch wishlist error:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view your wishlist.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Network error: Unable to connect to server.');
      } else {
        setError('Failed to load wishlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (removingId) return; // Prevent duplicate clicks while removing
    setRemovingId(productId);
    setActionError('');

    try {
      const response = await axiosInstance.delete(`/wishlist/${productId}`);
      if (response.status === 200 || response.data?.success) {
        // Dynamically update wishlist in UI without page refresh
        setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
        if (checkAuth) checkAuth();
      } else {
        setActionError(response.data?.message || 'Failed to remove from wishlist.');
      }
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      if (err.response?.data?.message) {
        setActionError(err.response.data.message);
      } else {
        setActionError('Failed to remove item. Please try again.');
      }
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f6fb' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '2.5rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
              My Wishlist
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.4rem', margin: 0 }}>
              {wishlist.length} {wishlist.length === 1 ? 'item saved' : 'items saved'}
            </p>
          </div>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              color: '#334155',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            &larr; Back to Products
          </Link>
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div
            role="alert"
            style={{
              marginBottom: '1.5rem',
              padding: '0.85rem 1.25rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              color: '#b91c1c',
              fontSize: '0.925rem',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>⚠️ {actionError}</span>
            <button
              onClick={() => setActionError('')}
              style={{ background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.25rem', color: '#64748b' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', borderWidth: '4px', borderTopColor: '#4f46e5' }}></div>
            Loading your wishlist...
          </div>
        ) : error ? (
          /* Error state */
          <div
            style={{
              textAlign: 'center',
              background: '#ffffff',
              padding: '3rem 2rem',
              borderRadius: '20px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              maxWidth: '500px',
              margin: '3rem auto'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: '700', marginBottom: '1.5rem' }}>
              Unable to load wishlist.
            </h2>
            <button
              onClick={fetchWishlist}
              style={{
                padding: '0.85rem 2rem',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.1s'
              }}
              onMouseOver={(e) => (e.target.style.background = '#334155')}
              onMouseOut={(e) => (e.target.style.background = '#0f172a')}
              onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Try Again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty wishlist state */
          <div
            style={{
              textAlign: 'center',
              background: '#ffffff',
              padding: '4rem 2rem',
              borderRadius: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              maxWidth: '560px',
              margin: '3rem auto'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: '#fff1f2',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1.5rem'
              }}
            >
              ❤️
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Your wishlist is empty ❤️
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Start saving products you love.
            </p>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '0.85rem 2rem',
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => (e.target.style.background = '#4338ca')}
              onMouseOut={(e) => (e.target.style.background = '#4f46e5')}
              onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* Dynamic products grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {wishlist.map((product) => {
              if (!product || !product._id) return null;
              const isRemoving = removingId === product._id;

              return (
                <div
                  key={product._id}
                  className="wishlist-card"
                  style={{
                    background: '#ffffff',
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
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      height: '220px',
                      width: '100%',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ color: '#94a3b8', fontWeight: '600' }}>PRODUCT IMAGE</span>
                    )}

                    {product.category && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(4px)',
                          color: '#4f46e5',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                        }}
                      >
                        {product.category}
                      </div>
                    )}
                  </div>

                  {/* Product Card Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        margin: '0 0 0.5rem',
                        color: '#0f172a',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.8rem'
                      }}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>
                        ₹{product.price?.toLocaleString('en-IN') || product.price}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        color: product.stock > 0 ? '#10b981' : '#ef4444',
                        marginBottom: '1.5rem',
                        fontWeight: '600'
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: product.stock > 0 ? '#10b981' : '#ef4444',
                          marginRight: '6px'
                        }}
                      ></span>
                      {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
                    </div>

                    {/* Required Actions on Every Wishlist Card */}
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {/* [ View Details ] */}
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${product._id}`)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '0.925rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s, transform 0.1s'
                        }}
                        onMouseOver={(e) => (e.target.style.background = '#334155')}
                        onMouseOut={(e) => (e.target.style.background = '#0f172a')}
                        onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
                        onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
                      >
                        View Details
                      </button>

                      {/* [ Remove from Wishlist ] */}
                      <button
                        type="button"
                        onClick={() => handleRemove(product._id)}
                        disabled={isRemoving}
                        aria-busy={isRemoving}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '0.925rem',
                          cursor: isRemoving ? 'not-allowed' : 'pointer',
                          opacity: isRemoving ? 0.75 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'background 0.2s, color 0.2s'
                        }}
                        onMouseOver={(e) => {
                          if (!isRemoving) {
                            e.target.style.background = '#fecaca';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isRemoving) {
                            e.target.style.background = '#fee2e2';
                          }
                        }}
                      >
                        {isRemoving ? 'Removing...' : 'Remove from Wishlist'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
