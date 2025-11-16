import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';

const Header = () => {
  const location = useLocation();

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
          <Link 
            to="/create" 
            className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
          >
            ✨ Створити
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            👤 Профіль
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;