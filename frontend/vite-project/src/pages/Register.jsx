import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../axiosCalls/axios'

const registerSlides = [
  {
    titlePrefix: 'Join VIP club.',
    titleHighlight: 'Earn rewards.',
    titleSuffix: 'Shop with elegance.',
    desc: 'Get immediate access to exclusive drops, personalized curation, and priority delivery on every order.'
  },
  {
    titlePrefix: '100% Authentic.',
    titleHighlight: 'Buyer Protection.',
    titleSuffix: 'Worry-free shopping.',
    desc: 'Every item is verified for premium quality. Enjoy 30-day hassle-free returns and insured global shipping.'
  },
  {
    titlePrefix: 'Seamless cart.',
    titleHighlight: 'Instant checkout.',
    titleSuffix: 'Smart savings.',
    desc: 'Sync your wishlist across devices, receive flash sale alerts, and track parcels live to your doorstep.'
  }
]

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loader, setLoader] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto-cycle carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % registerSlides.length)
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

    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.phone.trim()) {
      setErr('Please fill in all the required fields.')
      return
    }

    if (form.password.length < 6) {
      setErr('Password must be at least 6 characters long.')
      return
    }

    setLoader(true)
    try {
      const response = await axiosInstance.post('/customers/register', {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim()
      })

      if (response.data?.success || response.status === 200) {
        setSuccessMsg('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      } else {
        setErr(response.data?.message || 'Failed to register. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response?.data?.message) {
        setErr(error.response.data.message)
      } else if (error.response?.status === 409) {
        setErr('This email is already registered. Please sign in instead.')
      } else {
        setErr('Unable to connect to the server. Please check your connection.')
      }
    } finally {
      setLoader(false)
    }
  }

  const currentSlide = registerSlides[activeSlide]

  return (
    <div className="auth-page">
      {/* Ambient background glows */}
      <div className="bg-ambient-blob blob-1"></div>
      <div className="bg-ambient-blob blob-2"></div>

      <div className="auth-container">
        {/* ================= Left Showcase Panel ================= */}
        <div className="showcase-panel">
          {/* Top Brand Badge */}
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
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>VIP FREE</span>
                </div>
                <svg className="floating-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
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
              {registerSlides.map((_, idx) => (
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
            <Link to="/login" className="top-action-btn">
              <span>Sign In</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Form Header */}
          <div className="form-header">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Join ShopKart for exclusive access and member privileges</p>
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

          {/* Register Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <div className="input-container">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Alexander Wright"
                  className="form-input"
                  required
                />
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alexander@domain.com"
                  className="form-input"
                  required
                />
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <div className="input-container">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-1234"
                  className="form-input"
                  required
                />
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Create Password
              </label>
              <div className="input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
              style={{ marginTop: '0.75rem' }}
            >
              {loader ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating your account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          {/* Footer Switch */}
          <div className="auth-footer-text" style={{ marginTop: '2rem' }}>
            <span>Already have an account?</span>
            <Link to="/login" className="auth-switch-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register