import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.scss';
import { useAuthForm } from '../../hooks/useAuthForm';
import { makeAuthRequest } from './makeAuthRequest';

const Login = () => {
  const navigate = useNavigate();

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
          localStorage.setItem('user', JSON.stringify(responseData.user));
        } else {
          localStorage.removeItem('user');
        }

        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
        }

        navigate('/');
      } else {
        if (response.status === 422) {
          const errorData = await response.json();
          if (errorData.errors) {
            setErrors(errorData.errors);
          } else {
            setErrors({ general: ['Validation error'] });
          }
        } else {
          setErrors({ general: ['Login error! Please check your credentials.'] });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: ['Server connection error'] });
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">🔑 Login</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue using the service</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message">
                {Array.isArray(errors.general) ? errors.general[0] : errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email address</label>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
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
                Sign in
              </button>

              <div className="auth-link">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <div className="auth-link">
                Don't have an account?{' '}
                <Link to="/register">Sign up</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
