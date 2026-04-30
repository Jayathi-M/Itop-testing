import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '../../assets/login_image.png'
import logo from '../../assets/Logo.svg'
import './Login.css'

// Infinity / TrueZenix logo SVG icon
function InfinityIcon() {
  return (
    <svg className="lg-logo-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="inf-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a6de0" />
          <stop offset="100%" stopColor="#38c6f4" />
        </linearGradient>
      </defs>
      <path
        d="M22 22c-3-5-7-8-11-8a8 8 0 0 0 0 16c4 0 8-3 11-8z"
        stroke="url(#inf-grad)" strokeWidth="3.2" fill="none" strokeLinecap="round"
      />
      <path
        d="M22 22c3 5 7 8 11 8a8 8 0 0 0 0-16c-4 0-8 3-11 8z"
        stroke="url(#inf-grad)" strokeWidth="3.2" fill="none" strokeLinecap="round"
      />
    </svg>
  )
}

// Person icon SVG
function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="#8aaed4" strokeWidth="1.8"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#8aaed4" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// Lock icon SVG
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#8aaed4" strokeWidth="1.8"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#8aaed4" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()

  const [showSignup, setShowSignup] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const isMatch = password === confirmPassword

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate('/home', { replace: true })
  }

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isMatch) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setShowSignup(false)
  }

  return (
    <div className="lg-root">
      <div className="lg-frame">

        {/* LEFT — image panel */}
        <div className="lg-left">
          <img src={logoImg} alt="AI Pharma BioScience" />
        </div>

        {/* RIGHT — form panel */}
        <div className="lg-form-side">

          {/* Logo */}
          <div className="lg-logo-wrap">
            <div className="lg-logo-row">
              <img src={logo} alt="AI Pharma BioScience" />
              <span className="lg-logo-name">TrueZenix</span>
            </div>
            <span className="lg-logo-sub">AI • Pharma • BioScience</span>
          </div>

          {/* Login form */}
          <form className="lg-form" onSubmit={handleLogin}>
            <h1 className="lg-form-title">USER LOGIN</h1>

            <div className="lg-field">
              <span className="lg-field-icon"><PersonIcon /></span>
              <input className="lg-input" type="text" placeholder="Username" />
            </div>

            <div className="lg-field">
              <span className="lg-field-icon"><LockIcon /></span>
              <input className="lg-input" type="password" placeholder="Password" />
            </div>

            <div className="lg-row">
              <a
                href="#"
                className="lg-forget"
                onClick={(e) => { e.preventDefault(); setShowForgot(true) }}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className="lg-submit">LOGIN</button>

            <div className="lg-rows">
              <h5>Don't have an account?</h5>
              <a
                href="#"
                className="lg-Signup"
                onClick={(e) => { e.preventDefault(); setShowSignup(true) }}
              >
                Sign up
              </a>
            </div>
          </form>

          {/* Forgot password modal */}
          {showForgot && (
            <div className="modal-overlay" onClick={() => setShowForgot(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h2>Reset Password</h2>
                <h5>Email</h5>
                <input type="email" placeholder="Enter your email" />
                <button type="button">Send Reset Link</button>
                <p className="ss-ss" onClick={() => setShowForgot(false)}>Close</p>
              </div>
            </div>
          )}

          {/* Sign up modal */}
          {showSignup && (
            <div className="modal-overlay" onClick={() => setShowSignup(false)}>
              <form
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSignup}
              >
                <h2>Sign Up</h2>

                <div className="row">
                  <div className="field">
                    <h5>First Name</h5>
                    <input type="text" />
                  </div>
                  <div className="field">
                    <h5>Last Name</h5>
                    <input type="text" />
                  </div>
                </div>

                <h5>Email</h5>
                <input type="email" required />

                <h5>Password</h5>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <h5>Confirm Password</h5>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {confirmPassword && (
                  <p style={{ color: isMatch ? '#16a34a' : '#dc2626', margin: 0, fontSize: 13 }}>
                    {isMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}

                {error && <p style={{ color: '#dc2626', margin: 0, fontSize: 13 }}>{error}</p>}

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span>Agree to terms and conditions</span>
                  </label>
                </div>

                <button type="submit">Sign Up</button>
                <p className="ss-ss" onClick={() => setShowSignup(false)}>Close</p>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}