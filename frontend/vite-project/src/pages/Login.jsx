import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'
import { useAuth } from '../context/AuthContext'

const carouselSlides = [
  {
    titlePrefix: 'Shop more.',
    titleHighlight: 'Save more.',
    titleSuffix: 'Experience luxury.',
    desc: 'Curated global collections and seamless 1-click checkout crafted for discerning shoppers.'
  },
  {
    titlePrefix: 'Exclusive drops.',
    titleHighlight: 'VIP access.',
    titleSuffix: 'Unbeatable deals.',
    desc: 'Unlock member-only private sales, seasonal flash discounts, and 24/7 concierge support.'
  },
  {
    titlePrefix: 'Fast delivery.',
    titleHighlight: 'Safe & secure.',
    titleSuffix: 'Buyer protected.',
    desc: 'Real-time order tracking with bank-grade encrypted payment checkout and guaranteed returns.'
  }
]

function Login() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loader, setLoader] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto cycle carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (err) setErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setSuccessMsg('')

    if (!form.email.trim() || !form.password) {
      setErr('Please enter both your email and password.')
      return
    }

    setLoader(true)
    try {
      const response = await axiosInstance.post('/customers/login', {
        email: form.email.trim(),
        password: form.password
      })

      if (response.data?.success || response.status === 200) {
        await checkAuth()
        setSuccessMsg('Welcome back! Logging you in...')
        setTimeout(() => {
          navigate('/home')
        }, 500)
      } else {
        setErr(response.data?.message || 'Invalid email or password.')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.data?.message) {
        setErr(error.response.data.message)
      } else if (error.response?.status === 401) {
        setErr('Invalid email or password. Please check your credentials.')
      } else {
        setErr('Unable to connect to the server. Please check your connection.')
      }
    } finally {
      setLoader(false)
    }
  }

  const currentSlide = carouselSlides[activeSlide]

  return (
    <div className="auth-page">
      {/* Ambient background glows */}
      <div className="bg-ambient-blob blob-1"></div>
      <div className="bg-ambient-blob blob-2"></div>

      <div className="auth-container">
        {/* ================= Left Showcase Panel ================= */}
        <div className="showcase-panel">
          {/* Top Brand Pill */}
          <div className="brand-badge">
            <div className="brand-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span className="brand-name">
              ShopKart <span className="brand-pill-tag">VIP</span>
            </span>
          </div>

          {/* Central 3D Glowing Prism / Emblem */}
          <div className="showcase-visual-wrapper">
            <div className="glow-envelope-container">
              <div className="neon-ring ring-1"></div>
              <div className="neon-ring ring-2"></div>
              <div className="floating-3d-card">
                <div className="floating-badge-chip">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>4.9★</span>
                </div>
                <svg className="floating-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Showcase Bottom Copy & Carousel */}
          <div className="showcase-content">
            <div className="showcase-slide-text">
              <h2 className="showcase-title">
                {currentSlide.titlePrefix} <span className="text-gradient">{currentSlide.titleHighlight}</span><br />
                {currentSlide.titleSuffix}
              </h2>
              <p className="showcase-desc">{currentSlide.desc}</p>
            </div>

            <div className="carousel-controls" aria-label="Slide controls">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= Right Form Panel ================= */}
        <div className="form-panel">
          {/* Top Quick-Switch Action */}
          <div className="top-action-bar">
            <Link to="/register" className="top-action-btn">
              <span>Create Account</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Form Header */}
          <div className="form-header">
            <h1 className="form-title">Welcome Back!</h1>
            <p className="form-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {err && (
            <div className="auth-alert error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{err}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="auth-alert success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Your Email
              </label>
              <div className="input-container">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="youremail@gmail.com"
                  className="form-input"
                  required
                />
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="form-input"
                  required
                />
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loader}
              className="btn-primary-cta"
              style={{ marginTop: '0.5rem' }}
            >
              {loader ? (
                <>
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Footer Switch */}
          <div className="auth-footer-text" style={{ marginTop: '2rem' }}>
            <span>Don't have an account?</span>
            <Link to="/register" className="auth-switch-link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login