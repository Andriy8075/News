import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.scss';
import { useAuthForm } from '../../hooks/useAuthForm';
import { makeAuthRequest } from './makeAuthRequest';

const Register = () => {
  const navigate = useNavigate();

  const {
    formData,
    handleChange,
    errors,
    setErrors,
  } = useAuthForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ['Passwords do not match!'] });
      return;
    }

    const submitData = {
      ...formData,
      password_confirmation: formData.confirmPassword,
    };
    delete submitData.confirmPassword;

    try {
      const response = await makeAuthRequest('register', submitData);

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
          console.log(response);
          console.log(JSON.stringify(response.body));
            setErrors({ general: ['Error creating account!'] });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
          setErrors({ general: ['Server connection error'] });
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">📝 Registration</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Create a new account</h2>
            <p>Fill out the form below to join</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message">
                {Array.isArray(errors.general) ? errors.general[0] : errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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
                placeholder="Create a password"
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
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                className={
                  errors.confirmPassword || errors.password_confirmation ? 'error' : ''
                }
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
                Sign up
              </button>

              <div className="auth-link">
                Already have an account?{' '}
                <Link to="/login">Sign in</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
