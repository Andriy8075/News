import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createNews.scss';

const CreateNews = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'technology',
    image: '',
    tags: ''
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
    // Тут буде логіка відправки на сервер
    alert('Новину успішно створено!');
    navigate('/');
  };

  return (
    <div className="create-news">
      <div className="container">
        <h1 className="page-title">✨ Створити новину</h1>
        
        <form onSubmit={handleSubmit} className="news-form">
          <div className="form-group">
            <label htmlFor="title">Заголовок *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введіть заголовок новини"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Короткий опис *</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Короткий опис новини"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Повний текст *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Повний текст новини"
              rows="10"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Категорія</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="technology">Технології</option>
                <option value="politics">Політика</option>
                <option value="sports">Спорт</option>
                <option value="entertainment">Розваги</option>
                <option value="science">Наука</option>
                <option value="business">Бізнес</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">URL зображення</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Теги (через кому)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="технології, новини, україна"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
              Скасувати
            </button>
            <button type="submit" className="btn-primary">
              Опублікувати новину
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;