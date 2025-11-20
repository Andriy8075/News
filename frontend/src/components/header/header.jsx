import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './header.scss';

const Header = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      setUser(null);
    }
  }, [location]); // оновлюємо при зміні маршруту

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          📰 NewsHub
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🏠 Головна
          </Link>

          {user?.editor && (
            <Link
              to="/create"
              className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
            >
              ✨ Створити
            </Link>
          )}

          {user && (
            <Link
              to="/profile"
              className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              👤 Профіль
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              🔑 Увійти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
