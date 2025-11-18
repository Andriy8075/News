import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.scss';
import { getCsrfToken } from '../../utils/api';
import { useUser } from '../../context/UserContext';
import { useAuthForm } from '../../hooks/useAuthForm';
import { makeAuthRequest } from './makeAuthRequest';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const {
    formData,
    setErrors,
    errors,
    handleChange,
  } = useAuthForm({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await makeAuthRequest('login', formData);

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.user) {
          setUser(responseData.user);
        } else {
          setUser(null);
        }
        navigate('/');
      } else {
        if (response.status === 422) {
          const errorData = await response.json();
          if (errorData.errors) {
            setErrors(errorData.errors);
          } else {
            setErrors({ general: ['Помилка валідації'] });
          }
        } else {
          setErrors({ general: ['Помилка при вході! Перевірте дані.'] });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: ['Помилка підключення до сервера'] });
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">🔑 Вхід до акаунту</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Ласкаво просимо назад</h2>
            <p>Увійдіть, щоб продовжити роботу з сервісом</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message">
                {Array.isArray(errors.general) ? errors.general[0] : errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email адреса</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="field-error">
                  {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введіть пароль"
                required
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="field-error">
                  {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                </span>
              )}
            </div>

            <div className="auth-actions">
              <button type="submit" className="btn-primary">
                Увійти
              </button>

              <div className="auth-link">
                Ще не маєте акаунту?{' '}
                <Link to="/register">Зареєструватися</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
