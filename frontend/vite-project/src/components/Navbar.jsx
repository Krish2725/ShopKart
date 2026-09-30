import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header
      style={{
        width: '100%',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxSizing: 'border-box'
      }}
    >
      <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div className="brand-logo-icon" style={{ width: '30px', height: '30px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
          ShopKart
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Link 
          to="/products" 
          style={{
            textDecoration: 'none',
            color: '#0f172a',
            fontWeight: 600,
            fontSize: '0.95rem',
            marginRight: '0.5rem'
          }}
        >
          Products
        </Link>
        {user ? (
          <>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
              Hi, <strong style={{ color: '#0f172a' }}>{user.fullName?.split(' ')[0] || 'Member'}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="top-action-btn"
              style={{
                cursor: 'pointer',
                background: '#fee2e2',
                borderColor: '#fecaca',
                color: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600
              }}
            >
              <span>Logout</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </>
        ) : (
          <Link to="/login" className="top-action-btn">
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
