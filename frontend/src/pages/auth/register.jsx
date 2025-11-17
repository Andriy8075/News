import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.scss';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      alert('Паролі не співпадають!');
      return;
    }

    // Тут буде логіка реєстрації (запит до бекенду)
    alert('Акаунт успішно створено!');
    navigate('/login');
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
              />
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
                placeholder="Придумайте пароль"
                required
              />
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
              />
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
