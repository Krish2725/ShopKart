import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f6fb' }}>
      <Navbar />

      <div className="auth-page" style={{ flex: 1, padding: '2rem 1.5rem', minHeight: 'calc(100vh - 70px)' }}>
        <div className="bg-ambient-blob blob-1"></div>
        <div className="bg-ambient-blob blob-2"></div>

        <div
          style={{
            width: '100%',
            maxWidth: '850px',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '2.5rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ textAlign: 'center', margin: '1rem 0 2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: '#eef2ff', color: '#4f46e5', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem' }}>
              Protected Member Home
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
              Welcome back, {user?.fullName || 'Valued Member'}!
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              {user?.email ? `Authenticated as ${user.email}` : 'Your session is secure.'}
            </p>
          </div>

          {user && (
            <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Account Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Full Name</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{user.fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Email Address</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Phone Number</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{user.phone || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home