import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PublicRoutes({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-page">
        <div className="spinner"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default PublicRoutes