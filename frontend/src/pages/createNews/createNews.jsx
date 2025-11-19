import React from 'react';
import { useNavigate } from 'react-router-dom';
import './createNews.scss';
import { useNewsForm } from '../../hooks/useNewsForm';
import { submitNewsForm } from '../../utils/submitNewsForm';
import NewsForm from '../../components/newsForm/NewsForm';

const CreateNews = () => {
  const navigate = useNavigate();

  const {
    categories,
    formData,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const responseData = await submitNewsForm(formData, '/news/store', 'POST');
      alert('Новину успішно створено!');
      navigate(`/news/${responseData.data?.id || responseData.id}`);
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
        <h1 className="page-title">✨ Створити новину</h1>

        <NewsForm
          formData={formData}
          categories={categories}
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
          submitButtonText="Опублікувати новину"
        />
      </div>
    </div>
  );
};

export default CreateNews;
