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
    categorySearchTerm,
    isSearchingCategories,
    showCategoryDropdown,
    setShowCategoryDropdown,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleImageChange,
    handleCategorySearchChange,
    handleCategorySelect,
  } = useNewsForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const responseData = await submitNewsForm(formData, '/news/store', 'POST');
      alert('News created successfully!');
      navigate(`/news/${responseData.data?.id || responseData.id}`);
    } catch (error) {
      if (error.status === 422) {
        setErrors(error.errors);
      } else {
        setErrors({ general: ['Server connection error'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-news">
      <div className="container">
        <h1 className="page-title">✨ Create news</h1>

        <NewsForm
          formData={formData}
          categories={categories}
          categorySearchTerm={categorySearchTerm}
          isSearchingCategories={isSearchingCategories}
          showCategoryDropdown={showCategoryDropdown}
          setShowCategoryDropdown={setShowCategoryDropdown}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleCategorySearchChange={handleCategorySearchChange}
          handleCategorySelect={handleCategorySelect}
          submitButtonText="Publish news"
        />
      </div>
    </div>
  );
};

export default CreateNews;
