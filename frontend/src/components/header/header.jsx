import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './header.scss';
import { getCsrfTokenFromCookie, getCsrfTokenTimeFromCookie } from '../../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const syncAuthState = () => {
    try {
      const token = getCsrfTokenTimeFromCookie();

      if (!token) {
        // кука XSRF-TOKEN пропала або не створена
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        return;
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to sync auth state', e);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
  
      if (response.ok || response.status === 204) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Clear user from context
        setUser(null);
        // Navigate to home page
        navigate('/');
      } else {
        console.error('Logout failed:', response.status);
        // Still clear user and navigate even if request fails
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user and navigate even if request fails
      setUser(null);
      navigate('/');
    }
  };
  

  useEffect(() => {
    syncAuthState();
  }, [location]);

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
            <>
              <Link
                to="/profile"
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                👤 Профіль
              </Link>
              <Link
                type="button"
                className={`nav-link active`}
                onClick={handleLogout}
              >
                🚪 Вийти
              </Link>
            </>
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
