import React, { useEffect, useRef } from 'react';
import './newsForm.scss';

const NewsForm = ({
  categories,
  formData,
  categorySearchTerm,
  isSearchingCategories,
  showCategoryDropdown,
  setShowCategoryDropdown,
  errors,
  isSubmitting,
  onSubmit,
  onCancel,
  handleChange,
  handleImageChange,
  handleCategorySearchChange,
  handleCategorySelect,
  submitButtonText = 'Опублікувати новину',
  cancelButtonText = 'Скасувати',
}) => {
  const categoryDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown, setShowCategoryDropdown]);

  return (
    <form onSubmit={onSubmit} className="news-form">
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
        <div className="form-group category-search-group">
          <label htmlFor="category">Категорія</label>
          <div className="category-search-wrapper" ref={categoryDropdownRef}>
            <input
              type="text"
              id="category"
              name="category"
              value={categorySearchTerm}
              onChange={handleCategorySearchChange}
              onFocus={() => setShowCategoryDropdown(true)}
              placeholder="Введіть назву категорії..."
              className={errors.category ? 'error' : ''}
              autoComplete="off"
            />
            {isSearchingCategories && (
              <div className="category-search-loading">Пошук...</div>
            )}
            {showCategoryDropdown && categories.length > 0 && (
              <div className="category-dropdown">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className="category-option"
                    onClick={() => handleCategorySelect(cat.name)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
          placeholder="технології, новини, Україна"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          {cancelButtonText}
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Публікація...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default NewsForm;

