import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosCalls/axios';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product, onWishlistChange }) {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  // Check if product is already in user's wishlist
  const isProductInWishlist = Boolean(
    user?.wishlist?.some((item) => {
      const id = item?._id || item;
      return id && id.toString() === product._id?.toString();
    })
  );

  const [isWishlisted, setIsWishlisted] = useState(isProductInWishlist);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Keep in sync with user's wishlist if user context updates
  useEffect(() => {
    setIsWishlisted(isProductInWishlist);
  }, [isProductInWishlist]);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleWishlistClick = async (e) => {
    // 1. Prevent page refresh & event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 2. Prevent duplicate clicks while request is running
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (!isWishlisted) {
        // Add to Wishlist
        const response = await axiosInstance.post(`/wishlist/${product._id}`);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
          setIsWishlisted(true);
          if (onWishlistChange) onWishlistChange(product._id, true);
          if (checkAuth) checkAuth();
        } else {
          setError(response.data?.message || 'Failed to add to wishlist.');
        }
      } else {
        // Remove from Wishlist (toggle)
        const response = await axiosInstance.delete(`/wishlist/${product._id}`);
        if (response.status === 200 || response.data?.success) {
          setIsWishlisted(false);
          if (onWishlistChange) onWishlistChange(product._id, false);
          if (checkAuth) checkAuth();
        } else {
          setError(response.data?.message || 'Failed to remove from wishlist.');
        }
      }
    } catch (err) {
      console.error('Wishlist API error:', err);
      // Handle API failures with useful error messages
      if (err.response?.status === 401) {
        setError('Please log in to add items to your wishlist.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Network error: Unable to connect to server.');
      } else {
        setError('Failed to update wishlist. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Button label according to required states
  let buttonText = '♡ Add to Wishlist';
  if (isSaving) {
    buttonText = '⏳ Saving...';
  } else if (isWishlisted) {
    buttonText = '♥ Added to Wishlist';
  }

  return (
    <div
      className="product-card"
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Product Image & Top Overlays */}
      <div
        style={{
          height: '240px',
          width: '100%',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
          />
        ) : (
          <span style={{ color: '#94a3b8', fontWeight: '600', letterSpacing: '0.05em' }}>
            PRODUCT IMAGE
          </span>
        )}

        {/* Category Pill Over Image */}
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
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          >
            {product.category}
          </div>
        )}
      </div>

      {/* Product Card Body */}
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
            marginBottom: '1.25rem',
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

        {/* Card Action Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Wishlist Button with exact state text & icons */}
          <button
            type="button"
            className="wishlist-btn"
            id={`wishlist-btn-${product._id}`}
            onClick={handleWishlistClick}
            disabled={isSaving}
            aria-busy={isSaving}
            aria-label={isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              border: isWishlisted
                ? '1px solid #fecdd3'
                : '1px solid #e2e8f0',
              background: isSaving
                ? '#f8fafc'
                : isWishlisted
                ? '#fff1f2'
                : '#ffffff',
              color: isSaving
                ? '#64748b'
                : isWishlisted
                ? '#e11d48'
                : '#334155',
              boxShadow: isWishlisted
                ? '0 2px 8px rgba(225, 29, 72, 0.12)'
                : '0 1px 3px rgba(0, 0, 0, 0.04)',
              opacity: isSaving ? 0.75 : 1
            }}
            onMouseOver={(e) => {
              if (!isSaving) {
                if (isWishlisted) {
                  e.currentTarget.style.background = '#ffe4e6';
                } else {
                  e.currentTarget.style.background = '#fff1f2';
                  e.currentTarget.style.borderColor = '#fecdd3';
                  e.currentTarget.style.color = '#e11d48';
                }
              }
            }}
            onMouseOut={(e) => {
              if (!isSaving) {
                if (isWishlisted) {
                  e.currentTarget.style.background = '#fff1f2';
                  e.currentTarget.style.borderColor = '#fecdd3';
                  e.currentTarget.style.color = '#e11d48';
                } else {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                }
              }
            }}
            onMouseDown={(e) => {
              if (!isSaving) e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              if (!isSaving) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {buttonText}
          </button>

          {/* Useful Error Message on API Failure */}
          {error && (
            <div
              className="wishlist-error"
              role="alert"
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                lineHeight: '1.3',
                animation: 'fadeIn 0.2s ease-in-out'
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* View Details Button */}
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
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
