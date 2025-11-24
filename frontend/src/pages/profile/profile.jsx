import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.scss';
import { getCsrfTokenFromCookie } from '../../utils/api';
import { useUser } from '../../context/UserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const[error, setError] = useState('')
  const[success, setSuccess] = useState('')

  let initialUser = null;
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      initialUser = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
  }

  const [userData, setUserData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailVerified: initialUser?.email_verified || false,
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const { name, email } = userData;
    const formData = { name, email, _method: 'PATCH' };
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
    
      if (response.ok || response.status === 200) {
        const responseData = await response.json();
        localStorage.setItem('user', JSON.stringify(responseData.user));
        setError('')
        setSuccess('Дані профілю успішно змінено!')
      } else {
        console.error('Помилка при оновленні профілю:', response.status);
        setError('Переконайтеся, що дані введено правильно!')
      }
    } catch (error) {
      console.error('Помилка при оновленні профілю:', error);
      setError('Переконайтеся, що дані введено правильно!')
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, currentPassword, confirmPassword } = userData;
    let formError = true;
    setSuccess('')
  
    if (newPassword === currentPassword) { 
      setError('Пароль співпадає з старим паролем!');
      formError = false;
    }
  
    if (newPassword.length < 8 || currentPassword.length < 8 || confirmPassword.length < 8) {
      setError('Введіть пароль повністю (більше 8 символів)!');
      formError = false;
    }
  
    if (newPassword !== confirmPassword) {
      setError('Введіть правильний підтверджувальний пароль!');
      formError = false;
    }
  
    if (formError) { 
      const formData = { 
        new_password: newPassword, 
        current_password: currentPassword, 
        _method: 'PATCH' 
      };
  
      try {
        const response = await fetch(`${API_BASE_URL}/update-password`, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
          },
          credentials: 'include',
        });
      
        if (response.ok || response.status === 200) {
          setError('')
          setSuccess('Пароль успішно змінено!')
        } else {
          console.error('Помилка при оновленні профілю:', response.status);
          setError('Переконайтеся, що дані введено правильно!');
        }
      } catch (error) {
        console.error('Помилка при оновленні профілю:', error);
        setError('Переконайтеся, що дані введено правильно!');
      }
  
      setUserData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };
  

  const handleGoToMyNews = () => {
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
        setUser(null);
        navigate('/');
      } else {
        console.error('Logout failed:', response.status);
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      navigate('/');
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/email/verification-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
      if (response.ok || response.status === 200) {
        setError('')
        setSuccess('Повідомлення для підтвердження email надіслано!')
      } else {
        console.error('Помилка при надсиланні повідомлення для підтвердження email:', response.status);
        setError('Помилка при надсиланні повідомлення для підтвердження email!');
      }
    } catch (error) {
      console.error('Помилка при надсиланні повідомлення для підтвердження email:', error);
      setError('Помилка при надсиланні повідомлення для підтвердження email!');
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

            <button
              className="tab-button"
              onClick={handleGoToMyNews}
            >
              📰 Мої новини
            </button>

            <button
              className="tab-button logout-button"
              onClick={handleLogout}
            >
              🚪 Вийти з акаунту
            </button>
          </div>

          <div className="profile-content">
            {activeTab === 'profile' && (
              <form className="profile-form" onSubmit={handleProfileSubmit}>
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

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="success-message">
                    {success}
                  </div>
                )}
                
                <div className="btn-primary-container">
                  {!userData.emailVerified && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleSendVerificationEmail}
                    >
                      Надіслати повідомлення для підтвердження email
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Зберегти зміни
                  </button>
                </div>
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

                
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="success-message">
                    {success}
                  </div>
                )}
                

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
