import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../createNews/createNews.scss';
import { GETFetch } from '../../hooks/GETFetch';
import { useNewsForm } from '../../hooks/useNewsForm';
import { submitNewsForm } from '../../utils/submitNewsForm';
import NewsForm from '../../components/newsForm/NewsForm';

const EditNews = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // /news/:id/edit

  const {
    categories,
    formData,
    setFormData,
    newCategory,
    showAddCategory,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleImageChange,
    handleAddCategory,
    setShowAddCategory,
    setNewCategory,
  } = useNewsForm();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await GETFetch(`/news/${id}`);
        setFormData(prev => ({
          ...prev,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          tags: data.tags.join(', '),
          imagePreview: data.image,
        }));
      } catch (err) {
        console.error('Error fetching news', err);
      }
    };

    fetchNews();
  }, [id, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await submitNewsForm(formData, `/news/${id}/update`, 'PATCH');
      alert('Новину змінено успішно!');
      navigate(`/news/${id}`);
    } catch (error) {
      if (error.status === 422) {
        setErrors(error.errors);
      } else {
        setErrors({ general: ['Помилка підключення до сервера'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-news">
      <div className="container">
        <h1 className="page-title">✏️ Редагувати новину</h1>

        <NewsForm
          categories={categories}
          formData={formData}
          newCategory={newCategory}
          showAddCategory={showAddCategory}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleAddCategory={handleAddCategory}
          setShowAddCategory={setShowAddCategory}
          setNewCategory={setNewCategory}
          submitButtonText="Зберегти зміни"
        />
      </div>
    </div>
  );
};

export default EditNews;
