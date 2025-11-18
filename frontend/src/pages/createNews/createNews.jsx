import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createNews.scss';
import { getCsrfToken } from '../../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const token = getCsrfToken();
    console.log(token);

    // Prepare FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('excerpt', formData.excerpt);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    
    // Add image if selected
    if (formData.imageFile) {
      formDataToSend.append('image', formData.imageFile);
    }

    // Parse tags from comma-separated string to array
    if (formData.tags.trim()) {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      tagsArray.forEach(tag => {
        formDataToSend.append('tags[]', tag);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/news/store`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('Новину успішно створено!');
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
          setErrors({ general: ['Помилка при створенні новини!'] });
        }
      }
    } catch (error) {
      console.error('Error creating news:', error);
      setErrors({ general: ['Помилка підключення до сервера'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-news">
      <div className="container">
        <h1 className="page-title">✨ Створити новину</h1>

        <form onSubmit={handleSubmit} className="news-form">
          {errors.general && (
            <div className="error-message">
              {Array.isArray(errors.general) ? errors.general[0] : errors.general}
            </div>
          )}

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
              className={errors.title ? 'error' : ''}
            />
            {errors.title && (
              <span className="field-error">
                {Array.isArray(errors.title) ? errors.title[0] : errors.title}
              </span>
            )}
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
              className={errors.excerpt ? 'error' : ''}
            />
            {errors.excerpt && (
              <span className="field-error">
                {Array.isArray(errors.excerpt) ? errors.excerpt[0] : errors.excerpt}
              </span>
            )}
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
              className={errors.content ? 'error' : ''}
            />
            {errors.content && (
              <span className="field-error">
                {Array.isArray(errors.content) ? errors.content[0] : errors.content}
              </span>
            )}
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
                  className={errors.category ? 'error' : ''}
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
              {errors.category && (
                <span className="field-error">
                  {Array.isArray(errors.category) ? errors.category[0] : errors.category}
                </span>
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
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Публікація...' : 'Опублікувати новину'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;
