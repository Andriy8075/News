import React, { useState } from 'react';
import { getCsrfTokenFromCookie } from '../../utils/api';

import './auth.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSuccess('')

    const formData = { email };

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
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
        setSuccess('Запит успішний. Вам надіслано лист на електронну пошту!')
      } else {
        setError('Введіть правельні дані. Щось пішло не так!')
        
      }
    } catch (error) {
      setError('Введіть правельні дані. Щось пішло не так!')
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">Відновлення паролю</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Забули пароль?</h2>
            <p>Введіть email, і ми надішлемо інструкції для його відновлення.</p>
          </div>

          <form onSubmit={handleSendEmail} className="auth-form">
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

            <div className="form-group">
              <label htmlFor="email">Email адреса</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={error ? 'error' : ''}
              />
            </div>

            <div className="auth-actions">
              <button type="submit" className="btn-primary">
                Надіслати інструкції
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
