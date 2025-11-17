import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.scss';
import { getCsrfToken } from '../../utils/api';
import { data } from '../../data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    const token = getCsrfToken();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': token 
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Login successful
        const responseData = await response.json();
        if (responseData.user) {
          data.user = responseData.user;
        }
        navigate('/');
      } else {
        // Handle validation errors (422 status)
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
