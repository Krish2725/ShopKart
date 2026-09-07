import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Logout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogout = async () => {
      await logout()
      navigate('/login', { replace: true })
    }
    handleLogout()
  }, [logout, navigate])

  return (
    <div className="auth-page">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto', borderColor: '#4f46e5', borderTopColor: 'transparent' }}></div>
        <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 600 }}>Logging you out...</p>
      </div>
    </div>
  )
}

export default Logout
