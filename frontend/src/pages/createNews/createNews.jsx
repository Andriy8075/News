import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createNews.scss';

const CreateNews = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([
    { value: 'technology', label: 'Технології' },
    { value: 'politics', label: 'Політика' },
    { value: 'sports', label: 'Спорт' },
    { value: 'entertainment', label: 'Розваги' },
    { value: 'science', label: 'Наука' },
    { value: 'business', label: 'Бізнес' },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'technology',
    imageFile: null,
    imagePreview: null,
    tags: ''
  });

  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      // превʼю картинки
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        imageFile: null,
        imagePreview: null
      }));
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    const value = trimmed.toLowerCase().replace(/\s+/g, '-');

    // якщо така категорія вже є — просто вибираємо її
    const exists = categories.find(cat => cat.value === value);
    if (exists) {
      setFormData(prev => ({
        ...prev,
        category: exists.value
      }));
      setNewCategory('');
      setShowAddCategory(false);
      return;
    }

    const newCatObj = { value, label: trimmed };

    setCategories(prev => [...prev, newCatObj]);
    setFormData(prev => ({
      ...prev,
      category: newCatObj.value
    }));
    setNewCategory('');
    setShowAddCategory(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    

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
              <div className="category-row">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-secondary btn-add-category"
                  onClick={() => setShowAddCategory(prev => !prev)}
                >
                  ➕ Додати
                </button>
              </div>

              {showAddCategory && (
                <div className="add-category">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Нова категорія"
                  />
                  <button
                    type="button"
                    className="btn-secondary btn-small-primary"
                    onClick={handleAddCategory}
                  >
                    Зберегти
                  </button>
                </div>
              )}
            </div>


            <div className="form-group">
              <label htmlFor="image">Зображення</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imagePreview && (
                <div className="image-preview">
                  <img src={formData.imagePreview} alt="Превʼю" />
                </div>
              )}
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
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
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
