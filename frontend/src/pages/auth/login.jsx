import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.scss';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тут буде логіка логіну (запит до бекенду)
    alert('Вхід виконано!');
    navigate('/');
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
              />
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
              />
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
