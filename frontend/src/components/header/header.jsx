import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import { data } from '../../data';

import { useState, useEffect } from 'react';
import { fetchUser } from '../../utils/api';

const Header = () => {

  const [user, setUser] = useState(undefined);
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  const location = useLocation();
  return (
    <header className="header">
      <div className="header-container">
        {user!==undefined && (
          <Link to="/" className="logo">
            📰 NewsHub
          </Link>
        )}
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
        </nav>
      </div>
    </header>
  );
};

export default Header;