import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.scss';
import { getCsrfToken } from '../../utils/api';
import { useUser } from '../../context/UserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ['Паролі не співпадають!'] });
      return;
    }

    const token = getCsrfToken();

    // Prepare data for backend - Laravel expects password_confirmation, not confirmPassword
    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': token 
        },
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        setUser(responseData.user ?? null);
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
          console.log(response);
          console.log(JSON.stringify(response.body));
          setErrors({ general: ['Помилка при створенні акаунту!'] });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: ['Помилка підключення до сервера'] });
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">📝 Реєстрація</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Створіть новий акаунт</h2>
            <p>Заповніть форму нижче, щоб приєднатися</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message">
                {Array.isArray(errors.general) ? errors.general[0] : errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Ім'я та прізвище</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Іван Петренко"
                required
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <span className="field-error">
                  {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                </span>
              )}
            </div>

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
                placeholder="Придумайте пароль"
                required
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="field-error">
                  {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Підтвердження паролю</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторіть пароль"
                required
                className={errors.confirmPassword || errors.password_confirmation ? 'error' : ''}
              />
              {(errors.confirmPassword || errors.password_confirmation) && (
                <span className="field-error">
                  {Array.isArray(errors.confirmPassword) 
                    ? errors.confirmPassword[0] 
                    : Array.isArray(errors.password_confirmation)
                    ? errors.password_confirmation[0]
                    : errors.confirmPassword || errors.password_confirmation}
                </span>
              )}
            </div>

            <div className="auth-actions">
              <button type="submit" className="btn-primary">
                Зареєструватися
              </button>

              <div className="auth-link">
                Вже маєте акаунт?{' '}
                <Link to="/login">Увійти</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
