import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getCsrfTokenFromCookie } from '../../utils/api';
import './auth.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    const submitData = {
      token,
      email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });

      if (response.ok || response.status === 200) {
        setSuccess('Пароль успішно змінено! Перенаправлення на сторінку входу...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        if (response.status === 422) {
          const errorData = await response.json();
          if (errorData.errors) {
            setErrors(errorData.errors);
          } else {
            setErrors({ general: ['Помилка валідації'] });
          }
        } else {
          setErrors({ general: ['Помилка при зміні паролю. Можливо, посилання недійсне або застаріле.'] });
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: ['Помилка підключення до сервера'] });
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">Відновлення паролю</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Встановіть новий пароль</h2>
            <p>Введіть новий пароль для вашого акаунту</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message">
                {Array.isArray(errors.general) ? errors.general[0] : errors.general}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Новий пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введіть новий пароль"
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
              <label htmlFor="password_confirmation">Підтвердіть пароль</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Підтвердіть новий пароль"
                required
                className={errors.password_confirmation ? 'error' : ''}
              />
              {errors.password_confirmation && (
                <span className="field-error">
                  {Array.isArray(errors.password_confirmation) ? errors.password_confirmation[0] : errors.password_confirmation}
                </span>
              )}
            </div>

            <div className="auth-actions">
              <button type="submit" className="btn-primary">
                Змінити пароль
              </button>

              <div className="auth-link">
                <Link to="/login">Повернутися до входу</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

