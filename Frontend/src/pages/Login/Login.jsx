import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // ── Basic validation ───────────────────────────────────────
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username/phone and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ── Call backend API ───────────────────────────────────────
      const response = await fetch('http://localhost:5269/api/Login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ── Store token & user info ──────────────────────────────
        localStorage.setItem('token',    data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role',     data.role);

        // ── Redirect to home (landing page with sidebar) ─────────
        navigate('/home');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Allow Enter key to submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login__page">

      {/* ── Background grid lines ── */}
      <div className="login__grid" />

      {/* ── Glow orbs ── */}
      <div className="login__orb login__orb--1" />
      <div className="login__orb login__orb--2" />

      <div className="login__card">

        {/* ── Logo / Brand ── */}
        <div className="login__brand">
          <div className="login__logo">X</div>
          <div className="login__brand-text">
            <span className="login__brand-name">Xception</span>
            <span className="login__brand-ai">.AI</span>
          </div>
        </div>

        <p className="login__subtitle">Pharmaceutical Instrument Management</p>

        <div className="login__divider" />

        {/* ── Form ── */}
        <div className="login__form">

          {/* Username / Phone */}
          <div className="login__field">
            <label className="login__label">Username or Phone Number</label>
            <div className="login__input-wrap">
              <span className="login__input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                className="login__input"
                type="text"
                name="username"
                placeholder="Enter username or phone"
                value={formData.username}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login__field">
            <label className="login__label">Password</label>
            <div className="login__input-wrap">
              <span className="login__input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                className="login__input"
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                className="login__toggle-pass"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
                type="button"
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="login__error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            className={`login__btn ${loading ? 'login__btn--loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login__spinner" />
                Verifying...
              </>
            ) : (
              'Sign In'
            )}
          </button>

        </div>

        <p className="login__footer">
          Xception.AI © {new Date().getFullYear()} · All rights reserved
        </p>

      </div>
    </div>
  );
}