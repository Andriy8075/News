import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.scss';
import { getCsrfTokenFromCookie } from '../../utils/api';
import { useUser } from '../../context/UserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [userData, setUserData] = useState({
    name: 'Іван Петренко',
    email: 'ivan@example.com',
    phone: '+380991234567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Профіль оновлено!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    alert('Пароль змінено!');
    setUserData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleGoToMyNews = () => {
    // перехід на сторінку з особистими новинами
    navigate('/my-news');
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
  

  return (
    <div className="profile">
      <div className="container">
        <h1 className="page-title">👤 Особистий кабінет</h1>
        
        <div className="profile-layout">
          <div className="profile-sidebar">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              📝 Особиста інформація
            </button>
            <button 
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              🔒 Зміна паролю
            </button>

            {/* Кнопка для переходу на сторінку особистих новин */}
            <button 
              className="tab-button"
              onClick={handleGoToMyNews}
            >
              📰 Мої новини
            </button>

            {/* Кнопка логауту */}
            <button 
              className="tab-button logout-button"
              onClick={handleLogout}
            >
              🚪 Вийти з акаунту
            </button>
          </div>

          <div className="profile-content">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <h2>Особиста інформація</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Ім'я та прізвище</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email адреса</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Номер телефону</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Зберегти зміни
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <h2>Зміна паролю</h2>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Поточний пароль</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={userData.currentPassword}
                    onChange={handleChange}
                    placeholder="Введіть поточний пароль"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Новий пароль</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={userData.newPassword}
                    onChange={handleChange}
                    placeholder="Введіть новий пароль"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Підтвердження паролю</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Підтвердьте новий пароль"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Змінити пароль
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
