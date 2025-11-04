import React, { useState } from 'react';
import './profile.scss';

const Profile = () => {
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
    // Логіка оновлення профілю
    alert('Профіль оновлено!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Логіка зміни паролю
    alert('Пароль змінено!');
    setUserData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
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