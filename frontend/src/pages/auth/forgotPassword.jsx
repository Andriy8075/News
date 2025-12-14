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
        setSuccess('Request successful. An email has been sent to you!')
      } else {
        setError('Please enter correct data. Something went wrong!')
        
      }
    } catch (error) {
      setError('Please enter correct data. Something went wrong!')
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">Password recovery</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Forgot password?</h2>
            <p>Enter your email and we'll send you instructions to recover it.</p>
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
              <label htmlFor="email">Email address</label>
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
                Send instructions
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
