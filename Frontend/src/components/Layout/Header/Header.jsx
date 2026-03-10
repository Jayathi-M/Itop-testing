import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../../assets/react.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Read user info stored at login
  const username = sessionStorage.getItem('username') || 'Unknown User';
  const role     = sessionStorage.getItem('role')     || 'User';
  // Derive a simple user ID from username (first 3 chars uppercase + 4 digits)
  const userId   = 'USR-' + username.slice(0, 3).toUpperCase().padEnd(3, 'X') + '001';

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  function handleLogout() {

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    setMenuOpen(false);
    navigate('/', { replace: true });
  }

  return (
    <header className="topbar">

      {/* Logo */}
      <div className="topbar__logo">
        <img src={logoImg} alt="Logo" className="topbar__logo-img" />
      </div>

      {/* Profile button + dropdown */}
      <div className="topbar__profile-wrap" ref={menuRef}>
        <button
          className={`topbar__profile ${menuOpen ? 'topbar__profile--open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          title="Profile"
        >
          <i className="fa-solid fa-user" />
        </button>

        {menuOpen && (
          <div className="topbar__menu">

            {/* Arrow pointer */}
            <div className="topbar__menu-arrow" />

            {/* User info */}
            <div className="topbar__menu-user">
              <div className="topbar__menu-avatar">
                <i className="fa-solid fa-user" />
              </div>
              <div className="topbar__menu-info">
                <span className="topbar__menu-name">{username}</span>
                <span className="topbar__menu-id">{userId}</span>
                <span className="topbar__menu-role">{role}</span>
              </div>
            </div>

            <div className="topbar__menu-divider" />

            {/* Logout */}
            <button className="topbar__logout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" />
              <span>Logout</span>
            </button>

          </div>
        )}
      </div>

    </header>
  );
}